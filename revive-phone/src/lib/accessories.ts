export type Condition = "Новий" | "Як новий" | "Гарний"
export type CategoryKey = "cases" | "glass" | "chargers" | "holders"
export type BrandKey = "Apple" | "Samsung" | "Google" | "Xiaomi"

export type Accessory = {
  id: number
  name: string
  title: string
  category: string
  categoryKey: CategoryKey
  brand: BrandKey
  compatibility: string
  price: number
  condition: Condition
  image_url: string
}

export const PRODUCTS: Accessory[] = [
  {
    id: 1,
    title: "Захисне скло 9D Full Glue",
    name : "Захисне скло 9D Full Glue",
    category: "Захисне скло",
    categoryKey: "glass",
    brand: "Apple",
    compatibility: "для iPhone 14 Pro",
    price: 399,
    condition: "Новий",
    image_url: "/accessories/tempered-glass.png",
  },
  {
    id: 2,
    title: "Силіконовий чохол MagSafe",
    name : "Захисне скло 9D Full Glue",
    category: "Чохли",
    categoryKey: "cases",
    brand: "Apple",
    compatibility: "для iPhone 15 Pro Max",
    price: 749,
    condition: "Новий",
    image_url: "/accessories/clear-case.png",
  },
  {
    id: 3,
    title: "Зарядний пристрій USB-C 30W",
    category: "Зарядні пристрої",
    name : "Захисне скло 9D Full Glue",
    categoryKey: "chargers",
    brand: "Apple",
    compatibility: "для iPhone та iPad",
    price: 999,
    condition: "Новий",
    image_url: "/accessories/charger.png",
  },
  {
    id: 4,
    title: "Магнітний тримач в авто",
    category: "Тримачі",
    categoryKey: "holders",
    brand: "Xiaomi",
    name : "Захисне скло 9D Full Glue",
    compatibility: "універсальний",
    price: 549,
    condition: "Новий",
    image_url: "/accessories/car-mount.png",
  },
  {
    id: 5,
    title: "Прозорий чохол Anti-Shock",
    name : "Захисне скло 9D Full Glue",
    category: "Чохли",
    categoryKey: "cases",
    brand: "Samsung",
    compatibility: "для Galaxy S24 Ultra",
    price: 599,
    condition: "Як новий",
    image_url: "/accessories/clear-case.png",
  },
  {
    id: 6,
    title: "Захисне скло Privacy",
    category: "Захисне скло",
    categoryKey: "glass",
    brand: "Google",
    name : "Захисне скло 9D Full Glue",
    compatibility: "для Pixel 8 Pro",
    price: 459,
    condition: "Новий",
    image_url: "/accessories/tempered-glass.png",
  },
  {
    id: 7,
    title: "Бездротова зарядка 15W",
    category: "Зарядні пристрої",
    categoryKey: "chargers",
    name : "Захисне скло 9D Full Glue",
    brand: "Samsung",
    compatibility: "для Galaxy та Qi-девайсів",
    price: 1299,
    condition: "Гарний",
    image_url: "/accessories/charger.png",
  },
  {
    id: 8,
    title: "Велотримач для смартфона",
    category: "Тримачі",
    categoryKey: "holders",
    brand: "Xiaomi",
    compatibility: "універсальний 4.7–7\"",
    price: 449,
    condition: "Новий",
    name : "Захисне скло 9D Full Glue",
    image_url: "/accessories/car-mount.png",
  },
]

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "cases", label: "Чохли" },
  { key: "glass", label: "Захисне скло" },
  { key: "chargers", label: "Зарядні пристрої" },
  { key: "holders", label: "Тримачі" },
]

export const BRANDS: BrandKey[] = ["Apple", "Samsung", "Google", "Xiaomi"]

export const CONDITIONS: Condition[] = ["Новий", "Як новий", "Гарний"]

export const PRICE_MIN = 199
export const PRICE_MAX = 5000
