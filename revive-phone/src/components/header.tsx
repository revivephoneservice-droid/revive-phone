"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Heart, Menu, Search, ShoppingBag, Smartphone, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const NAV_LINKS = [
  { label: "КАТАЛОГ", href: "/catalog" },
  { label: "ПІДБІР ТЕЛЕФОНА", href: "/#phones" },
  { label: "ОБМІН (TRADE-IN)", href: "/#tool" },
  { label: "ЧОХЛИ", href: "/#accessories" },
  { label: "КОНТАКТИ", href: "#footer" },
]

export function SiteHeader() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

  const handleNavClick = (e: React.MouseEvent, href: string) => {
  e.preventDefault()
    setOpen(false) // Закрываем мобильное меню
    console.log("Клик по ссылке:", href);

    // Если это якорная ссылка типа /#phones или #tool
    if (href.startsWith('#') || href.includes('/#')) {
      // Если мы уже на главной, просто скроллим
      if (pathname === '/') {
        const id = href.split('#')[1]
        const element = document.getElementById(id)
        element?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Если мы на другой странице, переходим на главную с хешем
        router.push(href)
      }
    } else {
      // Для обычных ссылок (например, /catalog)
      router.push(href)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Thin promo banner */}
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] font-medium uppercase tracking-wider sm:text-xs">
          Одягни свій девайс: безкоштовна клейка плівки при покупці чохла
        </p>
      </div>

      <div className="border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
              <Smartphone className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">Upgrade Mobile</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="cursor-pointer text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
                {link.label}
            </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Пошук"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Search className="size-5" />
            </button>
            <button
              aria-label="Обране"
              className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
            >
              <Heart className="size-5" />
            </button>
            <button
              aria-label="Профіль"
              className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
            >
              <User className="size-5" />
            </button>
            <Link 
            href={"/checkout"}
              aria-label="Кошик"
              className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ShoppingBag className="size-5" />
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-foreground" />
            </Link>
            <button
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="mt-3 rounded-full font-semibold"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "#tool";
                }}
              >
                Отримати пропозицію
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
