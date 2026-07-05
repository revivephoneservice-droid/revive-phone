export type Condition = "Новий" | "Як новий" | "Гарний"
export type CategoryKey = "cases" | "protective_glasses" | "chargers" | "holders" | "smartphones"
export type BrandKey = "Apple" | "Samsung" | "Google" | "Xiaomi"

export type Accessory = {
  id: number
  name: string
  description: string
  category: string
  categoryKey: CategoryKey
  brand: BrandKey
  compatibility: string
  price: number
  condition: Condition
  image_url: string
}

// Добавьте этот объект прямо перед компонентом
export const CATEGORY_MAP: Record<string, string> = {
    "cases": "a1ac55de-ea49-45e1-a6ac-0045a8300b43", // UUID Чохлів з вашої бази
    "protective_glasses": "d17c311c-c403-4688-9db6-58c89ac6aaaf",
    "chargers": "1b0bcf38-6203-45c0-a36b-73e35b6b5735",
    "holders": "b5f30e72-19f0-468b-8ec5-76b63a766ab0",
    "smartphones": "9ad53acb-d27c-4e38-bc3f-444be570c59e", // UUID Телефонів з вашої бази
  }


export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "cases", label: "Чохоли" },
  { key: "protective_glasses", label: "Захисне скло" },
  { key: "chargers", label: "Зарядні пристрої" },
  { key: "smartphones", label: "Смартфони" },
  { key: "holders", label: "Тримачі" },
]

export const BRANDS: BrandKey[] = ["Apple", "Samsung", "Google", "Xiaomi"]

export const CONDITIONS: Condition[] = ["Новий", "Як новий", "Гарний"]

export const PRICE_MIN = 0
export const PRICE_MAX = 100000
