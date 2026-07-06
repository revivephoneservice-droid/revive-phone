"use client"

import { ProductDetail } from "./product-details";
import { Accessory } from "@/lib/accessories";

// Эта обертка всегда будет на клиенте
export function ProductDetailWrapper({ product }: { product: Accessory }) {
  return <ProductDetail product={product} />;
}