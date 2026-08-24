'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// DICCIONARIO DE TRADUCCIONES
const translations: Record<string, any> = {
  es: {
    appTitle: "Cotizador Express Pro",
    welcomeUser: "Bienvenido,",
    lblLang: "Idioma",
    lblTax: "Impuesto",
    catalogLabel: "Catálogo Rápido",
    btnCatalog: "Agregar",
    btnManageCatalog: "Conceptos",
    btnManageBanks: "Cuentas Bancarias",
    btnHistory: "Mis Cotizaciones",
    btnManageClients: "Clientes",
    btnManageCompanies: "Mis Empresas",
    btnSettings: "Ajustes",
    btnSubscribePro: "Plan Premium ($99/mes)",
    planProActive: "✅ Plan Premium Activo",
    expiresOn: "Vence el:",
    paymentTrustNote: "Pago único por 30 días. Sin cargos automáticos ni renovaciones forzosas.",
    lblSelectBank: "Cuenta Bancaria",
    lblSelectClient: "Cliente Frecuente",
    lblSelectCompany: "Emitir con",
    btnBlank: "Blanco",
    btnPrint: "Guardar / PDF",
    btnSaveCloud: "Guardar en Nube",
    btnWhatsApp: "Enviar por WhatsApp",
    btnLogout: "Cerrar Sesión",
    btnDeleteAccount: "🗑️ Eliminar mi cuenta",
    logoPrompt: "Haz clic para subir tu Logo o cárgalo desde 'Mis Empresas'",
    quotedTo: "COTIZACION",
    folio: "Folio:",
    date: "Fecha:",
    validity: "Vigencia:",
    delivery: "Entrega:",
    thConcept: "Concepto",
    thUnit: "Unidad",
    thQty: "Cant.",
    thPrice: "P. Unitario",
    thAmount: "Importe",
    bankHeader: "Datos Bancarios para Pago:",
    beneficiary: "Nombre / Beneficiario:",
    bank: "Banco:",
    account: "Cuenta:",
    clabe: "CLABE:",
    rfc: "RFC:",
    subtotal: "Subtotal:",
    discount: "Descuento (%):",
    taxLabel: "Impuesto:",
    total: "Total Neto:",
    advancePercent: "Anticipo requerido",
    advanceNote: "Nota de Anticipo:",
    advanceAmount: "Importe de Anticipo a Pagar:",
    modalTitle: "Administrar Conceptos Frecuentes",
    modalAddNew: "Agregar Nuevo Concepto (Máx. 10 personalizados):",
    btnSaveCatItem: "Guardar Concepto",
    btnCloseModal: "Cerrar",
    generatedAt: "Fecha y hora de emisión:",
    bankModalTitle: "Administrar Cuentas Bancarias",
    historyModalTitle: "Historial General de Cotizaciones Guardadas",
    clientHistoryTitle: "Historial de Cotizaciones del Cliente",
    clientModalTitle: "Directorio de Clientes Frecuentes",
    companyModalTitle: "Administrar Mis Empresas",
    settingsModalTitle: "Ajustes y Personalización del Documento",
    showBankToggle: "Mostrar datos bancarios en la cotización y PDF",
    noHistory: "Aún no tienes cotizaciones guardadas en la nube.",
    noClientHistory: "Este cliente aún no tiene cotizaciones guardadas.",
    noClients: "No tienes clientes frecuentes registrados.",
    noCompanies: "No tienes empresas registradas.",
    btnLoadQuote: "Cargar",
    btnDeleteQuote: "Eliminar",
    btnSelectClient: "Usar Cliente",
    btnClientHistory: "Historial",
    btnSelectCompany: "Cargar Empresa",
    footerTerms: "Términos y Condiciones",
    footerPrivacy: "Aviso de Privacidad",
    footerLegalNotice: "Cotizador Express Pro es un software de elaboración de documentos comerciales. Las cotizaciones generadas no constituyen una factura o comprobante fiscal."
  },
  en: {
    appTitle: "Express Quote Pro",
    welcomeUser: "Welcome,",
    lblLang: "Language",
    lblTax: "Tax Rate",
    catalogLabel: "Quick Catalog",
    btnCatalog: "Add Item",
    btnManageCatalog: "Concepts",
    btnManageBanks: "Bank Accounts",
    btnHistory: "Saved Quotes",
    btnManageClients: "Clients",
    btnManageCompanies: "My Companies",
    btnSettings: "Settings",
    btnSubscribePro: "Premium Plan ($99/mo)",
    planProActive: "✅ Premium Plan Active",
    expiresOn: "Expires on:",
    paymentTrustNote: "One-time payment for 30 days. No automatic charges or forced renewals.",
    lblSelectBank: "Bank Account",
    lblSelectClient: "Saved Client",
    lblSelectCompany: "Issue As",
    btnBlank: "Blank Item",
    btnPrint: "Save / PDF",
    btnSaveCloud: "Save to Cloud",
    btnWhatsApp: "Send via WhatsApp",
    btnLogout: "Log Out",
    btnDeleteAccount: "🗑️ Delete my account",
    logoPrompt: "Click to upload Logo or load it from 'My Companies'",
    quotedTo: "QUOTATION",
    folio: "Quote #:",
    date: "Date:",
    validity: "Validity:",
    delivery: "Delivery:",
    thConcept: "Concept",
    thUnit: "Unit",
    thQty: "Qty",
    thPrice: "Unit Price",
    thAmount: "Amount",
    bankHeader: "Wire / Banking Details:",
    beneficiary: "Beneficiary Name:",
    bank: "Bank:",
    account: "Account #:",
    clabe: "Routing / IBAN / CLABE:",
    rfc: "Tax ID / RFC:",
    subtotal: "Subtotal:",
    discount: "Discount (%):",
    taxLabel: "Tax Rate:",
    total: "Net Total:",
    advancePercent: "Required Down Payment",
    advanceNote: "Down Payment Note:",
    advanceAmount: "Down Payment Amount Due:",
    modalTitle: "Manage Frequent Concepts",
    modalAddNew: "Add New Concept (Max 10 custom):",
    btnSaveCatItem: "Save Concept",
    btnCloseModal: "Close",
    generatedAt: "Date and time of issue:",
    bankModalTitle: "Manage Bank Accounts",
    historyModalTitle: "Saved Quotes History",
    clientHistoryTitle: "Client's Quote History",
    clientModalTitle: "Frequent Clients Directory",
    companyModalTitle: "Manage My Companies",
    settingsModalTitle: "Settings & Document Customization",
    showBankToggle: "Show banking details on quotation & PDF",
    noHistory: "You don't have any saved quotes in the cloud yet.",
    noClientHistory: "No quotes found for this client.",
    noClients: "No saved clients found.",
    noCompanies: "No companies registered.",
    btnLoadQuote: "Load",
    btnDeleteQuote: "Delete",
    btnSelectClient: "Use Client",
    btnClientHistory: "History",
    btnSelectCompany: "Load Company",
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    footerLegalNotice: "Express Quote Pro is commercial document creation software. Generated quotes do not constitute an official tax invoice."
  }
};

