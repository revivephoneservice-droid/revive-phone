import { ArrowRight, Shirt, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5" />
            Trade-In · Аксесуари · Нові телефони
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Дбаємо про ваш девайс. Або знаходимо кращий.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Одягаємо ваш телефон у преміальний образ, обмінюємо старий на новий або підбираємо ідеальну модель — усе в
            одному місці.
          </p>
        </div>

        {/* Split focus */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Dress up */}
          <article className="group relative overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
              <img
                src="/images/hero-dress.png"
                alt="Флагманський смартфон у стильному захисному чохлі"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>
            <div className="relative -mt-20 p-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                <Shirt className="size-3.5" />
                Образ для девайсу
              </span>
              <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Нове життя для вашого девайсу
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Від кастомного чохла до преміального апгрейду.
              </p>
              <Button
                className="mt-6 rounded-full font-semibold"
                size="lg"
                asChild
              >
                <a href="#tool">
                  Одягнути девайс
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </article>

          {/* Pick new */}
          <article className="group relative overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
              <img
                src="/images/hero-new.png"
                alt="Новий флагманський смартфон"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>
            <div className="relative -mt-20 p-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                <Sparkles className="size-3.5" />
                Підбір нового
              </span>
              <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Підберемо кращий новий
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Якщо старий друг більше не тягне.
              </p>
              <Button
                variant="secondary"
                className="mt-6 rounded-full border border-border font-semibold"
                size="lg"
                  asChild
                >
                  <a href="#phones">
                    Підібрати новий
                    <ArrowRight className="size-4" />
                  </a>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
