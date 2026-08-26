'use client';
import { useState, useEffect } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado como PWA
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detectar si es iOS (iPhone)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOS);

    // Capturar evento para Android / PC
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
    if (isIOS) {
      alert('Para instalar en tu iPhone:\n\n1. Toca el botón de Compartir (⎋ o ↥) en tu navegador.\n2. Selecciona "Añadir a la pantalla de inicio".');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback por si el evento aún no carga: guía rápida
      alert('Para instalar la aplicación, toca los tres puntos (⠇) en la esquina superior de tu navegador y selecciona "Instalar aplicación".');
    }
  };

  // Si ya está instalado en el dispositivo, ocultamos el botón del menú
  if (isInstalled) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 transition-all"
    >
      <span className="text-base">📲</span>
      <span>Instalar App</span>
    </button>
  );
}