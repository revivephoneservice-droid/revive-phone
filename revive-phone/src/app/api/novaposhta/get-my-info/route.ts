/*
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NP_API_KEY; // Убедись, что ключ берется из .env
  
  const fetchNP = async (model: string, method: string, props: any) => {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      body: JSON.stringify({ apiKey, modelName: model, calledMethod: method, methodProperties: props })
    });
    return (await res.json()).data;
  };

  try {
    // 1. Получаем Ref отправителя (твоего профиля в НП)
    const senders = await fetchNP('Counterparty', 'getCounterparties', { CounterpartyProperty: 'Sender', Page: '1' });
    const senderRef = senders[0]?.Ref;

    // 2. Получаем Ref контактного лица отправителя (тебя)
    const contacts = await fetchNP('Counterparty', 'getCounterpartyContactPersons', { Ref: senderRef, Page: '1' });
    const contactRef = contacts[0]?.Ref;

    // 3. Получаем Ref твоего города (например, Днепр)
    const cities = await fetchNP('Address', 'getCities', { FindByString: 'Дніпро' });
    const cityRef = cities[0]?.Ref;

    return NextResponse.json({
      "СОХРАНИ_ЭТО_В_ENV": {
        NP_SENDER_REF: senderRef,
        NP_CONTACT_SENDER_REF: contactRef,
        NP_CITY_SENDER_REF: cityRef,
        // Ref отделения придется найти один раз через сайт НП или их АПИ (Address.getWarehouses)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
*/
/*
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NP_API_KEY;
  
  const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: apiKey,
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        // Это твой CityRef, который мы только что получили
        CityRef: 'db5c88f0-391c-11dd-90d9-001a92567626' 
      }
    })
  });

  const data = await response.json();
  
  // Оставляем только номер отделения, название и его Ref, чтобы браузер не завис от объема данных
  const branches = data.data.map((branch: any) => ({
    number: branch.Number,
    name: branch.Description,
    ref: branch.Ref
  }));

  return NextResponse.json(branches);
}
  
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NP_API_KEY;
  
  const fetchNP = async (model: string, method: string, props: any) => {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      body: JSON.stringify({ apiKey, modelName: model, calledMethod: method, methodProperties: props })
    });
    return (await res.json()).data;
  };

  try {
    // 1. Получаем профиль клиента
    const senders = await fetchNP('Counterparty', 'getCounterparties', { CounterpartyProperty: 'Sender', Page: '1' });
    const senderRef = senders[0]?.Ref;

    // 2. Получаем контактное лицо
    const contacts = await fetchNP('Counterparty', 'getCounterpartyContactPersons', { Ref: senderRef, Page: '1' });
    const contactRef = contacts[0]?.Ref;

    // 3. Ищем город Люботин
    const cities = await fetchNP('Address', 'getCities', { FindByString: 'Люботин' });
    const cityRef = cities[0]?.Ref;

    // 4. Ищем отделение №2 в Люботине
    let warehouseRef = 'Не найдено';
    if (cityRef) {
         const warehouses = await fetchNP('Address', 'getWarehouses', { CityRef: cityRef });
         // Ищем именно второе отделение
         const targetWarehouse = warehouses.find((w: any) => w.Number === '2');
         if (targetWarehouse) warehouseRef = targetWarehouse.Ref;
    }

    return NextResponse.json({
      "СКОПИРУЙ_ЭТО_В_ENV_LOCAL": {
        NP_SENDER_REF: senderRef,
        NP_CONTACT_SENDER_REF: contactRef,
        NP_CITY_SENDER_REF: cityRef,
        NP_SENDER_WAREHOUSE_REF: warehouseRef
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при запросе к НП' }, { status: 500 });
  }
}
  */