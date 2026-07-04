"use client"

import { useState } from "react"
import { PaymentButton } from "./payment-button"
import Image from "next/image"
import {
  Trash2,
  Minus,
  Plus,
  Truck,
  Package,
  Store,
  ShieldCheck,
  CreditCard,
  Banknote,
  CalendarClock,
  ArrowRight,
} from "lucide-react"
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type CartItem = {
  id: string
  title: string
  variant: string
  price: number
  qty: number
  image: string
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "case-15pro",
    title: "Чохол для iPhone 15 Pro",
    variant: "MagSafe / Чорний матовий",
    price: 899,
    qty: 1,
    image: "/images/case-thumb.png",
  },
  {
    id: "glass-9d",
    title: "Захисне скло 9D",
    variant: "Повне покриття / Прозоре",
    price: 349,
    qty: 1,
    image: "/images/glass-thumb.png",
  },
]

const DELIVERY_OPTIONS = [
  { id: "novaposhta", label: "Нова Пошта", icon: Truck, hint: "1–2 дні" },
  { id: "ukrposhta", label: "Укрпошта", icon: Package, hint: "2–4 дні" },
  { id: "pickup", label: "Самовивіз з магазину", icon: Store, hint: "Безкоштовно" },
]

const PAYMENT_OPTIONS = [
  {
    id: "card",
    label: "Оплата картою на сайті",
    desc: "Visa / Mastercard, безпечна оплата",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "Післяплата (Накладений платіж)",
    desc: "Оплата при отриманні у відділенні",
    icon: Banknote,
  },
  {
    id: "parts",
    label: "Оплата частинами",
    desc: "ПриватБанк / Монобанк, до 12 платежів",
    icon: CalendarClock,
  },
]

const PROMO_CODES: Record<string, number> = {
  UPGRADE10: 0.1,
  CASE5: 0.05,
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value)
}



export function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [delivery, setDelivery] = useState("novaposhta")
  const [payment, setPayment] = useState("card")
  const [promoInput, setPromoInput] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; rate: number } | null>(null)
  const [promoError, setPromoError] = useState("")
// Добавьте в CheckoutClient:
const [cities, setCities] = useState<{ Ref: string; Description: string }[]>([]);
const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([]);
const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
const [selectedCity, setSelectedCity] = useState<string | null>(null);
const [openCity, setOpenCity] = useState(false)
const [openWarehouse, setOpenWarehouse] = useState(false)
const [citySearch, setCitySearch] = useState("")

// Загрузка городов при вводе
const handleCitySearch = async (val: string) => {
  setCitySearch(val)
  if (val.length < 3) return
  const res = await fetch('/api/novaposhta', {
    method: 'POST',
    body: JSON.stringify({ action: 'getCities', cityName: val }),
  })
  const data = await res.json()
  setCities(data || [])
}

