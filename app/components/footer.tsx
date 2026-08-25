import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Columna de Marca con Logotipo Opción 1A (JT Real) */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 100" 
                className="w-10 h-10 rounded-xl shadow-md flex-shrink-0"
              >
                {/* Fondo oscuro con borde sutil */}
                <rect width="100" height="100" rx="22" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
                
                {/* Letra J estilizada */}
                <path 
                  d="M 32 32 H 50 M 41 32 V 58 C 41 68, 54 68, 54 58" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                
                {/* Letra T estilizada entrelazada */}
                <path 
                  d="M 52 32 H 80 M 66 32 V 68" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <div>
                <h3 className="text-white text-base font-bold tracking-wider">
                  JiCKS <span className="text-cyan-400 font-light">Tech</span>
                </h3>
                <p className="text-xs text-cyan-400 font-medium">
                  Un producto oficial
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Cotizador Express forma parte del ecosistema de soluciones tecnológicas avanzadas desarrolladas por JiCKS Tech para mercados globales.
            </p>
          </div>

          {/* Columna de Estado del Sistema */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Estado del Sistema
            </h4>
            <div className="flex items-center space-x-2 text-sm text-slate-400 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Todos los sistemas operativos</span>
            </div>
            <p className="text-xs text-slate-500">
              Infraestructura sincronizada en <span className="text-slate-400">app.jickstech.com</span>.
            </p>
          </div>

          {/* Columna de Contacto Oficial */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Soporte y Ventas
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

        {/* Copyright y Versión */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} JiCKS Tech. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="text-slate-400 font-medium">Cotizador Express v1.0</span>
            <span className="hover:text-slate-400 transition-colors">Global Software Suite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}