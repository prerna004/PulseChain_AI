// Reactive State Manager & Cross-Device Event Bus
// Real-time synchronization between Desktop Command Center and Mobile Companion
// v3: Full Auth (Hospital + Stockist + Manufacturer) + Expanded Catalog + WhatsApp Modal

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MUMBAI_HOSPITALS,
  MUMBAI_STOCKISTS,
  MUMBAI_MANUFACTURERS,
  MUMBAI_GEO_AREAS,
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

  // ── DYNAMIC GLOBAL INVENTORY & SUPPLIERS (No phantom stock / concurrency safe) ─
  const [allStockists, setAllStockists] = useState(MUMBAI_STOCKISTS);
  const [allManufacturers, setAllManufacturers] = useState(MUMBAI_MANUFACTURERS);

  // ── PERSISTENT DISTRIBUTED MESH BRIDGES ("Web of Provenance") ────────────────
  const [bridges, setBridges] = useState([
    {
      id: 'bridge-hosp-1-stock-1',
      hospitalId: 'hosp-1',
      hospitalName: 'Lilavati Hospital & Research Centre',
      hospitalCoords: { lat: 19.0515, lng: 72.8291 },
      stockistId: 'stock-1',
      stockistName: 'Entero Healthcare Solutions (Central Mumbai)',
      stockistCoords: { lat: 19.0178, lng: 72.8478 },
      lifetimeOrders: 4,
      totalValue: 364800,
      avgTransitMins: 18,
      activeCreditLine: '₹25,00,000 (45-Day Escrow Term Active)',
      lastDeliveredDate: '01 Nov 2026',
      fastTrackUnlocked: true,
      establishedAt: '01 Nov 2026, 09:30 AM'
    }
  ]);

  // ── HOSPITAL AUTH (Comprehensive all-Mumbai coverage) ────────────────────────
  const [registeredHospitals, setRegisteredHospitals] = useState(
    MUMBAI_HOSPITALS.map(h => ({
      id: h.id,
      name: h.name,
      area: h.area,
      lat: h.lat,
      lng: h.lng,
      beds: h.beds,
      phone: h.phone,
      contactPerson: h.contactPerson.split('(')[0].trim(),
      title: h.contactPerson.includes('(') ? h.contactPerson.split('(')[1].replace(')', '') : 'Head of Procurement',
      pin: '1234',
      completedFirstOrder: ['hosp-1', 'hosp-2', 'hosp-3', 'hosp-4'].includes(h.id) // First 4 verified with past history, others ready for 1-time onboarding
    }))
  );
  // Pre-seed active demo session so all pipelines and map views are instantly visible
  const [loggedInHospital, setLoggedInHospital] = useState({
    id: 'hosp-1',
    name: 'Lilavati Hospital & Research Centre',
    area: 'Bandra West',
    lat: 19.0515,
    lng: 72.8291,
    phone: '+91 98201 44521',
    contactPerson: 'Dr. Sunita Rao',
    title: 'Head of Procurement',
    pin: '1234',
    completedFirstOrder: true
  });

  // ── STOCKIST AUTH ─────────────────────────────────────────────────────────────
  const [registeredStockists, setRegisteredStockists] = useState([
    { id: 'stock-1', name: 'Entero Healthcare Solutions (Central Mumbai)', ownerName: 'Mr. Rajesh Shah', hub: 'Dadar West / Lower Parel', phone: '+91 98200 11223', pin: '1234' },
    { id: 'stock-2', name: 'Babuline Pharma & Surgical Distribution', ownerName: 'Mr. Nilesh Babuline', hub: 'Dadar East', phone: '+91 98209 88776', pin: '1234' },
    { id: 'stock-3', name: 'Princess Street / Dawa Bazar Wholesalers Syndicate', ownerName: 'Mr. Ketan Parekh', hub: 'Kalbadevi / Marine Lines', phone: '+91 98190 55443', pin: '1234' },
    { id: 'stock-4', name: 'Sagar Medical & Surgicals (Suburban Hub)', ownerName: 'Mr. Sandeep Gada', hub: 'Andheri West', phone: '+91 98211 99884', pin: '1234' },
  ]);
  const [loggedInStockist, setLoggedInStockist] = useState({
    id: 'stock-1',
    name: 'Entero Healthcare Solutions (Central Mumbai)',
    ownerName: 'Mr. Rajesh Shah',
    hub: 'Dadar West / Lower Parel',
    phone: '+91 98200 11223',
    pin: '1234'
  });

  // ── MANUFACTURER AUTH ─────────────────────────────────────────────────────────
  const [registeredManufacturers, setRegisteredManufacturers] = useState([
    { id: 'mfg-1', name: 'Hindustan Syringes & Medical Devices (HMD)', repName: 'Mr. Vikram Malhotra', title: 'Zonal Sales Director - West', brand: 'Dispovan', phone: '+91 98101 22334', pin: '1234' },
    { id: 'mfg-2', name: 'Poly Medicure Ltd. (Polymed)', repName: 'Ms. Deepa Singhal', title: 'VP Institutional Sales', brand: 'Polymed', phone: '+91 98118 77665', pin: '1234' },
    { id: 'mfg-3', name: '3M Healthcare India', repName: 'Mr. Anuj Saxena', title: 'Enterprise Healthcare Lead', brand: '3M MedTech', phone: '+91 98200 44321', pin: '1234' },
    { id: 'mfg-4', name: 'Becton Dickinson India (BD)', repName: 'Dr. Rajiv Merchant', title: 'Clinical Director', brand: 'BD Venflon', phone: '+91 98202 88990', pin: '1234' },
    { id: 'mfg-5', name: 'Cipla Critical Care & Hospital Supplies', repName: 'Mr. Hemant Kothari', title: 'Institutional Sales Head', brand: 'Cipla Med', phone: '+91 98203 11445', pin: '1234' },
  ]);
  const [loggedInManufacturer, setLoggedInManufacturer] = useState({
    id: 'mfg-1',
    name: 'Hindustan Syringes & Medical Devices (HMD)',
    repName: 'Mr. Vikram Malhotra',
    title: 'Zonal Sales Director - West',
    brand: 'Dispovan',
    phone: '+91 98101 22334',
    pin: '1234'
  });

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
            setOrders(prev => {
              if (prev.some(o => o.orderId === payload.orderId)) return prev;
              return [payload, ...prev];
            });
            addTelemetryLog('Remote Device', 'ORDER_CREATED', `Order ${payload.orderId} synced across devices`);
          } else if (type === 'INVENTORY_CONSUMED') {
            setInventory(prev => prev.map(item => {
              if (item.skuId !== payload.skuId) return item;
              const hId = payload.hospitalId || 'hosp-1';
              return {
                ...item,
                hospStockLilavati: hId === 'hosp-1' ? payload.newStock : item.hospStockLilavati,
                hospitalStock: {
                  ...(item.hospitalStock || {}),
                  [hId]: payload.newStock
                }
              };
            }));
          } else if (type === 'ROLE_CHANGE') {
            setCurrentRole(payload);
          } else if (type === 'SUPPLIER_REGISTERED') {
            if (payload.stockLevels || (payload.id && payload.id.startsWith('STK'))) {
              setAllStockists(prev => {
                if (prev.some(s => s.id === payload.id || s.name.toLowerCase() === payload.name.toLowerCase())) return prev;
                return [payload, ...prev];
              });
              setRegisteredStockists(prev => {
                if (prev.some(s => s.id === payload.id || s.name.toLowerCase() === payload.name.toLowerCase())) return prev;
                return [payload, ...prev];
              });
              addTelemetryLog('Broadcast Bus', 'SUPPLIER_REGISTERED', `Live map radar blip added: ${payload.name} (${payload.area || payload.hub})`);
            } else {
              setAllManufacturers(prev => {
                if (prev.some(m => m.id === payload.id || m.name.toLowerCase() === payload.name.toLowerCase())) return prev;
                return [payload, ...prev];
              });
              setRegisteredManufacturers(prev => {
                if (prev.some(m => m.id === payload.id || m.name.toLowerCase() === payload.name.toLowerCase())) return prev;
                return [payload, ...prev];
              });
              addTelemetryLog('Broadcast Bus', 'SUPPLIER_REGISTERED', `Live manufacturer added: ${payload.name} (${payload.area || payload.primaryHub})`);
            }
          } else if (type === 'STOCK_ALLOCATED') {
            setAllStockists(prev => prev.map(stk => {
              if (stk.id === payload.stockistId || stk.name.toLowerCase() === (payload.stockistName || '').toLowerCase()) {
                const cur = stk.stockLevels?.[payload.skuId] ?? 0;
                const newStock = Math.max(0, cur - payload.qty);
                return {
                  ...stk,
                  stockLevels: { ...stk.stockLevels, [payload.skuId]: newStock }
                };
              }
              return stk;
            }));
            addTelemetryLog(payload.hospitalName || 'Remote Device', 'STOCK_ALLOCATED', `Concurrent allocation: ${payload.qty} units deducted from ${payload.stockistName || payload.stockistId}`);
          } else if (type === 'ORDER_STATUS_UPDATE') {
            setOrders(prev => prev.map(o => o.orderId === payload.orderId ? { ...o, ...payload.updates } : o));
          } else if (type === 'BRIDGE_CREATED') {
            setBridges(prev => [...prev.filter(b => b.id !== payload.id), payload]);
            addTelemetryLog('Provenance Mesh', 'BRIDGE_FORMED', `Persistent Supply Bridge synced: ${payload.hospitalName} ⟷ ${payload.stockistName}`);
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

    // ── PRIVILEGED ZERO-CLICK MIC FAST-TRACK REORDERING ──────────────────────
    if (result.intent === 'FAST_TRACK_VOICE_ORDER') {
      const vendorKey = (result.vendor?.key || '').toLowerCase();
      const targetStockist = allStockists.find(s =>
        s.name.toLowerCase().includes(vendorKey) ||
        (result.vendor?.id && s.id === result.vendor.id) ||
        (s.hub && s.hub.toLowerCase().includes(vendorKey))
      ) || allStockists[0];

      const targetSku = result.sku || inventory[0];
      const finalQty = result.quantity || 50;
      const rate = targetStockist.stockPrices?.[targetSku.skuId] || targetSku.stockistPrice || 750;
      const finalTotal = rate * finalQty;

      // Atomic inventory deduction
      setAllStockists(prev => prev.map(stk => {
        if (stk.id === targetStockist.id) {
          const currentStock = stk.stockLevels?.[targetSku.skuId] ?? 0;
          const updatedStock = Math.max(0, currentStock - finalQty);
          return {
            ...stk,
            stockLevels: { ...stk.stockLevels, [targetSku.skuId]: updatedStock }
          };
        }
        return stk;
      }));

      broadcastEvent('STOCK_ALLOCATED', {
        stockistId: targetStockist.id,
        stockistName: targetStockist.name,
        skuId: targetSku.skuId,
        qty: finalQty,
        hospitalName: selectedHospital.name
      });

      const fastTrackOrder = {
        orderId: genId('ORD-MUM'),
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        hospitalCoords: { lat: selectedHospital.lat || 19.0515, lng: selectedHospital.lng || 72.8291 },
        stockistId: targetStockist.id,
        stockistName: targetStockist.name,
        stockistCoords: { lat: targetStockist.lat || 19.0178, lng: targetStockist.lng || 72.8478 },
        mfgId: targetSku.mfgId || 'mfg-1',
        mfgName: 'Authorized Manufacturer Hub',
        items: [{
          skuId: targetSku.skuId,
          name: targetSku.name,
          qty: finalQty,
          unit: targetSku.unit,
          rate: rate,
          total: finalTotal
        }],
        totalAmount: finalTotal,
        orderDate: 'Just Now (' + new Date().toLocaleTimeString('en-IN') + ')',
        deliveredBy: 'Today within 14 mins (Priority Sea Link Corridor)',
        deliveryStatus: 'DISPATCHED',
        transitRoute: `${targetStockist.hub} -> Sea Link Express -> ${selectedHospital.name}`,
        currentLocation: `${targetStockist.name} Express • 14 mins away • On Bandra-Worli Sea Link`,
        goodsProgressPct: 25,
        temperatureC: 'Ambient Controlled',
        paymentStatus: 'ESCROW_LOCKED',
        paymentDueBy: '45-Day Escrow Term',
        cashProgressPct: 20,
        creditAgingDays: 45,
        earlyDiscountOffer: '2% instant discount on 7-day settlement',
        fastTrack: true
      };

      setOrders(prev => [fastTrackOrder, ...prev]);
      broadcastEvent('NEW_ORDER', fastTrackOrder);
      addTelemetryLog(selectedHospital.name, 'FAST_TRACK_DISPATCH', `Zero-click voice order ${fastTrackOrder.orderId} dispatched to ${targetStockist.name} for ${finalQty} ${targetSku.unit}`);

      setLastAiMessage({
        title: '⚡ Zero-Click Fast-Track Order Dispatched',
        text: `Privileged order of ${finalQty} ${targetSku.unit} confirmed with ${targetStockist.name}. Bypassed RFQ paperwork. Driver en route, ETA 14 mins.`,
        type: 'SUCCESS'
      });
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

  // ── DYNAMIC UBER STOCKIST PING & CONCURRENCY FILTER ──────────────────────────
  const startUberStockistPing = (sku, quantity, urgency = 'STANDARD') => {
    let outOfStockFound = false;
    let outOfStockName = '';

    const quotes = allStockists.map((stk, idx) => {
      const distance = stk.distanceKm?.[selectedHospital.id] || 6.2;
      const variance = idx === 0 ? -20 : (idx === 1 ? +10 : (idx === 2 ? -40 : +15));
      const baseRate = stk.stockPrices?.[sku.skuId] || (sku.stockistPrice + variance);
      const quotedRate = baseRate;
      const totalAmount = quotedRate * quantity;
      const etaMins = Math.round(distance * 3.5 + (urgency === 'CRITICAL_EMERGENCY' ? 8 : 15));
      const availableStock = stk.stockLevels?.[sku.skuId] !== undefined ? stk.stockLevels[sku.skuId] : 100;
      const isOutOfStock = availableStock <= 0;

      if (isOutOfStock && !outOfStockFound) {
        outOfStockFound = true;
        outOfStockName = stk.name;
      }

      return {
        stockistId: stk.id,
        stockistName: stk.name,
        hub: stk.hub || stk.area,
        area: stk.area,
        lat: stk.lat,
        lng: stk.lng,
        rating: stk.rating || 4.8,
        distanceKm: distance,
        etaMinutes: etaMins,
        quotedRate,
        totalAmount,
        availableStock,
        isOutOfStock,
        outOfStockReason: isOutOfStock ? 'Batch Exhausted (Recently ordered by KEM Hospital)' : null,
        creditTerms: stk.creditOffered || '30 Days Escrow',
        isBestPrice: false,
        isFastest: idx === 1 || idx === 3
      };
    });

    if (outOfStockFound) {
      addTelemetryLog(selectedHospital.name, 'SUPPLIER_ROUTED_ALTERNATE', `${selectedHospital.name} routed to alternate supplier: ${outOfStockName} batch exhausted.`);
    }

    // Sort available quotes first by price; put out-of-stock quotes at the end
    const sortedQuotes = quotes.sort((a, b) => {
      if (a.isOutOfStock && !b.isOutOfStock) return 1;
      if (!a.isOutOfStock && b.isOutOfStock) return -1;
      return a.totalAmount - b.totalAmount;
    });

    // Lowest available gets best price badge
    const firstAvailable = sortedQuotes.find(q => !q.isOutOfStock);
    if (firstAvailable) {
      firstAvailable.isBestPrice = true;
    }

    setActiveUberPing({ sku, quantity, urgency, hospital: selectedHospital, quotes: sortedQuotes, timestamp: Date.now() });
  };

  // ── ATOMIC CONFIRM & DISPATCH WITH STATEFUL STOCK DEPLETION ──────────────────
  const confirmOrderDispatch = (selectedQuote, customQty = null) => {
    if (!activeUberPing) return;
    const finalQty = customQty !== null ? customQty : activeUberPing.quantity;
    const finalTotal = selectedQuote.quotedRate * finalQty;

    // Deduct inventory dynamically from allStockists
    setAllStockists(prev => prev.map(stk => {
      if (stk.id === selectedQuote.stockistId) {
        const currentStock = stk.stockLevels?.[activeUberPing.sku.skuId] ?? 0;
        const updatedStock = Math.max(0, currentStock - finalQty);
        return {
          ...stk,
          stockLevels: { ...stk.stockLevels, [activeUberPing.sku.skuId]: updatedStock }
        };
      }
      return stk;
    }));

    const activeHosp = loggedInHospital || selectedHospital || MUMBAI_HOSPITALS[0];

    broadcastEvent('STOCK_ALLOCATED', {
      stockistId: selectedQuote.stockistId,
      stockistName: selectedQuote.stockistName,
      skuId: activeUberPing.sku.skuId,
      qty: finalQty,
      hospitalName: activeHosp.name
    });

    const newOrder = {
      orderId: genId('ORD-MUM'),
      hospitalId: activeHosp.id,
      hospitalName: activeHosp.name,
      hospitalCoords: { lat: activeHosp.lat || 19.0515, lng: activeHosp.lng || 72.8291 },
      stockistId: selectedQuote.stockistId,
      stockistName: selectedQuote.stockistName,
      stockistCoords: { lat: selectedQuote.lat || 19.0178, lng: selectedQuote.lng || 72.8478 },
      mfgId: activeUberPing.sku.mfgId || 'mfg-1',
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
      transitRoute: `${selectedQuote.hub} -> Sea Link / WEH -> ${activeHosp.name}`,
      currentLocation: `${selectedQuote.stockistName} Express • 14 mins away • On Bandra-Worli Sea Link`,
      goodsProgressPct: 20,
      temperatureC: 'Ambient Controlled',
      paymentStatus: 'ESCROW_LOCKED',
      paymentDueBy: '45-Day Escrow Term',
      cashProgressPct: 15,
      creditAgingDays: 45,
      earlyDiscountOffer: '2% instant discount on 7-day settlement'
    };

    setOrders(prev => [newOrder, ...prev]);
    createOrUpdateBridge(newOrder);
    broadcastEvent('NEW_ORDER', newOrder);
    addTelemetryLog(activeHosp.name, 'ORDER_DISPATCHED', `Order ${newOrder.orderId} to ${selectedQuote.stockistName} for ${finalQty} ${activeUberPing.sku.unit}`);
    aiEngine.speak(`Order of ${finalQty} ${activeUberPing.sku.unit} confirmed with ${selectedQuote.stockistName}. Driver en route, ETA ${selectedQuote.etaMinutes} minutes.`);
    setActiveUberPing(null);
  };

  // ── DIRECT ON-DEMAND ORDER (Nearest Stockist or Manufacturer with 1-Time Onboarding) ──
  const placeDirectOrder = ({
    hospital,
    supplier,
    sku,
    qty = 50,
    isManufacturer = false,
    essentialDetails = null
  }) => {
    const hosp = hospital || loggedInHospital || selectedHospital;
    const targetSku = sku || inventory[0];
    const finalQty = Number(qty) || 50;
    const rate = supplier.stockPrices?.[targetSku.skuId] || supplier.hospitalRate || targetSku.hospitalRate || 750;
    const finalTotal = rate * finalQty;

    // Deduct stock if from stockist
    if (!isManufacturer) {
      setAllStockists(prev => prev.map(stk => {
        if (stk.id === supplier.id) {
          const cur = stk.stockLevels?.[targetSku.skuId] ?? 50;
          return {
            ...stk,
            stockLevels: { ...stk.stockLevels, [targetSku.skuId]: Math.max(0, cur - finalQty) }
          };
        }
        return stk;
      }));
      broadcastEvent('STOCK_ALLOCATED', {
        stockistId: supplier.id,
        stockistName: supplier.name,
        skuId: targetSku.skuId,
        qty: finalQty,
        hospitalName: hosp.name
      });
    }

    // Mark hospital as verified / first order complete
    setRegisteredHospitals(prev => prev.map(h => {
      if (h.id === hosp.id) {
        return {
          ...h,
          completedFirstOrder: true,
          ...(essentialDetails || {})
        };
      }
      return h;
    }));

    if (loggedInHospital && loggedInHospital.id === hosp.id) {
      setLoggedInHospital(prev => ({
        ...prev,
        completedFirstOrder: true,
        ...(essentialDetails || {})
      }));
    }

    const newOrder = {
      orderId: genId('ORD-MUM'),
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      hospitalCoords: { lat: hosp.lat || 19.0515, lng: hosp.lng || 72.8291 },
      stockistId: isManufacturer ? 'mfg-direct' : supplier.id,
      stockistName: supplier.name,
      stockistCoords: { lat: supplier.lat || 19.0178, lng: supplier.lng || 72.8478 },
      mfgId: isManufacturer ? supplier.id : (targetSku.mfgId || 'mfg-1'),
      mfgName: isManufacturer ? supplier.name : 'Authorized Factory Depot',
      items: [{
        skuId: targetSku.skuId,
        name: targetSku.name,
        qty: finalQty,
        unit: targetSku.unit,
        rate,
        total: finalTotal
      }],
      totalAmount: finalTotal,
      orderDate: 'Just Now (' + new Date().toLocaleTimeString('en-IN') + ')',
      deliveredBy: 'Within 25 mins (Priority Corridor)',
      deliveryStatus: 'DISPATCHED',
      transitRoute: `${supplier.hub || supplier.area || 'Logistics Depot'} -> Priority Corridor -> ${hosp.name}`,
      currentLocation: `${supplier.name} Dispatch Van • 14 mins away`,
      goodsProgressPct: 25,
      temperatureC: 'Ambient Controlled (22°C)',
      paymentStatus: 'ESCROW_LOCKED',
      paymentDueBy: '45-Day Escrow Term',
      cashProgressPct: 20,
      creditAgingDays: 45,
      earlyDiscountOffer: '2% prompt settlement incentive'
    };

    setOrders(prev => [newOrder, ...prev]);
    createOrUpdateBridge(newOrder);
    broadcastEvent('NEW_ORDER', newOrder);
    addTelemetryLog(hosp.name, 'DIRECT_ORDER_DISPATCHED', `Dispatched ${finalQty} ${targetSku.unit} from ${supplier.name} for ₹${finalTotal.toLocaleString('en-IN')}`);
    aiEngine.speak(`Direct order placed: ${finalQty} ${targetSku.name} from ${supplier.name}. Delivery vehicle dispatched!`);
    return newOrder;
  };

  // ── PERSISTENT BRIDGE FORMATION ("Web of Provenance") ────────────────────────
  const createOrUpdateBridge = (order) => {
    if (!order) return;
    const hosp = MUMBAI_HOSPITALS.find(h => h.id === order.hospitalId) || registeredHospitals.find(h => h.id === order.hospitalId) || selectedHospital;
    const stk = allStockists.find(s => s.id === order.stockistId) || { lat: 19.0178, lng: 72.8478, name: order.stockistName };
    const bridgeId = `bridge-${order.hospitalId || 'hosp-1'}-${order.stockistId || 'stock-1'}`;

    setBridges(prev => {
      const existing = prev.find(b => b.id === bridgeId);
      const updatedBridge = {
        id: bridgeId,
        hospitalId: order.hospitalId,
        hospitalName: order.hospitalName,
        hospitalCoords: { lat: hosp.lat || 19.0515, lng: hosp.lng || 72.8291 },
        stockistId: order.stockistId,
        stockistName: order.stockistName,
        stockistCoords: { lat: stk.lat || 19.0178, lng: stk.lng || 72.8478 },
        lifetimeOrders: (existing ? existing.lifetimeOrders : 0) + 1,
        totalValue: (existing ? existing.totalValue : 0) + order.totalAmount,
        avgTransitMins: 16,
        activeCreditLine: '₹25,00,000 (45-Day Escrow Active)',
        lastDeliveredDate: 'Just Now',
        fastTrackUnlocked: true,
        establishedAt: existing ? existing.establishedAt : new Date().toLocaleTimeString('en-IN')
      };
      broadcastEvent('BRIDGE_CREATED', updatedBridge);
      return [...prev.filter(b => b.id !== bridgeId), updatedBridge];
    });
    addTelemetryLog(order.hospitalName, 'BRIDGE_ESTABLISHED', `Persistent Supply Bridge formed with ${order.stockistName}. Web of Provenance updated.`);
  };

  // ── FAST-FORWARD DELIVERY LIFECYCLE TICKER ───────────────────────────────────
  const fastForwardDelivery = (orderId = null) => {
    setOrders(prev => {
      const targetOrder = orderId
        ? prev.find(o => o.orderId === orderId)
        : prev.find(o => o.deliveryStatus !== 'DELIVERED');

      if (!targetOrder) return prev;

      let nextStatus = 'IN_TRANSIT';
      let nextProgress = 60;
      let nextLoc = `${targetOrder.stockistName} Express • 8 mins away • On Bandra-Worli Sea Link`;
      let nextPaymentStatus = 'ESCROW_LOCKED (In Transit)';
      let nextCashProg = 50;

      if (targetOrder.deliveryStatus === 'DISPATCHED') {
        nextStatus = 'IN_TRANSIT';
        nextProgress = 60;
        nextLoc = `${targetOrder.stockistName} Express • 8 mins away • On Bandra-Worli Sea Link`;
        nextPaymentStatus = 'ESCROW_LOCKED (In Transit)';
        nextCashProg = 50;
      } else if (targetOrder.deliveryStatus === 'IN_TRANSIT') {
        nextStatus = 'ARRIVING';
        nextProgress = 90;
        nextLoc = `${targetOrder.stockistName} Express • 2 mins away • At Hospital Dock Gate 2`;
        nextPaymentStatus = 'INWARD_GATE_VERIFICATION';
        nextCashProg = 80;
      } else if (targetOrder.deliveryStatus === 'ARRIVING' || targetOrder.deliveryStatus !== 'DELIVERED') {
        nextStatus = 'DELIVERED';
        nextProgress = 100;
        nextLoc = 'Delivered & Received at Dock. Inward Gate Verified.';
        nextPaymentStatus = 'RELEASED_ON_DELIVERY';
        nextCashProg = 100;
      }

      const updatedOrder = {
        ...targetOrder,
        deliveryStatus: nextStatus,
        goodsProgressPct: nextProgress,
        currentLocation: nextLoc,
        paymentStatus: nextPaymentStatus,
        cashProgressPct: nextCashProg
      };

      if (nextStatus === 'DELIVERED') {
        createOrUpdateBridge(updatedOrder);
        aiEngine.speak(`Delivery for order ${updatedOrder.orderId} reached 100%. Persistent Supply Bridge formed with ${updatedOrder.stockistName}.`);
      }

      broadcastEvent('ORDER_STATUS_UPDATE', { orderId: updatedOrder.orderId, updates: updatedOrder });
      addTelemetryLog(targetOrder.hospitalName, 'DELIVERY_ADVANCE', `Order ${updatedOrder.orderId} advanced to ${nextStatus} (${nextProgress}%)`);

      return prev.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o);
    });
  };

  // ── AUTOMATED DELIVERY LIFECYCLE TICKER (Background Timer) ───────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => {
        const activeOrder = prev.find(o => o.deliveryStatus === 'DISPATCHED' || o.deliveryStatus === 'IN_TRANSIT');
        if (!activeOrder) return prev;

        let nextStatus = activeOrder.deliveryStatus;
        let nextProg = activeOrder.goodsProgressPct;
        let nextLoc = activeOrder.currentLocation;
        let nextPay = activeOrder.paymentStatus;
        let nextCash = activeOrder.cashProgressPct;

        if (activeOrder.deliveryStatus === 'DISPATCHED') {
          nextStatus = 'IN_TRANSIT';
          nextProg = 60;
          nextLoc = `${activeOrder.stockistName} Express • 12 mins away • On Bandra-Worli Sea Link`;
          nextPay = 'ESCROW_LOCKED (In Transit)';
          nextCash = 50;
        } else if (activeOrder.deliveryStatus === 'IN_TRANSIT') {
          nextStatus = 'ARRIVING';
          nextProg = 90;
          nextLoc = `${activeOrder.stockistName} Express • 2 mins away • At Hospital Dock Gate 2`;
          nextPay = 'INWARD_GATE_VERIFICATION';
          nextCash = 85;
        }

        const updated = {
          ...activeOrder,
          deliveryStatus: nextStatus,
          goodsProgressPct: nextProg,
          currentLocation: nextLoc,
          paymentStatus: nextPay,
          cashProgressPct: nextCash
        };

        broadcastEvent('ORDER_STATUS_UPDATE', { orderId: updated.orderId, updates: updated });
        return prev.map(o => o.orderId === updated.orderId ? updated : o);
      });
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  // Ward Inventory Depletion → Auto-Reorder (Isolated per hospital)
  const consumeWardItem = (skuId, amount = 10, wardName = 'Operation Theatre 1') => {
    const hosp = loggedInHospital || selectedHospital || MUMBAI_HOSPITALS[0];
    const hospId = hosp.id;

    setInventory(prev => {
      const updated = prev.map(item => {
        if (item.skuId === skuId) {
          const currentStock = (item.hospitalStock && item.hospitalStock[hospId] !== undefined)
            ? item.hospitalStock[hospId]
            : (hospId === 'hosp-1' ? item.hospStockLilavati : (item.hospStockLilavati || Math.round(item.reorderLevel * 1.5)));

          const newStock = Math.max(0, currentStock - amount);
          broadcastEvent('INVENTORY_CONSUMED', { skuId, newStock, hospitalId: hospId });

          if (newStock <= item.reorderLevel) {
            const alertMsg = `Critical threshold breached at ${hosp.name}: ${item.name} at ${newStock} units in ${wardName}. Auto-generating replenishment requisition...`;
            aiEngine.speak(alertMsg);
            setLastAiMessage({ title: 'Auto-Replenishment Triggered', text: alertMsg, type: 'CRITICAL' });
            setTimeout(() => startUberStockistPing(item, 50, 'CRITICAL_EMERGENCY'), 1200);
          } else {
            setLastAiMessage({ title: 'Ward Item Consumed', text: `Consumed ${amount} units of ${item.name} in ${wardName} (${hosp.name}). Remaining stock: ${newStock}.`, type: 'INFO' });
          }

          addTelemetryLog(hosp.name, 'WARD_CONSUMPTION', `[${hosp.name} Private] Consumed ${amount} ${item.unit} of ${item.name} in ${wardName}`);
          return {
            ...item,
            hospStockLilavati: hospId === 'hosp-1' ? newStock : item.hospStockLilavati,
            hospitalStock: {
              ...(item.hospitalStock || {}),
              [hospId]: newStock
            }
          };
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
  const signupStockist = ({ ownerName, businessName, hub, area, phone, pin, initialStock, initialPrices }) => {
    const exists = registeredStockists.find(s => s.name.toLowerCase() === businessName.toLowerCase()) ||
                   allStockists.find(s => s.name.toLowerCase() === businessName.toLowerCase());
    if (exists) return { error: 'A business with this name is already registered. Please log in instead.' };

    const chosenArea = area || hub || 'Dadar West';
    const coords = MUMBAI_GEO_AREAS[chosenArea] || MUMBAI_GEO_AREAS['Dadar West'] || { lat: 19.0178, lng: 72.8478 };

    const distanceKm = {};
    MUMBAI_HOSPITALS.forEach(h => {
      const dLat = (h.lat - coords.lat) * 111;
      const dLng = (h.lng - coords.lng) * 105;
      distanceKm[h.id] = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10;
    });

    const newStockist = {
      id: genId('STK-MUM'),
      name: businessName,
      ownerName,
      hub: hub || chosenArea,
      area: chosenArea,
      lat: coords.lat,
      lng: coords.lng,
      rating: 5.0,
      deliverySLA: '35 mins (Express)',
      distanceKm,
      contactPerson: `${ownerName} (Owner)`,
      phone,
      whatsapp: phone,
      authorizedBrands: ['Generic Med', 'Polymed', 'Dispovan'],
      creditOffered: '15-30 Days',
      warehouseStockLevel: 'Live Declared Opening Stock',
      stockLevels: initialStock || { 'SKU-GLV-75': 50, 'SKU-SYR-5ML': 30 },
      stockPrices: initialPrices || { 'SKU-GLV-75': 750, 'SKU-SYR-5ML': 420 },
      isNewBlip: true, // triggers pulsating radar ring on map
      registeredAt: new Date().toISOString()
    };

    setAllStockists(prev => [newStockist, ...prev]);
    setRegisteredStockists(prev => [newStockist, ...prev]);
    broadcastEvent('SUPPLIER_REGISTERED', newStockist);
    addTelemetryLog(businessName, 'STOCKIST_SIGNUP', `New stockist: ${businessName} registered at ${chosenArea} with live map radar blip.`);
    return { stockist: newStockist };
  };

  const loginStockist = (stockist) => {
    setLoggedInStockist(stockist);
    const matched = allStockists.find(s => s.id === stockist.id) || MUMBAI_STOCKISTS.find(s => s.id === stockist.id);
    if (matched) setSelectedStockist(matched);
    addTelemetryLog(stockist.name, 'STOCKIST_LOGIN', `${stockist.ownerName} logged in`);
  };

  const logoutStockist = () => {
    setLoggedInStockist(null);
    setSelectedStockist(allStockists[0] || MUMBAI_STOCKISTS[0]);
  };

  // ── MANUFACTURER AUTH FUNCTIONS ───────────────────────────────────────────────
  const signupManufacturer = ({ repName, title, companyName, brand, area, hub, phone, pin, initialStock }) => {
    const exists = registeredManufacturers.find(m => m.name.toLowerCase() === companyName.toLowerCase()) ||
                   allManufacturers.find(m => m.name.toLowerCase() === companyName.toLowerCase());
    if (exists) return { error: 'This company is already registered. Please log in instead.' };

    const chosenArea = area || hub || 'Bhiwandi C&F';
    const coords = MUMBAI_GEO_AREAS[chosenArea] || MUMBAI_GEO_AREAS['Bhiwandi C&F'] || { lat: 19.2968, lng: 73.0631 };

    const newMfg = {
      id: genId('MFG-MUM'),
      name: companyName,
      repName,
      title: title || 'Sales Manager',
      brand: brand || companyName,
      area: chosenArea,
      primaryHub: chosenArea,
      lat: coords.lat,
      lng: coords.lng,
      phone,
      pin,
      isNewBlip: true,
      registeredAt: new Date().toISOString()
    };

    setAllManufacturers(prev => [newMfg, ...prev]);
    setRegisteredManufacturers(prev => [newMfg, ...prev]);
    broadcastEvent('SUPPLIER_REGISTERED', newMfg);
    addTelemetryLog(companyName, 'MFG_SIGNUP', `New manufacturer: ${companyName} (${brand}) registered at ${chosenArea}`);
    return { manufacturer: newMfg };
  };

  const loginManufacturer = (manufacturer) => {
    setLoggedInManufacturer(manufacturer);
    const matched = allManufacturers.find(m => m.id === manufacturer.id) || MUMBAI_MANUFACTURERS.find(m => m.id === manufacturer.id);
    if (matched) setSelectedManufacturer(matched);
    addTelemetryLog(manufacturer.name, 'MFG_LOGIN', `${manufacturer.repName} logged in`);
  };

  const logoutManufacturer = () => {
    setLoggedInManufacturer(null);
    setSelectedManufacturer(allManufacturers[0] || MUMBAI_MANUFACTURERS[0]);
  };

  // ── PER-HOSPITAL ORDERS FILTER (Strict Privacy) ─────────────────────────────
  const getOrdersForCurrentView = () => {
    if (currentRole === 'HOSPITAL') {
      const activeH = loggedInHospital || selectedHospital;
      if (activeH) {
        return orders.filter(o => o.hospitalId === activeH.id);
      }
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
        // Dynamic Suppliers & Distributed Mesh State
        allStockists, setAllStockists,
        allManufacturers, setAllManufacturers,
        bridges, setBridges,
        fastForwardDelivery,
        createOrUpdateBridge,
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
        placeDirectOrder,
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
