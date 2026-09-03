'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      console.log('Enviando solicitud de recuperación para:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'https://cotizador.jickstech.com/update-password',
      });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      setMessage('¡Correo enviado! Revisa tu bandeja de entrada.');
    } catch (err: any) {
      console.error('Excepción capturada:', err);
      setErrorMessage(err.message || 'Ocurrió un error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-800 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Recuperar Contraseña</h1>
          <p className="text-xs text-slate-400 font-medium">
            Ingresa tu correo electrónico registrado y te enviaremos instrucciones.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs p-3 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {message && (
          <div className="bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs p-3 rounded-xl font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-4">
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

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl text-sm transition shadow-md text-white ${
              loading
                ? 'bg-slate-800 cursor-not-allowed opacity-60'
                : 'bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 shadow-lg'
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <Link href="/login" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition">
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
}