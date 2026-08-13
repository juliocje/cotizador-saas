'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// DICCIONARIO DE TRADUCCIONES
const translations: Record<string, any> = {
  es: {
    appTitle: "⚡ Cotizador Express Pro",
    appSub: "Selecciona el idioma, cliente y empresa emisora.",
    lblLang: "🌐 Idioma:",
    lblTax: "Impuesto:",
    catalogLabel: "📦 Catálogo Rápido:",
    btnCatalog: "⚡ Agregar",
    btnManageCatalog: "⚙️ Catálogo",
    btnManageBanks: "🏦 Cuentas Bancarias",
    btnHistory: "📜 Mis Cotizaciones",
    btnManageClients: "👥 Clientes",
    btnManageCompanies: "🏢 Mis Empresas",
    lblSelectBank: "💳 Cuenta Bancaria:",
    lblSelectClient: "👤 Cliente Frecuente:",
    lblSelectCompany: "🏢 Emitir con:",
    btnBlank: "➕ Blanco",
    btnPrint: "📄 Guardar / PDF",
    btnSaveCloud: "☁️ Guardar en Nube",
    btnLogout: "🚪 Cerrar Sesión",
    logoPrompt: "Haz clic para subir tu Logo o cárgalo desde 'Mis Empresas'",
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
    beneficiary: "Nombre / Beneficiario:",
    bank: "Banco:",
    account: "Cuenta:",
    clabe: "CLABE:",
    rfc: "RFC:",
    subtotal: "Subtotal Bruto:",
    discount: "Descuento (%):",
    taxLabel: "Impuesto:",
    total: "Total Neto:",
    modalTitle: "⚙️ Administrar Conceptos / Catálogo",
    modalAddNew: "➕ Agregar Nuevo Concepto:",
    btnSaveCatItem: "+ Agregar al Catálogo (Máx. 15)",
    btnAddToQuoteDirect: "⚡ Agregar Directo a Cotización",
    btnCloseModal: "Cerrar",
    generatedAt: "Fecha y hora de emisión:",
    bankModalTitle: "🏦 Administrar Cuentas Bancarias",
    historyModalTitle: "📜 Historial de Cotizaciones Guardadas",
    clientModalTitle: "👥 Directorio de Clientes Frecuentes",
    companyModalTitle: "🏢 Administrar Mis Empresas",
    noHistory: "Aún no tienes cotizaciones guardadas en la nube.",
    noClients: "No tienes clientes frecuentes registrados.",
    noCompanies: "No tienes empresas registradas.",
    btnLoadQuote: "📥 Cargar",
    btnDeleteQuote: "🗑️ Eliminar",
    btnSelectClient: "⚡ Usar Cliente",
    btnSelectCompany: "⚡ Cargar Empresa"
  },
  en: {
    appTitle: "⚡ Express Quote Pro",
    appSub: "Select language, client, and issuing company.",
    lblLang: "🌐 Language:",
    lblTax: "Tax Rate:",
    catalogLabel: "📦 Quick Catalog:",
    btnCatalog: "⚡ Add Item",
    btnManageCatalog: "⚙️ Edit Catalog",
    btnManageBanks: "🏦 Bank Accounts",
    btnHistory: "📜 Saved Quotes",
    btnManageClients: "👥 Clients",
    btnManageCompanies: "🏢 My Companies",
    lblSelectBank: "💳 Bank Account:",
    lblSelectClient: "👤 Saved Client:",
    lblSelectCompany: "🏢 Issue As:",
    btnBlank: "➕ Blank Item",
    btnPrint: "📄 Save / PDF",
    btnSaveCloud: "☁️ Save to Cloud",
    btnLogout: "🚪 Log Out",
    logoPrompt: "Click to upload Logo or load it from 'My Companies'",
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
    beneficiary: "Beneficiary Name:",
    bank: "Bank:",
    account: "Account #:",
    clabe: "Routing / IBAN / CLABE:",
    rfc: "Tax ID / RFC:",
    subtotal: "Subtotal:",
    discount: "Discount (%):",
    taxLabel: "Tax Rate:",
    total: "Net Total:",
    modalTitle: "⚙️ Manage Items / Catalog",
    modalAddNew: "➕ Add New Concept:",
    btnSaveCatItem: "+ Add to Catalog (Max 15)",
    btnAddToQuoteDirect: "⚡ Add Directly to Quote",
    btnCloseModal: "Close",
    generatedAt: "Date and time of issue:",
    bankModalTitle: "🏦 Manage Bank Accounts",
    historyModalTitle: "📜 Saved Quotes History",
    clientModalTitle: "👥 Frequent Clients Directory",
    companyModalTitle: "🏢 Manage My Companies",
    noHistory: "You don't have any saved quotes in the cloud yet.",
    noClients: "No saved clients found.",
    noCompanies: "No companies registered.",
    btnLoadQuote: "📥 Load",
    btnDeleteQuote: "🗑️ Delete",
    btnSelectClient: "⚡ Use Client",
    btnSelectCompany: "⚡ Load Company"
  }
};

