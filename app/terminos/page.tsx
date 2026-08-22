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

        <section className="space-y-5 text-sm text-slate-700 leading-relaxed">
          
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">1. Aceptación de los Términos</h2>
            <p>
              Al registrarse, acceder o utilizar el software <strong>Cotizador Express Pro</strong> (en adelante, &quot;la Plataforma&quot;), el usuario (en adelante, &quot;el Usuario&quot;) acepta de manera expresa, plena y sin reservas todos y cada uno de los presentes Términos y Condiciones de Uso. Si el Usuario no está de acuerdo con las condiciones aquí establecidas, deberá abstenerse de utilizar el servicio.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">2. Naturaleza del Software y Deslinde de Responsabilidad</h2>
            <p>
              La Plataforma proporciona herramientas exclusivamente tecnológicas orientadas a la elaboración, diseño, edición y exportación de documentos comerciales digitales (cotizaciones, presupuestos y estimaciones).
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Inexistencia de Comprobante Fiscal:</strong> Los documentos generados mediante la Plataforma son estimaciones comerciales informativas y bajo ningún concepto constituyen facturas fiscales, Comprobantes Fiscales Digitales por Internet (CFDI) ni documentos de validez tributaria oficial ante el Servicio de Administración Tributaria (SAT) u órganos equivalentes.</li>
              <li><strong>Independencia Comercial:</strong> La Plataforma no forma parte ni interviene en las operaciones, contratos, acuerdos, cobranzas o disputas comerciales que se susciten entre el Usuario y sus clientes finales.</li>
              <li><strong>Veracidad e Importes:</strong> El Usuario es el único y exclusivo responsable de la veracidad, cálculo, precisión de impuestos, precios, descuentos y condiciones comerciales establecidas en los documentos generados.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">3. Uso Aceptable, Eliminación de Cuenta y Suspensión</h2>
            <p>
              El Usuario se compromete a hacer un uso lícito y ético de la Plataforma. Queda estrictamente prohibido utilizar el servicio para:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Generar cotizaciones falsas, engañosas, fraudulentas o destinadas a esquemas de estafa.</li>
              <li>Cotizar productos o servicios ilegales, regulados o cuya comercialización infrinja leyes vigentes.</li>
              <li>Suplantar la identidad de personas físicas, morales o marcas registradas sin la debida autorización.</li>
            </ul>
            <p className="mt-2">
              <strong>Eliminación Definitiva de Cuenta:</strong> El Usuario cuenta con una herramienta automatizada para eliminar su cuenta en cualquier momento. Al hacer uso de esta opción, el Usuario reconoce y acepta que el proceso es <strong>permanente e irreversible</strong>, eliminando por completo su perfil, cotizaciones guardadas, directorio de clientes y empresas registradas de las bases de datos sin derecho a recuperación.
            </p>
            <p className="mt-2">
              Nos reservamos el derecho indiscutible de suspender, bloquear o eliminar definitivamente de manera inmediata y sin previo aviso la cuenta de cualquier Usuario que infrinja esta disposición, sin derecho a reembolso o indemnización.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">4. Propiedad Intelectual, Logotipos y Marcas de Terceros</h2>
            <p>
              Todos los derechos de propiedad intelectual del diseño, código fuente, interfaz y marca <strong>Cotizador Express Pro</strong> pertenecen en su totalidad a sus desarrolladores. 
            </p>
            <p className="mt-2">
              En relación con las imágenes, logotipos y marcas comerciales que el Usuario cargue en la Plataforma para personalizar sus cotizaciones, el Usuario declara y garantiza bajo protesta de decir verdad que cuenta con la titularidad, licencias o autorizaciones correspondientes para su uso. La Plataforma queda totalmente liberada de cualquier responsabilidad derivada de infracciones a derechos de autor o propiedad industrial cometidas por los Usuarios.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">5. Suscripciones, Planes de Pago, Vigencia y Reembolsos</h2>
            <p>
              El acceso a funcionalidades avanzadas (Plan Premium) requiere el pago de la tarifa correspondiente. Los pagos se procesan a través de pasarelas de pago de terceros cifradas y seguras (Mercado Pago).
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Vigencia del Plan:</strong> Las suscripciones al Plan Premium tienen una vigencia estándar de 30 días naturales a partir de la confirmación electrónica del pago.</li>
              <li><strong>Caducidad y Restricción Automática:</strong> Si el periodo de vigencia fenece sin que se registre una renovación de pago confirmada por los sistemas automatizados (Webhooks), la cuenta se degradará de manera automática al Plan Gratuito (Free), aplicando de inmediato los límites de uso vigentes.</li>
              <li>El Usuario puede cancelar o suspender su suscripción en cualquier momento.</li>
              <li>No se otorgarán reembolsos ni devoluciones proporcionales por periodos de cobro ya procesados o transcurridos.</li>
              <li>Las variaciones de tarifa serán notificadas oportunamente a través de la plataforma o correo electrónico.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">6. Limitación de Responsabilidad y Garantías de Disponibilidad</h2>
            <p>
              El servicio se provee &quot;tal cual&quot; (&quot;as is&quot;) y &quot;según disponibilidad&quot;. A pesar de aplicar altos estándares de seguridad y estabilidad, no garantizamos que el servicio sea ininterrumpido o esté completamente libre de errores. La Plataforma no será responsable por daños indirectos, pérdida de ganancias, interrupción de negocios o pérdida de datos causados por fallas en servidores de infraestructura de terceros (hospedaje o base de datos).
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">7. Cláusula de Indemnización</h2>
            <p>
              El Usuario se obliga a defender, indemnizar y sacar en paz y a salvo a <strong>Cotizador Express Pro</strong>, sus administradores, desarrolladores y afiliados frente a cualquier demanda, reclamación, juicio, multa, sanción u honorarios legales que deriven del uso indebido de la Plataforma, incumplimiento de contratos con sus clientes o violación de estos Términos.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">8. Jurisdicción y Ley Aplicable</h2>
            <p>
              Para la interpretación, cumplimiento y solución de cualquier controversia o litigio derivado de estos Términos y Condiciones, las partes se someten expresamente a la legislación vigente y a la jurisdicción de los tribunales competentes de la ciudad de <strong>Hermosillo, Sonora, México</strong>, renunciando expresamente a cualquier otro fuero que por razón de sus domicilios presentes o futuros pudiera corresponderles.
            </p>
          </div>

        </section>

        <div className="border-t pt-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cotizador Express Pro. Todos los derechos reservados.</p>
        </div>

      </div>
    </div>
  );
}