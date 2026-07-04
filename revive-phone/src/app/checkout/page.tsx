import { CheckoutClient } from "@/components/checkout-client"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
        <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Оформлення
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                    Завершіть замовлення
                </h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Заповніть дані для доставки та оплати. Це займе менше хвилини.
                </p>
            </div>
            <CheckoutClient />
        </main>
      </div>
  )
}
