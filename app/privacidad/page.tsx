'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-slate-200 space-y-6">
        
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Aviso de Privacidad</h1>
            <p className="text-xs text-slate-500 mt-1">Última actualización: Agosto 2026</p>
          </div>
          <Link href="/" className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
            ← Volver al Cotizador
          </Link>
        </div>

        <section className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">1. Identidad del Responsable</h2>
          <p>
            <strong>Cotizador Express Pro</strong> es responsable del tratamiento y protección de sus datos personales conforme a la legislación aplicable en materia de protección de datos personales.
          </p>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">2. Datos Personales Recabados</h2>
          <p>
            Para brindar el servicio de cotizador comercial y gestión de cuentas, podemos recabar los siguientes datos:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Datos del Usuario:</strong> Nombre, correo electrónico, nombre comercial o razón social, número de teléfono y datos fiscales opcionales.</li>
            <li><strong>Datos de Clientes del Usuario:</strong> Nombre, teléfono, correo electrónico y RFC ingresados en el directorio privado de la cuenta del usuario.</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">3. Finalidad del Tratamiento de Datos</h2>
          <p>Los datos recabados se utilizan exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Autenticación de acceso a la plataforma.</li>
            <li>Generación y personalización de documentos comerciales en formato PDF.</li>
            <li>Procesamiento de cobros y gestión de la suscripción al Plan Premium.</li>
            <li>Soporte técnico y comunicación sobre el servicio.</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">4. Seguridad y Almacenamiento</h2>
          <p>
            Sus datos personales y la información de sus clientes son privados e individuales por usuario. Se almacenan utilizando infraestructura de base de datos segura y encriptada (Supabase PostgreSQL) y hospedaje en la nube (Vercel). Las transacciones bancarias son procesadas de forma cifrada por Mercado Pago; nosotros no almacenamos números completos de tarjetas ni datos financieros sensibles.
          </p>

          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">5. Derechos ARCO</h2>
          <p>
            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información (Rectificación), su eliminación de nuestros registros (Cancelación) u oponerse al uso de los mismos (Oposición). Para ejercer cualquiera de estos derechos, puede ponerse en contacto a través de la sección de soporte del servicio.
          </p>
        </section>

        <div className="border-t pt-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cotizador Express Pro. Todos los derechos reservados.</p>
        </div>

      </div>
    </div>
  );
}