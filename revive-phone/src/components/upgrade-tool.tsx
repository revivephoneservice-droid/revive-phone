"use client"

import { useState } from "react"
import { ArrowRight, BadgeCheck, RefreshCw, ShieldCheck, Shirt, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

type Plan = "dress" | "trade" | "buy"

const PLANS: { id: Plan; label: string; icon: typeof Shirt }[] = [
  { id: "dress", label: "Одягнути старий", icon: Shirt },
  { id: "trade", label: "Обміняти на новий", icon: RefreshCw },
  { id: "buy", label: "Купити аксесуари", icon: ShoppingBag },
]

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Інше"]
const CONDITIONS = ["Як новий", "Гарний", "Задовільний", "Несправний"]
const ACCESSORY_TYPES = ["Чохол", "Захисне скло", "Зарядка", "Тримач"]
const CATEGORIES = ["Чохли оверсайз", "Скло 9D", "Бездротові зарядки", "Магнітні тримачі"]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2.5 block text-sm font-medium text-foreground">{children}</span>
}

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const active = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={
                active
                  ? "rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
                  : "rounded-full border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              }
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-border bg-secondary/60 px-5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-foreground/40"
      />
    </div>
  )
}

export function UpgradeTool() {
  const [plan, setPlan] = useState<Plan>("trade")
  const [brand, setBrand] = useState("Apple")
  const [model, setModel] = useState("")
  const [condition, setCondition] = useState("Як новий")
  const [target, setTarget] = useState("")
  const [accessory, setAccessory] = useState("Чохол")
  const [category, setCategory] = useState("Чохли оверсайз")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Базовая проверка: поля Name и Phone обязательны всегда
    if (!name || !phone || !model) {
      alert("Будь ласка, заповніть усі необхідні поля.")
      return
    }

    // Логика отправки данных (здесь можно добавить fetch к API)
    console.log("Відправлено:", { plan, brand, model, condition, target, accessory, category, name, phone })
    
    setIsSubmitted(true)
  }

  return (
    <section id="tool" className="border-b border-border bg-background scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="px-6 py-10 sm:px-12 sm:py-14">
            
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-700">
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                  <BadgeCheck className="size-8" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Дякуємо!</h2>
                <p className="mt-4 text-muted-foreground max-w-sm">
                  Ваша заявка успішно отримана. Наш менеджер зв'яжеться з вами найближчим часом для уточнення деталей.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  className="mt-8 rounded-full px-8"
                  variant="outline"
                >
                  Повернутися назад
                </Button>
              </div>
            ) : (
              <>
                <div className="mx-auto max-w-2xl text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    Безкоштовна миттєва оцінка
                  </span>
                  <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Оцінка &amp; апгрейд за лічені секунди
                  </h2>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Жодних зобов&apos;язань. Дізнайтеся точну пропозицію перед бронюванням.
                  </p>
                </div>

                <form
                  className="mx-auto mt-10 flex max-w-2xl flex-col gap-7"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <FieldLabel>Який у вас план?</FieldLabel>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {PLANS.map((p) => {
                        const active = plan === p.id
                        const Icon = p.icon
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPlan(p.id)}
                            className={
                              active
                                ? "flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-4 text-sm font-semibold text-background"
                                : "flex items-center justify-center gap-2 rounded-2xl border border-border bg-transparent px-4 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                            }
                          >
                            <Icon className="size-4 shrink-0" />
                            {p.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <ChoiceGroup label="Бренд пристрою" options={BRANDS} value={brand} onChange={setBrand} />

                  {plan === "dress" && (
                    <>
                      <TextField
                        label="Модель пристрою"
                        placeholder="Напр. iPhone 15 Pro"
                        value={model}
                        onChange={setModel}
                      />
                      <ChoiceGroup
                        label="Тип аксесуарів"
                        options={ACCESSORY_TYPES}
                        value={accessory}
                        onChange={setAccessory}
                      />
                    </>
                  )}

                  {plan === "trade" && (
                    <>
                      <TextField
                        label="Ваша поточна модель"
                        placeholder="Напр. iPhone 13"
                        value={model}
                        onChange={setModel}
                      />
                      <ChoiceGroup label="Стан пристрою" options={CONDITIONS} value={condition} onChange={setCondition} />
                      <TextField
                        label="Бажана нова модель"
                        placeholder="Напр. iPhone 15 Pro"
                        value={target}
                        onChange={setTarget}
                      />
                    </>
                  )}

                  {plan === "buy" && (
                    <>
                      <TextField
                        label="Модель пристрою"
                        placeholder="Напр. Galaxy S24 Ultra"
                        value={model}
                        onChange={setModel}
                      />
                      <ChoiceGroup label="Категорія" options={CATEGORIES} value={category} onChange={setCategory} />
                    </>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Ім'я" placeholder="Олександр Коваленко" value={name} onChange={setName} />
                    <TextField
                      label="Номер телефону"
                      placeholder="(050) 555-0123"
                      value={phone}
                      onChange={setPhone}
                      type="tel"
                    />
                  </div>

                  <Button type="submit" size="lg" className="h-13 rounded-full text-base font-semibold">
                    Отримати пропозицію
                    <ArrowRight className="size-4" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Надсилаючи заявку, ви погоджуєтесь отримати одноразове повідомлення з пропозицією. Жодного спаму,
                    ніколи.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}