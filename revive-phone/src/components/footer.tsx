import { Smartphone } from "lucide-react"

const FOOTER_COLUMNS = [
  {
    title: "Послуги",
    links: [
      { name: "Аксесуари", href: "/#tools" },
      { name: "Підбір телефона", href: "/#tools" },
      { name: "Trade-In", href: "/#tools" },
      { name: "Чохли на замовлення", href: "/#tools" },
    ],
  },
  {
    title: "Підтримка",
    links: [
      { name: "Оплата і доставка", href: "/shipping-payment" },
      { name: "Гарантія", href: "/warranty" }, // Добавил путь для Гарантии
      { name: "Повернення", href: "/returns" },
      { name: "Часті питання", href: "/faq" }, // Добавил путь для FAQ
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
                <Smartphone className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">FixPhon</span>
            </a>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Дбаємо про вашого старого друга. А якщо це неможливо — підбираємо нового та кращого.
            </p>
            <a href="tel:8005550123" className="mt-5 inline-block text-lg font-semibold tracking-tight text-foreground">
              (098) 054-11-65
            </a>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FixPhon. Всі права захищені.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Політика конфіденційності
            </a>
            <a href="/public-offer" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Умови використання
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}