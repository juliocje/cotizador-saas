'use client';
import { useState, useEffect } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    if (isIOS) {
      alert('Para instalar en tu iPhone:\n\n1. Toca el botón de Compartir en la barra de Safari.\n2. Selecciona "Añadir a la pantalla de inicio".');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert('Para instalar la aplicación:\n\n1. Toca los tres puntos (⠇) en la esquina superior de tu navegador.\n2. Selecciona "Instalar aplicación" o "Agregar a la pantalla principal".');
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 transition-all shadow-md"
    >
      <span className="text-base">📲</span>
      <span>Instalar App</span>
    </button>
  );
}