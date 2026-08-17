import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const { title, price, quantity, userEmail } = await request.json();

    // Obtener el usuario autenticado actual desde Supabase para usar su ID como referencia
    // (Esto requiere que la petición incluya las cookies de sesión del navegador)
    const { data: { user } } = await supabaseServer.auth.getUser();
    const userId = user?.id || '';

    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
        // 🔑 CLAVE: Guardamos el UUID del usuario aquí para que el Webhook sepa exactamente a quién actualizar
        external_reference: userId, 
        back_urls: {
          success: `${baseUrl}?success=true`,
          failure: `${baseUrl}?success=false`,
          pending: `${baseUrl}?success=pending`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar el pago' }, { status: 500 });
  }
}