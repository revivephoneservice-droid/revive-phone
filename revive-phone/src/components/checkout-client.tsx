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
} from "lucide-react"
import { useCart } from "@/context/cart-context"

const DELIVERY_OPTIONS = [
  { id: "novaposhta", label: "Нова Пошта", icon: Truck, hint: "1–2 дні" },
  { id: "ukrposhta", label: "Укрпошта", icon: Package, hint: "2–4 дні" },
  { id: "pickup", label: "Самовивіз", icon: Store, hint: "Безкоштовно" },
]

const PAYMENT_OPTIONS = [
  { id: "card", label: "Оплата картою", desc: "Visa / Mastercard", icon: CreditCard },
  { id: "cod", label: "Післяплата", desc: "Оплата при отриманні", icon: Banknote },
  { id: "parts", label: "Оплата частинами", desc: "Приват / Моно", icon: CalendarClock },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value)
}

export function CheckoutClient() {
  const { items, updateQty, removeItem } = useCart()
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", email: "" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
  
  const [delivery, setDelivery] = useState("novaposhta")
  const [payment, setPayment] = useState("card")
  const [promoInput, setPromoInput] = useState("")
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-10 lg:py-16 lg:px-8">
      
      {/* LEFT: Order form */}
      <div className="order-2 space-y-6 lg:order-1">
      <FormSection step="1" title="Контактні дані">
        <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ім'я" htmlFor="firstName">
            <Input id="firstName" placeholder="Олександр" value={formData.firstName} onChange={handleInputChange} />
            </Field>
            <Field label="Прізвище" htmlFor="lastName">
            <Input id="lastName" placeholder="Коваленко" value={formData.lastName} onChange={handleInputChange} />
            </Field>
            <Field label="Телефон" htmlFor="phone">
            <Input id="phone" type="tel" placeholder="(050) 555-0123" value={formData.phone} onChange={handleInputChange} />
            </Field>
            <Field label="Email" htmlFor="email">
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
            </Field>
        </div>
        </FormSection>

        <FormSection step="2" title="Доставка">
          <div className="grid gap-3 sm:grid-cols-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <button key={opt.id} type="button" onClick={() => setDelivery(opt.id)} className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${delivery === opt.id ? "border-foreground bg-foreground text-background" : "border-border bg-muted/40 text-foreground hover:border-foreground/40"}`}>
                <opt.icon className="size-5" />
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className={`text-xs ${delivery === opt.id ? "text-background/70" : "text-muted-foreground"}`}>{opt.hint}</span>
              </button>
            ))}
          </div>
        </FormSection>

        <FormSection step="3" title="Оплата">
          <div className="space-y-3">
            {PAYMENT_OPTIONS.map((opt) => (
              <button key={opt.id} type="button" onClick={() => setPayment(opt.id)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${payment === opt.id ? "border-foreground bg-muted/60" : "border-border bg-muted/30 hover:border-foreground/40"}`}>
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${payment === opt.id ? "border-foreground" : "border-muted-foreground"}`}>{payment === opt.id && <span className="size-2.5 rounded-full bg-foreground" />}</span>
                <opt.icon className="size-5 shrink-0 text-muted-foreground" />
                <span className="flex-1"><span className="block text-sm font-semibold">{opt.label}</span><span className="block text-xs text-muted-foreground">{opt.desc}</span></span>
              </button>
            ))}
          </div>
        </FormSection>
      </div>

      {/* RIGHT: Cart summary */}
      <aside className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-28 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Ваше замовлення</h2>
          <ul className="mt-5 space-y-4">
            {items.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground border-dashed border rounded-2xl">Кошик порожній</li>
            ) : (
              items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted"><Image src={item.image} alt={item.title} fill className="object-cover" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start text-sm font-semibold">
                      {item.title}
                      <button onClick={() => removeItem(item.id)}><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></button>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 border rounded-full">
                        <QtyButton label="Зменшити" onClick={() => updateQty(item.id, -1)}><Minus className="size-3.5" /></QtyButton>
                        <span className="w-6 text-center text-sm">{item.qty}</span>
                        <QtyButton label="Збільшити" onClick={() => updateQty(item.id, 1)}><Plus className="size-3.5" /></QtyButton>
                      </div>
                      <span className="text-sm font-bold tabular-nums">{formatPrice(item.price * item.qty)} ₴</span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="mt-6 border-t pt-5 text-sm space-y-2">
            <Row label="Сума" value={`${formatPrice(subtotal)} ₴`} />
            <div className="flex justify-between text-lg font-extrabold border-t pt-2 mt-2">
              <span>Разом</span>
              <span>{formatPrice(total)} ₴</span>
            </div>
          </div>

          <div className="mt-6">
             <PaymentButton orderData={{ items, delivery, payment, total, contactData: formData }} />
          </div>
          
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Безпечне оформлення</p>
        </div>
      </aside>
    </form>
  )
}

function FormSection({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">{step}</span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="h-12 w-full rounded-xl border border-input bg-muted/40 px-4 text-sm text-foreground outline-none focus:border-ring focus:bg-muted/70" />
}

function QtyButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">{children}</button>
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="font-semibold text-foreground">{value}</span></div>
}