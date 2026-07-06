import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    const { items, total, contact } = await req.json();
    
    // ИЗМЕНЕНИЕ: Используй одну переменную для всего
    const merchantAccount = 'test_merch_n1'; 
    const merchantSecretKey = process.env.WAYFORPAY_SECRET_KEY!; 
    const merchantDomainName = 'shamanproject.vercel.app';
    const orderReference = `order_${Date.now()}`;
    const orderDate = Math.floor(Date.now() / 1000).toString();
    const amount = total.toString();
    const currency = 'UAH';
  
    // Теперь signString использует те же переменные, что и JSON
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
      language: "UA"
    });
}