'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage('¡Contraseña actualizada con éxito! Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-800 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Nueva Contraseña</h1>
          <p className="text-xs text-slate-400 font-medium">
            Ingresa tu nueva contraseña segura para tu cuenta.
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

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
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
            {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
          </button>
        </form>

      </div>
    </div>
  );
}