"use client"

import { useMemo, useState, useEffect } from "react"
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductCard } from "./product-cart"
import { FilterSidebar, type Filters } from "@/components/filter-sidebar"
import { PRICE_MAX, PRICE_MIN } from "@/lib/accessories"
import { createClient } from "@/lib/supabase"
import { CATEGORY_MAP } from "@/lib/accessories"
import { SearchComponent } from "./SearchComponent"


const SORT_OPTIONS = [
  { value: "popular", label: "За популярністю" },
  { value: "price-asc", label: "Від дешевих до дорогих" },
  { value: "price-desc", label: "Від дорожчих до дешевих" },
]

const EMPTY_FILTERS: Filters = {
  categories: [],
  brands: [],
  conditions: [],
  price: [PRICE_MIN, PRICE_MAX],
}

export function CatalogClient() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState("popular")
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true)
      console.log("Fetched products:", data)
      if (data) setProducts(data)
      if (error) console.error("Ошибка загрузки товаров:", error)
      setLoading(false)
    }
    fetchProducts()
  }, [supabase])

  console.log("Current products:", products)

  const filtered = useMemo(() => {
    let result = [...products].filter((p) => {
      // 1. Поиск по названию
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Категории
      const selectedCategoryIds = filters.categories.map(key => CATEGORY_MAP[key]);
      const matchesCategory = filters.categories.length === 0 || selectedCategoryIds.includes(p.category_id);
      
      // 3. Бренды
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(p.brand);
      
      // 4. Цена
      const matchesPrice = p.price >= filters.price[0] && p.price <= filters.price[1];
  
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  
    // Сортировка
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [filters, sort, products, searchQuery]); // Добавили searchQuery в зависимости

  const handleChange = (next: Filters) => {
    setFilters(next)
    setPage(1)
  }

  const handleReset = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">

      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Аксесуари для ваших девайсів

            {searchQuery && <p>Результати пошуку: "{searchQuery}"</p>}
          </h1>
          
          <p className="mt-3 text-sm text-muted-foreground">
            Знайдено <span className="font-semibold text-foreground">{filtered.length} товарів</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Фільтри
          </button>
          <Select value={sort} onValueChange={(v) => setSort(v as string)}>
            <SelectTrigger className="h-11 w-full min-w-52 rounded-full px-4">
              <SelectValue>{SORT_OPTIONS.find((o) => o.value === sort)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <SearchComponent 
       products={products} 
       value={searchQuery} 
       onChange={setSearchQuery} // Вот этот вызов передает текст вверх в состояние CatalogClient
    />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-44">
            <FilterSidebar filters={filters} onChange={handleChange} onReset={handleReset} />
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Завантаження товарів...</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm font-medium text-foreground">Нічого не знайдено</p>
              <button onClick={handleReset} className="mt-4 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Скинути фільтри</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}