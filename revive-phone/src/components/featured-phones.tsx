"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const PHONES = [
  {
    image: "/images/phone-iphone15pro.png",
    title: "Apple iPhone 15 Pro (Вживаний)",
    price: "34 999 ₴",
    memory: "256 ГБ",
    condition: "Як новий",
    badge: "Вживаний",
  },
  {
    image: "/images/phone-s24ultra.png",
    title: "Samsung S24 Ultra (Новий)",
    price: "47 499 ₴",
    memory: "512 ГБ",
    condition: "Новий",
    badge: "Новий",
  },
  {
    image: "/images/phone-pixel.png",
    title: "Google Pixel 8 Pro (Новий)",
    price: "29 999 ₴",
    memory: "128 ГБ",
    condition: "Новий",
    badge: "Новий",
  },
  {
    image: "/images/phone-iphone14.png",
    title: "Apple iPhone 14 (Вживаний)",
    price: "21 499 ₴",
    memory: "128 ГБ",
    condition: "Гарний",
    badge: "Вживаний",
  },
]

function PhoneCard({ phone }: { phone: (typeof PHONES)[number] }) {
  const [liked, setLiked] = useState(false)
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-foreground/25">
      <div className="relative aspect-square w-full overflow-hidden bg-secondary/40">
        <img
          src={phone.image || "/placeholder.svg"}
          alt={phone.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          {phone.badge}
        </span>
        <button
          aria-label={liked ? "Прибрати з обраного" : "Додати в обране"}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={liked ? "size-4.5 fill-foreground" : "size-4.5"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-bold leading-snug tracking-tight text-foreground">{phone.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {phone.memory}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {phone.condition}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xl font-bold tracking-tight text-foreground">{phone.price}</span>
          <Button size="sm" variant="secondary" className="rounded-full border border-border font-semibold">
            Переглянути
          </Button>
        </div>
      </div>
    </article>
  )
}

export function FeaturedPhones() {
  return (
    <section id="phones" className="border-b border-border bg-background scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">Каталог</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Досконалі нові та вживані моделі
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Якщо старий друг більше не тягне — ми підберемо нового та кращого.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PHONES.map((phone) => (
            <PhoneCard key={phone.title} phone={phone} />
          ))}
        </div>
      </div>
    </section>
  )
}
