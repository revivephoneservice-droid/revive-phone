"use client"

import { useState } from "react"
import Image from "next/image"
import { BadgeCheck, ChevronRight, Heart, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Accessory } from "@/lib/accessories"

// Используем ваш тип Accessory
interface ProductDetailProps {
  product: Accessory; // В идеале замените на ваш тип Accessory
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  
  // Предположим, что у вас в базе одно фото, 
  // если есть массив - замените логику GALLERY
  const imageUrl = product.image_url || "/placeholder.svg";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="Хлібні крихти" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="text-foreground">{product.brand} / {product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Media */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-card">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Purchase info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-tight text-balance sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold tracking-tight">{product.price.toLocaleString("uk-UA")} ₴</span>
          </div>

          <p className="mt-6 text-muted-foreground">{product.description}</p>

          {/* Quantity + CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between rounded-full border border-border bg-card px-2 py-2 sm:w-auto">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button className="h-14 flex-1 rounded-full text-sm font-bold uppercase">
              Додати в кошик
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}