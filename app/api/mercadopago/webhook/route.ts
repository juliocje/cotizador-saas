import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Solo procesamos si es un evento de pago
    if (body.type === 'payment' || body.action === 'payment.updated') {
      const paymentId = body.data?.id;

      if (paymentId) {
        const paymentClient = new Payment(client);
        const paymentInfo = await paymentClient.get({ id: paymentId });

        if (paymentInfo.status === 'approved') {
          // El ID del usuario que guardamos en el checkout
          const userId = paymentInfo.external_reference;

          if (userId) {
            // Actualizamos la columna subscription_status en tu tabla profiles
            const { error } = await supabaseServer
              .from('profiles')
              .update({ subscription_status: 'pro' }) // Cambiamos de 'free' a 'pro'
              .eq('id', userId);

            if (error) {
              console.error('Error al actualizar Supabase:', error);
              return NextResponse.json({ error: 'DB Error' }, { status: 500 });
            }

            console.log(`✅ Usuario ${userId} actualizado a 'pro' correctamente.`);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error en webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}