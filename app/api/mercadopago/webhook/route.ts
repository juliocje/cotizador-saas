import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mercado Pago envía diferentes tipos de notificaciones; nos interesa 'payment'
    if (body.type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
      const paymentId = body.data?.id;

      if (paymentId) {
        // Consultamos los detalles del pago directamente a la API de Mercado Pago
        const paymentClient = new Payment(client);
        const paymentInfo = await paymentClient.get({ id: paymentId });

        // Verificamos si el pago fue aprobado
        if (paymentInfo.status === 'approved') {
          // El external_reference contiene el UUID del usuario de Supabase que guardamos en el checkout
          const userId = paymentInfo.external_reference;

          if (userId) {
            // Actualizamos la base de datos de Supabase para activar el plan premium
            const { error } = await supabaseServer
              .from('profiles') // Cambia 'profiles' por el nombre de tu tabla de usuarios si es diferente
              .update({ is_premium: true, updated_at: new Date().toISOString() })
              .eq('id', userId);

            if (error) {
              console.error('Error al actualizar Supabase desde el webhook:', error);
              return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
            }

            console.log(`¡Usuario ${userId} actualizado a Premium exitosamente!`);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error procesando el webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}