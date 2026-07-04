import { BatteryCharging, Magnet, ShieldHalf, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

const ACCESSORIES = [
  {
    icon: Smartphone,
    title: "Чохли оверсайз",
    description: "Об'ємний захист преміум-класу з ідеальним хватом та стилем.",
    price: "від $19",
  },
  {
    icon: ShieldHalf,
    title: "Захисне скло 9D",
    description: "Повне покриття екрана з олеофобним шаром проти відбитків.",
    price: "від $9",
  },
  {
    icon: BatteryCharging,
    title: "Бездротові зарядки",
    description: "Швидка магнітна зарядка для девайсів Apple та Samsung.",
    price: "від $29",
  },
  {
    icon: Magnet,
    title: "Магнітні тримачі",
    description: "Надійне кріплення в авто та на столі одним рухом.",
    price: "від $15",
  },
]

export function AccessoriesShowcase() {
  return (
    <section id="accessories" className="border-b border-border bg-background scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">Аксесуари</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Преміальний образ для телефона
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Одягніть свій девайс так, щоб він виглядав як новий — і служив довше.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACCESSORIES.map((item) => {
            const Icon = item.icon
            return (
              <article
                key={item.title}
                className="flex flex-col rounded-3xl border border-border bg-card p-7 transition-colors hover:border-foreground/25"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg font-bold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{item.price}</span>
                  <Button size="sm" variant="secondary" className="rounded-full border border-border font-semibold">
                    Купити
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
