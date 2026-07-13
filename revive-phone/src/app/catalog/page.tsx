import { CatalogClient } from "@/components/catalog-clients"
import { Suspense } from "react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div>Завантаження каталогу...</div>}>
        <CatalogClient />
      </Suspense>
    </main>
  )
}