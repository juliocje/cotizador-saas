'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

// DICCIONARIO DE TRADUCCIONES
const translations: Record<string, any> = {
  es: {
    appTitle: "⚡ Cotizador Express Pro",
    appSub: "Selecciona el idioma y los impuestos para tu cliente.",
    lblLang: "🌐 Idioma:",
    lblTax: "Impuesto:",
    catalogLabel: "📦 Catálogo Rápido:",
    btnCatalog: "⚡ Agregar",
    btnManageCatalog: "⚙️ Catálogo",
    btnBlank: "➕ Blanco",
    btnPrint: "📄 Guardar / PDF",
    btnSaveCloud: "☁️ Guardar en Nube",
    logoPrompt: "Haz clic para subir tu Logo",
    quotedTo: "Cotizado Para:",
    details: "Detalles Comerciales:",
    folio: "Folio:",
    date: "Fecha:",
    validity: "Vigencia:",
    delivery: "Entrega:",
    thConcept: "Concepto / Descripción",
    thQty: "Cant.",
    thPrice: "P. Unitario",
    thAmount: "Importe",
    bankHeader: "💳 Datos Bancarios para Pago:",
    bank: "Banco:",
    beneficiary: "Beneficiario:",
    account: "Cuenta:",
    clabe: "CLABE:",
    rfc: "RFC:",
    subtotal: "Subtotal Bruto:",
    discount: "Descuento (%):",
    total: "Total Neto:",
    modalTitle: "⚙️ Administrar Catálogo Rápido",
    modalAddNew: "➕ Agregar Nuevo Concepto al Catálogo:",
    btnSaveCatItem: "+ Agregar al Catálogo",
    btnCloseModal: "Cerrar y Guardar"
  },
  en: {
    appTitle: "⚡ Express Quote Pro",
    appSub: "Select language and tax rate for your client.",
    lblLang: "🌐 Language:",
    lblTax: "Tax Rate:",
    catalogLabel: "📦 Quick Catalog:",
    btnCatalog: "⚡ Add Item",
    btnManageCatalog: "⚙️ Edit Catalog",
    btnBlank: "➕ Blank Item",
    btnPrint: "📄 Save / PDF",
    btnSaveCloud: "☁️ Save to Cloud",
    logoPrompt: "Click to upload your Logo",
    quotedTo: "Quoted To:",
    details: "Commercial Details:",
    folio: "Quote #:",
    date: "Date:",
    validity: "Validity:",
    delivery: "Delivery:",
    thConcept: "Item / Description",
    thQty: "Qty",
    thPrice: "Unit Price",
    thAmount: "Amount",
    bankHeader: "💳 Wire / Banking Details:",
    bank: "Bank:",
    beneficiary: "Beneficiary:",
    account: "Account #:",
    clabe: "Routing/IBAN:",
    rfc: "Tax ID / RFC:",
    subtotal: "Subtotal:",
    discount: "Discount (%):",
    total: "Net Total:",
    modalTitle: "⚙️ Manage Quick Catalog",
    modalAddNew: "➕ Add New Item to Catalog:",
    btnSaveCatItem: "+ Add to Catalog",
    btnCloseModal: "Close & Save"
  }
};

const initialCatalog = [
  { es: "Mano de obra y remodelación de espacio", en: "Labor and space remodeling", price: 1200.00 },
  { es: "Materiales y acabados especiales", en: "Special materials and finishes", price: 350.00 },
  { es: "Diseño y planos arquitectónicos (M2)", en: "Architectural design and blueprints (SqFt)", price: 850.00 },
  { es: "Instalación eléctrica residencial/comercial", en: "Residential/Commercial electrical installation", price: 500.00 }
];

