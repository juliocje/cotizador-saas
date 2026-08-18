'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [legalAccepted, setLegalAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validación obligatoria de términos al registrarse por primera vez
    if (isSignUp && !legalAccepted) {
      setErrorMessage('Debes aceptar los Términos y Condiciones y el Aviso de Privacidad para crear tu cuenta.');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre de pila.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // REGISTRO DE NUEVO USUARIO EN SUPABASE AUTH PASANDO EL NOMBRE EN METADATA
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim()
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

        alert('¡Registro exitoso! Por favor inicia sesión.');
        setIsSignUp(false);
        setFullName('');
      } else {
        // INICIO DE SESIÓN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error en la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // CONTENEDOR CON DEGRADADO OSCURO PROFESIONAL
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-200 space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cotizador Express Pro</h1>
          <p className="text-xs text-slate-500 font-medium">
            {isSignUp ? 'Crea una cuenta nueva' : 'Inicia sesión en tu cuenta'}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* CAMPO DE NOMBRE DE PILA (SOLO SE MUESTRA EN REGISTRO) */}
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Nombre de Pila</label>
              <input 
                type="text" 
                required={isSignUp}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-indigo-600 transition"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-indigo-600 transition"
            />
          </div>

          {/* CHECKBOX OBLIGATORIO DE TÉRMINOS Y PRIVACIDAD (SOLO EN REGISTRO) */}
          {isSignUp && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                <input 
                  type="checkbox" 
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0" 
                />
                <span className="leading-tight">
                  Acepto los{' '}
                  <Link href="/terminos" target="_blank" className="text-indigo-600 font-bold underline hover:text-indigo-800">
                    Términos y Condiciones
                  </Link>{' '}
                  y el{' '}
                  <Link href="/privacidad" target="_blank" className="text-indigo-600 font-bold underline hover:text-indigo-800">
                    Aviso de Privacidad
                  </Link>.
                </span>
              </label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (isSignUp && !legalAccepted)}
            className={`w-full font-bold py-3 rounded-xl text-sm transition shadow-md text-white ${
              loading || (isSignUp && !legalAccepted)
                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'
            }`}
          >
            {loading ? 'Procesando...' : (isSignUp ? 'Registrarme' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setLegalAccepted(false);
              setFullName('');
              setErrorMessage('');
            }}
            className="text-xs text-indigo-600 hover:underline font-semibold"
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

      </div>
    </div>
  );
}