// Функция выбора отделения
const handleSelectCity = async (cityRef: string) => {
  const res = await fetch('/api/novaposhta', {
    method: 'POST',
    body: JSON.stringify({ action: 'getWarehouses', cityRef }),
  });
  const data = await res.json();
  setWarehouses(data);
};

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, rate: PROMO_CODES[code] })
      setPromoError("")
    } else {
      setAppliedPromo(null)
      setPromoError("Промокод не знайдено")
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0
  const shippingFree = delivery === "pickup"
  const total = subtotal - discount

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-10 lg:py-16 lg:px-8"
    >
      {/* ---------- LEFT: Order form ---------- */}
      <div className="order-2 space-y-6 lg:order-1">
        {/* Contact */}
        <FormSection step="1" title="Контактні дані">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ім'я" htmlFor="firstName">
              <Input id="firstName" placeholder="Олександр" autoComplete="given-name" />
            </Field>
            <Field label="Прізвище" htmlFor="lastName">
              <Input id="lastName" placeholder="Коваленко" autoComplete="family-name" />
            </Field>
            <Field label="Телефон" htmlFor="phone">
              <Input id="phone" type="tel" placeholder="(050) 555-0123" autoComplete="tel" />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
            </Field>
          </div>
        </FormSection>

        {/* Delivery */}
        <FormSection step="2" title="Доставка">
          <div className="grid gap-3 sm:grid-cols-3">
            {DELIVERY_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = delivery === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDelivery(opt.id)}
                  aria-pressed={active}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-muted/40 text-foreground hover:border-foreground/40"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-semibold leading-tight">{opt.label}</span>
                  <span className={`text-xs ${active ? "text-background/70" : "text-muted-foreground"}`}>
                    {opt.hint}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Місто" htmlFor="city">
  <input
    id="city"
    placeholder="Почніть вводити місто..."
    onChange={(e) => handleCitySearch(e.target.value)} // Вызываем поиск при вводе
    className="h-12 w-full rounded-xl border border-input bg-muted/40 px-4 text-sm text-foreground"
  />
  
  {/* Список городов под полем ввода */}
  {cities.length > 0 && (
    <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg">
      {cities.map((city) => (
        <li 
          key={city.Ref} 
          onClick={() => {
            handleSelectCity(city.Ref); // Загружаем отделения
            setCities([]); // Скрываем список после выбора
            // Тут можно добавить запись названия города в Input
          }}
          className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
        >
          {city.Description}
        </li>
      ))}
    </ul>
  )}
</Field>
<Field label="Відділення" htmlFor="branch">
  <select 
    disabled={warehouses.length === 0}
    onChange={(e) => setSelectedWarehouse(e.target.value)}
    className="h-12 w-full rounded-xl border border-input bg-muted/40 px-4 text-sm"
  >
    <option>Оберіть відділення...</option>
    {warehouses.map((w) => (
      <option key={w.Ref} value={w.Ref}>{w.Description}</option>
    ))}
  </select>
</Field>
          </div>
        </FormSection>

        {/* Payment */}
        <FormSection step="3" title="Оплата">
          <div className="space-y-3" role="radiogroup" aria-label="Спосіб оплати">
            {PAYMENT_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = payment === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPayment(opt.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-foreground bg-muted/60"
                      : "border-border bg-muted/30 hover:border-foreground/40"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-foreground" : "border-muted-foreground"
                    }`}
                  >
                    {active && <span className="size-2.5 rounded-full bg-foreground" />}
                  </span>
                  <Icon className="size-5 shrink-0 text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </FormSection>
      </div>

      {/* ---------- RIGHT: Cart summary ---------- */}
      <aside className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-bold tracking-tight">Ваше замовлення</h2>

            {/* Items */}
            <ul className="mt-5 space-y-4">
              {items.length === 0 && (
                <li className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  Кошик порожній
                </li>
              )}
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{item.title}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Видалити ${item.title}`}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{item.variant}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border">
                        <QtyButton label="Зменшити" onClick={() => updateQty(item.id, -1)}>
                          <Minus className="size-3.5" />
                        </QtyButton>
                        <span className="w-6 text-center text-sm font-medium tabular-nums">{item.qty}</span>
                        <QtyButton label="Збільшити" onClick={() => updateQty(item.id, 1)}>
                          <Plus className="size-3.5" />
                        </QtyButton>
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {formatPrice(item.price * item.qty)} ₴
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Promo */}
            <div className="mt-6 border-t border-border pt-5">
              <label htmlFor="promo" className="text-xs font-medium text-muted-foreground">
                Промокод
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="promo"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="UPGRADE10"
                  className="h-11 flex-1 rounded-xl border border-input bg-muted/40 px-3 text-sm uppercase tracking-wide text-foreground outline-none transition-all placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:border-ring focus:bg-muted/70 focus:ring-2 focus:ring-ring/30"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="h-11 shrink-0 rounded-xl border border-border bg-muted px-4 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  Застосувати
                </button>
              </div>
              {promoError && <p className="mt-2 text-xs text-destructive">{promoError}</p>}
              {appliedPromo && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Промокод <span className="font-semibold text-foreground">{appliedPromo.code}</span> застосовано
                  (−{Math.round(appliedPromo.rate * 100)}%)
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
              <Row label="Сума замовлення" value={`${formatPrice(subtotal)} ₴`} />
              {discount > 0 && (
                <Row label="Знижка" value={`−${formatPrice(discount)} ₴`} accent />
              )}
              <Row
                label="Доставка"
                hint="за тарифами перевізника"
                value={shippingFree ? "Безкоштовно" : "—"}
              />
            </div>

            <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Разом до оплати
              </span>
              <span className="text-2xl font-extrabold tabular-nums">{formatPrice(total)} ₴</span>
            </div>

            {/* CTA */}
            <div
              className={`mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-base font-bold text-background transition-all hover:opacity-90 ${
                items.length === 0 ? "cursor-not-allowed opacity-40" : ""
              }`}
            >
              <PaymentButton
                orderData={{
                  items,
                  delivery,
                  payment,
                  total,
                }}
              />
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              Безпечне оформлення. Дані захищено.
            </p>
          </div>
        </div>
      </aside>
    </form>
  )
}

/* ---------- Building blocks ---------- */

function FormSection({
  step,
  title,
  children,
}: {
  step: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
          {step}
        </span>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-xl border border-input bg-muted/40 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:bg-muted/70 focus:ring-2 focus:ring-ring/30"
    />
  )
}

function QtyButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  )
}

function Row({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string
  hint?: string
  accent?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">
        {label}
        {hint && <span className="ml-1 text-xs text-muted-foreground/70">({hint})</span>}
      </span>
      <span className={`font-semibold tabular-nums ${accent ? "text-foreground" : ""}`}>{value}</span>
    </div>
  )
}