"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { ProductCard } from "./product-cart"
import { Accessory } from "@/lib/accessories"

// SearchComponent.tsx
export function SearchComponent({ 
    value, 
    onChange, 
    products 
  }: { 
    value: string, 
    onChange: (val: string) => void,
    products: any[] 
  }) {
    // Убираем внутренний useState, теперь используем пропсы
    const searchResults = useMemo(() => {
      if (!value.trim()) return []
      return products
        .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 4)
    }, [value, products])
  
    return (
      <div className="w-full max-w-3xl mx-auto mb-8 px-4 relative z-50 mt-8">
        <div className="relative group">
          <input
            type="text"
            placeholder="Пошук аксесуарів..."
            value={value} // Используем пропс value
            onChange={(e) => onChange(e.target.value)} // Используем пропс onChange
            className="w-full rounded-full border py-3.5 pl-12 pr-12 text-sm outline-none"
          />
          {/* ... (кнопка сброса и оверлей остаются те же) */}
        </div>
      </div>
    )
  }