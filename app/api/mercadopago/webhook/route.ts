import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || searchParams.get('type');
    const id = searchParams.get('id') || searchParams.get('data.id');

    if (topic === 'payment' && id) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      if (paymentData.status === 'approved') {
        const userEmail = paymentData.payer?.email;

        if (userEmail) {
          // Actualiza el perfil del usuario en Supabase a plan activo
          const { error } = await supabase
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('email', userEmail);

          if (error) {
            console.error('Error al actualizar suscripción en Supabase:', error);
          } else {
            console.log(`Suscripción Pro activada con éxito para: ${userEmail}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error en el webhook de Mercado Pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}