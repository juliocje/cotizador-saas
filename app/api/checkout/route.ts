import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const { title, price, quantity, userEmail } = await request.json();

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'plan-pro-mensual',
            title: title || 'Suscripción Cotizador Express Pro',
            quantity: Number(quantity) || 1,
            unit_price: Number(price) || 199,
            currency_id: 'MXN',
          },
        ],
        payer: {
          email: userEmail || 'comprador@test.com',
        },
        back_urls: {
          success: 'https://www.google.com',
          failure: 'https://www.google.com',
          pending: 'https://www.google.com',
        },
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar el pago' }, { status: 500 });
  }
}