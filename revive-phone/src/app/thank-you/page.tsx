export default function ThankYouPage() {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Дякуємо за замовлення!</h1>
        <p className="text-muted-foreground mb-8">
          Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом.
        </p>
        <a href="/" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-all">
          Повернутися на головну
        </a>
      </div>
    )
  }