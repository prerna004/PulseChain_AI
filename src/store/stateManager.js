// Reactive State Manager & Cross-Device Event Bus
// Real-time synchronization between Desktop Command Center and Mobile Companion
// v3: Full Auth (Hospital + Stockist + Manufacturer) + Expanded Catalog + WhatsApp Modal

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MUMBAI_HOSPITALS,
  MUMBAI_STOCKISTS,
  MUMBAI_MANUFACTURERS,
  MEDICAL_CATALOG,
  INITIAL_SUPPLY_CHAIN_ORDERS,
  HOSPITAL_WARDS
} from '../data/mumbaiData';
import { aiEngine } from '../ai/agentEngine';

// ── Helper: generate short unique IDs ────────────────────────────────────────
function genId(prefix) {
  return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Current Active Persona
  const [currentRole, setCurrentRole] = useState('HOSPITAL');
  const [selectedHospital, setSelectedHospital] = useState(MUMBAI_HOSPITALS[0]);
  const [selectedStockist, setSelectedStockist] = useState(MUMBAI_STOCKISTS[0]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(MUMBAI_MANUFACTURERS[0]);

  // ── HOSPITAL AUTH ─────────────────────────────────────────────────────────────
  const [registeredHospitals, setRegisteredHospitals] = useState([
    { id: 'hosp-1', name: 'Lilavati Hospital & Research Centre', area: 'Bandra West', phone: '+91 98201 44521', contactPerson: 'Dr. Sunita Rao', title: 'Head of Procurement', pin: '1234', completedFirstOrder: true },
    { id: 'hosp-2', name: 'P.D. Hinduja National Hospital', area: 'Mahim', phone: '+91 98192 33145', contactPerson: 'Mr. Arvind Joshi', title: 'Materials Manager', pin: '1234', completedFirstOrder: true },
    { id: 'hosp-3', name: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri West', phone: '+91 97693 88102', contactPerson: 'Ms. Pooja Mehta', title: 'Director - Supply Chain', pin: '1234', completedFirstOrder: true },
  ]);
  const [loggedInHospital, setLoggedInHospital] = useState(null);

  // ── STOCKIST AUTH ─────────────────────────────────────────────────────────────
  const [registeredStockists, setRegisteredStockists] = useState([
    { id: 'stock-1', name: 'Entero Healthcare Solutions (Central Mumbai)', ownerName: 'Mr. Rajesh Shah', hub: 'Dadar West / Lower Parel', phone: '+91 98200 11223', pin: '1234' },
    { id: 'stock-2', name: 'Babuline Pharma & Surgical Distribution', ownerName: 'Mr. Nilesh Babuline', hub: 'Dadar East', phone: '+91 98209 88776', pin: '1234' },
    { id: 'stock-3', name: 'Princess Street / Dawa Bazar Wholesalers Syndicate', ownerName: 'Mr. Ketan Parekh', hub: 'Kalbadevi / Marine Lines', phone: '+91 98190 55443', pin: '1234' },
    { id: 'stock-4', name: 'Sagar Medical & Surgicals (Suburban Hub)', ownerName: 'Mr. Sandeep Gada', hub: 'Andheri West', phone: '+91 98211 99884', pin: '1234' },
  ]);
  const [loggedInStockist, setLoggedInStockist] = useState(null);

  // ── MANUFACTURER AUTH ─────────────────────────────────────────────────────────
  const [registeredManufacturers, setRegisteredManufacturers] = useState([
    { id: 'mfg-1', name: 'Hindustan Syringes & Medical Devices (HMD)', repName: 'Mr. Vikram Malhotra', title: 'Zonal Sales Director - West', brand: 'Dispovan', phone: '+91 98101 22334', pin: '1234' },
    { id: 'mfg-2', name: 'Poly Medicure Ltd. (Polymed)', repName: 'Ms. Deepa Singhal', title: 'VP Institutional Sales', brand: 'Polymed', phone: '+91 98118 77665', pin: '1234' },
    { id: 'mfg-3', name: '3M Healthcare India', repName: 'Mr. Anuj Saxena', title: 'Enterprise Healthcare Lead', brand: '3M MedTech', phone: '+91 98200 44321', pin: '1234' },
    { id: 'mfg-4', name: 'Becton Dickinson India (BD)', repName: 'Dr. Rajiv Merchant', title: 'Clinical Director', brand: 'BD Venflon', phone: '+91 98202 88990', pin: '1234' },
    { id: 'mfg-5', name: 'Cipla Critical Care & Hospital Supplies', repName: 'Mr. Hemant Kothari', title: 'Institutional Sales Head', brand: 'Cipla Med', phone: '+91 98203 11445', pin: '1234' },
  ]);
  const [loggedInManufacturer, setLoggedInManufacturer] = useState(null);

  // View / Layout Modes
  const [deviceMode, setDeviceMode] = useState('SPLIT_SYNC');

  // Supply Chain State
  const [inventory, setInventory] = useState(MEDICAL_CATALOG);
  const [orders, setOrders] = useState(INITIAL_SUPPLY_CHAIN_ORDERS);
  const [wards, setWards] = useState(HOSPITAL_WARDS);

  // Central Data Lake Telemetry
  const [dataLakeLogs, setDataLakeLogs] = useState([
    { id: 'log-1', timestamp: '18:10:02', source: 'Lilavati Hospital', event: 'VOICE_QUERY', detail: '"Show inventory to order tomorrow"', status: 'PROCESSED' },
    { id: 'log-2', timestamp: '18:12:15', source: 'Entero Healthcare', event: 'STOCKIST_PING', detail: 'Received dispatch alert for Dadar corridor', status: 'ACKNOWLEDGED' },
    { id: 'log-3', timestamp: '18:14:40', source: 'HMD Dispovan', event: 'MFG_SYNC', detail: 'Central C&F stock levels updated: 1.2M units', status: 'SYNCD' },
    { id: 'log-4', timestamp: '18:15:20', source: 'Kokilaben Hospital', event: 'ORDER_CREATED', detail: 'N95 Masks x40 boxes ordered from Sagar Medical', status: 'INDEXED' },
    { id: 'log-5', timestamp: '18:18:05', source: 'Poly Medicure', event: 'MFG_SYNC', detail: 'Vashi depot IV Cannula stock replenished: 50,000 units', status: 'SYNCD' },
    { id: 'log-6', timestamp: '18:20:30', source: 'Princess Street Syndicate', event: 'STOCKIST_PING', detail: 'KEM Hospital quote request received: N95 Masks x100', status: 'PROCESSED' },
  ]);

  // Modals & Dynamic UI
  const [activeUberPing, setActiveUberPing] = useState(null);
  const [showUnknownEntityModal, setShowUnknownEntityModal] = useState(false);
  const [unknownEntityData, setUnknownEntityData] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDataLakeModal, setShowDataLakeModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // AI & Voice State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAiMessage, setLastAiMessage] = useState({
    title: 'PulseChain AI Ready',
    text: 'Click the mic or speak: "Order 200 boxes of 7.5 gloves" or "Get me best prices for Dispovan 5ml"',
    type: 'INFO'
  });

  // Cross-Tab / Cross-Device Broadcast Channel Sync
  useEffect(() => {
    let channel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('mumbai_medpulse_sync');
        channel.onmessage = (event) => {
          const { type, payload } = event.data;
          if (type === 'NEW_ORDER') {
            setOrders(prev => [payload, ...prev]);
            addTelemetryLog('Remote Device', 'ORDER_CREATED', `Order ${payload.orderId} synced across devices`);
          } else if (type === 'INVENTORY_CONSUMED') {
            setInventory(prev => prev.map(item =>
              item.skuId === payload.skuId ? { ...item, hospStockLilavati: payload.newStock } : item
            ));
          } else if (type === 'ROLE_CHANGE') {
            setCurrentRole(payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }
    return () => { if (channel) channel.close(); };
  }, []);

  const broadcastEvent = (type, payload) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const ch = new BroadcastChannel('mumbai_medpulse_sync');
        ch.postMessage({ type, payload });
        ch.close();
      } catch (e) {}
    }
  };

  const addTelemetryLog = (source, event, detail) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setDataLakeLogs(prev => [
      { id: 'log-' + Date.now(), timestamp: time, source, event, detail, status: 'RECORDED' },
      ...prev.slice(0, 99) // Keep last 100
    ]);
  };

  // Voice / Text Processing
  const handleVoiceOrTextInput = (text) => {
    setTranscript(text);
    const result = aiEngine.parseVoiceOrText(text, selectedHospital);

    if (result.speechReply) {
      aiEngine.speak(result.speechReply);
    }

    const sourceName = currentRole === 'HOSPITAL'
      ? (loggedInHospital?.name || selectedHospital.name)
      : currentRole === 'STOCKIST'
        ? (loggedInStockist?.name || selectedStockist.name)
        : (loggedInManufacturer?.name || selectedManufacturer.name);

    addTelemetryLog(sourceName, result.intent, `Prompt: "${text}"`);

    if (result.intent === 'UNKNOWN_ENTITY') {
      setShowUnknownEntityModal(true);
      setUnknownEntityData({ prompt: text });
      setLastAiMessage({ title: 'Unknown Entity Detected', text: result.speechReply, type: 'WARNING' });
      return;
    }

    if (result.intent === 'UBER_PING_SEARCH' || result.intent === 'CREATE_REQUISITION') {
      const targetSku = result.sku || (result.entities && result.entities.sku) || inventory[0];
      const qty = result.entities ? result.entities.quantity : 50;
      startUberStockistPing(targetSku, qty, result.entities ? result.entities.urgency : 'STANDARD');
      setLastAiMessage({ title: 'Uber Reverse-Ping Active', text: result.speechReply, type: 'SUCCESS' });
      return;
    }

    if (result.intent === 'INVENTORY_REORDER_FORECAST') {
      setLastAiMessage({ title: 'Inventory Reorder Forecast', text: result.speechReply, type: 'INFO' });
      return;
    }

    if (result.intent === 'STOCKIST_DEMAND_RADAR') {
      setLastAiMessage({ title: 'Mumbai Hospital Demand Radar', text: result.speechReply, type: 'SUCCESS' });
      return;
    }

    setLastAiMessage({ title: 'Agent Response', text: result.speechReply, type: 'INFO' });
  };

  // Uber Stockist Ping
  const startUberStockistPing = (sku, quantity, urgency = 'STANDARD') => {
    const quotes = MUMBAI_STOCKISTS.map((stk, idx) => {
      const distance = stk.distanceKm[selectedHospital.id] || 6.2;
      const variance = idx === 0 ? -20 : (idx === 1 ? +10 : (idx === 2 ? -40 : +15));
      const quotedRate = sku.stockistPrice + variance;
      const totalAmount = quotedRate * quantity;
      const etaMins = Math.round(distance * 3.5 + (urgency === 'CRITICAL_EMERGENCY' ? 8 : 15));
      return {
        stockistId: stk.id,
        stockistName: stk.name,
        hub: stk.hub,
        rating: stk.rating,
        distanceKm: distance,
        etaMinutes: etaMins,
        quotedRate,
        totalAmount,
        availableStock: stk.stockLevels?.[sku.skuId] || Math.floor(Math.random() * 400 + 120),
        creditTerms: stk.creditOffered,
        isBestPrice: idx === 2 || idx === 0,
        isFastest: idx === 1 || idx === 3
      };
    }).sort((a, b) => a.totalAmount - b.totalAmount);

    setActiveUberPing({ sku, quantity, urgency, hospital: selectedHospital, quotes, timestamp: Date.now() });
  };

  // Confirm & Dispatch
  const confirmOrderDispatch = (selectedQuote, customQty = null) => {
    if (!activeUberPing) return;
    const finalQty = customQty !== null ? customQty : activeUberPing.quantity;
    const finalTotal = selectedQuote.quotedRate * finalQty;

    const newOrder = {
      orderId: genId('ORD-MUM'),
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      stockistId: selectedQuote.stockistId,
      stockistName: selectedQuote.stockistName,
      mfgId: activeUberPing.sku.mfgId,
      mfgName: 'Authorized Manufacturer Hub',
      items: [{
        skuId: activeUberPing.sku.skuId,
        name: activeUberPing.sku.name,
        qty: finalQty,
        unit: activeUberPing.sku.unit,
        rate: selectedQuote.quotedRate,
        total: finalTotal
      }],
      totalAmount: finalTotal,
      orderDate: 'Just Now (' + new Date().toLocaleTimeString('en-IN') + ')',
      deliveredBy: `Today within ${selectedQuote.etaMinutes} mins (ETA)`,
      deliveryStatus: 'DISPATCHED',
      transitRoute: `${selectedQuote.hub} -> Sea Link / WEH -> ${selectedHospital.name}`,
      currentLocation: 'Dispatched from Stockist Bay (Driver Assigned)',
      goodsProgressPct: 20,
      temperatureC: 'Ambient Controlled',
      paymentStatus: 'ESCROW_LOCKED',
      paymentDueBy: '45-Day Escrow Term',
      cashProgressPct: 15,
      creditAgingDays: 45,
      earlyDiscountOffer: '2% instant discount on 7-day settlement'
    };

    setOrders(prev => [newOrder, ...prev]);
    broadcastEvent('NEW_ORDER', newOrder);
    addTelemetryLog(selectedHospital.name, 'ORDER_DISPATCHED', `Order ${newOrder.orderId} to ${selectedQuote.stockistName} for ${finalQty} ${activeUberPing.sku.unit}`);
    aiEngine.speak(`Order of ${finalQty} ${activeUberPing.sku.unit} confirmed with ${selectedQuote.stockistName}. Driver en route, ETA ${selectedQuote.etaMinutes} minutes.`);
    setActiveUberPing(null);
  };

  // Ward Inventory Depletion → Auto-Reorder
  const consumeWardItem = (skuId, amount = 10, wardName = 'Operation Theatre 1') => {
    setInventory(prev => {
      const updated = prev.map(item => {
        if (item.skuId === skuId) {
          const newStock = Math.max(0, item.hospStockLilavati - amount);
          broadcastEvent('INVENTORY_CONSUMED', { skuId, newStock });

          if (newStock <= item.reorderLevel) {
            const alertMsg = `Critical threshold breached: ${item.name} at ${newStock} units in ${wardName}. Auto-generating replenishment requisition...`;
            aiEngine.speak(alertMsg);
            setLastAiMessage({ title: 'Auto-Replenishment Triggered', text: alertMsg, type: 'CRITICAL' });
            setTimeout(() => startUberStockistPing(item, 50, 'CRITICAL_EMERGENCY'), 1200);
          } else {
            setLastAiMessage({ title: 'Ward Item Consumed', text: `Consumed ${amount} units of ${item.name} in ${wardName}. Remaining stock: ${newStock}.`, type: 'INFO' });
          }

          addTelemetryLog(selectedHospital.name, 'WARD_CONSUMPTION', `Consumed ${amount} ${item.unit} of ${item.name} in ${wardName}`);
          return { ...item, hospStockLilavati: newStock };
        }
        return item;
      });
      return updated;
    });
  };

  // Unknown entity voice onboarding
  const registerNewEntity = (name, title, entityName, mobile, type = 'HOSPITAL') => {
    const newHosp = {
      id: 'hosp-' + Date.now(),
      name: entityName,
      type: 'Registered Care Provider',
      beds: 50,
      area: 'Mumbai Metropolitan Region',
      lat: 19.10, lng: 72.85,
      contactPerson: `${name} (${title})`,
      phone: mobile,
      whatsapp: mobile,
      creditDays: 30,
      monthlyBudget: '₹45 Lakhs'
    };
    setSelectedHospital(newHosp);
    setShowUnknownEntityModal(false);
    addTelemetryLog(entityName, 'NEW_ENTITY_ONBOARDED', `Onboarded ${name} (${title}) with WhatsApp ${mobile}`);
    aiEngine.speak(`Welcome ${name}. ${entityName} is now registered in our Mumbai Central Data Lake. How can I assist you today?`);
  };

  // ── HOSPITAL AUTH FUNCTIONS ───────────────────────────────────────────────────
  const signupHospital = ({ name, title, hospitalName, area, phone, pin }) => {
    const exists = registeredHospitals.find(h => h.name.toLowerCase() === hospitalName.toLowerCase());
    if (exists) return { error: 'A hospital with this name is already registered. Please log in instead.' };
    const newHospital = { id: genId('HOSP-MUM'), name: hospitalName, area: area || 'Mumbai', phone, contactPerson: name, title: title || 'Procurement Contact', pin, completedFirstOrder: false, registeredAt: new Date().toISOString() };
    setRegisteredHospitals(prev => [...prev, newHospital]);
    addTelemetryLog(hospitalName, 'HOSPITAL_SIGNUP', `New hospital: ${hospitalName} by ${name}`);
    return { hospital: newHospital };
  };

  const loginHospital = (hospital) => {
    setLoggedInHospital(hospital);
    const matched = MUMBAI_HOSPITALS.find(h => h.id === hospital.id);
    setSelectedHospital(matched || { id: hospital.id, name: hospital.name, type: 'Registered Care Provider', beds: 50, area: hospital.area || 'Mumbai', lat: 19.10, lng: 72.85, contactPerson: `${hospital.contactPerson} (${hospital.title})`, phone: hospital.phone, whatsapp: hospital.phone, creditDays: 30, monthlyBudget: '₹45 Lakhs' });
    addTelemetryLog(hospital.name, 'HOSPITAL_LOGIN', `${hospital.contactPerson} logged in`);
  };

  const logoutHospital = () => {
    setLoggedInHospital(null);
    setSelectedHospital(MUMBAI_HOSPITALS[0]);
  };

  const markFirstOrderComplete = (hospitalId) => {
    setRegisteredHospitals(prev => prev.map(h => h.id === hospitalId ? { ...h, completedFirstOrder: true } : h));
    setLoggedInHospital(prev => prev ? { ...prev, completedFirstOrder: true } : prev);
    addTelemetryLog(loggedInHospital?.name || hospitalId, 'FIRST_ORDER_KYC_DONE', 'First-order paperwork completed');
  };

  // ── STOCKIST AUTH FUNCTIONS ───────────────────────────────────────────────────
  const signupStockist = ({ ownerName, businessName, hub, phone, pin }) => {
    const exists = registeredStockists.find(s => s.name.toLowerCase() === businessName.toLowerCase());
    if (exists) return { error: 'A business with this name is already registered. Please log in instead.' };
    const newStockist = { id: genId('STK-MUM'), name: businessName, ownerName, hub: hub || 'Mumbai', phone, pin, registeredAt: new Date().toISOString() };
    setRegisteredStockists(prev => [...prev, newStockist]);
    addTelemetryLog(businessName, 'STOCKIST_SIGNUP', `New stockist: ${businessName} by ${ownerName}`);
    return { stockist: newStockist };
  };

  const loginStockist = (stockist) => {
    setLoggedInStockist(stockist);
    const matched = MUMBAI_STOCKISTS.find(s => s.id === stockist.id);
    if (matched) setSelectedStockist(matched);
    addTelemetryLog(stockist.name, 'STOCKIST_LOGIN', `${stockist.ownerName} logged in`);
  };

  const logoutStockist = () => {
    setLoggedInStockist(null);
    setSelectedStockist(MUMBAI_STOCKISTS[0]);
  };

  // ── MANUFACTURER AUTH FUNCTIONS ───────────────────────────────────────────────
  const signupManufacturer = ({ repName, title, companyName, brand, phone, pin }) => {
    const exists = registeredManufacturers.find(m => m.name.toLowerCase() === companyName.toLowerCase());
    if (exists) return { error: 'This company is already registered. Please log in instead.' };
    const newMfg = { id: genId('MFG-MUM'), name: companyName, repName, title: title || 'Sales Manager', brand: brand || companyName, phone, pin, registeredAt: new Date().toISOString() };
    setRegisteredManufacturers(prev => [...prev, newMfg]);
    addTelemetryLog(companyName, 'MFG_SIGNUP', `New manufacturer: ${companyName} by ${repName}`);
    return { manufacturer: newMfg };
  };

  const loginManufacturer = (manufacturer) => {
    setLoggedInManufacturer(manufacturer);
    const matched = MUMBAI_MANUFACTURERS.find(m => m.id === manufacturer.id);
    if (matched) setSelectedManufacturer(matched);
    addTelemetryLog(manufacturer.name, 'MFG_LOGIN', `${manufacturer.repName} logged in`);
  };

  const logoutManufacturer = () => {
    setLoggedInManufacturer(null);
    setSelectedManufacturer(MUMBAI_MANUFACTURERS[0]);
  };

  // ── PER-HOSPITAL ORDERS FILTER ────────────────────────────────────────────────
  const getOrdersForCurrentView = () => {
    if (currentRole === 'HOSPITAL' && loggedInHospital) {
      return orders.filter(o => o.hospitalId === loggedInHospital.id);
    }
    return orders;
  };

  return (
    <AppContext.Provider
      value={{
        // Roles & entities
        currentRole,
        setCurrentRole: (r) => { setCurrentRole(r); broadcastEvent('ROLE_CHANGE', r); },
        selectedHospital, setSelectedHospital,
        selectedStockist, setSelectedStockist,
        selectedManufacturer, setSelectedManufacturer,
        deviceMode, setDeviceMode,
        // Supply chain data
        inventory, orders, wards, dataLakeLogs,
        // Modals
        activeUberPing, setActiveUberPing,
        showUnknownEntityModal, setShowUnknownEntityModal,
        unknownEntityData,
        showPermissionsModal, setShowPermissionsModal,
        showDataLakeModal, setShowDataLakeModal,
        showWhatsAppModal, setShowWhatsAppModal,
        // Voice & AI
        isListening, setIsListening,
        transcript, setTranscript,
        lastAiMessage,
        handleVoiceOrTextInput,
        startUberStockistPing,
        confirmOrderDispatch,
        consumeWardItem,
        registerNewEntity,
        addTelemetryLog,
        // Hospital auth
        registeredHospitals,
        loggedInHospital,
        loginHospital, logoutHospital,
        signupHospital, markFirstOrderComplete,
        getOrdersForCurrentView,
        // Stockist auth
        registeredStockists,
        loggedInStockist,
        loginStockist, logoutStockist,
        signupStockist,
        // Manufacturer auth
        registeredManufacturers,
        loggedInManufacturer,
        loginManufacturer, logoutManufacturer,
        signupManufacturer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
