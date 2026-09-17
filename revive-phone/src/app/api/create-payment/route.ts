import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Инициализируем серверный клиент Supabase (используйте service_role key или стандартный)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    const { items, total, contact, novaPoshta } = await req.json();
    
    const merchantAccount = 'revive_phone_ten_vercel_app'; 
    const merchantSecretKey = process.env.WAYFORPAY_SECRET_KEY!; 
    const merchantDomainName = 'revive-phone-ten.vercel.app';
    const orderReference = `order_${Date.now()}`;
    const orderDate = Math.floor(Date.now() / 1000).toString();
    const amount = total.toString();
    const currency = 'UAH';

    const merchantDataString = novaPoshta ? JSON.stringify(novaPoshta) : '';

    // Сохраняем заказ в таблицу orders в Supabase перед отправкой запроса к WayForPay
    const { error: dbError } = await supabase.from('orders').insert([{
      order_reference: orderReference,
      status: 'pending',
      first_name: contact.firstName,
      last_name: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      total: Number(total),
      items: items,
      nova_poshta: novaPoshta
    }]);

    if (dbError) {
      console.error("Ошибка сохранения заказа в БД:", dbError);
    }
  
    const signString = [
      merchantAccount,
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      currency,
      items.map((i: any) => i.title).join(';'),
      items.map((i: any) => i.qty).join(';'),
      items.map((i: any) => i.price).join(';')
    ].join(';');
  
    const signature = crypto.createHmac('md5', merchantSecretKey).update(signString).digest('hex');
  
    return NextResponse.json({
      merchantAccount,
      merchantDomainName,
      authorizationType: "SimpleSignature",
      merchantSignature: signature,
      orderReference,
      orderDate,
      amount,
      currency,
      productName: items.map((i: any) => i.title),
      productPrice: items.map((i: any) => i.price),
      productCount: items.map((i: any) => i.qty),
      clientFirstName: contact.firstName,
      clientLastName: contact.lastName,
      clientPhone: contact.phone.replace(/\D/g, ''),
      clientEmail: contact.email,
      language: "UA",
      merchantData: merchantDataString 
    });
}