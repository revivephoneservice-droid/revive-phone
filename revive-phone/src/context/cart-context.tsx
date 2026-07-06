"use client"
import { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: string
  title: string
  variant: string
  price: number
  qty: number
  image: string
}

const CartContext = createContext<{
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (id: string, delta: number) => void
  removeItem: (id: string) => void
  clearCart: () => void 
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // 1. Вызываем useEffect всегда (порядок хуков одинаковый при каждом рендере)
  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem("cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Ошибка парсинга корзины", e)
      }
    }
  }, [])

  // 2. Вызываем второй useEffect всегда
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isMounted])

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === newItem.id)
      if (exists) {
        return prev.map((i) => i.id === newItem.id ? { ...i, qty: i.qty + newItem.qty } : i)
      }
      return [...prev, newItem]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const clearCart = () => {
    setItems([]); // Очищаем массив товаров
    localStorage.removeItem("cart"); // Если сохраняешь в localstorage
  };

  // 3. Возвращаем Provider всегда
  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}