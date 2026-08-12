"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HistorialPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setQuotes(data || []);
      } catch (err) {
        console.error("Error al obtener cotizaciones:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">📋 Historial de Cotizaciones</h1>
            <p className="text-sm text-slate-400">Cotizaciones guardadas en la nube</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition"
          >
            ← Volver al Cotizador
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Cargando cotizaciones...</div>
        ) : quotes.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
            <p className="text-slate-400">Aún no has guardado ninguna cotización.</p>
          </div>
        ) : (
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Conceptos</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {q.client_name || "Sin nombre"}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {Array.isArray(q.items) ? q.items.length : 0} elemento(s)
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono">
                        ${Number(q.total || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}