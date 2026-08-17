import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de Supabase con Service Role Key (opcional pero recomendado para webhooks del servidor)
// O usando tu cliente estándar si tiene permisos de escritura en profiles.
import { supabase } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Leer tanto de query params como de posibles cuerpos JSON enviados por Mercado Pago
    let topic = searchParams.get('topic') || searchParams.get('type');
    let id = searchParams.get('id') || searchParams.get('data.id');

    // Si viene en el body JSON (formato moderno de Webhooks de MP)
    if (!id) {
      try {
        const body = await request.json();
        topic = topic || body.type || body.topic;
        id = id || body.data?.id || body.id;
      } catch (e) {
        // Si no hay body JSON, ignoramos el error y seguimos con los params
      }
    }

    if ((topic === 'payment' || topic === 'subscription_preapproval') && id) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      if (paymentData.status === 'approved') {
        // Mercado Pago a veces guarda el correo en metadata, payer.email o external_reference
        const userEmail = paymentData.payer?.email || paymentData.metadata?.user_email;
        const externalRef = paymentData.external_reference; // ID de usuario si lo mandaste al crear la preferencia

        if (externalRef || userEmail) {
          let query = supabase.from('profiles').update({ subscription_status: 'active' });

          // Priorizar buscar por ID exacto si se pasó en el external_reference
          if (externalRef) {
            query = query.eq('id', externalRef);
          } else if (userEmail) {
            // Si usas email, asegúrate de que la tabla profiles tenga la columna email o haz match por auth
            query = query.eq('email', userEmail);
          }

          const { error } = await query;

          if (error) {
            console.error('Error al actualizar suscripción en Supabase:', error);
          } else {
            console.log(`✅ Suscripción Pro activada con éxito para referencia/email: ${externalRef || userEmail}`);
          }
        } else {
          console.warn('⚠️ Pago aprobado pero no se encontró email ni external_reference en la transacción.');
        }
      }
    }

    // Mercado Pago exige siempre un status 200 rápido para confirmar la recepción
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error crítico en el webhook de Mercado Pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}