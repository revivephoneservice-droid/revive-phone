"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  BRANDS,
  CATEGORIES,
  CONDITIONS,
  PRICE_MAX,
  PRICE_MIN,
  type BrandKey,
  type CategoryKey,
  type Condition,
} from "@/lib/accessories"

export type Filters = {
  categories: CategoryKey[]
  brands: BrandKey[]
  conditions: Condition[]
  price: [number, number]
}

type Props = {
  filters: Filters
  onChange: (next: Filters) => void
  onReset: () => void
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export function FilterSidebar({ filters, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Фільтри
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Скинути
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "brand", "price", "condition"]}>
        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger>Категорія</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 pt-1">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.key}
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                >
                  <Checkbox
                    checked={filters.categories.includes(cat.key)}
                    onCheckedChange={() =>
                      onChange({
                        ...filters,
                        categories: toggle(filters.categories, cat.key),
                      })
                    }
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand">
          <AccordionTrigger>Бренд</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 pt-1">
              {BRANDS.map((brand) => (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() =>
                      onChange({
                        ...filters,
                        brands: toggle(filters.brands, brand),
                      })
                    }
                  />
                  {brand}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger>Ціна</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 pt-3">
              <Slider
                value={filters.price}
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={50}
                onValueChange={(value) =>
                  onChange({
                    ...filters,
                    price: value as [number, number],
                  })
                }
              />
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-md border border-border px-2 py-1 text-foreground">
                  {filters.price[0].toLocaleString("uk-UA")} ₴
                </span>
                <span className="rounded-md border border-border px-2 py-1 text-foreground">
                  {filters.price[1].toLocaleString("uk-UA")} ₴
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition">
          <AccordionTrigger>Стан</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {CONDITIONS.map((cond) => {
                const active = filters.conditions.includes(cond)
                return (
                  <button
                    key={cond}
                    aria-pressed={active}
                    onClick={() =>
                      onChange({
                        ...filters,
                        conditions: toggle(filters.conditions, cond),
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {cond}
                  </button>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
