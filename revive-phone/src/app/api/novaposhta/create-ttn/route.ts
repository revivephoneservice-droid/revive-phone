/*
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { order } = await req.json();
    const apiKey = "c3e3c9ae75edea12c1f4f18d649d5c43";

    const recipientFirstName = order.first_name || '';
    const recipientLastName = order.last_name || '';
    const recipientPhone = order.phone ? order.phone.replace(/\D/g, '') : '';
    
    const cityRecipientRef = order.nova_poshta?.cityRef;
    const warehouseRecipientRef = order.nova_poshta?.warehouseRef;

    if (!cityRecipientRef || !warehouseRecipientRef) {
      return NextResponse.json({ error: 'В заказе отсутствуют данные города или отделения Новой почты' }, { status: 400 });
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

    const requestBody = {
      apiKey: apiKey,
      modelName: 'InternetDocument',
      calledMethod: 'save',
      methodProperties: {
        PayerType: 'Recipient',
        PaymentMethod: 'Cash',
        DateTime: formattedDate,
        CargoType: 'Cargo',
        Weight: '1',
        SeatsAmount: '1',
        Description: 'Товари інтернет-магазину',
        Cost: order.total.toString(),
        ServiceType: 'WarehouseWarehouse',

        // Реальный Ref города отправителя из Postman:
        CitySender: 'db5c88ac-391c-11dd-90d9-031a92567626',
        SenderType: 'PrivatePerson',
        SenderFirstName: 'Ілля',
        SenderMiddleName: 'Вікторович',
        SenderLastName: 'Кушнір',
        SendersPhone: '380635132869',

        // Получатель из заказа
        CityRecipient: cityRecipientRef,
        RecipientAddress: warehouseRecipientRef,
        RecipientType: 'PrivatePerson',
        RecipientFirstName: recipientFirstName,
        RecipientLastName: recipientLastName,
        RecipientsPhone: recipientPhone,
      }
    };

    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("NP API Error:", data.errors);
      return NextResponse.json({ error: data.errors?.join(', ') || 'Ошибка создания ТТН' }, { status: 400 });
    }

    const ttnData = data.data[0];

    return NextResponse.json({
      success: true,
      ttnNumber: ttnData.IntraDocNumber,
      ttnRef: ttnData.Ref,
    });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
  */
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { order } = await req.json();
    
    // Берем ключ из .env, чтобы не светить его в коде
    const apiKey = process.env.NP_API_KEY;

    const recipientFirstName = order.first_name || '';
    const recipientLastName = order.last_name || '';
    const recipientPhone = order.phone ? order.phone.replace(/\D/g, '') : '';
    
    const cityRecipientRef = order.nova_poshta?.cityRef;
    const warehouseRecipientRef = order.nova_poshta?.warehouseRef;

    if (!cityRecipientRef || !warehouseRecipientRef) {
      return NextResponse.json({ error: 'В заказе отсутствуют данные города или отделения Новой почты' }, { status: 400 });
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

    const requestBody = {
      apiKey: apiKey,
      modelName: 'InternetDocument',
      calledMethod: 'save',
      methodProperties: {
        PayerType: 'Recipient',
        PaymentMethod: 'Cash',
        DateTime: formattedDate,
        CargoType: 'Cargo',
        Weight: '1',
        SeatsAmount: '1',
        Description: 'Телефони та аксесуари',
        Cost: order.total.toString(),
        ServiceType: 'WarehouseWarehouse',

        // Твои сохраненные Ref-коды отправителя подтягиваются из .env
        CitySender: process.env.NP_CITY_SENDER_REF,
        Sender: process.env.NP_SENDER_REF,
        SenderAddress: process.env.NP_SENDER_WAREHOUSE_REF,
        ContactSender: process.env.NP_CONTACT_SENDER_REF,
        SendersPhone: '380635132869',

        // Данные получателя
        CityRecipient: cityRecipientRef,
        RecipientAddress: warehouseRecipientRef,
        RecipientType: 'PrivatePerson',
        RecipientName: `${recipientLastName} ${recipientFirstName}`.trim(),
        RecipientsPhone: `380${recipientPhone.replace(/\D/g, '').slice(-9)}`,
        
        // КРИТИЧНО ВАЖНО: этот параметр заставляет НП создать получателя на лету
        NewAddress: '1' 
      }
    };

    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("NP API Error:", data.errors);
      return NextResponse.json({ error: data.errors?.join(', ') || 'Ошибка создания ТТН' }, { status: 400 });
    }

    const ttnData = data.data[0];

    return NextResponse.json({
      success: true,
      ttnNumber: ttnData.IntDocNumber, // <--- Исправлено
      ttnRef: ttnData.Ref,
    });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}