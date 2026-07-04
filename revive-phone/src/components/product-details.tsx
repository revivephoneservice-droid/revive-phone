"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  Layers,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GALLERY = [
  { src: "/images/case-main.png", alt: "Шкіряний чохол спереду" },
  { src: "/images/case-back.png", alt: "Шкіряний чохол ззаду з MagSafe" },
  { src: "/images/case-side.png", alt: "Бічна сторона чохла" },
  { src: "/images/case-detail.png", alt: "Макрозйомка текстури шкіри" },
]

const MODELS = ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max"]

const COLORS = [
  { name: "Чорний", value: "#0a0a0a" },
  { name: "Глибокий синій", value: "#1c2a3f" },
  { name: "Коньячний", value: "#7c4a2d" },
]

const FEATURES = [
  { icon: Sparkles, title: "Підтримка MagSafe", text: "Надійна магнітна фіксація" },
  { icon: Layers, title: "Натуральна шкіра", text: "Преміальна повнозерниста" },
  { icon: ShieldCheck, title: "Захист від падінь", text: "Сертифікація до 2 метрів" },
  { icon: Smartphone, title: "Сумісність з 9D склом", text: "Не заважає захисту екрана" },
]

const SPECS = [
  { label: "Матеріал", value: "Натуральна повнозерниста шкіра" },
  { label: "Сумісність", value: "iPhone 15 / 15 Pro / 15 Pro Max" },
  { label: "Бренд", value: "Upgrade Mobile" },
  { label: "Колір", value: "Чорний, Синій, Коньячний" },
  { label: "MagSafe", value: "Так, вбудований магнітний масив" },
  { label: "Гарантія", value: "12 місяців" },
]

const REVIEWS = [
  {
    name: "Олександр К.",
    rating: 5,
    date: "12 червня 2026",
    text: "Шкіра приємна на дотик, MagSafe тримає ідеально. Виглядає набагато дорожче за свою ціну.",
  },
  {
    name: "Марія В.",
    rating: 5,
    date: "8 червня 2026",
    text: "Замовляла коньячний колір — у житті ще краще, ніж на фото. Захист кнопок чіткий.",
  },
  {
    name: "Дмитро Л.",
    rating: 4,
    date: "2 червня 2026",
    text: "Якісний чохол, єдине — хотілося б більше відтінків. Доставка швидка.",
  },
]

const TABS = [
  { id: "description", label: "Опис" },
  { id: "specs", label: "Характеристики" },
  { id: "reviews", label: "Відгуки (42)" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function ProductDetail() {
  const [activeImage, setActiveImage] = useState(0)
  const [model, setModel] = useState(MODELS[1])
  const [color, setColor] = useState(COLORS[0].name)
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  const [tab, setTab] = useState<TabId>("description")

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="Хлібні крихти" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {["Головна", "Аксесуари", "Чохли", "Apple"].map((crumb, i, arr) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <a
              href="#"
              className={cn(
                "transition-colors hover:text-foreground",
                i === arr.length - 1 && "text-foreground",
              )}
            >
              {crumb}
            </a>
            {i < arr.length - 1 && <ChevronRight className="size-3.5" />}
          </span>
        ))}
      </nav>

      {/* Core section */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Media */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-card">
            <Image
              src={GALLERY[activeImage].src || "/placeholder.svg"}
              alt={GALLERY[activeImage].alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setFavorite((v) => !v)}
              aria-pressed={favorite}
              aria-label="Додати в обране"
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-background"
            >
              <Heart className={cn("size-5", favorite && "fill-foreground")} />
            </button>
            <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
              Новий
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {GALLERY.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Показати ${image.alt}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-2xl bg-card ring-2 transition-all",
                  activeImage === i ? "ring-foreground" : "ring-transparent hover:ring-border",
                )}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-tight text-balance sm:text-4xl">
            Преміальний Шкіряний Чохол MagSafe для iPhone 15 Pro
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-foreground text-foreground" />
                ))}
              </span>
              <span className="font-semibold">4.9</span>
              <span className="text-muted-foreground">(42 відгуки)</span>
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <BadgeCheck className="size-4" />В наявності
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold tracking-tight">1 499 ₴</span>
            <span className="text-lg text-muted-foreground line-through">1 899 ₴</span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">−21%</span>
          </div>

          {/* Model selector */}
          <div className="mt-8">
            <p className="text-sm font-medium">Модель пристрою</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {MODELS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    model === m
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-foreground hover:border-foreground/40",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className="mt-6">
            <p className="text-sm font-medium">
              Колір: <span className="text-muted-foreground">{color}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background transition-all",
                    color === c.name ? "ring-foreground" : "ring-border hover:ring-foreground/40",
                  )}
                >
                  <span className="size-7 rounded-full border border-white/10" style={{ backgroundColor: c.value }} />
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between rounded-full border border-border bg-card px-2 py-2 sm:w-auto">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Зменшити кількість"
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-base font-semibold tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Збільшити кількість"
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button className="h-14 flex-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Додати в кошик
            </Button>
          </div>

          <Button
            variant="outline"
            className="mt-3 h-14 w-full rounded-full text-sm font-bold uppercase tracking-wide"
          >
            Купити в один клік
          </Button>

          {/* Reassurance */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-card p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4" /> Безкоштовна доставка від 1 000 ₴
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" /> Гарантія 12 місяців
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-2xl bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted">
              <feature.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex flex-wrap gap-2 border-b border-border/60">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "relative -mb-px px-4 py-3 text-sm font-semibold transition-colors",
                tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "description" && (
            <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Преміальний чохол виготовлений із натуральної повнозернистої шкіри, яка з часом набуває благородної
                патини. Вбудований магнітний масив MagSafe забезпечує миттєву фіксацію зарядних пристроїв та
                аксесуарів без втрати ефективності заряджання.
              </p>
              <p>
                М&apos;яка мікрофіброва підкладка захищає корпус від подряпин, а підняті бортики навколо камери та
                екрана додають впевненості при щоденному використанні. Точні вирізи залишають доступ до всіх кнопок і
                портів, а тонкий профіль зберігає оригінальну ергономіку вашого iPhone.
              </p>
            </div>
          )}

          {tab === "specs" && (
            <div className="max-w-2xl overflow-hidden rounded-2xl bg-card">
              <table className="w-full text-sm">
                <tbody>
                  {SPECS.map((spec, i) => (
                    <tr key={spec.label} className={cn(i !== SPECS.length - 1 && "border-b border-border/50")}>
                      <th scope="row" className="w-2/5 px-5 py-4 text-left font-medium text-muted-foreground">
                        {spec.label}
                      </th>
                      <td className="px-5 py-4 font-medium">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "reviews" && (
            <div className="max-w-3xl space-y-4">
              {REVIEWS.map((review) => (
                <div key={review.name} className="rounded-2xl bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{review.name}</span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="mt-2 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < review.rating ? "fill-foreground text-foreground" : "text-muted-foreground/40",
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
