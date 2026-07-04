import  {ProductDetail}  from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"

export default function Page() {
  return (
      <main className="dark min-h-screen bg-background text-foreground">
        <ProductDetail />
        <RelatedProducts />
      </main>
  )
}
