import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const { title, price, quantity, userEmail } = await request.json();

    // Obtener el usuario autenticado actual desde Supabase
    const { data: { user } } = await supabaseServer.auth.getUser();
    const userId = user?.id || '';

    const preference = new Preference(client);

    const baseUrl = 'http://localhost:3000';

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'plan-pro-mensual',
            title: title || 'Suscripción Cotizador Express Pro',
            quantity: Number(quantity) || 1,
            unit_price: Number(price) || 99,
            currency_id: 'MXN',
          },
        ],
        payer: {
          email: userEmail || user?.email || 'comprador@test.com',
        },
        external_reference: userId, 
        back_urls: {
          success: `${baseUrl}/?success=true`,
          failure: `${baseUrl}/?success=false`,
          pending: `${baseUrl}?success=pending`,
        },
        // Quitamos temporalmente auto_return para evitar bloqueos locales
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json({ 
      error: error.message || 'Error al procesar el pago' 
    }, { status: 500 });
  }
}