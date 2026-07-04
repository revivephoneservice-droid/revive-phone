"use client";

interface OrderData {
  // Define the structure of orderData here
  [key: string]: any;
}

export function PaymentButton({ orderData }: { orderData: OrderData }) {
  const handlePay = async () => {
    // 1. Получаем данные для оплаты с подписью
    const res = await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    const paymentParams = await res.json();

    // 2. Инициализируем виджет (убедитесь, что скрипт подключен в layout)
    const wayforpay = new (window as any).Wayforpay();
    
    wayforpay.run(paymentParams, 
      (response: any) => { /* Success */ alert("Оплата успішна!"); },
      (response: any) => { /* Declined */ alert("Оплата відхилена."); },
      (response: any) => { /* Pending */ alert("Оплата в обробці."); }
    );
  };

  return <button onClick={handlePay}>Оплатити</button>;
}