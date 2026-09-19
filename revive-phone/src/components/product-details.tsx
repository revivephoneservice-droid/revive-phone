"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  Zap,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Accessory } from "@/lib/accessories"
import { useCart } from "@/context/cart-context"

type ProductWithDetails = Accessory & {
  description?: string | null
  images?: string[] | null
  specifications?: Record<
    string,
    string | number | boolean | null
  > | null

  warranty_months?: number | null
  availability_status?: string | null

  stock_quantity?: number | null
  sku?: number | string | null
  brand?: string | null
  color?: string | null
}

interface ProductDetailProps {
  product: ProductWithDetails
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, items } = useCart()

  /*
   * Собираем галерею.
   *
   * Сначала берём product.images.
   * Если images пустой, используем image_url.
   *
   * Также удаляем дубликаты.
   */
  const galleryImages = useMemo(() => {
    const images: string[] = []

    if (Array.isArray(product.images)) {
      product.images.forEach((image) => {
        if (image && typeof image === "string") {
          images.push(image)
        }
      })
    }

    if (
      product.image_url &&
      typeof product.image_url === "string" &&
      !images.includes(product.image_url)
    ) {
      images.unshift(product.image_url)
    }

    const uniqueImages = [...new Set(images)]

    if (uniqueImages.length === 0) {
      return ["/placeholder.svg"]
    }

    return uniqueImages
  }, [product.images, product.image_url])

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  /*
   * При переходе с одного товара на другой
   * возвращаем галерею на первое фото.
   */
  useEffect(() => {
    setActiveImageIndex(0)
    setQuantity(1)
  }, [product.id])

  const selectedImage =
    galleryImages[activeImageIndex] || galleryImages[0]

  const specifications = useMemo(() => {
    if (!product.specifications) {
      return []
    }

    return Object.entries(product.specifications)
  }, [product.specifications])

  const inCart = items.find(
    (item) => String(item.id) === String(product.id)
  )

  /*
   * Следующая фотография.
   */
  const nextImage = () => {
    setActiveImageIndex((current) =>
      current === galleryImages.length - 1
        ? 0
        : current + 1
    )
  }

  /*
   * Предыдущая фотография.
   */
  const previousImage = () => {
    setActiveImageIndex((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1
    )
  }

  /*
   * Статус наличия.
   */
  const availability = (() => {
    switch (product.availability_status) {
      case "low_stock":
        return {
          label: "Закінчується",
          className: "text-orange-600",
        }

      case "out_of_stock":
        return {
          label: "Немає в наявності",
          className: "text-red-600",
        }

      default:
        return {
          label: "В наявності",
          className: "text-emerald-600",
        }
    }
  })()

  const isOutOfStock =
    product.availability_status === "out_of_stock"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* ===================================================== */}
      {/* BREADCRUMBS */}
      {/* ===================================================== */}

      <nav className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="cursor-pointer transition-colors hover:text-foreground">
          Каталог
        </span>

        <ChevronRight className="size-3" />

        <span className="font-medium text-foreground">
          {product.brand || "Смартфон"} / {product.name}
        </span>
      </nav>

      {/* ===================================================== */}
      {/* ОСНОВНАЯ КАРТОЧКА ТОВАРА */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ================================================= */}
        {/* ГАЛЕРЕЯ */}
        {/* ================================================= */}

        <div className="min-w-0">
          {/* Главное изображение */}

          <div className="group relative aspect-square overflow-hidden rounded-3xl border border-border bg-white">
            <img
              src={selectedImage}
              alt={`${product.name} — фото ${
                activeImageIndex + 1
              }`}
              className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03] sm:p-10"
            />

            {/* Счётчик изображений */}

            {galleryImages.length > 1 && (
              <div className="absolute right-4 top-4 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            )}

            {/* Стрелка влево */}

            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                aria-label="Попереднє фото"
                className="
                  absolute left-3 top-1/2
                  flex size-11
                  -translate-y-1/2
                  items-center justify-center
                  rounded-full border
                  bg-background/90
                  shadow-md
                  backdrop-blur
                  transition
                  hover:scale-105
                  hover:bg-background
                  sm:left-5
                "
              >
                <ChevronLeft className="size-5" />
              </button>
            )}

            {/* Стрелка вправо */}

            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                aria-label="Наступне фото"
                className="
                  absolute right-3 top-1/2
                  flex size-11
                  -translate-y-1/2
                  items-center justify-center
                  rounded-full border
                  bg-background/90
                  shadow-md
                  backdrop-blur
                  transition
                  hover:scale-105
                  hover:bg-background
                  sm:right-5
                "
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>

          {/* Миниатюры */}

          {galleryImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => {
                const isActive = activeImageIndex === index

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Відкрити фото ${index + 1}`}
                    className={cn(
                      `
                        relative
                        size-20
                        shrink-0
                        overflow-hidden
                        rounded-2xl
                        border-2
                        bg-white
                        transition-all
                        duration-200
                        sm:size-24
                      `,
                      isActive
                        ? "border-primary shadow-sm"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} — мініатюра ${
                        index + 1
                      }`}
                      className="h-full w-full object-contain p-2"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* ИНФОРМАЦИЯ О ТОВАРЕ */}
        {/* ================================================= */}

        <div className="flex flex-col">
          <div
            className="
              mb-4 inline-flex w-fit
              items-center gap-2
              rounded-full
              bg-primary/10
              px-3 py-1
              text-xs font-bold
              uppercase tracking-widest
              text-primary
            "
          >
            <Zap className="size-3" />
            Хіт продажів
          </div>

          {/* Название */}

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-current"
                />
              ))}
            </div>

            <span className="text-sm font-semibold text-foreground/80 underline decoration-muted-foreground underline-offset-4">
              128 відгуків
            </span>
          </div>

          {/* Артикул */}

          {product.sku && (
            <div className="mt-5 text-sm text-muted-foreground">
              Артикул:{" "}
              <span className="font-semibold text-foreground">
                {product.sku}
              </span>
            </div>
          )}

          {/* Цена */}

          <div className="mt-6 text-4xl font-bold text-foreground sm:text-5xl">
            {Number(product.price).toLocaleString("uk-UA")} ₴
          </div>

          {/* Короткое описание */}

          {product.description && (
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              {product.description}
            </p>
          )}

          {/* Наличие + гарантия */}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                availability.className
              )}
            >
              <BadgeCheck className="size-5 shrink-0" />

              {availability.label}
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-5 shrink-0" />

              Офіційна гарантія{" "}
              {product.warranty_months ?? 12} міс.
            </div>
          </div>

          {/* ================================================= */}
          {/* КОЛИЧЕСТВО + КОРЗИНА */}
          {/* ================================================= */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {/* Quantity */}

            <div
              className="
                flex w-fit
                items-center
                rounded-full
                border border-border
                bg-card p-1
              "
            >
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
                disabled={isOutOfStock}
                className="
                  rounded-full p-3
                  transition
                  hover:bg-muted
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Minus className="size-4" />
              </button>

              <span className="w-12 text-center text-lg font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => current + 1)
                }
                disabled={isOutOfStock}
                className="
                  rounded-full p-3
                  transition
                  hover:bg-muted
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Add to cart */}

            <Button
              size="lg"
              disabled={isOutOfStock}
              className="
                h-14 flex-1
                rounded-full
                px-8
                text-base font-bold
              "
              onClick={() =>
                addItem({
                  id: String(product.id),
                  title: product.name,
                  price: Number(product.price),
                  qty: quantity,
                  image:
                    selectedImage ||
                    product.image_url ||
                    "/placeholder.svg",
                  variant:
                    product.color ||
                    "Default",
                })
              }
            >
              {isOutOfStock
                ? "Немає в наявності"
                : inCart
                  ? `У кошику (${inCart.qty})`
                  : "Додати в кошик"}
            </Button>
          </div>

          {/* ================================================= */}
          {/* ДОСТАВКА */}
          {/* ================================================= */}

          <div className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <Truck className="size-8 shrink-0 text-primary" />

              <div>
                <p className="font-bold text-foreground">
                  Безкоштовна доставка
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  При замовленні від 2000 ₴
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Heart className="size-8 shrink-0 text-primary" />

              <div>
                <p className="font-bold text-foreground">
                  Повернення 14 днів
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Відповідно до умов магазину
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ОПИСАНИЕ + ОСНОВНАЯ ИНФОРМАЦИЯ */}
      {/* ===================================================== */}

      <section className="mt-20">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Описание */}

          <div className="rounded-3xl border bg-card p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Про товар
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h2>

            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {product.description ||
                "Детальний опис товару незабаром буде додано."}
            </p>
          </div>

          {/* Basic information */}

          <div className="rounded-3xl border bg-secondary/20 p-7 sm:p-10">
            <h3 className="mb-6 text-xl font-bold">
              Основна інформація
            </h3>

            <div className="space-y-5">
              {product.brand && (
                <InfoRow
                  label="Бренд"
                  value={product.brand}
                />
              )}

              {product.sku && (
                <InfoRow
                  label="Артикул"
                  value={String(product.sku)}
                />
              )}

              {product.color && (
                <InfoRow
                  label="Колір"
                  value={product.color}
                />
              )}

              <InfoRow
                label="Гарантія"
                value={`${
                  product.warranty_months ?? 12
                } міс.`}
              />

              <InfoRow
                label="Наявність"
                value={availability.label}
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ХАРАКТЕРИСТИКИ */}
      {/* ===================================================== */}

      {specifications.length > 0 && (
        <section className="mt-10">
          <div className="overflow-hidden rounded-3xl border bg-card">
            <div className="border-b px-7 py-7 sm:px-10">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Характеристики
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Технічні характеристики
              </h2>
            </div>

            <div className="grid md:grid-cols-2">
              {specifications.map(
                ([key, value], index) => (
                  <div
                    key={key}
                    className={cn(
                      `
                        flex
                        min-h-16
                        items-center
                        justify-between
                        gap-6
                        border-b
                        px-7 py-5
                        sm:px-10
                        md:border-r
                      `,
                      index % 2 === 1 &&
                        "md:border-r-0"
                    )}
                  >
                    <span className="text-sm text-muted-foreground">
                      {key}
                    </span>

                    <span className="text-right text-sm font-semibold text-foreground">
                      {formatSpecificationValue(value)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================== */}
      {/* ПРЕИМУЩЕСТВА МАГАЗИНА */}
      {/* ===================================================== */}

      <section className="mt-24 border-t border-border pt-16">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          Чому обирають FixPhon?
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Сертифікована якість",
              desc: "Кожен пристрій проходить перевірку перед продажем.",
            },

            {
              icon: Zap,
              title: "Швидка відправка",
              desc: "Замовлення оперативно передаємо до служби доставки.",
            },

            {
              icon: BadgeCheck,
              title: "Підтримка клієнтів",
              desc: "Допоможемо з вибором, оформленням та налаштуванням пристрою.",
            },
          ].map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="
                  flex flex-col
                  items-center
                  rounded-3xl
                  border border-border/50
                  bg-secondary/20
                  p-8 text-center
                "
              >
                <div
                  className="
                    mb-6 flex
                    size-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Icon className="size-7" />
                </div>

                <h3 className="mb-3 text-xl font-bold">
                  {item.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/* ========================================================= */
/* INFO ROW */
/* ========================================================= */

interface InfoRowProps {
  label: string
  value: string
  last?: boolean
}

function InfoRow({
  label,
  value,
  last = false,
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 pb-4",
        !last && "border-b"
      )}
    >
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  )
}

/* ========================================================= */
/* FORMAT SPECIFICATION */
/* ========================================================= */

function formatSpecificationValue(
  value: string | number | boolean | null
) {
  if (value === null || value === undefined) {
    return "—"
  }

  if (typeof value === "boolean") {
    return value ? "Так" : "Ні"
  }

  return String(value)
}