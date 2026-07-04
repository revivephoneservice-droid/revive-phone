import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { action, cityName, cityRef } = await req.json();

  try {
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.NP_API_KEY,
        modelName: action === 'getCities' ? "Address" : "AddressGeneral",
        calledMethod: action === 'getCities' ? "getCities" : "getWarehouses",
        methodProperties: action === 'getCities' 
            ? { FindByString: cityName } 
            : { CityRef: cityRef }
      })
    });

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка НП' }, { status: 500 });
  }
}