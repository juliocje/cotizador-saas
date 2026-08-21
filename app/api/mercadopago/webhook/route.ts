import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment, MerchantOrder } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🔔 Webhook recibido de Mercado Pago:", JSON.stringify(body, null, 2));

    const topic = body.type || body.action || body.topic;
    let paymentId = body.data?.id || body.id;

    // Si es una orden comercial, extraemos el ID del pago aprobado
    if (topic?.includes('merchant_order') || topic === 'topic_merchant_order_wh') {
      const orderId = body.data?.id || body.id;
      if (orderId) {
        const merchantOrderClient = new MerchantOrder(client);
        const orderInfo = await merchantOrderClient.get({ merchantOrderId: orderId });
        const approvedPayment = orderInfo.payments?.find(p => p.status === 'approved');
        if (approvedPayment && approvedPayment.id) {
          paymentId = approvedPayment.id;
        }
      }
    }

    if (paymentId) {
      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      console.log(`💳 Estado del pago ${paymentId}:`, paymentInfo.status);

      if (paymentInfo.status === 'approved') {
        const userId = paymentInfo.external_reference;
        const userEmail = paymentInfo.payer?.email || paymentInfo.metadata?.user_email;

        console.log("🔍 Buscando en Supabase -> ID:", userId, "| Email:", userEmail);

        let updated = false;

        // 1. Intentar actualizar directamente por el UUID del usuario (external_reference)
        if (userId) {
          const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('id', userId)
            .select(); // Trae el registro afectado para verificar

          if (error) {
            console.error("❌ Error de Supabase al actualizar por ID:", error);
          } else if (data && data.length > 0) {
            console.log("✅ ¡Perfil actualizado a 'active' exitosamente por ID!", data);
            updated = true;
          } else {
            console.warn("⚠️ No se encontró ningún registro en 'profiles' con el ID:", userId);
          }
        }

        // 2. Respaldo: Si no se actualizó por ID, intentar buscar por correo (si no es de prueba de MP)
        if (!updated && userEmail && !userEmail.includes('@testuser.com')) {
          const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('email', userEmail)
            .select();

          if (error) {
            console.error("❌ Error de Supabase al actualizar por Email:", error);
          } else if (data && data.length > 0) {
            console.log("✅ ¡Perfil actualizado a 'active' exitosamente por Email!", data);
            updated = true;
          }
        }

        if (!updated) {
          console.error("❌ No se pudo actualizar el estatus. El ID o el email no coinciden con la tabla profiles.");
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('🔥 Error procesando el webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}