const taxPresets = [
  { label: "IVA México (16%)", value: 16 },
  { label: "IVA Fronterizo MX (8%)", value: 8 },
  { label: "Sin Impuesto (0%)", value: 0 },
  { label: "USA - California (7.25%)", value: 7.25 },
  { label: "USA - Texas (6.25%)", value: 6.25 },
  { label: "USA - Florida (6.00%)", value: 6 },
  { label: "USA - New York (4.00%)", value: 4 },
  { label: "USA - Washington (6.50%)", value: 6.5 },
];

const unitOptions = [
  { label: "pieza", value: "pieza" },
  { label: "metro", value: "metro" },
  { label: "kilo", value: "kilo" },
  { label: "tonelada", value: "tonelada" },
  { label: "m2", value: "m2" },
  { label: "m3", value: "m3" },
  { label: "servicio", value: "servicio" },
  { label: "litro", value: "litro" },
];

const initialCatalog = [
  { es: "Mano de obra y remodelación de espacio", en: "Labor and space remodeling" },
  { es: "Materiales y acabados especiales", en: "Special materials and finishes" },
  { es: "Diseño y planos arquitectónicos (M2)", en: "Architectural design and blueprints (SqFt)" },
  { es: "Instalación eléctrica residencial/comercial", en: "Residential/Commercial electrical installation" },
  { es: "Mantenimiento preventivo e inspección técnica", en: "Preventive maintenance and technical inspection" },
  { es: "Servicios de pintura e impermeabilización", en: "Painting and waterproofing services" },
  { es: "Consultoría e ingeniería de proyecto", en: "Consulting and project engineering" },
  { es: "Supervisión y administración de obra", en: "Construction supervision and management" },
  { es: "Instalación hidrosanitaria y plomería general", en: "Plumbing and hydrosanitary installation" },
  { es: "Suministro e instalación de aire acondicionado", en: "HVAC / Air conditioning supply and installation" },
  { es: "Fabricación e instalación de carpintería/aluminio", en: "Carpentry and aluminum fabrication/installation" },
  { es: "Demolición y retiro de escombro", en: "Demolition and debris removal" },
  { es: "Desarrollo de software y sistemas a medida", en: "Custom software and systems development" },
  { es: "Servicios de diseño gráfico y branding", en: "Graphic design and branding services" },
  { es: "Estrategia de marketing digital y publicidad", en: "Digital marketing and advertising strategy" }
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
  const [userName, setUserName] = useState<string>('Usuario');
  const [taxRate, setTaxRate] = useState<number>(16);
  const [discount, setDiscount] = useState<number | string>(0);
  const [currency] = useState<string>('MXN');

  const [legalAccepted, setLegalAccepted] = useState<boolean>(false);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(true);

  const [advanceRate, setAdvanceRate] = useState<number | string>(50);
  const [advanceCustomNote, setAdvanceCustomNote] = useState<string>(
    "Nota: Al aceptar la cotización se requiere el pago de un anticipo para iniciar los trabajos."
  );

  const [templateStyle, setTemplateStyle] = useState<'classic' | 'compact'>('classic');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSharedView, setIsSharedView] = useState<boolean>(false);

  const [companyName, setCompanyName] = useState<string>("Mi Empresa S.A. de C.V.");
  const [companyTagline, setCompanyTagline] = useState<string>("Servicios Profesionales");
  const [companyEmail, setCompanyEmail] = useState<string>("contacto@miempresa.com");
  const [companyTaxId, setCompanyTaxId] = useState<string>("");
  const [companyPhone, setCompanyPhone] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [companyPostalCode, setCompanyPostalCode] = useState<string>("");
  const [companyCity, setCompanyCity] = useState<string>("");
  const [companyState, setCompanyState] = useState<string>("");
  const [logo, setLogo] = useState<string | null>(null);

  const [clientName, setClientName] = useState<string>("Cliente: Juan Pérez / Empresa ABC");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [folio, setFolio] = useState<string>("#COT-2026-001");

  const [customCatalog, setCustomCatalog] = useState<{ es: string, en: string }[]>([]);
  const [newCustomConcept, setNewCustomConcept] = useState({ es: '', en: '' });
  const [isConceptsModalOpen, setIsConceptsModalOpen] = useState<boolean>(false);
  const [selectedCatalogIdx, setSelectedCatalogIdx] = useState<number>(0);

  const fullCatalog = [...initialCatalog, ...customCatalog];

  const [bankAccountsList, setBankAccountsList] = useState(initialBankAccounts);
  const [bankData, setBankData] = useState(initialBankAccounts[0]);
  const [isBanksModalOpen, setIsBanksModalOpen] = useState<boolean>(false);
  
  const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
  const [bankForm, setBankForm] = useState({
    alias: '', nombre: '', banco: '', cuenta: '', clabe: '', rfc: ''
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isClientsOpen, setIsClientsOpen] = useState<boolean>(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState<boolean>(false);
  const [isClientHistoryOpen, setIsClientHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<any>(null);
  const [clientQuotesList, setClientQuotesList] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [companiesList, setCompaniesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', tax_id: '', address: '' });
  const [clientCountryCode, setClientCountryCode] = useState<string>('+52');
  const [clientLocalPhone, setClientLocalPhone] = useState<string>('');

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({ 
    company_name: '', 
    tagline: '', 
    email: '', 
    phone: '', 
    tax_id: '', 
    address: '', 
    postal_code: '',
    city: '',
    state: '',
    logo_url: '' 
  });

  const [items, setItems] = useState<Array<{ description_es: string; description_en: string; unit: string; qty: number | string; price: number | string }>>([
    { description_es: initialCatalog[0].es, description_en: initialCatalog[0].en, unit: 'pieza', qty: 1, price: 0.00 }
  ]);

  const t = translations[lang];

  useEffect(() => {
    fetchUserProfile();
    fetchClients();
    fetchCompanies();

    const checkSharedQuote = () => {
      const params = new URLSearchParams(window.location.search);
      const quoteId = params.get('quote');
      if (quoteId) {
        setIsSharedView(true);
        fetchQuoteById(quoteId);
      }
    };

    checkSharedQuote();
    const timer = setTimeout(checkSharedQuote, 300);
    return () => clearTimeout(timer);
  }, []);

  const fetchQuoteById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        if (data.client_name) setClientName(data.client_name);
        if (data.items && Array.isArray(data.items)) setItems(data.items);
        if (data.tax_rate !== undefined) setTaxRate(data.tax_rate);
        if (data.discount !== undefined) setDiscount(data.discount);
        if (data.folio) setFolio(data.folio);
      }
    } catch (err: any) {
      console.error("Error al cargar la cotización compartida:", err.message);
      alert("No se pudo cargar la cotización o el enlace ha expirado.");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, full_name, subscription_end_date')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        let status = data.subscription_status || 'free';
        if (data.subscription_end_date) {
          setSubscriptionEndDate(data.subscription_end_date);
        }

        if (status === 'active' && data.subscription_end_date) {
          const cutoffDate = new Date(data.subscription_end_date);
          const now = new Date();

          if (now > cutoffDate) {
            await supabase
              .from('profiles')
              .update({ subscription_status: 'free' })
              .eq('id', user.id);
            
            status = 'free';
          }
        }

        setSubscriptionStatus(status);
        if (data.full_name) setUserName(data.full_name);
        else if (user.user_metadata?.full_name) setUserName(user.user_metadata.full_name);
        else if (user.email) setUserName(user.email.split('@')[0]);
      } else {
        if (user.user_metadata?.full_name) setUserName(user.user_metadata.full_name);
        else if (user.email) setUserName(user.email.split('@')[0]);
      }
    } catch (err) {
      console.error("Excepción en fetchUserProfile:", err);
    }
  };

  const logUsage = async () => {
    if (subscriptionStatus === 'active') return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('quotes').insert([{ user_id: user.id, client_name: "Consumo PDF/WA", total_amount: 0, folio: "AUTO-" + Date.now() }]);
  };

  const checkFreePlanUsageLimit = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (!profileError && profile?.subscription_status === 'active') {
        return true;
      }

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { count, error } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', firstDayOfMonth);

      if (!error && count !== null && count >= 3) {
        alert("⚠️ Has alcanzado el límite de 3 cotizaciones mensuales del Plan Gratuito.\n\nSuscríbete al Plan Premium para generar, guardar, descargar y enviar cotizaciones ilimitadas.");
        return false;
      }
    } catch (err) {
      console.error("Error al verificar límite de uso mensual:", err);
    }
    return true;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err: any) {
      alert("Error al cerrar sesión: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "⚠️ ¿Estás completamente seguro de eliminar tu cuenta?\n\nEsta acción borrará permanentemente tu usuario, cotizaciones, clientes, empresas registradas y no se podrá deshacer."
    );

    if (!confirmation) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("No hay sesión activa.");

      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la cuenta en el servidor.');
      }

      await supabase.auth.signOut();
      alert("Tu cuenta y todos tus datos han sido eliminados permanentemente.");
      router.push('/login');
    } catch (err: any) {
      alert("Ocurrió un error al intentar eliminar la cuenta: " + err.message);
    }
  };

  const handlePrintPdf = async () => {
    if (!isSharedView) {
      const canProceed = await checkFreePlanUsageLimit();
      if (!canProceed) return;
      await logUsage();
    }
    window.print();
  };

  const handleCheckoutPro = async () => {
    if (!legalAccepted) {
      alert("Debes aceptar los Términos y Condiciones y el Aviso de Privacidad para continuar.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Suscripción Plan Premium - Cotizador Express Pro',
          price: 99,
          quantity: 1,
          userId: user?.id,
          userEmail: user?.email || 'cliente@cotizador.com'
        })
      });

      if (!response.ok) {
        throw new Error('El servidor de pagos no respondió correctamente.');
      }

      const data = await response.json();

      if (data.init_point) {
        window.open(data.init_point, '_blank');
      } else {
        alert("Error al iniciar el pago: " + (data.error || "Intenta más tarde"));
      }
    } catch (err: any) {
      alert("Error de conexión con la pasarela de pagos: " + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSaveBankAccount = () => {
    if (!bankForm.alias || !bankForm.banco || !bankForm.cuenta) {
      return alert("Por favor completa al menos el Alias, Banco y Número de Cuenta.");
    }

    let updatedAccounts = [...bankAccountsList];

    if (editingBankIndex !== null) {
      updatedAccounts[editingBankIndex] = bankForm;
      if (bankData === bankAccountsList[editingBankIndex]) {
        setBankData(bankForm);
      }
      alert("Cuenta bancaria actualizada.");
    } else {
      updatedAccounts.push(bankForm);
      setBankData(bankForm);
      alert("Cuenta bancaria guardada y seleccionada.");
    }

    setBankAccountsList(updatedAccounts);
    resetBankForm();
  };

  const handleEditBankClick = (index: number) => {
    setEditingBankIndex(index);
    setBankForm(bankAccountsList[index]);
  };

  const resetBankForm = () => {
    setEditingBankIndex(null);
    setBankForm({ alias: '', nombre: '', banco: '', cuenta: '', clabe: '', rfc: '' });
  };

  const handleRemoveBankAccount = (index: number) => {
    if (bankAccountsList.length <= 1) {
      return alert("Debes mantener al menos una cuenta bancaria.");
    }
    const updated = bankAccountsList.filter((_, i) => i !== index);
    setBankAccountsList(updated);
    setBankData(updated[0]);
    if (editingBankIndex === index) {
      resetBankForm();
    }
  };

  const handleAddCustomConcept = () => {
    if (!newCustomConcept.es.trim()) {
      return alert("Escribe al menos el nombre del concepto en español.");
    }

    if (customCatalog.length >= 10) {
      return alert("Has alcanzado el límite máximo de 10 conceptos personalizados.");
    }

    const newItem = {
      es: newCustomConcept.es.trim(),
      en: newCustomConcept.en.trim() || newCustomConcept.es.trim()
    };

    setCustomCatalog([...customCatalog, newItem]);
    setNewCustomConcept({ es: '', en: '' });
    alert("Concepto guardado e integrado a la lista rápida.");
  };

  const handleRemoveCustomConcept = (index: number) => {
    setCustomCatalog(customCatalog.filter((_, i) => i !== index));
  };

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

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
      if (!user) return alert("Debes iniciar sesión para guardar clientes.");

      const fullPhone = clientLocalPhone.trim() ? `${clientCountryCode}${clientLocalPhone.trim()}` : '';

      const { error } = await supabase.from('clients').insert([{ 
        name: newClient.name,
        email: newClient.email,
        tax_id: newClient.tax_id,
        address: newClient.address,
        phone: fullPhone,
        user_id: user.id 
      }]);
      if (error) throw error;
      
      alert("Cliente guardado con éxito.");
      setNewClient({ name: '', email: '', phone: '', tax_id: '', address: '' });
      setClientCountryCode('+52');
      setClientLocalPhone('');
      fetchClients();
    } catch (err: any) {
      alert("Error al guardar cliente: " + err.message);
    }
  };

  const handleSelectClient = (client: any) => {
    setClientName(`Cliente: ${client.name} ${client.tax_id ? `(${client.tax_id})` : ''}`);
    if (client.phone) setClientPhone(client.phone);
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

  const handleViewClientHistory = async (client: any) => {
    setSelectedClientForHistory(client);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Debes iniciar sesión para consultar el historial.");

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .ilike('client_name', `%${client.name}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClientQuotesList(data || []);
      setIsClientHistoryOpen(true);
    } catch (err: any) {
      alert("Error al cargar historial del cliente: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCompaniesList(data || []);

      if (data && data.length > 0 && !editingCompanyId) {
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
    setCompanyTaxId(company.tax_id || '');
    setCompanyPhone(company.phone || '');
    setCompanyAddress(company.address || '');
    setCompanyPostalCode(company.postal_code || '');
    setCompanyCity(company.city || '');
    setCompanyState(company.state || '');
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
      if (!user) return alert("Debes iniciar sesión para registrar una empresa.");

      const payload: any = {
        company_name: newCompany.company_name,
        tagline: newCompany.tagline,
        email: newCompany.email,
        phone: newCompany.phone,
        tax_id: newCompany.tax_id,
        address: newCompany.address,
        postal_code: newCompany.postal_code,
        city: newCompany.city,
        state: newCompany.state,
        logo_url: newCompany.logo_url
      };

      if (editingCompanyId) {
        const { error } = await supabase
          .from('companies')
          .update(payload)
          .eq('id', editingCompanyId)
          .eq('user_id', user.id);

        if (error) throw error;
        alert("Empresa actualizada con éxito.");
      } else {
        const { error } = await supabase.from('companies').insert([{ ...payload, user_id: user.id }]);
        if (error) throw error;
        alert("Empresa registrada con éxito.");
      }

      resetCompanyForm();
      fetchCompanies();
    } catch (err: any) {
      alert("Error al guardar empresa: " + err.message);
    }
  };

  const handleEditCompanyClick = (company: any) => {
    setEditingCompanyId(company.id);
    setNewCompany({
      company_name: company.company_name || '',
      tagline: company.tagline || '',
      email: company.email || '',
      phone: company.phone || '',
      tax_id: company.tax_id || '',
      address: company.address || '',
      postal_code: company.postal_code || '',
      city: company.city || '',
      state: company.state || '',
      logo_url: company.logo_url || ''
    });
  };

  const resetCompanyForm = () => {
    setEditingCompanyId(null);
    setNewCompany({ company_name: '', tagline: '', email: '', phone: '', tax_id: '', address: '', postal_code: '', city: '', state: '', logo_url: '' });
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("¿Eliminar esta empresa?")) return;
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      if (editingCompanyId === id) resetCompanyForm();
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
    const prod = fullCatalog[selectedCatalogIdx];
    if (prod) {
      setItems([...items, { description_es: prod.es, description_en: prod.en, unit: 'pieza', qty: 1, price: 0.00 }]);
    }
  };

  const addBlankItem = () => {
    setItems([...items, { description_es: "", description_en: "", unit: 'pieza', qty: 1, price: 0.00 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'qty') {
      newItems[index].qty = value === '' ? '' : (parseFloat(value) || 0);
    } else if (field === 'price') {
      newItems[index].price = value === '' ? '' : (parseFloat(value) || 0);
    } else if (field === 'unit') {
      newItems[index].unit = value;
    } else {
      newItems[index].description_es = value;
      newItems[index].description_en = value;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const numDiscount = typeof discount === 'number' ? discount : parseFloat(discount) || 0;
  const numAdvance = typeof advanceRate === 'number' ? advanceRate : parseFloat(advanceRate) || 0;

  const subtotal = items.reduce((acc, item) => {
    const q = typeof item.qty === 'number' ? item.qty : parseFloat(item.qty) || 0;
    const p = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return acc + (q * p);
  }, 0);
  const discountAmount = subtotal * (numDiscount / 100);
  const subtotalWithDiscount = subtotal - discountAmount;
  const taxAmount = subtotalWithDiscount * (taxRate / 100);
  const total = subtotalWithDiscount + taxAmount;
  const advanceAmount = total * (numAdvance / 100);

  const sendPdfWhatsApp = async () => {
    const canProceed = await checkFreePlanUsageLimit();
    if (!canProceed) return;
    await logUsage();

    setIsGeneratingPdf(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsGeneratingPdf(false);
        return alert("Debes iniciar sesión para enviar cotizaciones.");
      }

      const { data: savedData, error } = await supabase.from('quotes').insert([
        {
          user_id: user.id,
          client_name: clientName,
          total_amount: total,
          items: items,
          tax_rate: taxRate,
          discount: numDiscount,
          folio: folio
        }
      ]).select('id').single();

      if (error) {
        throw new Error(error.message);
      }

      if (!savedData || !savedData.id) {
        throw new Error("No se pudo generar el identificador único de la cotización.");
      }

      const quoteId = savedData.id;
      const shareableLink = `${window.location.origin}/?quote=${quoteId}`;

      // Alerta de depuración para confirmar el enlace generado en dispositivos móviles
      alert("Enlace generado con éxito:\n" + shareableLink);

      const cleanPhone = clientPhone.replace(/\D/g, '');
      let text = `COTIZACIÓN DE SERVICIOS\n`;
      text += `Empresa: ${companyName}\n`;
      text += `Cliente: ${clientName}\n`;
      text += `Folio: ${folio}\n`;
      text += `Total Neto: $${total.toFixed(2)} ${currency}\n`;
      if (numAdvance > 0) {
        text += `Anticipo (${numAdvance}%): $${advanceAmount.toFixed(2)} ${currency}\n`;
      }
      text += `\n`;
      text += `Puedes ver y descargar la cotización en formato oficial aquí:\n${shareableLink}\n\n`;
      text += `¡Quedamos a tus órdenes!`;

      const encodedText = encodeURIComponent(text);
      const waUrl = cleanPhone 
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
        : `https://api.whatsapp.com/send?text=${encodedText}`;

      window.open(waUrl, '_blank');
    } catch (err: any) {
      alert("Error al preparar el envío por WhatsApp: " + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const saveQuoteToCloud = async () => {
    const canProceed = await checkFreePlanUsageLimit();
    if (!canProceed) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Debes iniciar sesión para guardar cotizaciones.");

      const { error } = await supabase.from('quotes').insert([
        {
          user_id: user.id,
          client_name: clientName,
          total_amount: total,
          items: items,
          tax_rate: taxRate,
          discount: numDiscount,
          folio: folio
        }
      ]);

      if (error) throw error;
      alert("¡Cotización guardada exitosamente en la nube!");
    } catch (err: any) {
      alert("Error al guardar en la nube: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchQuotesHistory = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Debes iniciar sesión para consultar el historial.");

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
    setIsClientHistoryOpen(false);
    setIsClientsOpen(false);
    alert(`Cotización "${quote.client_name}" cargada.`);
  };

  const deleteQuoteFromHistory = async (id: string) => {
    if (!confirm("¿Eliminar esta cotización?")) return;
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (error) throw error;
      setSavedQuotes(savedQuotes.filter(q => q.id !== id));
      setClientQuotesList(clientQuotesList.filter(q => q.id !== id));
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const currentDateTime = new Date().toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', {
    dateStyle: 'medium', timeStyle: 'short'
  });

  const cityStateText = [companyCity, companyState].filter(Boolean).join(', ');

  const menuBtnClass = "w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-3 rounded-xl text-sm transition-all duration-200 text-center shadow-md border border-slate-500/50 active:scale-[0.98]";

  const getContainerStyle = () => {
    if (templateStyle === 'compact') {
      return "quote-container pdf-theme-compact relative bg-white p-3 md:p-6 rounded-xl shadow-lg border border-slate-300 overflow-hidden text-xs w-full max-w-3xl mx-auto my-6";
    }
    return "quote-container pdf-theme-classic relative bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-3xl mx-auto my-6";
  };

  const getHeaderTableStyle = () => {
    if (templateStyle === 'compact') {
      return "grid grid-cols-12 border-b-2 border-slate-800 text-[11px] font-black text-slate-800 uppercase pb-1 mb-1";
    }
    return "grid grid-cols-12 border-b-2 border-slate-300 text-xs font-bold text-slate-600 uppercase pb-2";
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800 print:bg-white print:p-0 flex flex-col md:flex-row pt-14 md:pt-0">
      
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 0; size: auto; }
          body { background-color: white !important; padding: 0 !important; margin: 0 !important; }
          .quote-container { box-shadow: none !important; border: none !important; padding: 0.2cm !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
        }

        .pdf-theme-compact .client-box-compact {
          background-color: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
        }
        .pdf-theme-classic .client-box-classic {
          background-color: #f8fafc !important;
          border: 1px solid #f1f5f9 !important;
        }
      `}</style>

      {/* BARRA SUPERIOR FIJA MÓVIL (Oculta si es vista de cliente compartido) */}
      {!isSharedView && (
        <div className="no-print md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white px-4 py-3 flex justify-between items-center shadow-lg z-50 h-14">
          <h1 className="font-bold text-base tracking-tight">{t.appTitle}</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 active:bg-slate-700"
          >
            <span>{isMobileMenuOpen ? "✕" : "☰"}</span>
            <span>{isMobileMenuOpen ? "Cerrar" : "Menú"}</span>
          </button>
        </div>
      )}

      {/* MENÚ LATERAL (Oculto si es vista de cliente compartido) */}
      {!isSharedView && (
        <aside className={`no-print w-full md:w-64 bg-slate-900 text-slate-100 p-4 shrink-0 flex-col justify-between border-r border-slate-800 shadow-xl z-40 
          ${isMobileMenuOpen ? 'fixed inset-x-0 top-14 bottom-0 flex overflow-y-auto' : 'hidden md:flex'}`}>
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800/80 block text-center space-y-1">
              <h1 className="text-xl font-bold text-white tracking-tight">{t.appTitle}</h1>
              <p className="text-xs text-amber-400 font-semibold">
                {t.welcomeUser} <span className="text-white underline">{userName}</span>
              </p>
            </div>

            {subscriptionStatus === 'active' ? (
              <div className="w-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold px-4 py-3 rounded-xl text-sm text-center shadow-md space-y-1">
                <div>{t.planProActive}</div>
                {subscriptionEndDate && (
                  <div className="text-[11px] font-normal text-emerald-200/90">
                    {t.expiresOn} {new Date(subscriptionEndDate).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'medium' })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-300 px-1 select-none">
                  <input 
                    type="checkbox" 
                    checked={legalAccepted} 
                    onChange={(e) => setLegalAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0" 
                  />
                  <span className="leading-tight">
                    Acepto los{' '}
                    <Link href="/terminos" target="_blank" className="underline hover:text-white font-semibold text-amber-400">
                      Términos
                    </Link>{' '}
                    y el{' '}
                    <Link href="/privacidad" target="_blank" className="underline hover:text-white font-semibold text-amber-400">
                      Aviso de Privacidad
                    </Link>.
                  </span>
                </label>

                <button 
                  onClick={handleCheckoutPro} 
                  disabled={isProcessingPayment || !legalAccepted} 
                  className={`w-full font-extrabold px-4 py-3 rounded-xl text-sm transition-all duration-200 text-center shadow-lg border text-slate-900 ${
                    legalAccepted && !isProcessingPayment
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-amber-300 active:scale-[0.98] animate-pulse'
                      : 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isProcessingPayment ? "Conectando..." : t.btnSubscribePro}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-tight px-1 pt-0.5">
                  {t.paymentTrustNote}
                </p>
              </div>
            )}

            <nav className="flex flex-col gap-2.5">
              <button onClick={() => { setIsClientsOpen(true); setIsMobileMenuOpen(false); }} className={menuBtnClass}>{t.btnManageClients}</button>
              <button onClick={() => { setIsConceptsModalOpen(true); setIsMobileMenuOpen(false); }} className={menuBtnClass}>{t.btnManageCatalog}</button>
              <button onClick={() => { setIsCompaniesOpen(true); setIsMobileMenuOpen(false); }} className={menuBtnClass}>{t.btnManageCompanies}</button>
              <button onClick={() => { setIsBanksModalOpen(true); setIsMobileMenuOpen(false); }} className={menuBtnClass}>{t.btnManageBanks}</button>
              <button onClick={() => { fetchQuotesHistory(); setIsMobileMenuOpen(false); }} disabled={isLoading} className={menuBtnClass}>{t.btnHistory}</button>
              <button onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }} className={menuBtnClass}>{t.btnSettings}</button>
              <button onClick={() => { setIsMobileMenuOpen(false); handlePrintPdf(); }} className={menuBtnClass}>{t.btnPrint}</button>
              <button onClick={() => { setIsMobileMenuOpen(false); saveQuoteToCloud(); }} disabled={isSaving} className={menuBtnClass}>{isSaving ? "Guardando..." : t.btnSaveCloud}</button>
              <button onClick={() => { setIsMobileMenuOpen(false); sendPdfWhatsApp(); }} disabled={isGeneratingPdf} className={menuBtnClass}>{isGeneratingPdf ? "Generando Enlace..." : t.btnWhatsApp}</button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 pb-6 md:pb-0 space-y-2">
            <button onClick={handleLogout} className="w-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 shadow-md text-center border border-slate-700">{t.btnLogout}</button>
            <button onClick={handleDeleteAccount} className="w-full flex items-center justify-center bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 shadow-md text-center border border-rose-900/50">{t.btnDeleteAccount}</button>
          </div>
        </aside>
      )}

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-3 md:p-8 overflow-x-hidden flex flex-col justify-between min-h-screen">
        <div className="max-w-5xl mx-auto print:max-w-none print:w-full space-y-6 w-full">
          
          {/* BARRA SUPERIOR DE SELECTORES (Oculta si es vista compartida del cliente) */}
          {!isSharedView && (
            <div className="no-print bg-white p-4 md:p-5 rounded-xl shadow-md border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <div className="flex flex-col justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lblLang}</label>
                  <select value={lang} onChange={(e) => setLang(e.target.value as 'es' | 'en')} className="w-full bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-2 cursor-pointer outline-none">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex flex-col justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lblTax}</label>
                  <div className="flex gap-1.5 items-center">
                    <select onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-full bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-2 cursor-pointer outline-none">
                      <option value="">-- Seleccionar --</option>
                      {taxPresets.map((preset, idx) => (
                        <option key={idx} value={preset.value}>{preset.label}</option>
                      ))}
                    </select>
                    <div className="flex items-center bg-white border border-slate-300 rounded px-1.5 py-1">
                      <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-10 text-center font-bold text-xs text-indigo-700 outline-none" />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lblSelectCompany}</label>
                  <select onChange={(e) => { const comp = companiesList[Number(e.target.value)]; if (comp) applyCompany(comp); }} disabled={companiesList.length === 0} className="w-full bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-2 outline-none cursor-pointer">
                    {companiesList.length === 0 ? <option value="">Sin empresas</option> : companiesList.map((c, idx) => <option key={c.id} value={idx}>{c.company_name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lblSelectClient}</label>
                  <select onChange={(e) => { const cli = clientsList[Number(e.target.value)]; if (cli) handleSelectClient(cli); }} disabled={clientsList.length === 0} className="w-full bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-2 outline-none cursor-pointer">
                    {clientsList.length === 0 ? <option value="">Sin clientes</option> : <><option value="">-- Seleccionar --</option>{clientsList.map((c, idx) => <option key={c.id} value={idx}>{c.name}</option>)}</>}
                  </select>
                </div>
                <div className="flex flex-col justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lblSelectBank}</label>
                  <select onChange={(e) => { const account = bankAccountsList[Number(e.target.value)]; if (account) setBankData(account); }} className="w-full bg-white text-slate-800 font-semibold text-xs rounded border border-slate-300 p-2 outline-none cursor-pointer">
                    {bankAccountsList.map((b, idx) => <option key={idx} value={idx}>{b.alias || b.banco}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENTO COTIZACIÓN (Modo Limpio / Lectura si es compartido con cliente) */}
          <div id="quote-document" className={getContainerStyle()}>
            
            {subscriptionStatus === 'free' && !isSharedView && (
              <div className="absolute inset-0 pointer-events-none select-none z-0 no-print overflow-hidden opacity-15">
                <div className="w-[220%] h-[220%] -translate-x-1/4 -translate-y-1/4 -rotate-12 flex flex-wrap gap-x-4 gap-y-2 items-center justify-center p-2">
                  {Array.from({ length: 160 }).map((_, i) => (
                    <span key={i} className="text-slate-900 font-black text-[10px] sm:text-xs tracking-tight uppercase leading-none">VERSIÓN FREE</span>
                  ))}
                </div>
              </div>
            )}

            <div className="relative z-10">
              <div className={`flex flex-col md:flex-row justify-between items-start border-b border-slate-200 gap-4 ${templateStyle === 'compact' ? 'pb-1' : 'pb-3'}`}>
                
                {/* LOGOTIPO */}
                <div className="w-full md:w-1/2 flex justify-start">
                  <div className={`relative bg-transparent rounded-lg flex items-center justify-center overflow-hidden ${templateStyle === 'compact' ? 'h-16 w-36' : 'h-28 w-60'}`}>
                    {logo ? (
                      <img src={logo} alt="Logo" className="h-full object-contain" />
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 text-center px-2 no-print">{t.logoPrompt}</span>
                    )}
                    {!isSharedView && <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer no-print" />}
                  </div>
                </div>

                <div className="w-full md:w-1/2 text-left md:text-right flex flex-col items-start md:items-end space-y-0.5">
                  {isSharedView ? (
                    <div className={`font-extrabold text-slate-900 w-full text-left md:text-right leading-none tracking-tight mb-0.5 ${templateStyle === 'compact' ? 'text-base' : 'text-xl'}`}>{companyName}</div>
                  ) : (
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={`font-extrabold text-slate-900 w-full text-left md:text-right bg-transparent outline-none leading-none tracking-tight mb-0.5 ${templateStyle === 'compact' ? 'text-base' : 'text-xl'}`} />
                  )}
                  
                  {companyTagline && (
                    isSharedView ? <div className="text-xs text-slate-500 w-full text-left md:text-right leading-none mb-0.5">{companyTagline}</div> :
                    <input value={companyTagline} onChange={(e) => setCompanyTagline(e.target.value)} className="text-xs text-slate-500 w-full text-left md:text-right bg-transparent outline-none leading-none mb-0.5" />
                  )}

                  <div className={`text-slate-600 flex flex-col items-start md:items-end leading-tight space-y-0.5 w-full ${templateStyle === 'compact' ? 'text-[10px]' : 'text-xs'}`}>
                    {companyTaxId && <p className="font-semibold text-slate-800">RFC: {companyTaxId}</p>}
                    {companyAddress && <p>{companyAddress}</p>}
                    {cityStateText && <p>{cityStateText}</p>}
                    {companyPostalCode && <p>C.P. {companyPostalCode}</p>}
                    {companyPhone && <p><strong>Tel:</strong> {companyPhone}</p>}
                    {isSharedView ? <div className="text-xs text-slate-500 w-full text-left md:text-right leading-tight">{companyEmail}</div> :
                    <input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="text-xs text-slate-500 w-full text-left md:text-right bg-transparent outline-none leading-tight" />}
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl print:bg-transparent print:p-0 print:border-none ${
                templateStyle === 'compact' ? 'client-box-compact bg-slate-50 p-2 my-2' : 'client-box-classic bg-slate-50 p-3 my-3 md:my-4'
              }`}>
                <div>
                  <span className="font-bold text-slate-700 text-xs uppercase block mb-0.5">{t.quotedTo}</span>
                  {isSharedView ? <div className={`font-semibold text-slate-800 w-full ${templateStyle === 'compact' ? 'text-xs' : 'text-sm md:text-base'}`}>{clientName}</div> :
                  <input value={clientName} onChange={(e) => setClientName(e.target.value)} className={`font-semibold text-slate-800 w-full bg-transparent outline-none ${templateStyle === 'compact' ? 'text-xs' : 'text-sm md:text-base'}`} />}
                </div>
                <div className="md:text-right space-y-1 text-xs text-slate-600">
                  <p className="flex items-center justify-start md:justify-end gap-1">
                    <strong>{t.folio}</strong> 
                    {isSharedView ? <span className="font-semibold text-slate-800 ml-1">{folio}</span> :
                    <input value={folio} onChange={(e) => setFolio(e.target.value)} className="w-32 text-left md:text-right bg-transparent outline-none font-semibold text-slate-800" />}
                  </p>
                </div>
              </div>

              <div className={templateStyle === 'compact' ? 'mt-1' : 'mt-2'}>
                <div className={getHeaderTableStyle()}>
                  <div className="col-span-2 text-center px-1">{t.thQty}</div>
                  <div className="col-span-2 text-center px-1">{t.thUnit}</div>
                  <div className="col-span-4 px-2">{t.thConcept}</div>
                  <div className="col-span-2 text-right px-2">{t.thPrice}</div>
                  <div className="col-span-2 text-right px-2">{t.thAmount}</div>
                </div>

                <div className="divide-y divide-slate-100 sm:divide-y-0 space-y-2 sm:space-y-0">
                  {items.map((item, idx) => {
                    const q = typeof item.qty === 'number' ? item.qty : parseFloat(item.qty) || 0;
                    const p = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;

                    return (
                      <div key={idx} className={`bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-none border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-0 items-center hover:bg-slate-50/80 transition ${templateStyle === 'compact' ? 'py-1' : 'py-1.5'}`}>
                        <div className="sm:col-span-2 sm:px-1 sm:text-center">
                          <label className="text-[10px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">{t.thQty}</label>
                          {isSharedView ? <span className={`font-semibold text-slate-800 block sm:text-center ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`}>{item.qty}</span> :
                          <input type="number" value={item.qty} onFocus={() => updateItem(idx, 'qty', '')} onBlur={() => { if (item.qty === '') updateItem(idx, 'qty', 0); }} onChange={(e) => updateItem(idx, 'qty', e.target.value)} className={`w-full sm:w-16 text-center bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded p-1.5 sm:p-0 font-semibold outline-none mx-auto ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`} />}
                        </div>

                        <div className="sm:col-span-2 sm:px-1 sm:text-center">
                          <label className="text-[10px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">{t.thUnit}</label>
                          {isSharedView ? <span className="text-xs font-semibold text-slate-700 block sm:text-center">{item.unit || 'pieza'}</span> :
                          <select value={item.unit || 'pieza'} onChange={(e) => updateItem(idx, 'unit', e.target.value)} className="w-full bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded p-1.5 sm:p-0 text-xs font-semibold text-slate-700 cursor-pointer outline-none">
                            {unitOptions.map((u, uIdx) => <option key={uIdx} value={u.value}>{u.label}</option>)}
                          </select>}
                        </div>

                        <div className="sm:col-span-4 sm:px-2 py-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">{t.thConcept}</label>
                          {isSharedView ? <div className={`font-medium text-slate-800 whitespace-pre-wrap ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`}>{lang === 'es' ? item.description_es : item.description_en}</div> :
                          <textarea value={lang === 'es' ? item.description_es : item.description_en} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="Escribe un concepto..." rows={2} className={`w-full bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded p-1.5 sm:p-0 font-medium outline-none resize-none ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`} />}
                        </div>

                        <div className="sm:col-span-2 sm:px-2 sm:text-right">
                          <label className="text-[10px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">{t.thPrice}</label>
                          {isSharedView ? <span className={`font-semibold text-slate-800 block sm:text-right ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`}>${Number(item.price || 0).toFixed(2)}</span> :
                          <input type="number" value={item.price} onFocus={() => updateItem(idx, 'price', '')} onBlur={() => { if (item.price === '') updateItem(idx, 'price', 0); }} onChange={(e) => updateItem(idx, 'price', e.target.value)} className={`w-full sm:w-20 text-right bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded p-1.5 sm:p-0 font-semibold outline-none ml-auto ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`} placeholder="0.00" />}
                        </div>

                        <div className="sm:col-span-2 sm:px-2 text-right">
                          <label className="text-[10px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">{t.thAmount}</label>
                          <span className={`font-bold text-slate-800 block pt-1 sm:pt-0 ${templateStyle === 'compact' ? 'text-xs' : 'text-sm'}`}>${(q * p).toFixed(2)}</span>
                        </div>

                        {!isSharedView && (
                          <div className="sm:col-span-12 text-right mt-1 no-print flex justify-end">
                            <button onClick={() => removeItem(idx)} className="text-rose-500 hover:text-rose-700 font-bold text-xs bg-rose-50 sm:bg-transparent px-2 py-0.5 rounded">Eliminar ✕</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`flex justify-end border-t border-slate-200 ${templateStyle === 'compact' ? 'mt-2 pt-1' : 'mt-4 pt-3'}`}>
                <div className="w-full md:w-96 space-y-2 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>{t.subtotal}</span>
                    <span className="font-semibold">${subtotal.toFixed(2)} {currency}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1">
                      {t.discount}
                      {isSharedView ? <span className="font-bold text-slate-800 text-xs ml-1">{discount}%</span> :
                      <div className="flex items-center border border-slate-300 rounded bg-white px-1 py-0.5 no-print">
                        <input type="number" min="0" max="100" step="1" value={discount} onFocus={() => { if (discount === 0 || discount === '0') setDiscount(''); }} onBlur={() => { if (discount === '') setDiscount(0); }} onChange={(e) => setDiscount(e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))} className="w-10 text-center font-bold text-xs text-slate-800 outline-none" />
                        <span className="text-[10px] font-bold text-slate-400">%</span>
                      </div>}
                    </span>
                    <span className="font-semibold text-rose-600">-{discountAmount > 0 ? `$${discountAmount.toFixed(2)}` : '$0.00'} {currency}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span>{t.taxLabel} ({taxRate}%)</span>
                    <span className="font-semibold">${taxAmount.toFixed(2)} {currency}</span>
                  </div>

                  <div className="flex justify-between items-center text-base font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>{t.total}</span>
                    <span className="text-indigo-600">${total.toFixed(2)} {currency}</span>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 space-y-1.5 mt-2 print:bg-transparent print:border-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 font-bold text-amber-900 text-xs">
                        {t.advancePercent} ({numAdvance}%):
                        {isSharedView ? <span className="font-bold text-amber-900 text-xs ml-1">{numAdvance}%</span> :
                        <div className="flex items-center border border-amber-300 rounded bg-white px-1 py-0.5 no-print">
                          <input type="number" min="0" max="100" step="1" value={advanceRate} onFocus={() => { if (advanceRate === 0 || advanceRate === '0') setAdvanceRate(''); }} onBlur={() => { if (advanceRate === '') setAdvanceRate(0); }} onChange={(e) => setAdvanceRate(e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))} className="w-12 text-center font-bold text-xs text-amber-900 outline-none" />
                          <span className="text-[10px] font-bold text-amber-600">%</span>
                        </div>}
                      </span>
                      <span className="font-extrabold text-amber-900 text-sm">${advanceAmount.toFixed(2)} {currency}</span>
                    </div>

                    <div className="pt-1 border-t border-amber-200/60">
                      {isSharedView ? <div className="text-[11px] text-amber-950 italic font-medium leading-tight">{advanceCustomNote}</div> :
                      <textarea value={advanceCustomNote} onChange={(e) => setAdvanceCustomNote(e.target.value)} rows={2} className="w-full bg-transparent text-[11px] text-amber-950 italic outline-none resize-none leading-tight font-medium" placeholder="Escribe la leyenda o condición de anticipo..." />}
                    </div>
                  </div>
                </div>
              </div>

              {showBankDetails && (
                <div className={`bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 print:bg-transparent print:border-slate-300 ${templateStyle === 'compact' ? 'mt-2 p-2 space-y-1' : 'mt-4 p-3.5 space-y-2'}`}>
                  <p className="font-bold text-slate-800 text-sm">{t.bankHeader}</p>
                  <div className="flex flex-col space-y-1.5 text-slate-700 max-w-md">
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] items-center">
                      <strong className="text-slate-900">{t.beneficiary}</strong>
                      <span className="font-medium text-slate-800">{bankData.nombre || '—'}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] items-center">
                      <strong className="text-slate-900">{t.account}</strong>
                      <span className="font-medium text-slate-800">{bankData.cuenta || '—'}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] items-center">
                      <strong className="text-slate-900">{t.rfc}</strong>
                      <span className="font-medium text-slate-800">{bankData.rfc || '—'}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] items-center">
                      <strong className="text-slate-900">{t.bank}</strong>
                      <span className="font-medium text-slate-800">{bankData.banco || '—'}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] items-center">
                      <strong className="text-slate-900">{t.clabe}</strong>
                      <span className="font-medium text-slate-800">{bankData.clabe || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="hidden print:block mt-2 text-[10px] text-slate-500 text-right font-medium">
                {t?.generatedAt || 'Generado el:'} {currentDateTime || ''}
              </div>

            </div>
          </div>

          {/* Botón flotante para imprimir o descargar PDF cuando el cliente abre el enlace */}
          {isSharedView && (
            <div className="no-print flex justify-center pb-8">
              <button onClick={handlePrintPdf} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-sm transition">
                🖨️ Imprimir / Guardar como PDF
              </button>
            </div>
          )}

        </div>

        <footer className="no-print mt-12 pt-6 border-t border-slate-300/80 text-center text-xs text-slate-500 space-y-2 w-full max-w-5xl mx-auto">
          <div className="flex justify-center items-center gap-4 font-semibold text-slate-600">
            <Link href="/terminos" className="hover:text-slate-900 hover:underline transition">{t.footerTerms}</Link>
            <span>•</span>
            <Link href="/privacidad" className="hover:text-slate-900 hover:underline transition">{t.footerPrivacy}</Link>
          </div>
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.footerLegalNotice}</p>
          <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} {t.appTitle}. Todos los derechos reservados.</p>
        </footer>
      </main>

    </div>
  );
}