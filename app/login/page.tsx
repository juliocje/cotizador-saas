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
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-800 space-y-6">
        
        {/* ENCABEZADO CON LOGOTIPO OFICIAL MUY GRANDE */}
        <div className="text-center space-y-3">
          <div className="bg-slate-950 p-3 rounded-3xl inline-block shadow-inner border border-slate-800">
            <img 
              src="/cotizador-icon.png" 
              alt="Cotizador Express Logo" 
              className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-md"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Cotizador Express</h1>
            <p className="text-xs text-slate-400 font-medium">
              {isSignUp ? 'Crea una cuenta nueva' : 'Inicia sesión en tu cuenta'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs p-3 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* CAMPO DE NOMBRE DE PILA (SOLO SE MUESTRA EN REGISTRO) */}
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Nombre de Pila</label>
              <input 
                type="text" 
                required={isSignUp}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* CHECKBOX OBLIGATORIO DE TÉRMINOS Y PRIVACIDAD (SOLO EN REGISTRO) */}
          {isSignUp && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                <input 
                  type="checkbox" 
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-400 cursor-pointer shrink-0" 
                />
                <span className="leading-tight">
                  Acepto los{' '}
                  <Link href="/terminos" target="_blank" className="text-indigo-400 font-bold underline hover:text-indigo-300">
                    Términos y Condiciones
                  </Link>{' '}
                  y el{' '}
                  <Link href="/privacidad" target="_blank" className="text-indigo-400 font-bold underline hover:text-indigo-300">
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
                ? 'bg-slate-800 cursor-not-allowed opacity-60'
                : 'bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 shadow-lg'
            }`}
          >
            {loading ? 'Procesando...' : (isSignUp ? 'Registrarme' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setLegalAccepted(false);
              setFullName('');
              setErrorMessage('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition"
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

      </div>
    </div>
  );
}