import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NOVAPOSHTA_API_KEY;

  try {
    // 1. Получаем информацию о вашем контрагенте (организации/ФЛП)
    const counterpartyRes = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        modelName: 'Counterparty',
        calledMethod: 'getCounterparties',
        methodProperties: {
          CounterpartyProperty: 'Sender',
          Page: '1'
        }
      })
    });
    const counterpartyData = await counterpartyRes.json();
    
    // Берем первого найденного отправителя
    const sender = counterpartyData.data?.[0];
    const senderRef = sender?.Ref; // 👈 ЭТО ВАШ Sender
    const contactSenderRef = sender?.ContactPerson?.data?.[0]?.Ref; // 👈 ЭТО ВАШ ContactSender

    // 2. Получаем список ваших складов (SenderAddress) для этого контрагента
    let warehousesData = null;
    if (senderRef) {
      const whRes = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          modelName: 'Counterparty',
          calledMethod: 'getCounterpartyAddresses',
          methodProperties: {
            Ref: senderRef,
            CounterpartyProperty: 'Sender'
          }
        })
      });
      warehousesData = await whRes.json();
    }

    return new NextResponse(
        JSON.stringify({
          success: true,
          senderRef: senderRef || "Не найдено",
          contactSenderRef: contactSenderRef || "Не найдено",
          senderAddresses: warehousesData?.data || "Сначала найдите senderRef",
          phone: sender?.Phone || "Укажите ваш телефон вручную"
        }),
        {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}