"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase";
import {
  AVAILABILITY_OPTIONS,
  IMAGE_TYPES,
  MAX_PRODUCT_IMAGES,
  PRODUCT_IMAGE_BUCKET,
  createProductDraft,
  getProductPhotos,
  movePhoto,
  normalizeImageUrl,
  productPayload,
  readableError,
  validateImageFile,
  validateProductDraft,
} from "@/lib/admin-products";
import type {
  AdminProduct,
  Category,
  DraftSpecification,
  ProductDraft,
} from "@/lib/admin-products";

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50";
const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });
const PAGE_SIZE = 24;

function ProductImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed)
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
      >
        <ImageIcon className="size-10" aria-hidden="true" />
        <span className="sr-only">Фото недоступно</span>
      </div>
    );
  // Native img accepts both existing local paths and uploaded Supabase URLs.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={600}
      height={600}
      className={`bg-white object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

export default function AdminDashboard() {
  const [supabase] = useState(() => createClient());
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductDraft | null>(null);
  const [formError, setFormError] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrls = useRef(new Set<string>());
  const dirty = useRef(false);
  const mutationLock = useRef(false);
  const loadVersion = useRef(0);
  const authorizedUserId = useRef<string | null>(null);

  const releasePreviews = useCallback(() => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url);
    objectUrls.current.clear();
  }, []);

  const loadProducts = useCallback(async () => {
    const version = ++loadVersion.current;
    setLoading(true);
    setPageError("");
    setAuthorized(false);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user)
        throw new Error(
          "Войдите в аккаунт администратора, затем обновите страницу.",
        );
      const { data: allowed, error: accessError } = await supabase.rpc(
        "fixphon_catalog_access",
      );
      if (accessError) throw accessError;
      if (allowed !== true)
        throw new Error(
          "У этого аккаунта нет доступа к каталогу. В profiles должна быть роль admin.",
        );

      // Read all batches instead of silently truncating the catalog at 1000 rows.
      const readAllProducts = async () => {
        const rows: AdminProduct[] = [];
        const batchSize = 500;
        for (let offset = 0; ; offset += batchSize) {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
            .order("id")
            .range(offset, offset + batchSize - 1);
          if (error) throw error;
          rows.push(...((data ?? []) as AdminProduct[]));
          if (
            !data ||
            data.length < batchSize ||
            version !== loadVersion.current
          )
            break;
        }
        return rows;
      };
      const [rows, categoryResult] = await Promise.all([
        readAllProducts(),
        supabase.from("categories").select("id, name").order("name"),
      ]);
      if (categoryResult.error) throw categoryResult.error;
      if (version !== loadVersion.current) return;
      setProducts(rows);
      setCategories((categoryResult.data ?? []) as Category[]);
      authorizedUserId.current = authData.user.id;
      setAuthorized(true);
    } catch (error) {
      if (version === loadVersion.current) {
        setProducts([]);
        setPageError(readableError(error));
      }
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadProducts();
    return () => {
      loadVersion.current += 1;
    };
  }, [loadProducts]);

  useEffect(() => () => releasePreviews(), [releasePreviews]);

  // Account changes require a fresh authorization check, not a stale admin UI.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_OUT" ||
        (event === "SIGNED_IN" &&
          authorizedUserId.current &&
          session?.user.id !== authorizedUserId.current)
      ) {
        loadVersion.current += 1;
        authorizedUserId.current = null;
        setAuthorized(false);
        setProducts([]);
        setLoading(false);
        setPageError(
          "Сессия завершена или аккаунт изменён. Войдите под администратором и обновите каталог.",
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesText =
        !search ||
        [product.name, product.brand, product.sku].some((value) =>
          String(value ?? "")
            .toLocaleLowerCase()
            .includes(search),
        );
      return (
        matchesText &&
        (visibility === "all" ||
          (visibility === "active" ? product.is_active : !product.is_active))
      );
    });
  }, [products, query, visibility]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  function openEditor(product?: AdminProduct) {
    try {
      const nextForm = createProductDraft(product);
      releasePreviews();
      dirty.current = false;
      setFormError("");
      setImageLink("");
      setForm(nextForm);
    } catch (error) {
      setPageError(readableError(error));
    }
  }

  function closeEditor() {
    if (mutationLock.current) return;
    if (
      dirty.current &&
      !window.confirm("Закрыть форму? Несохранённые изменения будут потеряны.")
    )
      return;
    releasePreviews();
    dirty.current = false;
    setForm(null);
    setFormError("");
  }

  function patchForm(update: Partial<ProductDraft>) {
    dirty.current = true;
    setForm((current) => (current ? { ...current, ...update } : current));
  }

  function changeStock(value: string) {
    if (!form) return;
    let status = form.availability_status;
    if (
      value.trim() !== "" &&
      Number(value) === 0 &&
      ["in_stock", "low_stock"].includes(status)
    )
      status = "out_of_stock";
    if (Number(value) > 0 && status === "out_of_stock") status = "in_stock";
    patchForm({ stock_quantity: value, availability_status: status });
  }

  function addFiles(files: File[]) {
    if (!form || mutationLock.current || !files.length) return;
    try {
      if (form.photos.length + files.length > MAX_PRODUCT_IMAGES)
        throw new Error(
          `Можно добавить до ${MAX_PRODUCT_IMAGES} фотографий на товар.`,
        );
      files.forEach(validateImageFile);
      const added = files.map((file) => {
        const url = URL.createObjectURL(file);
        objectUrls.current.add(url);
        return { key: crypto.randomUUID(), url, file };
      });
      patchForm({ photos: [...form.photos, ...added] });
      setFormError("");
    } catch (error) {
      setFormError(readableError(error));
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function addImageLink() {
    if (!form) return;
    try {
      const url = normalizeImageUrl(imageLink);
      if (form.photos.length >= MAX_PRODUCT_IMAGES)
        throw new Error(`Максимум ${MAX_PRODUCT_IMAGES} фото.`);
      if (form.photos.some((photo) => photo.url === url))
        throw new Error("Это фото уже добавлено.");
      patchForm({
        photos: [...form.photos, { key: crypto.randomUUID(), url }],
      });
      setImageLink("");
      setFormError("");
    } catch (error) {
      setFormError(readableError(error));
    }
  }

  function removePhoto(key: string) {
    if (!form) return;
    const photo = form.photos.find((item) => item.key === key);
    if (photo && objectUrls.current.has(photo.url)) {
      URL.revokeObjectURL(photo.url);
      objectUrls.current.delete(photo.url);
    }
    patchForm({ photos: form.photos.filter((item) => item.key !== key) });
  }

  function patchSpecification(id: string, update: Partial<DraftSpecification>) {
    if (form)
      patchForm({
        specifications: form.specifications.map((row) =>
          row.id === id ? { ...row, ...update } : row,
        ),
      });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || mutationLock.current || !authorized) return;
    setFormError("");
    try {
      validateProductDraft(form);
    } catch (error) {
      setFormError(readableError(error));
      return;
    }
    mutationLock.current = true;
    setSaving(true);
    const draft = form;
    const photos = [...draft.photos];
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user)
        throw new Error("Сессия завершена. Войдите снова перед сохранением.");
      let uploadedCount = 0;
      const pendingCount = photos.filter((photo) => photo.file).length;
      for (let index = 0; index < photos.length; index += 1) {
        const photo = photos[index];
        if (!photo.file) continue;
        setProgress(`Загрузка фото ${uploadedCount + 1} из ${pendingCount}…`);
        const path = `${draft.id}/${crypto.randomUUID()}.${IMAGE_TYPES[photo.file.type]}`;
        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .upload(path, photo.file, {
            contentType: photo.file.type,
            cacheControl: "31536000",
            upsert: false,
          });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .getPublicUrl(path);
        photos[index] = { key: photo.key, url: publicData.publicUrl };
        // Keep successful uploads in the form if a later upload or DB write fails.
        setForm((current) =>
          current?.id === draft.id
            ? { ...current, photos: [...photos] }
            : current,
        );
        uploadedCount += 1;
      }
      setProgress("Сохранение товара…");
      const payload = productPayload(
        draft,
        photos.map((photo) => photo.url),
      );
      // A new draft keeps one UUID. Retrying after an uncertain network response
      // updates that same row instead of creating a duplicate product.
      const result = draft.isNew
        ? await supabase
            .from("products")
            .upsert(payload, { onConflict: "id" })
            .select("*")
            .single()
        : await supabase
            .from("products")
            .update(payload)
            .eq("id", draft.id)
            .select("*")
            .single();
      if (result.error) throw result.error;
      if (!result.data)
        throw new Error(
          "Товар не сохранён: сервер не вернул результат. Обновите каталог и проверьте права доступа.",
        );
      const saved = result.data as AdminProduct;
      setProducts((current) =>
        current.some((item) => item.id === saved.id)
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current],
      );
      setNotice(draft.isNew ? "Товар добавлен." : "Изменения сохранены.");
      setPageError("");
      dirty.current = false;
      releasePreviews();
      setForm(null);
    } catch (error) {
      setFormError(readableError(error));
      // Never delete uploaded files here: a DB response can be lost after commit.
    } finally {
      mutationLock.current = false;
      setSaving(false);
      setProgress("");
    }
  }

  async function deleteProduct() {
    if (!deleteTarget || mutationLock.current || !authorized) return;
    mutationLock.current = true;
    setDeleting(true);
    setDeleteError("");
    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteTarget.id)
        .select("id")
        .single();
      if (error) throw error;
      if (!data)
        throw new Error(
          "Товар не удалён. Обновите список и проверьте права доступа.",
        );
      setProducts((current) =>
        current.filter((product) => product.id !== deleteTarget.id),
      );
      setNotice("Товар удалён из каталога.");
      setDeleteTarget(null);
      // URLs can be referenced by historical orders or another product.
      // Removing a product must not destroy those shared image assets.
    } catch (error) {
      setDeleteError(readableError(error));
    } finally {
      mutationLock.current = false;
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Каталог товаров</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Товары, фотографии, характеристики и остатки.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={loading || saving || deleting}
            onClick={() => void loadProducts()}
            aria-label="Обновить каталог"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            disabled={!authorized || loading}
            onClick={() => openEditor()}
          >
            <Plus className="mr-2 size-4" />
            Добавить товар
          </Button>
        </div>
      </div>
      {pageError && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
        >
          {pageError}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Закрыть уведомление"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {authorized && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Поиск товаров"
              placeholder="Название, бренд или артикул"
              value={query}
              className="pl-9"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Видимость товаров"
            className={`${selectClass} sm:max-w-56`}
            value={visibility}
            onChange={(event) => {
              setVisibility(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">Все товары</option>
            <option value="active">Опубликованные</option>
            <option value="hidden">Скрытые</option>
          </select>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center gap-2 py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Загрузка каталога…
        </div>
      ) : (
        authorized && (
          <>
            <p className="text-sm text-muted-foreground">
              Найдено: {filtered.length} · Всего: {products.length}
            </p>
            {!visibleProducts.length && (
              <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
                {products.length
                  ? "По вашему запросу товаров нет."
                  : "Добавьте первый товар."}
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const photos = getProductPhotos(product);
                return (
                  <Card
                    key={product.id}
                    className="flex flex-col overflow-hidden"
                  >
                    <div className="relative p-4">
                      <ProductImage
                        key={photos[0] ?? "empty"}
                        src={photos[0]}
                        alt={product.name}
                        className="aspect-square w-full rounded-xl p-4"
                      />
                      <span
                        className={`absolute left-6 top-6 rounded-full px-2.5 py-1 text-xs font-medium ${product.is_active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700"}`}
                      >
                        {product.is_active ? "Опубликован" : "Скрыт"}
                      </span>
                      <span className="absolute bottom-6 right-6 rounded-full bg-background/95 px-2 py-1 text-xs">
                        {photos.length} фото
                      </span>
                    </div>
                    <CardContent className="flex-1 space-y-2 px-5">
                      <h2 className="text-lg font-semibold leading-snug">
                        {product.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {product.brand || "Без бренда"} ·{" "}
                        {categoryNames.get(product.category_id ?? "") ||
                          "Без категории"}
                      </p>
                      <p className="text-2xl font-bold">
                        {money.format(Number(product.price))} ₴
                      </p>
                      <p className="text-sm">
                        Остаток: <b>{product.stock_quantity ?? 0}</b> шт.
                        {product.sku != null && (
                          <span className="ml-3 text-muted-foreground">
                            Арт. {String(product.sku)}
                          </span>
                        )}
                      </p>
                    </CardContent>
                    <CardFooter className="gap-2 p-5">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => openEditor(product)}
                      >
                        <Pencil className="mr-2 size-4" />
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        className="text-destructive"
                        aria-label={`Удалить ${product.name}`}
                        onClick={() => {
                          setDeleteError("");
                          setDeleteTarget(product);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Назад
                </Button>
                <span>
                  {currentPage} / {pageCount}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Далее
                </Button>
              </div>
            )}
          </>
        )
      )}

      <Dialog
        open={form !== null}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
      >
        <DialogContent
          className="max-h-[94vh] w-[96vw] overflow-y-auto sm:max-w-4xl"
          onEscapeKeyDown={(event) => {
            if (saving) event.preventDefault();
          }}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {form?.isNew ? "Новый товар" : "Редактирование товара"}
            </DialogTitle>
            <DialogDescription>
              Заполните данные и добавьте фото. Изменения появятся после
              сохранения.
            </DialogDescription>
          </DialogHeader>
          {form && (
            <form onSubmit={saveProduct} className="space-y-7">
              <fieldset
                disabled={saving || !authorized}
                className="min-w-0 space-y-7 disabled:opacity-70"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="product-name">Название *</Label>
                    <Input
                      id="product-name"
                      required
                      value={form.name}
                      onChange={(event) =>
                        patchForm({ name: event.target.value })
                      }
                      placeholder="Samsung Galaxy A07 4/128GB Black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-brand">Бренд</Label>
                    <Input
                      id="product-brand"
                      value={form.brand}
                      onChange={(event) =>
                        patchForm({ brand: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Категория *</Label>
                    <select
                      id="product-category"
                      required
                      className={selectClass}
                      value={form.category_id}
                      onChange={(event) =>
                        patchForm({ category_id: event.target.value })
                      }
                    >
                      <option value="">Выберите категорию</option>
                      {form.category_id &&
                        !categories.some(
                          (category) => category.id === form.category_id,
                        ) && (
                          <option value={form.category_id}>
                            Текущая категория (недоступна в списке)
                          </option>
                        )}
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {!categories.length && (
                      <p className="text-xs text-destructive">
                        В таблице categories нет доступных категорий.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Цена, грн *</Label>
                    <Input
                      id="product-price"
                      type="number"
                      min="1"
                      max="2147483647"
                      step="1"
                      required
                      value={form.price}
                      onChange={(event) =>
                        patchForm({ price: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Остаток, шт. *</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      min="0"
                      max="2147483647"
                      step="1"
                      required
                      value={form.stock_quantity}
                      onChange={(event) => changeStock(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-sku">Артикул (цифры)</Label>
                    <Input
                      id="product-sku"
                      inputMode="numeric"
                      pattern="[0-9]{1,15}"
                      maxLength={15}
                      value={form.sku}
                      onChange={(event) =>
                        patchForm({ sku: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-color">Цвет</Label>
                    <Input
                      id="product-color"
                      value={form.color}
                      onChange={(event) =>
                        patchForm({ color: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-warranty">Гарантия, месяцев</Label>
                    <Input
                      id="product-warranty"
                      type="number"
                      min="0"
                      max="2147483647"
                      step="1"
                      placeholder="Не указана"
                      value={form.warranty_months}
                      onChange={(event) =>
                        patchForm({ warranty_months: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-availability">Наличие</Label>
                    <select
                      id="product-availability"
                      className={selectClass}
                      value={form.availability_status}
                      onChange={(event) =>
                        patchForm({ availability_status: event.target.value })
                      }
                    >
                      {!AVAILABILITY_OPTIONS.some(
                        (option) => option.value === form.availability_status,
                      ) && (
                        <option value={form.availability_status}>
                          {form.availability_status}
                        </option>
                      )}
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Описание товара</Label>
                  <Textarea
                    id="product-description"
                    rows={7}
                    value={form.description}
                    onChange={(event) =>
                      patchForm({ description: event.target.value })
                    }
                    placeholder="Описание товара. Отделяйте абзацы пустой строкой."
                  />
                  <p className="text-xs text-muted-foreground">
                    Используйте обычный текст. Пустая строка разделяет абзацы.
                  </p>
                </div>

                <section className="space-y-4" aria-labelledby="photos-heading">
                  <div>
                    <h3 id="photos-heading" className="text-lg font-semibold">
                      Фотографии · {form.photos.length}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Первое фото — обложка товара. JPG, PNG или WebP, до 5 МБ
                      каждое.
                    </p>
                  </div>
                  <div
                    className="rounded-xl border-2 border-dashed p-5 text-center"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (!saving && authorized)
                        addFiles(Array.from(event.dataTransfer.files));
                    }}
                  >
                    <input
                      ref={fileInput}
                      className="sr-only"
                      aria-label="Загрузить фотографии товаров"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelection}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInput.current?.click()}
                    >
                      <Upload className="mr-2 size-4" />
                      Выбрать фотографии
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Можно выбрать несколько файлов или перетащить их сюда.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {form.photos.map((photo, index) => (
                      <div
                        key={photo.key}
                        className={`overflow-hidden rounded-xl border ${index === 0 ? "border-primary ring-1 ring-primary" : "border-border"}`}
                      >
                        <div className="relative">
                          <ProductImage
                            key={photo.url}
                            src={photo.url}
                            alt={`${form.name || "Товар"}, фото ${index + 1}`}
                            className="aspect-square w-full p-2"
                          />
                          <button
                            type="button"
                            className="absolute right-1 top-1 rounded-full bg-background/95 p-1.5 text-destructive disabled:opacity-50"
                            aria-label={`Убрать фото ${index + 1}`}
                            onClick={() => removePhoto(photo.key)}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                        <div className="space-y-1 p-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={index === 0 ? "default" : "outline"}
                            className="w-full text-xs"
                            onClick={() =>
                              patchForm({
                                photos: movePhoto(form.photos, index, 0),
                              })
                            }
                          >
                            {index === 0 ? (
                              <Check className="mr-1 size-3" />
                            ) : (
                              <Star className="mr-1 size-3" />
                            )}
                            {index === 0 ? "Главное фото" : "Сделать главным"}
                          </Button>
                          <div className="flex items-center justify-between">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={index === 0 || saving}
                              aria-label={`Передвинуть фото ${index + 1} влево`}
                              onClick={() =>
                                patchForm({
                                  photos: movePhoto(
                                    form.photos,
                                    index,
                                    index - 1,
                                  ),
                                })
                              }
                            >
                              <ArrowLeft className="size-3" />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              {index + 1}
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={
                                index === form.photos.length - 1 || saving
                              }
                              aria-label={`Передвинуть фото ${index + 1} вправо`}
                              onClick={() =>
                                patchForm({
                                  photos: movePhoto(
                                    form.photos,
                                    index,
                                    index + 1,
                                  ),
                                })
                              }
                            >
                              <ArrowRight className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <details className="rounded-lg border p-3 text-sm">
                    <summary className="cursor-pointer font-medium">
                      Добавить ссылку на существующее фото
                    </summary>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Input
                        aria-label="Ссылка на фото"
                        placeholder="/images/products/samsungA07.png или https://…"
                        value={imageLink}
                        onChange={(event) => setImageLink(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addImageLink();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!imageLink.trim() || saving}
                        onClick={addImageLink}
                      >
                        Добавить
                      </Button>
                    </div>
                  </details>
                </section>

                <section
                  className="space-y-3"
                  aria-labelledby="specifications-heading"
                >
                  <h3
                    id="specifications-heading"
                    className="text-lg font-semibold"
                  >
                    Характеристики
                  </h3>
                  {form.specifications.map((row) => (
                    <div
                      key={row.id}
                      className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_125px_1fr_auto]"
                    >
                      <Input
                        aria-label="Название характеристики"
                        placeholder="Например: Объём памяти"
                        value={row.name}
                        onChange={(event) =>
                          patchSpecification(row.id, {
                            name: event.target.value,
                          })
                        }
                      />
                      <select
                        aria-label="Тип значения характеристики"
                        className={selectClass}
                        value={row.kind}
                        onChange={(event) => {
                          const kind = event.target
                            .value as DraftSpecification["kind"];
                          patchSpecification(row.id, {
                            kind,
                            value: kind === "boolean" ? "true" : row.value,
                          });
                        }}
                      >
                        <option value="text">Текст</option>
                        <option value="number">Число</option>
                        <option value="boolean">Да / Нет</option>
                        {row.kind === "json" && (
                          <option value="json">JSON</option>
                        )}
                      </select>
                      {row.kind === "boolean" ? (
                        <select
                          aria-label="Значение характеристики"
                          className={selectClass}
                          value={row.value}
                          onChange={(event) =>
                            patchSpecification(row.id, {
                              value: event.target.value,
                            })
                          }
                        >
                          <option value="true">Да</option>
                          <option value="false">Нет</option>
                        </select>
                      ) : row.kind === "json" ? (
                        <Textarea
                          aria-label="Структурированная характеристика"
                          value={row.value}
                          onChange={(event) =>
                            patchSpecification(row.id, {
                              value: event.target.value,
                            })
                          }
                        />
                      ) : (
                        <Input
                          aria-label="Значение характеристики"
                          placeholder="Например: 128 ГБ"
                          value={row.value}
                          onChange={(event) =>
                            patchSpecification(row.id, {
                              value: event.target.value,
                            })
                          }
                        />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`Удалить характеристику ${row.name}`}
                        onClick={() =>
                          patchForm({
                            specifications: form.specifications.filter(
                              (item) => item.id !== row.id,
                            ),
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      patchForm({
                        specifications: [
                          ...form.specifications,
                          {
                            id: crypto.randomUUID(),
                            name: "",
                            value: "",
                            kind: "text",
                          },
                        ],
                      })
                    }
                  >
                    <Plus className="mr-2 size-4" />
                    Добавить характеристику
                  </Button>
                </section>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/30 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 size-4"
                    checked={form.is_active}
                    onChange={(event) =>
                      patchForm({ is_active: event.target.checked })
                    }
                  />
                  <span>
                    <span className="block font-medium">
                      Показывать товар на сайте
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Снимите отметку, чтобы сохранить товар скрытым.
                    </span>
                  </span>
                </label>
              </fieldset>
              {formError && (
                <div
                  role="alert"
                  className="whitespace-pre-wrap rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800"
                >
                  {formError}
                </div>
              )}
              <DialogFooter className="sticky -bottom-6 border-t bg-background py-4">
                <span
                  role="status"
                  className="mr-auto self-center text-sm text-muted-foreground"
                >
                  {progress}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={closeEditor}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={saving || !authorized}>
                  {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {saving
                    ? "Сохраняем…"
                    : form.isNew
                      ? "Создать товар"
                      : "Сохранить изменения"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              «{deleteTarget?.name}» будет удалён из каталога. Чтобы временно
              убрать товар с сайта, откройте редактирование и снимите отметку
              «Показывать товар на сайте».
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p role="alert" className="text-sm text-destructive">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting || !authorized}
              onClick={() => void deleteProduct()}
            >
              {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Удалить товар
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
