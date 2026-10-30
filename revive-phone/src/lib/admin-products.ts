export const PRODUCT_IMAGE_BUCKET = "product-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 20;
export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface AdminProduct {
  id: string;
  name: string;
  brand: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  stock_quantity: number | null;
  image_url: string | null;
  images: string[] | null;
  specifications: Record<string, JsonValue> | null;
  sku: string | number | null;
  color: string | null;
  warranty_months: number | null;
  availability_status: string | null;
  is_active: boolean | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface DraftPhoto {
  key: string;
  url: string;
  file?: File;
}

export interface DraftSpecification {
  id: string;
  name: string;
  value: string;
  kind: "text" | "number" | "boolean" | "json";
}

export interface ProductDraft {
  id: string;
  isNew: boolean;
  name: string;
  brand: string;
  category_id: string;
  description: string;
  price: string;
  stock_quantity: string;
  sku: string;
  color: string;
  warranty_months: string;
  availability_status: string;
  is_active: boolean;
  photos: DraftPhoto[];
  specifications: DraftSpecification[];
}

export const AVAILABILITY_OPTIONS = [
  { value: "in_stock", label: "В наличии" },
  { value: "low_stock", label: "Заканчивается" },
  { value: "out_of_stock", label: "Нет в наличии" },
  { value: "preorder", label: "Под заказ" },
];

// The cover is included even for older rows whose images array is empty.
// Local /images/products/... paths and Supabase URLs use the same format.
export function getProductPhotos(
  product: Pick<AdminProduct, "image_url" | "images">,
): string[] {
  return Array.from(
    new Set(
      [product.image_url, ...(product.images ?? [])]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export function normalizeImageUrl(raw: string): string {
  const value = raw.trim();
  if (!value || /[\u0000-\u0020\\]/.test(value)) {
    throw new Error("Укажите корректную ссылку на фото без пробелов.");
  }
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Нужна ссылка https://… или путь /images/products/…");
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "Допустимы только ссылки http/https или пути внутри сайта.",
    );
  }
  return value;
}

export function validateImageFile(
  file: Pick<File, "name" | "type" | "size">,
): void {
  if (!IMAGE_TYPES[file.type])
    throw new Error(`${file.name}: выберите JPG, PNG или WebP.`);
  if (file.size <= 0) throw new Error(`${file.name}: файл пустой.`);
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error(`${file.name}: максимальный размер фото — 5 МБ.`);
}

export function createProductDraft(product?: AdminProduct): ProductDraft {
  const stock = product?.stock_quantity ?? 0;
  const specs = product?.specifications ?? {};
  if (typeof specs !== "object" || Array.isArray(specs)) {
    throw new Error(
      "Характеристики этого товара должны быть JSON-объектом. Исправьте specifications в базе перед редактированием.",
    );
  }
  return {
    id: product?.id ?? crypto.randomUUID(),
    isNew: !product,
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    category_id: product?.category_id ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    stock_quantity: String(stock),
    sku: product?.sku == null ? "" : String(product.sku),
    color: product?.color ?? "",
    warranty_months:
      product?.warranty_months == null ? "" : String(product.warranty_months),
    availability_status:
      product?.availability_status ?? (stock > 0 ? "in_stock" : "out_of_stock"),
    is_active: product?.is_active ?? true,
    photos: product
      ? getProductPhotos(product).map((url) => ({
          key: crypto.randomUUID(),
          url,
        }))
      : [],
    specifications: Object.entries(specs).map(([name, value]) => ({
      id: crypto.randomUUID(),
      name,
      value: typeof value === "string" ? value : JSON.stringify(value),
      kind:
        typeof value === "string"
          ? "text"
          : typeof value === "number"
            ? "number"
            : typeof value === "boolean"
              ? "boolean"
              : "json",
    })),
  };
}

export function specificationsToObject(
  rows: DraftSpecification[],
): Record<string, JsonValue> {
  const entries: [string, JsonValue][] = [];
  const used = new Set<string>();
  for (const row of rows) {
    const name = row.name.trim();
    const value = row.value.trim();
    if (!name && !value) continue;
    if (!name || !value)
      throw new Error("У каждой характеристики заполните название и значение.");
    if (used.has(name.toLocaleLowerCase()))
      throw new Error(`Характеристика «${name}» указана дважды.`);
    used.add(name.toLocaleLowerCase());
    let parsed: JsonValue = value;
    if (row.kind === "number") {
      parsed = Number(value);
      if (!Number.isFinite(parsed))
        throw new Error(`«${name}»: введите число.`);
    } else if (row.kind === "boolean") {
      if (!["true", "false"].includes(value))
        throw new Error(`«${name}»: выберите Да или Нет.`);
      parsed = value === "true";
    } else if (row.kind === "json") {
      try {
        parsed = JSON.parse(value) as JsonValue;
      } catch {
        throw new Error(`«${name}»: неверный JSON.`);
      }
    }
    entries.push([name, parsed]);
  }
  return Object.fromEntries(entries);
}

function integerField(raw: string, label: string, minimum = 0): number {
  const value = raw.trim();
  const parsed = Number(value);
  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(parsed) ||
    parsed < minimum ||
    parsed > 2147483647
  ) {
    throw new Error(
      `${label}: введите целое число от ${minimum} до 2147483647.`,
    );
  }
  return parsed;
}

export function validateProductDraft(draft: ProductDraft): void {
  if (!draft.name.trim()) throw new Error("Введите название товара.");
  if (!draft.category_id) throw new Error("Выберите категорию товара.");
  integerField(draft.price, "Цена", 1);
  const stock = integerField(draft.stock_quantity, "Остаток");
  if (draft.warranty_months.trim())
    integerField(draft.warranty_months, "Гарантия");
  // Existing products.sku is numeric, not text. Never invent alphanumeric SKUs.
  if (draft.sku.trim() && !/^\d{1,15}$/.test(draft.sku.trim())) {
    throw new Error("Артикул: до 15 цифр, без букв и пробелов.");
  }
  if (!draft.availability_status.trim())
    throw new Error("Выберите статус наличия.");
  if (
    stock === 0 &&
    ["in_stock", "low_stock"].includes(draft.availability_status)
  ) {
    throw new Error(
      "При нулевом остатке выберите «Нет в наличии» или «Под заказ».",
    );
  }
  if (draft.is_active && !draft.photos.length)
    throw new Error(
      "Для публикации добавьте хотя бы одно фото. Или сохраните товар скрытым.",
    );
  for (const photo of draft.photos) {
    if (photo.file) validateImageFile(photo.file);
    else normalizeImageUrl(photo.url);
  }
  specificationsToObject(draft.specifications);
}

export function productPayload(draft: ProductDraft, uploadedUrls: string[]) {
  validateProductDraft(draft);
  if (uploadedUrls.length !== draft.photos.length)
    throw new Error("Не все фотографии загружены. Повторите сохранение.");
  const images = Array.from(new Set(uploadedUrls.map(normalizeImageUrl)));
  return {
    id: draft.id,
    name: draft.name.trim(),
    brand: draft.brand.trim() || null,
    category_id: draft.category_id,
    description: draft.description.trim() || null,
    price: integerField(draft.price, "Цена", 1),
    stock_quantity: integerField(draft.stock_quantity, "Остаток"),
    sku: draft.sku.trim() || null,
    color: draft.color.trim() || null,
    warranty_months: draft.warranty_months.trim()
      ? integerField(draft.warranty_months, "Гарантия")
      : null,
    availability_status: draft.availability_status,
    is_active: draft.is_active,
    image_url: images[0] ?? null,
    images,
    specifications: specificationsToObject(draft.specifications),
  };
}

export function movePhoto(
  photos: DraftPhoto[],
  from: number,
  to: number,
): DraftPhoto[] {
  if (
    from < 0 ||
    to < 0 ||
    from >= photos.length ||
    to >= photos.length ||
    from === to
  )
    return photos;
  const result = [...photos];
  const [photo] = result.splice(from, 1);
  result.splice(to, 0, photo);
  return result;
}

export function readableError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "Не удалось выполнить действие. Попробуйте ещё раз.";
  if (/row.level.security|permission denied|42501/i.test(message)) {
    return (
      "Недостаточно прав. Проверьте вход под администратором и выполнение setup.sql. " +
      message
    );
  }
  if (/bucket.*not found/i.test(message))
    return "Не найден Storage bucket product-images. Выполните setup.sql.";
  if (/fixphon_catalog_access|PGRST202/i.test(message))
    return "Сначала выполните setup.sql в Supabase SQL Editor, затем обновите страницу.";
  return message;
}