export default function Home() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [taxRate, setTaxRate] = useState<number>(16);
  const [discount, setDiscount] = useState<number>(0);
  const [currency] = useState<string>('MXN');
  
  const [clientName, setClientName] = useState<string>("Cliente: Juan Pérez / Empresa ABC");
  const [catalog, setCatalog] = useState(initialCatalog);
  const [selectedCatalogIdx, setSelectedCatalogIdx] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [logo, setLogo] = useState<string | null>(null);
  
  const [items, setItems] = useState([
    { description_es: initialCatalog[0].es, description_en: initialCatalog[0].en, qty: 1, price: initialCatalog[0].price },
    { description_es: initialCatalog[1].es, description_en: initialCatalog[1].en, qty: 2, price: initialCatalog[1].price }
  ]);

  const [newCatEs, setNewCatEs] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatPrice, setNewCatPrice] = useState('');

  const t = translations[lang];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addItemFromCatalog = () => {
    const prod = catalog[selectedCatalogIdx];
    if (prod) {
      setItems([...items, { description_es: prod.es, description_en: prod.en, qty: 1, price: prod.price }]);
    }
  };

  const addBlankItem = () => {
    const defaultDesc = lang === 'es' ? "Nuevo concepto / servicio" : "New item / service";
    setItems([...items, { description_es: defaultDesc, description_en: defaultDesc, qty: 1, price: 100.00 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'qty') newItems[index].qty = parseFloat(value) || 0;
    else if (field === 'price') newItems[index].price = parseFloat(value) || 0;
    else {
      if (lang === 'es') newItems[index].description_es = value;
      else newItems[index].description_en = value;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addNewCatalogItem = () => {
    if (!newCatEs && !newCatEn) return alert("Ingresa al menos un nombre para el concepto.");
    setCatalog([...catalog, { es: newCatEs || newCatEn, en: newCatEn || newCatEs, price: parseFloat(newCatPrice) || 0 }]);
    setNewCatEs(''); setNewCatEn(''); setNewCatPrice('');
  };

  // Cálculos
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const discountAmount = subtotal * (discount / 100);
  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = subtotalWithDiscount * (taxRate / 100);
  const total = subtotalWithDiscount + taxAmount;

  // FUNCIÓN PARA GUARDAR EN SUPABASE
  const saveQuoteToCloud = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('quotes').insert([
        {
          client_name: clientName,
          total_amount: total,
          items: items,
        }
      ]);

      if (error) throw error;
      alert("☁️ ¡Cotización guardada exitosamente en la nube!");
    } catch (err: any) {
      alert("⚠️ Error al guardar en la nube: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Barra de Herramientas */}
        <div className="no-print bg-white p-4 rounded-xl shadow-md mb-6 space-y-4 border border-slate-200">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{t.appTitle}</h1>
              <p className="text-xs text-slate-500">{t.appSub}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-600 pl-1">{t.lblLang}</label>
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as 'es' | 'en')}
                  className="bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-1 cursor-pointer outline-none"
                >
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-600 pl-1">{t.lblTax}</label>
                <input 
                  type="number" 
                  value={taxRate} 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-12 text-center font-bold text-xs bg-white border border-slate-300 rounded p-1 text-indigo-700 outline-none"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>

              <button onClick={saveQuoteToCloud} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow transition">
                {isSaving ? "Guardando..." : t.btnSaveCloud}
              </button>

              <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow transition">
                {t.btnPrint}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-600">{t.catalogLabel}</label>
            <select 
              value={selectedCatalogIdx}
              onChange={(e) => setSelectedCatalogIdx(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none flex-1 max-w-xs font-medium"
            >
              {catalog.map((item, idx) => (
                <option key={idx} value={idx}>
                  {(lang === 'es' ? item.es : item.en)} - ${item.price.toFixed(2)}
                </option>
              ))}
            </select>
            <button onClick={addItemFromCatalog} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-3 py-2 rounded-lg text-xs transition">
              {t.btnCatalog}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-3 py-2 rounded-lg text-xs transition border border-slate-300">
              {t.btnManageCatalog}
            </button>
            <button onClick={addBlankItem} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-2 rounded-lg text-xs transition border border-indigo-200 ml-auto">
              {t.btnBlank}
            </button>
          </div>
        </div>

        {/* Documento Cotización */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-8 gap-6">
            <div className="w-full md:w-1/2">
              <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg h-20 w-48 flex items-center justify-center cursor-pointer overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Logo" className="h-full object-contain" />
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 text-center px-2">{t.logoPrompt}</span>
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="w-full md:w-1/2 text-left md:text-right space-y-1">
              <input defaultValue="Mi Empresa S.A. de C.V." className="font-bold text-xl text-slate-900 w-full text-left md:text-right bg-transparent outline-none" />
              <input defaultValue="Servicios Profesionales" className="text-xs text-slate-500 w-full text-left md:text-right bg-transparent outline-none" />
              <input defaultValue="contacto@miempresa.com" className="text-xs text-slate-500 w-full text-left md:text-right bg-transparent outline-none" />
            </div>
          </div>

          {/* Datos Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">{t.quotedTo}</span>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="font-semibold text-slate-800 w-full bg-transparent outline-none" />
            </div>
            <div className="md:text-right space-y-1 text-xs text-slate-600">
              <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">{t.details}</span>
              <p><strong>{t.folio}</strong> <input defaultValue="#COT-2026-001" className="w-28 text-right bg-transparent outline-none font-semibold text-slate-800" /></p>
            </div>
          </div>

          {/* Tabla de Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="py-3 px-2">{t.thConcept}</th>
                  <th className="py-3 px-2 w-20 text-center">{t.thQty}</th>
                  <th className="py-3 px-2 w-28 text-right">{t.thPrice}</th>
                  <th className="py-3 px-2 w-28 text-right">{t.thAmount}</th>
                  <th className="py-3 px-2 w-10 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-2">
                      <input 
                        value={lang === 'es' ? (item.description_es || item.description_en) : (item.description_en || item.description_es)} 
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input 
                        type="number" 
                        value={item.qty} 
                        onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                        className="w-16 text-center bg-transparent outline-none"
                      />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <input 
                        type="number" 
                        value={item.price} 
                        onChange={(e) => updateItem(idx, 'price', e.target.value)}
                        className="w-24 text-right bg-transparent outline-none"
                      />
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center no-print">
                      <button onClick={() => removeItem(idx)} className="text-rose-400 hover:text-rose-600 font-bold">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex flex-col md:flex-row justify-between items-start mt-8 border-t border-slate-200 pt-6 gap-6">
            <div className="w-full md:w-1/2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-bold text-slate-800 text-sm mb-2">{t.bankHeader}</p>
              <p className="flex items-center gap-1"><strong className="w-24">{t.bank}</strong><input defaultValue="BBVA México" className="w-full bg-transparent outline-none font-medium" /></p>
            </div>

            <div className="w-full md:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-semibold">${subtotal.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>{t.total}</span>
                <span className="text-indigo-600">${total.toFixed(2)} {currency}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Catálogo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800">{t.modalTitle}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold text-xl">✕</button>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg">{t.btnCloseModal}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}