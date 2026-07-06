"use client";
import Script from 'next/script';
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

export function PaymentButton({ orderData }: { orderData: any }) {
    const router = useRouter();
    const { clearCart } = useCart();
// В файле src/components/payment-button.tsx
const runPayment = async () => {
    const res = await fetch('/api/create-payment', { 
        method: 'POST', 
        body: JSON.stringify({ 
          items: orderData.items, 
          total: orderData.total, 
          contact: orderData.contactData 
        }) 
    });
    const data = await res.json();
  
    const wayforpay = new (window as any).Wayforpay();
    wayforpay.run({
      ...data,
      test: true,               // Принудительный тестовый режим
      straightWidget: true,     // Открывать виджет поверх страницы
      merchantAuthType: "SimpleSignature"
    }, 
    (res: any) => { 
        if (res.transactionStatus === 'Approved') {
            clearCart(); // Теперь функция существует
            router.push('/thank-you');
        }
    },
    (res: any) => { console.log("ОК", res); },
    (err: any) => { console.error("Ошибка", err); },
    (pen: any) => { console.log("В процессе", pen); }
    );
  };

  return (
    <>
      <Script src="https://secure.wayforpay.com/server/pay-widget.js" strategy="lazyOnload" />
      <button 
        onClick={runPayment} 
        className="w-full h-14 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-all"
      >
        Оплатити замовлення
      </button>
    </>
  );
}