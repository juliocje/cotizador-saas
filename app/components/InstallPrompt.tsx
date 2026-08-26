'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya está instalado como PWA (modo standalone)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return; // Si ya está instalado, no mostramos nada

    // 2. Detectar si es dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOS);

    if (iOS) {
      // En iOS no hay eventos automáticos, mostramos el banner de guía manual tras un breve retraso
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }

    // 3. Capturar evento de instalación para Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl text-slate-100 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/15 p-2.5 rounded-xl border border-cyan-500/30">
            <span className="text-2xl">📲</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Instala Cotizador Express</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Accede más rápido y úsala a pantalla completa.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-white text-sm px-1.5 py-0.5 rounded-lg bg-slate-800"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* CONTENIDO CONDICIONAL SEGÚN EL DISPOSITIVO */}
      {isIOS ? (
        /* GUÍA PARA IOS / iPHONE */
        <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5">
          <p className="font-medium text-cyan-400">Instrucciones para iPhone:</p>
          <div className="flex items-center gap-2">
            <span>1. Toca el botón de Compartir</span>
            <span className="inline-block px-1.5 py-0.5 bg-slate-800 rounded font-bold">⎋ o ↥</span>
          </div>
          <p>2. Desplázate y selecciona <strong className="text-white">&quot;Añadir a la pantalla de inicio&quot;</strong>.</p>
        </div>
      ) : (
        /* BOTÓN AUTOMÁTICO PARA ANDROID */
        <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
          <button
            onClick={handleAndroidInstall}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Instalar Aplicación Ahora</span>
          </button>
        </div>
      )}
    </div>
  );
}