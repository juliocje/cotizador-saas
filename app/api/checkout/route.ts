import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const bodyData = await request.json().catch(() => ({}));
    const { title, price, quantity } = bodyData;

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN");
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Estructura limpia y probada que no genera conflicto de formato JSON
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'plan-pro-mensual',
            title: String(title || 'Suscripción Plan Premium - Cotizador Express Pro'),
            quantity: Number(quantity || 1),
            unit_price: Number(price || 99),
            currency_id: 'MXN'
          }
        ],
        back_urls: {
          success: `${baseUrl}/`,
          failure: `${baseUrl}/`,
          pending: `${baseUrl}/`
        }
      }
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error("🔥 ERROR DETALLADO DE MERCADO PAGO:", {
      message: error.message,
      response: error.apiResponse?.cause || error.response
    });
    return NextResponse.json({ error: error.message || 'Error al procesar el pago' }, { status: 500 });
  }
}