"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase" // Убедитесь, что путь к supabase клиенту верный
import Link from "next/link"

function PhoneCard({ phone }: { phone: any }) {
  const [liked, setLiked] = useState(false)
  
  return (
    // 2. Оборачиваем весь контент в Link. 
    // className "block" нужен, чтобы Link растянулся на всю карточку
    <Link href={`/product/${phone.id}`} className="block group">
      <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-foreground/25 h-full">
        <div className="relative aspect-square w-full overflow-hidden bg-secondary/40">
          <img
            src={phone.image_url || "/placeholder.svg"}
            alt={phone.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
            {phone.is_active ? "В наявності" : "Продано"}
          </span>
          {/* Кнопку "Избранное" нужно вынести из ссылки, иначе при клике на нее 
              будет происходить переход по ссылке */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Предотвращает переход по ссылке при клике на сердечко
              setLiked((v) => !v);
            }}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
          >
            <Heart className={liked ? "size-4.5 fill-foreground" : "size-4.5"} />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-base font-bold leading-snug tracking-tight text-foreground">{phone.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {phone.brand}
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="text-xl font-bold tracking-tight text-foreground">{phone.price} ₴</span>
            <Button size="sm" variant="secondary" className="rounded-full border border-border font-semibold pointer-events-none">
              Переглянути
            </Button>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function FeaturedPhones() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4) // Ограничиваем количество товаров для главной страницы

      if (data) setProducts(data)
      if (error) console.error("Ошибка загрузки:", error)
      setLoading(false)
    }
    fetchProducts()
  }, [supabase])

  return (
    <section id="phones" className="border-b border-border bg-background scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">Каталог</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Досконалі нові та вживані моделі
          </h2>
        </div>

        {loading ? (
          <div className="mt-12 text-center">Завантаження товарів...</div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <PhoneCard key={product.id} phone={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}