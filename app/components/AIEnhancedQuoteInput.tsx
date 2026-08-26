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
  const [isListening, setIsListening] = useState(false);

  // Función para activar el dictado por voz del navegador
  const handleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz directo. Te recomendamos usar Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX'; // Idioma español
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setPrompt(speechText);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Error de reconocimiento de voz:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

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
        onDataParsed(result.data);
        setPrompt('');
      } else {
        alert('Detalle del error: ' + (result.error || 'Error desconocido'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Error de conexión: ' + (err.message || 'No se pudo conectar al servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-cyan-400 text-sm font-bold flex items-center gap-1">
          🎙️ Dictado Mágico por Voz (IA)
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 mb-4">
        Haz clic en el micrófono y dicta tu cotización (ej. <span className="text-slate-300 italic">&quot;Cotiza a Juan Pérez 3 escritorios de 3500 pesos&quot;</span>) o escríbela si lo prefieres.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow flex items-center">
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isListening ? "Escuchando... Habla ahora..." : "Presiona el micrófono o escribe aquí..."}
            className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none transition-all ${
              isListening ? 'border-rose-500 ring-2 ring-rose-500/20 animate-pulse' : 'border-slate-800 focus:border-cyan-500'
            }`}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            type="button"
            onClick={handleVoiceDictation}
            title="Dictar con voz"
            className={`absolute right-3 p-2 rounded-lg transition-all ${
              isListening ? 'bg-rose-500 text-white animate-bounce' : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
            }`}
          >
            🎤
          </button>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || isListening}
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