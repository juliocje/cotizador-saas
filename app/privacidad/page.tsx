'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-slate-200 space-y-6">
        
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Aviso de Privacidad Integración y Protección de Datos</h1>
            <p className="text-xs text-slate-500 mt-1">Última actualización: Agosto 2026</p>
          </div>
          <Link href="/" className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
            ← Volver al Cotizador
          </Link>
        </div>

        <section className="space-y-5 text-sm text-slate-700 leading-relaxed">
          
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">1. Responsable del Tratamiento de Datos</h2>
            <p>
              <strong>Cotizador Express Pro</strong>, con domicilio y operaciones en Hermosillo, Sonora, México, es responsable de la recopilación, almacenamiento y protección de sus datos personales, en estricto cumplimiento con la legislación aplicable en materia de Protección de Datos Personales.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">2. Datos Personales Recabados</h2>
            <p>
              Para operar las funcionalidades de la plataforma, podemos recabar los siguientes datos:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Datos del Usuario Administrador:</strong> Nombre, dirección de correo electrónico, teléfono de contacto, razón social o marca comercial, logotipos e identificación fiscal (RFC / Tax ID).</li>
              <li><strong>Datos de Clientes Frecuentes del Usuario:</strong> Nombre de clientes, teléfono, correo electrónico, RFC y domicilio ingresados en el directorio privado por el propio Usuario.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">3. Propiedad e Inviolabilidad de la Información de Clientes (Encargado de Tratamiento)</h2>
            <p>
              Se establece expresamente que toda la información ingresada por el Usuario respecto a sus clientes, catálogos de servicios, precios y cotizaciones históricas es de la <strong>exclusiva propiedad del Usuario</strong>.
            </p>
            <p className="mt-2">
              <strong>Cotizador Express Pro</strong> actúa únicamente como un <em>Encargado del Tratamiento de Datos</em> (Data Processor) y se compromete formalmente a:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>No comercializar, vender, alquilar ni transferir bajo ninguna circunstancia las bases de datos de clientes de los Usuarios a ningún tercero.</li>
              <li>No acceder a la información privada de las cotizaciones con fines comerciales ajenos al soporte técnico solicitado explícitamente por el Usuario.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">4. Finalidad del Tratamiento</h2>
            <p>Los datos recabados se utilizan exclusivamente para las siguientes finalidades primarias y necesarias:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Autenticación de seguridad y gestión de la cuenta del Usuario.</li>
              <li>Generación, maquetación y descarga de documentos de cotización en formato PDF.</li>
              <li>Procesamiento de pagos y cobranza recurrente del Plan Premium mediante la API segura de Mercado Pago.</li>
              <li>Brindar soporte técnico y enviar notificaciones operativas referentes al servicio.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">5. Seguridad, Cifrado y Servicios de Terceros</h2>
            <p>
              Para garantizar la confidencialidad y la integridad de sus datos, empleamos infraestructura tecnológica con estándares internacionales de seguridad:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Almacenamiento Cifrado:</strong> Las bases de datos operan bajo arquitectura Supabase PostgreSQL con autenticación cifrada.</li>
              <li><strong>Procesamiento Financiero:</strong> Los datos bancarios y de tarjetas de crédito/débito son procesados directamente por la pasarela de pagos cifrada de Mercado Pago. La Plataforma no almacena ni recopila números completos de tarjetas ni claves bancarias.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">6. Ejercicio de Derechos ARCO y Cancelación</h2>
            <p>
              El Usuario tiene derecho a conocer qué datos personales tenemos registrados, rectificarlos en caso de ser inexactos, solicitar la cancelación definitiva de su cuenta y eliminación completa de sus datos de nuestros servidores, o bien oponerse al tratamiento de los mismos (Derechos ARCO). Para ejercer estos derechos, el Usuario puede enviar su solicitud a la dirección de soporte habilitada en la Plataforma.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-1">7. Jurisdicción y Cambios al Aviso de Privacidad</h2>
            <p>
              Este Aviso de Privacidad se rige por las leyes aplicables en los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a la competencia de los tribunales de la ciudad de <strong>Hermosillo, Sonora, México</strong>. Nos reservamos el derecho de actualizar este aviso; los cambios entrarán en vigor al ser publicados en la Plataforma.
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