const taxPresets = [
  { label: "IVA México (16%)", value: 16 },
  { label: "IVA Fronterizo MX (8%)", value: 8 },
  { label: "Sin Impuesto (0%)", value: 0 },
  { label: "USA - California (7.25%)", value: 7.25 },
  { label: "USA - Texas (6.25%)", value: 6.25 },
  { label: "USA - Florida (6.00%)", value: 6.00 },
  { label: "USA - New York (4.00%)", value: 4.00 },
  { label: "USA - Washington (6.50%)", value: 6.50 },
];

const initialCatalog = [
  { es: "Mano de obra y remodelación de espacio", en: "Labor and space remodeling" },
  { es: "Materiales y acabados especiales", en: "Special materials and finishes" },
  { es: "Diseño y planos arquitectónicos (M2)", en: "Architectural design and blueprints (SqFt)" },
  { es: "Instalación eléctrica residencial/comercial", en: "Residential/Commercial electrical installation" }
];

const initialBankAccounts = [
  {
    alias: "BBVA Principal",
    nombre: "Juan Pérez / Empresa ABC",
    banco: "BBVA México",
    cuenta: "1234567890",
    clabe: "012180012345678901",
    rfc: "ABC123456XYZ"
  }
];

export default function Home() {
  const router = useRouter();

  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [taxRate, setTaxRate] = useState<number>(16);
  const [discount, setDiscount] = useState<number>(0);
  const [currency] = useState<string>('MXN');

  // DATOS MI EMPRESA
  const [companyName, setCompanyName] = useState<string>("Mi Empresa S.A. de C.V.");
  const [companyTagline, setCompanyTagline] = useState<string>("Servicios Profesionales");
  const [companyEmail, setCompanyEmail] = useState<string>("contacto@miempresa.com");
  const [logo, setLogo] = useState<string | null>(null);

  // DATOS CLIENTE
  const [clientName, setClientName] = useState<string>("Cliente: Juan Pérez / Empresa ABC");
  const [folio, setFolio] = useState<string>("#COT-2026-001");

  // CATÁLOGOS Y MODALES
  const [catalog] = useState(initialCatalog);
  const [selectedCatalogIdx, setSelectedCatalogIdx] = useState<number>(0);
  
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isClientsOpen, setIsClientsOpen] = useState<boolean>(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // HISTORIAL, CLIENTES Y EMPRESAS
  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [companiesList, setCompaniesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // FORMULARIO NUEVO CLIENTE
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', tax_id: '', address: '' });

  // FORMULARIO NUEVA EMPRESA (CON LOGO)
  const [newCompany, setNewCompany] = useState({ company_name: '', tagline: '', email: '', phone: '', address: '', logo_url: '' });

  // BANCOS
  const [bankData, setBankData] = useState(initialBankAccounts[0]);

  const [items, setItems] = useState([
    { description_es: initialCatalog[0].es, description_en: initialCatalog[0].en, qty: 1, price: 0.00 }
  ]);

  const t = translations[lang];

  useEffect(() => {
    fetchClients();
    fetchCompanies();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err: any) {
      alert("Error al cerrar sesión: " + err.message);
    }
  };

  // CLIENTES DE SUPABASE
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('name', { ascending: true });
      if (error) throw error;
      setClientsList(data || []);
    } catch (err: any) {
      console.error("Error al cargar clientes:", err.message);
    }
  };

  const handleSaveClient = async () => {
    if (!newClient.name) return alert("Escribe al menos el nombre del cliente.");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('clients').insert([{ ...newClient, user_id: user?.id }]);
      if (error) throw error;
      
      alert("✅ Cliente guardado con éxito.");
      setNewClient({ name: '', email: '', phone: '', tax_id: '', address: '' });
      fetchClients();
    } catch (err: any) {
      alert("Error al guardar cliente: " + err.message);
    }
  };

  const handleSelectClient = (client: any) => {
    setClientName(`Cliente: ${client.name} ${client.tax_id ? `(${client.tax_id})` : ''}`);
    setIsClientsOpen(false);
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      fetchClients();
    } catch (err: any) {
      alert("Error al eliminar cliente: " + err.message);
    }
  };

  // EMPRESAS DE SUPABASE
  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      setCompaniesList(data || []);

      if (data && data.length > 0) {
        applyCompany(data[0]);
      }
    } catch (err: any) {
      console.error("Error al cargar empresas:", err.message);
    }
  };

  const applyCompany = (company: any) => {
    setCompanyName(company.company_name);
    setCompanyTagline(company.tagline || '');
    setCompanyEmail(company.email || '');
    if (company.logo_url) {
      setLogo(company.logo_url);
    }
  };

  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setNewCompany({ ...newCompany, logo_url: reader.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveCompany = async () => {
    if (!newCompany.company_name) return alert("Escribe el nombre de tu empresa.");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('companies').insert([{ ...newCompany, user_id: user?.id }]);
      if (error) throw error;

      alert("🏢 Empresa registrada con éxito.");
      setNewCompany({ company_name: '', tagline: '', email: '', phone: '', address: '', logo_url: '' });
      fetchCompanies();
    } catch (err: any) {
      alert("Error al guardar empresa: " + err.message);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("¿Eliminar esta empresa?")) return;
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      fetchCompanies();
    } catch (err: any) {
      alert("Error al eliminar empresa: " + err.message);
    }
  };

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
      setItems([...items, { description_es: prod.es, description_en: prod.en, qty: 1, price: 0.00 }]);
    }
  };

  const addBlankItem = () => {
    const defaultDesc = lang === 'es' ? "Nuevo concepto / servicio" : "New item / service";
    setItems([...items, { description_es: defaultDesc, description_en: defaultDesc, qty: 1, price: 0.00 }]);
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

  // CÁLCULOS
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const discountAmount = subtotal * (discount / 100);
  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = subtotalWithDiscount * (taxRate / 100);
  const total = subtotalWithDiscount + taxAmount;

  // GUARDAR EN LA NUBE
  const saveQuoteToCloud = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('quotes').insert([
        {
          user_id: user?.id,
          client_name: clientName,
          total_amount: total,
          items: items,
          tax_rate: taxRate,
          discount: discount,
          folio: folio
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

  // HISTORIAL
  const fetchQuotesHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      setSavedQuotes(data || []);
      setIsHistoryOpen(true);
    } catch (err: any) {
      alert("Error al obtener historial: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuoteFromHistory = (quote: any) => {
    if (quote.client_name) setClientName(quote.client_name);
    if (quote.items && Array.isArray(quote.items)) setItems(quote.items);
    if (quote.tax_rate !== undefined) setTaxRate(quote.tax_rate);
    if (quote.discount !== undefined) setDiscount(quote.discount);
    if (quote.folio) setFolio(quote.folio);

    setIsHistoryOpen(false);
    alert(`📥 Cotización "${quote.client_name}" cargada.`);
  };

  const deleteQuoteFromHistory = async (id: string) => {
    if (!confirm("¿Eliminar esta cotización?")) return;
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (error) throw error;
      setSavedQuotes(savedQuotes.filter(q => q.id !== id));
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const currentDateTime = new Date().toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', {
    dateStyle: 'medium', timeStyle: 'short'
  });

  return (
    <div className="bg-slate-100 min-h-screen p-4 md:p-8 font-sans text-slate-800 print:bg-white print:p-0">
      
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 0; size: auto; }
          body { background-color: white !important; padding: 0 !important; margin: 0 !important; }
          .quote-container { box-shadow: none !important; border: none !important; padding: 1.5cm !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto print:max-w-none print:w-full">
        
        {/* BARRA SUPERIOR */}
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

              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-600 pl-1">{t.lblTax}</label>
                <select 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-1 cursor-pointer outline-none max-w-[130px]"
                >
                  <option value="">-- Seleccionar --</option>
                  {taxPresets.map((preset, idx) => (
                    <option key={idx} value={preset.value}>{preset.label}</option>
                  ))}
                </select>
                <input 
                  type="number" step="0.01" value={taxRate} 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-12 text-center font-bold text-xs bg-white border border-slate-300 rounded p-1 text-indigo-700 outline-none"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>

              <button onClick={() => setIsClientsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow transition">
                {t.btnManageClients}
              </button>

              <button onClick={() => setIsCompaniesOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow transition">
                {t.btnManageCompanies}
              </button>

              <button onClick={fetchQuotesHistory} disabled={isLoading} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow transition">
                {t.btnHistory}
              </button>

              <button onClick={saveQuoteToCloud} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow transition">
                {isSaving ? "Guardando..." : t.btnSaveCloud}
              </button>

              <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow transition">
                {t.btnPrint}
              </button>

              <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow transition border border-rose-700">
                {t.btnLogout}
              </button>
            </div>
          </div>

          {/* DESPLEGABLES DE SELECCIÓN RÁPIDA */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            {companiesList.length > 0 && (
              <div className="flex items-center gap-1.5 bg-purple-50 p-1.5 rounded-lg border border-purple-200">
                <label className="text-xs font-bold text-purple-900">{t.lblSelectCompany}</label>
                <select 
                  onChange={(e) => {
                    const comp = companiesList[Number(e.target.value)];
                    if (comp) applyCompany(comp);
                  }}
                  className="bg-white text-purple-900 font-semibold text-xs rounded border border-purple-300 p-1 outline-none cursor-pointer"
                >
                  {companiesList.map((c, idx) => (
                    <option key={c.id} value={idx}>{c.company_name}</option>
                  ))}
                </select>
              </div>
            )}

            {clientsList.length > 0 && (
              <div className="flex items-center gap-1.5 bg-blue-50 p-1.5 rounded-lg border border-blue-200">
                <label className="text-xs font-bold text-blue-900">{t.lblSelectClient}</label>
                <select 
                  onChange={(e) => {
                    const cli = clientsList[Number(e.target.value)];
                    if (cli) handleSelectClient(cli);
                  }}
                  className="bg-white text-blue-900 font-semibold text-xs rounded border border-blue-300 p-1 outline-none cursor-pointer"
                >
                  <option value="">-- Seleccionar --</option>
                  {clientsList.map((c, idx) => (
                    <option key={c.id} value={idx}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <select 
                value={selectedCatalogIdx}
                onChange={(e) => setSelectedCatalogIdx(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg p-1.5 outline-none font-medium max-w-[200px]"
              >
                {catalog.map((item, idx) => (
                  <option key={idx} value={idx}>{(lang === 'es' ? item.es : item.en)}</option>
                ))}
              </select>
              <button onClick={addItemFromCatalog} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-2.5 py-1.5 rounded-lg text-xs">
                {t.btnCatalog}
              </button>
              <button onClick={addBlankItem} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs border border-indigo-200">
                {t.btnBlank}
              </button>
            </div>
          </div>
        </div>

        {/* DOCUMENTO COTIZACIÓN */}
        <div className="quote-container relative bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {logo && (
            <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none select-none z-0">
              <img src={logo} alt="Watermark" className="w-1/2 max-w-md max-h-[500px] object-contain opacity-10 filter grayscale" />
            </div>
          )}

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-8 gap-6">
              <div className="w-full md:w-1/2">
                <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg h-24 w-52 flex items-center justify-center cursor-pointer overflow-hidden print:border-none print:bg-transparent">
                  {logo ? (
                    <img src={logo} alt="Logo" className="h-full object-contain" />
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 text-center px-2 no-print">{t.logoPrompt}</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer no-print" />
                </div>
              </div>

              <div className="w-full md:w-1/2 text-left md:text-right space-y-1">
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="font-bold text-xl text-slate-900 w-full text-left md:text-right bg-transparent outline-none" />
                <input value={companyTagline} onChange={(e) => setCompanyTagline(e.target.value)} className="text-xs text-slate-500 w-full text-left md:text-right bg-transparent outline-none" />
                <input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="text-xs text-slate-500 w-full text-left md:text-right bg-transparent outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 bg-slate-50/80 p-4 rounded-xl border border-slate-100 print:bg-transparent print:p-0 print:border-none">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">{t.quotedTo}</span>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="font-semibold text-slate-800 w-full bg-transparent outline-none" />
              </div>
              <div className="md:text-right space-y-1 text-xs text-slate-600">
                <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">{t.details}</span>
                <p><strong>{t.folio}</strong> <input value={folio} onChange={(e) => setFolio(e.target.value)} className="w-28 text-right bg-transparent outline-none font-semibold text-slate-800" /></p>
              </div>
            </div>

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
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2">
                        <input 
                          value={lang === 'es' ? (item.description_es || item.description_en) : (item.description_en || item.description_es)} 
                          onChange={(e) => updateItem(idx, 'description', e.target.value)}
                          className="w-full bg-transparent outline-none"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input type="number" value={item.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} className="w-16 text-center bg-transparent outline-none" />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <input type="number" value={item.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} className="w-24 text-right bg-transparent outline-none font-medium" placeholder="0.00" />
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

            <div className="flex justify-end mt-8 border-t border-slate-200 pt-6">
              <div className="w-full md:w-72 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold">${subtotal.toFixed(2)} {currency}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{t.discount}</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)} {currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{t.taxLabel} ({taxRate}%)</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>{t.total}</span>
                  <span className="text-indigo-600">${total.toFixed(2)} {currency}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-slate-50/80 p-5 rounded-xl border border-slate-200 text-xs space-y-3 print:bg-transparent print:border-slate-300">
              <p className="font-bold text-slate-800 text-sm">{t.bankHeader}</p>
              <div className="flex flex-col space-y-2 text-slate-700 max-w-md">
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <strong className="text-slate-900">{t.beneficiary}</strong>
                  <input value={bankData.nombre} onChange={(e) => setBankData({ ...bankData, nombre: e.target.value })} className="bg-transparent outline-none font-medium text-slate-800" />
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <strong className="text-slate-900">{t.account}</strong>
                  <input value={bankData.cuenta} onChange={(e) => setBankData({ ...bankData, cuenta: e.target.value })} className="bg-transparent outline-none font-medium text-slate-800" />
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <strong className="text-slate-900">{t.rfc}</strong>
                  <input value={bankData.rfc} onChange={(e) => setBankData({ ...bankData, rfc: e.target.value })} className="bg-transparent outline-none font-medium text-slate-800" />
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <strong className="text-slate-900">{t.bank}</strong>
                  <input value={bankData.banco} onChange={(e) => setBankData({ ...bankData, banco: e.target.value })} className="bg-transparent outline-none font-medium text-slate-800" />
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <strong className="text-slate-900">{t.clabe}</strong>
                  <input value={bankData.clabe} onChange={(e) => setBankData({ ...bankData, clabe: e.target.value })} className="bg-transparent outline-none font-medium text-slate-800" />
                </div>
              </div>
            </div>

            <div className="hidden print:block mt-4 text-[10px] text-slate-500 text-right font-medium">
              {t.generatedAt} {currentDateTime}
            </div>

          </div>
        </div>
      </div>

      {/* MODAL 1: CLIENTES FRECUENTES */}
      {isClientsOpen && (
        <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">{t.clientModalTitle}</h3>
              <button onClick={() => setIsClientsOpen(false)} className="text-slate-400 font-bold text-xl">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <input placeholder="Nombre / Razón Social *" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="border p-2 rounded bg-white" />
              <input placeholder="RFC / Tax ID" value={newClient.tax_id} onChange={(e) => setNewClient({ ...newClient, tax_id: e.target.value })} className="border p-2 rounded bg-white" />
              <input placeholder="Correo Electrónico" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="border p-2 rounded bg-white" />
              <input placeholder="Teléfono" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} className="border p-2 rounded bg-white" />
              <button onClick={handleSaveClient} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded text-xs transition">
                + Guardar Cliente
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {clientsList.length === 0 ? (
                <p className="text-center text-slate-500 py-6 text-xs">{t.noClients}</p>
              ) : (
                clientsList.map((cli) => (
                  <div key={cli.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border text-xs">
                    <div>
                      <strong className="text-slate-800 text-sm block">{cli.name}</strong>
                      <span className="text-slate-500">{cli.tax_id} {cli.email ? `• ${cli.email}` : ''}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleSelectClient(cli)} className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-semibold">
                        {t.btnSelectClient}
                      </button>
                      <button onClick={() => handleDeleteClient(cli.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end border-t pt-3">
              <button onClick={() => setIsClientsOpen(false)} className="bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-lg">
                {t.btnCloseModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MIS EMPRESAS EMISORAS (CON CARGA DE LOGOTIPO) */}
      {isCompaniesOpen && (
        <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">{t.companyModalTitle}</h3>
              <button onClick={() => setIsCompaniesOpen(false)} className="text-slate-400 font-bold text-xl">✕</button>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 grid grid-cols-2 gap-3 text-xs">
              <input placeholder="Nombre de la Empresa *" value={newCompany.company_name} onChange={(e) => setNewCompany({ ...newCompany, company_name: e.target.value })} className="border p-2 rounded bg-white" />
              <input placeholder="Slogan / Giro" value={newCompany.tagline} onChange={(e) => setNewCompany({ ...newCompany, tagline: e.target.value })} className="border p-2 rounded bg-white" />
              <input placeholder="Correo de Empresa" value={newCompany.email} onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })} className="border p-2 rounded bg-white" />
              <input placeholder="Teléfono" value={newCompany.phone} onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })} className="border p-2 rounded bg-white" />

              {/* CARGA DE LOGO DE EMPRESA */}
              <div className="col-span-2 border-2 border-dashed border-purple-300 bg-white p-3 rounded-lg text-center cursor-pointer relative hover:bg-purple-50 transition">
                {newCompany.logo_url ? (
                  <div className="flex items-center justify-center gap-2">
                    <img src={newCompany.logo_url} alt="Preview Logo" className="h-10 object-contain" />
                    <span className="text-emerald-600 font-bold text-xs">✓ Logotipo listo</span>
                  </div>
                ) : (
                  <span className="text-slate-500 font-medium">📷 Haz clic para seleccionar el Logotipo de esta empresa</span>
                )}
                <input type="file" accept="image/*" onChange={handleCompanyLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <button onClick={handleSaveCompany} className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded text-xs transition">
                + Guardar Mi Empresa
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {companiesList.length === 0 ? (
                <p className="text-center text-slate-500 py-6 text-xs">{t.noCompanies}</p>
              ) : (
                companiesList.map((comp) => (
                  <div key={comp.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border text-xs">
                    <div className="flex items-center gap-3">
                      {comp.logo_url && (
                        <img src={comp.logo_url} alt="Logo" className="w-10 h-10 object-contain bg-white rounded border p-1" />
                      )}
                      <div>
                        <strong className="text-slate-800 text-sm block">{comp.company_name}</strong>
                        <span className="text-slate-500">{comp.tagline} {comp.email ? `• ${comp.email}` : ''}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { applyCompany(comp); setIsCompaniesOpen(false); }} className="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded text-xs font-semibold">
                        {t.btnSelectCompany}
                      </button>
                      <button onClick={() => handleDeleteCompany(comp.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end border-t pt-3">
              <button onClick={() => setIsCompaniesOpen(false)} className="bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-lg">
                {t.btnCloseModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: HISTORIAL COTIZACIONES */}
      {isHistoryOpen && (
        <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">{t.historyModalTitle}</h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 font-bold text-xl">✕</button>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {savedQuotes.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">{t.noHistory}</p>
              ) : (
                savedQuotes.map((q) => (
                  <div key={q.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition gap-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{q.client_name || "Cliente sin nombre"}</h4>
                      <div className="flex gap-4 text-xs text-slate-500 mt-1">
                        <span><strong>Folio:</strong> {q.folio || "S/F"}</span>
                        <span><strong>Monto:</strong> ${q.total_amount ? q.total_amount.toFixed(2) : '0.00'}</span>
                        <span><strong>Fecha:</strong> {new Date(q.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button onClick={() => loadQuoteFromHistory(q)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition">
                        {t.btnLoadQuote}
                      </button>
                      <button onClick={() => deleteQuoteFromHistory(q.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                        {t.btnDeleteQuote}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end border-t pt-3">
              <button onClick={() => setIsHistoryOpen(false)} className="bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2 rounded-lg">
                {t.btnCloseModal}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}