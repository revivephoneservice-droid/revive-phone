"use client"

import { useState } from "react"
import Image from "next/image"
import { BadgeCheck, Heart, Minus, Plus, ShieldCheck, Star, Truck, Zap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Accessory } from "@/lib/accessories"
import { useCart } from "@/context/cart-context"

interface ProductDetailProps {
  product: Accessory;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc")
  const { addItem, items } = useCart()
  const inCart = items.find(i => String(i.id) === String(product.id))

  const imageUrl = product.image_url || "/placeholder.svg";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <span className="hover:text-foreground transition-colors cursor-pointer">Каталог</span>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">{product.brand} / {product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted/20">
          <img src={imageUrl} alt={product.name}  className="object-cover hover:scale-105 transition-transform duration-700" />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="size-3" /> Хіт продажів
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">{product.name}</h1>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-5 fill-current" />)}
            </div>
            <span className="text-sm font-semibold text-foreground/80 underline decoration-muted-foreground underline-offset-4">128 відгуків</span>
          </div>

          <div className="mt-8 text-5xl font-bold text-foreground">{product.price.toLocaleString("uk-UA")} ₴</div>
          
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            Преміальний аксесуар, що поєднує витончений дизайн та надійний захист. 
            Виготовлено вручну з натуральної шкіри для тих, хто цінує якість у кожній деталі.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <BadgeCheck className="size-5" /> В наявності
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-5" /> Офіційна гарантія 12 міс.
            </div>
          </div>
          
          <div className="mt-10 flex gap-4">
             <div className="flex items-center rounded-full border border-border bg-card p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-muted rounded-full transition"><Minus className="size-4"/></button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-muted rounded-full transition"><Plus className="size-4"/></button>
             </div>
            <Button 
                className="..."
                onClick={() => addItem({
                    id: String(product.id),
                    title: product.name,
                    price: product.price,
                    qty: quantity, // ИСПОЛЬЗУЙ СОСТОЯНИЕ quantity, а не число 1
                    image: product.image_url,
                    variant: "Default"
                })}
                >
                {inCart ? `У кошику (${inCart.qty})` : "Додати в кошик"}
            </Button>
          </div>

          {/* Доставка и возврат */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-t pt-8 border-border">
            <div className="flex items-start gap-4">
              <Truck className="size-8 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">Безкоштовна доставка</p>
                <p className="text-xs text-muted-foreground mt-1">При замовленні від 2000 ₴</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Heart className="size-8 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">Повернення 14 днів</p>
                <p className="text-xs text-muted-foreground mt-1">Без зайвих питань</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Преимущества магазина */}
<section className="mt-24 border-t border-border pt-16">
  <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Чому обирають  FixPhon?</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        icon: ShieldCheck,
        title: "Сертифікована якість",
        desc: "Кожен пристрій проходить 15 етапів тестування перед продажем.",
      },
      {
        icon: Zap,
        title: "Швидка відправка",
        desc: "Замовлення, оформлені до 16:00, їдуть до вас у той же день.",
      },
      {
        icon: BadgeCheck,
        title: "Підтримка 24/7",
        desc: "Наші фахівці готові допомогти вам з налаштуванням будь-якого девайса.",
      },
    ].map((item, idx) => (
      <div key={idx} className="flex flex-col items-center text-center p-8 rounded-3xl bg-secondary/20 border border-border/50">
        <div className="size-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
          <item.icon className="size-7" />
        </div>
        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

      {/* Tabs и контент остались прежними, но теперь они гармонично продолжают этот стиль */}
    </div>
  )
}