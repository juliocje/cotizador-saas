import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Columna de Marca */}
          <div>
            <h3 className="text-white text-lg font-bold tracking-wider mb-3">
              JiCKS Tech
            </h3>
            <p className="text-sm text-slate-400">
              Soluciones tecnológicas avanzadas y herramientas de cotización multiplataforma para mercados globales.
            </p>
          </div>

          {/* Columna de Enlaces */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">
                  Panel de Cotizaciones
                </a>
              </li>
              <li>
                <a href="/clients" className="hover:text-white transition-colors">
                  Registro de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna de Contacto Oficial */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Contacto Oficial
            </h4>
            <p className="text-sm text-slate-400 mb-2">
              ¿Necesitas asistencia técnica o comercial? Escríbenos a:
            </p>
            <a 
              href="mailto:support@jickstech.com" 
              className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors inline-flex items-center gap-1"
            >
              support@jickstech.com
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} JiCKS Tech. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 transition-colors">Global Market Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}