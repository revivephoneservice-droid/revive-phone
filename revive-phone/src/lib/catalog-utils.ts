import { CATEGORY_MAP, CATEGORIES, PRICE_MIN } from "@/lib/accessories";
import type { Accessory, CategoryKey } from "@/lib/accessories";

export type CatalogSort = "newest" | "price-asc" | "price-desc";
export type CatalogFilters = {
  categories: CategoryKey[];
  brands: string[];
  // null means no upper price limit: a newly added expensive product stays visible.
  price: [number, number | null];
};

export function categoryFromParam(value: string | null): CategoryKey | null {
  return CATEGORIES.find((category) => category.key === value)?.key ?? null;
}

export function createCatalogFilters(
  category: string | null = null,
): CatalogFilters {
  const key = categoryFromParam(category);
  return { categories: key ? [key] : [], brands: [], price: [PRICE_MIN, null] };
}

export function normalizeCatalogProduct(product: Accessory): Accessory {
  const photos = Array.from(
    new Set(
      [product.image_url, ...(product.images ?? [])]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
  return {
    ...product,
    name: product.name.trim(),
    brand: product.brand?.trim() || null,
    price: Number(product.price),
    image_url: photos[0] ?? null,
    images: photos,
  };
}

export function catalogBrands(products: Accessory[]): string[] {
  const names = new Map<string, string>();
  for (const product of products) {
    if (product.is_active !== true) continue;
    const name = product.brand?.trim();
    if (name && !names.has(name.toLocaleLowerCase()))
      names.set(name.toLocaleLowerCase(), name);
  }
  return Array.from(names.values()).sort((a, b) => a.localeCompare(b, "uk"));
}

function createdTime(product: Accessory): number {
  const value = Date.parse(product.created_at ?? "");
  return Number.isFinite(value) ? value : 0;
}

export function filterCatalog(
  products: Accessory[],
  filters: CatalogFilters,
  searchQuery: string,
  sort: CatalogSort,
): Accessory[] {
  const query = searchQuery.trim().toLocaleLowerCase();
  const categoryIds = new Set(
    filters.categories.map((key) => CATEGORY_MAP[key]),
  );
  const brands = new Set(
    filters.brands.map((brand) => brand.trim().toLocaleLowerCase()),
  );
  const filtered = products.filter((product) => {
    if (product.is_active !== true || !Number.isFinite(product.price))
      return false;
    const matchesSearch =
      !query ||
      [product.name, product.brand, product.sku].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase()
          .includes(query),
      );
    const matchesCategory =
      !categoryIds.size || categoryIds.has(product.category_id ?? "");
    const matchesBrand =
      !brands.size ||
      brands.has((product.brand ?? "").trim().toLocaleLowerCase());
    const matchesPrice =
      product.price >= filters.price[0] &&
      (filters.price[1] === null || product.price <= filters.price[1]);
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });
  filtered.sort((a, b) => {
    const priceOrder =
      sort === "price-asc"
        ? a.price - b.price
        : sort === "price-desc"
          ? b.price - a.price
          : 0;
    return (
      priceOrder || createdTime(b) - createdTime(a) || a.id.localeCompare(b.id)
    );
  });
  return filtered;
}

export function catalogPage(
  products: Accessory[],
  requestedPage: number,
  pageSize = 12,
) {
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const page = Math.max(1, Math.min(requestedPage, pageCount));
  return {
    page,
    pageCount,
    items: products.slice((page - 1) * pageSize, page * pageSize),
  };
}
