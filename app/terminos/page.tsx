'use client';

import React from 'react';
import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-slate-200 space-y-6">
        
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Términos y Condiciones de Uso</h1>
            <p className="text-xs text-slate-500 mt-1">Última actualización: Agosto 2026</p>
          </div>
          <Link href="/" className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
            ← Volver al Cotizador
          </Link>
        </div>

        <section className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">1. Aceptación del Servicio</h2>
          <p>
            Al acceder y utilizar <strong>Cotizador Express Pro</strong>, el usuario acepta de manera plena y sin reservas los presentes Términos y Condiciones. Si no está de acuerdo con alguno de los términos, deberá abstenerse de utilizar la plataforma.
          </p>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">2. Naturaleza del Software y Deslinde Legal</h2>
          <p>
            <strong>Cotizador Express Pro</strong> es únicamente una herramienta digital de software diseñada para la facilitación y elaboración de documentos comerciales (cotizaciones, presupuestos y estimaciones). 
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>No es un Comprobante Fiscal:</strong> Las cotizaciones o presupuestos generados no constituyen una factura ni comprobante fiscal oficial (CFDI) ante autoridades tributarias.</li>
            <li><strong>Responsabilidad de Contenido:</strong> El usuario es el único responsable de la exactitud, veracidad y legalidad de los precios, conceptos, descuentos, impuestos e información comercial ingresados en sus documentos.</li>
            <li><strong>Acuerdos Comerciales:</strong> La plataforma no interviene en las transacciones, contratos ni discrepancias que surjan entre el usuario y sus clientes finales.</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">3. Suscripción y Pagos (Plan Premium)</h2>
          <p>
            El acceso al Plan Premium otorga uso ilimitado de generación de cotizaciones. Los pagos son procesados de forma segura a través de pasarelas de pago de terceros (Mercado Pago). El usuario podrá cancelar su suscripción en cualquier momento. No se realizan reembolsos proporcionales por periodos mensuales ya iniciados.
          </p>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">4. Disponibilidad del Servicio</h2>
          <p>
            El servicio se provee &quot;tal cual&quot; (&quot;as is&quot;). No se garantiza una disponibilidad ininterrumpida del 100% ni nos hacemos responsables por pérdidas económicas derivadas de interrupciones técnicas imprevistas de los proveedores de infraestructura (hosting/base de datos).
          </p>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">5. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento. El uso continuado de la plataforma tras la publicación de cambios constituye la aceptación de los mismos.
          </p>
        </section>

        <div className="border-t pt-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cotizador Express Pro. Todos los derechos reservados.</p>
        </div>

      </div>
    </div>
  );
}