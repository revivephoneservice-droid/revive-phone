"use client"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

const RELATED = [
  { name: "Захисне 9D скло для iPhone 15 Pro", badge: "Новий", price: "499 ₴", image: "/images/glass.png" },
  { name: "Бездротова зарядка MagSafe 15W", badge: "Новий", price: "1 299 ₴", image: "/images/charger.png" },
  { name: "Кабель USB-C → USB-C 1м", badge: "Новий", price: "399 ₴", image: "/images/cable.png" },
  { name: "Бездротові навушники Pro", badge: "Новий", price: "3 499 ₴", image: "/images/airpods.png" },
]

export function RelatedProducts() {
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

      const shortProducts = products.length > 4 ? products.slice(0, 4) : products; 
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold uppercase tracking-tight text-balance sm:text-3xl">
        З цим товаром також купують
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shortProducts.map((product) => (
          <article key={product.name} className="group overflow-hidden rounded-3xl bg-card">
            <div className="relative aspect-square overflow-hidden bg-muted/30">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                {product.brand}
              </span>
              <button
                type="button"
                aria-label="Додати в обране"
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-background"
              >
                <Heart className="size-4" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="min-h-10 text-sm font-semibold leading-snug text-pretty">{product.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold">{product.price}₴</span>
                <Button variant="secondary" size="sm" className="rounded-full px-4">
                  Переглянути
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
