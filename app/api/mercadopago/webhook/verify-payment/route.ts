import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request) {
  // Puedes llamar a esta URL desde tu navegador: http://localhost:3000/api/mercadopago/verify-payment?email=TU_CORREO
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: "Falta email" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ subscription_status: 'active' })
    .eq('email', email);

  return NextResponse.json({ data, error });
}