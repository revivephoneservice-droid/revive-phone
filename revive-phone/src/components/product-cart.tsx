"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingBag, Check } from "lucide-react"
import type { Accessory } from "@/lib/accessories"
import Link from "next/link"

export function ProductCard({ product }: { product: Accessory }) {
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  return (
    <Link href={`/product/${product.id}`} className="group">
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/30">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground backdrop-blur">
          {product.brand}
        </span>
        <button
          aria-label={liked ? "Прибрати з обраного" : "Додати в обране"}
          aria-pressed={liked}
          onClick={() => setLiked((l) => !l)}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={`size-4 transition-colors ${liked ? "fill-foreground" : ""}`}
          />
        </button>
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt="images"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold leading-snug text-foreground text-balance">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-foreground">
            {product.price.toLocaleString("uk-UA")} ₴
          </span>
          <button
            onClick={() => {
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
            }}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {added ? (
              <>
                <Check className="size-3.5" />
                Додано
              </>
            ) : (
              <>
                <ShoppingBag className="size-3.5" />
                Купити
              </>
            )}
          </button>
        </div>
      </div>
    </article>
    </Link>
  )
}
