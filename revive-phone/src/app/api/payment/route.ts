import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { amount, orderReference, productName, productPrice, productCount } = await request.json();
  
  const merchantAccount = "test_merch_n1"; // Ваш мерчант
  const merchantSecretKey = "flk3409refn54t54t*FNJRET"; // Секретный ключ
  const merchantDomainName = "www.ваш-сайт.com";
  const orderDate = Math.floor(Date.now() / 1000);
  const currency = "UAH";

  // Подготовка строки для подписи (в порядке документации WayForPay)
  // Важно: порядок полей должен строго соответствовать API
  const stringToSign = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    productName.join(';'),
    productCount.join(';'),
    productPrice.join(';')
  ].join(';');

  const signature = crypto
    .createHmac('md5', merchantSecretKey)
    .update(stringToSign)
    .digest('hex');

  return NextResponse.json({
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productPrice,
    productCount,
    merchantSignature: signature
  });
}