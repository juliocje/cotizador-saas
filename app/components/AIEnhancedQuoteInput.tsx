'use client';

import React, { useState } from 'react';

interface ParsedItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ParsedData {
  clientName?: string;
  items?: ParsedItem[];
}

interface AIEnhancedQuoteInputProps {
  onDataParsed: (data: ParsedData) => void;
}

export default function AIEnhancedQuoteInput({ onDataParsed }: AIEnhancedQuoteInputProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/parse-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Enviamos los datos estructurados al formulario principal
        onDataParsed(result.data);
        setPrompt(''); // Limpiamos la caja de texto
      } else {
        alert('Hubo un error al procesar con IA.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-cyan-400 text-sm font-bold flex items-center gap-1">
          ✨ Asistente IA (Autocompletar Mágico)
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 mb-4">
        Escribe en lenguaje natural (ej. <span className="text-slate-300 italic">&quot;Cotiza a Comercializadora X 5 escritorios de $3,500 y un envío por $500&quot;</span>) y deja que la IA llene los campos por ti.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe lo que deseas cotizar..."
          className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-all text-sm disabled:opacity-50 flex-shrink-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Procesando...
            </>
          ) : (
            'Generar con IA'
          )}
        </button>
      </div>
    </div>
  );
}