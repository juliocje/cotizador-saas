import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');

    // Si el pago fue aprobado y tenemos un ID de pago
    if (status === 'approved' && paymentId) {
      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      const userId = paymentInfo.external_reference;

      if (userId) {
        // Actualizamos automáticamente en Supabase a 'pro'
        const { error } = await supabaseServer
          .from('profiles')
          .update({ subscription_status: 'pro' })
          .eq('id', userId);

        if (error) {
          console.error('Error al actualizar Supabase:', error);
        }
      }
    }

    // Redirigimos al usuario de vuelta a la página principal con éxito
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/?success=true`);
  } catch (error: any) {
    console.error('Error al verificar el pago:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/?success=false`);
  }
}