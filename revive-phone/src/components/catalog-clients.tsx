"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogFilters } from "@/components/catalog-filters";
import {
  catalogBrands,
  catalogPage,
  createCatalogFilters,
  filterCatalog,
  normalizeCatalogProduct,
} from "@/lib/catalog-utils";
import type {
  CatalogFilters as FilterValues,
  CatalogSort,
} from "@/lib/catalog-utils";
import type { Accessory } from "@/lib/accessories";
import { createClient } from "@/lib/supabase";
import { ProductCard } from "./product-cart";
import { SearchComponent } from "./SearchComponent";

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "newest", label: "Спочатку нові" },
  { value: "price-asc", label: "Від дешевих до дорогих" },
  { value: "price-desc", label: "Від дорожчих до дешевих" },
];

function CatalogLoading() {
  return (
    <div role="status" className="py-20 text-center text-muted-foreground">
      Завантаження товарів…
    </div>
  );
}

function CatalogContent() {
  // One client per mount; render/state updates do not recreate the effect dependency.
  const [supabase] = useState(() => createClient());
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const categoryParam = searchParams?.get("category") ?? null;
  const [filters, setFilters] = useState<FilterValues>(() =>
    createCatalogFilters(categoryParam),
  );
  const [sort, setSort] = useState<CatalogSort>("newest");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setFilters(createCatalogFilters(categoryParam));
    setPage(1);
  }, [categoryParam]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const rows: Accessory[] = [];
        const batchSize = 500;
        for (let offset = 0; ; offset += batchSize) {
          const { data, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .order("id", { ascending: true })
            .range(offset, offset + batchSize - 1)
            .abortSignal(controller.signal);
          if (!mounted) return;
          if (fetchError) throw fetchError;
          rows.push(
            ...((data ?? []) as Accessory[]).map(normalizeCatalogProduct),
          );
          if (!data || data.length < batchSize) break;
        }
        if (mounted) setProducts(rows);
      } catch {
        if (mounted) {
          setProducts([]);
          setError(
            "Не вдалося завантажити каталог. Перевірте з’єднання та спробуйте ще раз.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void fetchProducts();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [supabase, reload]);

  // Returning from the admin tab fetches current data without a Realtime setup.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible")
        setReload((value) => value + 1);
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const brands = useMemo(() => catalogBrands(products), [products]);
  const maxPrice = useMemo(
    () =>
      products.reduce(
        (max, product) =>
          Number.isFinite(product.price) ? Math.max(max, product.price) : max,
        0,
      ),
    [products],
  );
  const filtered = useMemo(
    () => filterCatalog(products, filters, searchQuery, sort),
    [products, filters, searchQuery, sort],
  );
  const pagination = catalogPage(filtered, page, 12);

  function handleChange(next: FilterValues) {
    setFilters(next);
    setPage(1);
  }
  function handleSearch(value: string) {
    setSearchQuery(value);
    setPage(1);
  }
  function handleReset() {
    setFilters(createCatalogFilters());
    setSearchQuery("");
    setPage(1);
    // Otherwise refreshing ?category=... would immediately restore that filter.
    if (categoryParam) {
      const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
      nextParams.delete("category");
      const query = nextParams.toString();
      router.replace(`${pathname ?? "/catalog"}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Смартфони та аксесуари
          </h1>
          {searchQuery.trim() && (
            <p className="mt-3 text-sm text-muted-foreground">
              Результати пошуку: «{searchQuery.trim()}»
            </p>
          )}
          <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
            {loading ? (
              "Оновлюємо каталог…"
            ) : error ? (
              "Каталог тимчасово недоступний"
            ) : (
              <>
                Знайдено{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length} товарів
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-expanded={mobileFiltersOpen}
            aria-controls="catalog-filters"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Фільтри
          </button>
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value as CatalogSort);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="h-11 w-auto min-w-52 rounded-full px-4"
              aria-label="Сортування товарів"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            disabled={loading}
            onClick={() => setReload((value) => value + 1)}
            aria-label="Оновити каталог"
            className="rounded-full border border-border p-3 transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <SearchComponent
        products={products}
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside
          id="catalog-filters"
          className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}
        >
          <div className="lg:sticky lg:top-44">
            <CatalogFilters
              filters={filters}
              brands={brands}
              maxPrice={maxPrice}
              onChange={handleChange}
              onReset={handleReset}
            />
          </div>
        </aside>
        <div>
          {loading ? (
            <CatalogLoading />
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/30 p-8 text-center"
            >
              <p className="text-sm text-destructive">{error}</p>
              <button
                type="button"
                className="mt-4 rounded-full border border-border px-4 py-2 text-sm"
                onClick={() => setReload((value) => value + 1)}
              >
                Спробувати ще раз
              </button>
            </div>
          ) : pagination.items.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {pagination.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {pagination.pageCount > 1 && (
                <nav
                  aria-label="Сторінки каталогу"
                  className="mt-8 flex items-center justify-center gap-4"
                >
                  <button
                    type="button"
                    aria-label="Попередня сторінка"
                    disabled={pagination.page <= 1}
                    className="rounded-full border border-border p-2.5 disabled:opacity-30"
                    onClick={() => setPage(pagination.page - 1)}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <span className="text-sm">
                    Сторінка {pagination.page} з {pagination.pageCount}
                  </span>
                  <button
                    type="button"
                    aria-label="Наступна сторінка"
                    disabled={pagination.page >= pagination.pageCount}
                    className="rounded-full border border-border p-2.5 disabled:opacity-30"
                    onClick={() => setPage(pagination.page + 1)}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Нічого не знайдено
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
              >
                Скинути фільтри та пошук
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Keep useSearchParams under Suspense, including production static builds.
export function CatalogClient() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}
