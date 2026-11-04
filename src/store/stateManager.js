// Reactive State Manager & Cross-Device Event Bus
// Real-time synchronization between Desktop Command Center and Mobile Companion

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

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Current Active Persona
  const [currentRole, setCurrentRole] = useState('HOSPITAL'); // 'HOSPITAL' | 'STOCKIST' | 'MANUFACTURER'
  const [selectedHospital, setSelectedHospital] = useState(MUMBAI_HOSPITALS[0]);
  const [selectedStockist, setSelectedStockist] = useState(MUMBAI_STOCKISTS[0]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(MUMBAI_MANUFACTURERS[0]);

  // View / Layout Modes: 'DESKTOP' (Full Screen) | 'MOBILE' (App view) | 'SPLIT_SYNC' (Dual Synced View)
  const [deviceMode, setDeviceMode] = useState('SPLIT_SYNC');

  // Real-Time Supply Chain State
  const [inventory, setInventory] = useState(MEDICAL_CATALOG);
  const [orders, setOrders] = useState(INITIAL_SUPPLY_CHAIN_ORDERS);
  const [wards, setWards] = useState(HOSPITAL_WARDS);

  // Central Data Lake Telemetry
  const [dataLakeLogs, setDataLakeLogs] = useState([
    { id: 'log-1', timestamp: '18:10:02', source: 'Lilavati Hospital', event: 'VOICE_QUERY', detail: '"Show inventory to order tomorrow"', status: 'PROCESSED' },
    { id: 'log-2', timestamp: '18:12:15', source: 'Entero Healthcare', event: 'STOCKIST_PING', detail: 'Received dispatch alert for Dadar corridor', status: 'ACKNOWLEDGED' },
    { id: 'log-3', timestamp: '18:14:40', source: 'HMD Dispovan', event: 'MFG_SYNC', detail: 'Central C&F stock levels updated: 1.2M units', status: 'SYNCD' },
    { id: 'log-4', timestamp: '18:15:20', source: 'Talent Lake (Campus)', event: 'RECRUITER_SEARCH', detail: 'Placement search: MedTech SCM Analyst (Mumbai)', status: 'INDEXED' }
  ]);

  // Modals & Dynamic UI Triggers
  const [activeUberPing, setActiveUberPing] = useState(null); // { sku, quantity, hospital, quotes: [] }
  const [showUnknownEntityModal, setShowUnknownEntityModal] = useState(false);
  const [unknownEntityData, setUnknownEntityData] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDataLakeModal, setShowDataLakeModal] = useState(false);

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
          console.log('[CrossDeviceSync] Received event:', type, payload);
          if (type === 'NEW_ORDER') {
            setOrders(prev => [payload, ...prev]);
            addTelemetryLog('Remote Device', 'ORDER_CREATED', `Order ${payload.orderId} synced across devices`);
          } else if (type === 'INVENTORY_CONSUMED') {
            setInventory(prev => prev.map(item => item.skuId === payload.skuId ? { ...item, hospStockLilavati: payload.newStock } : item));
          } else if (type === 'ROLE_CHANGE') {
            setCurrentRole(payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or error:', e);
      }
    }
    return () => {
      if (channel) channel.close();
    };
  }, []);

  const broadcastEvent = (type, payload) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('mumbai_medpulse_sync');
        channel.postMessage({ type, payload });
        channel.close();
      } catch (e) {}
    }
  };

  const addTelemetryLog = (source, event, detail) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setDataLakeLogs(prev => [
      { id: 'log-' + Date.now(), timestamp: time, source, event, detail, status: 'RECORDED' },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  };

  // Trigger Live Voice / Text Processing
  const handleVoiceOrTextInput = (text) => {
    setTranscript(text);
    const result = aiEngine.parseVoiceOrText(text, selectedHospital);

    // Speak audio feedback
    if (result.speechReply) {
      aiEngine.speak(result.speechReply);
    }

    addTelemetryLog(
      currentRole === 'HOSPITAL' ? selectedHospital.name : (currentRole === 'STOCKIST' ? selectedStockist.name : selectedManufacturer.name),
      result.intent,
      `Prompt: "${text}"`
    );

    if (result.intent === 'UNKNOWN_ENTITY') {
      setShowUnknownEntityModal(true);
      setUnknownEntityData({ prompt: text });
      setLastAiMessage({
        title: 'Unknown Entity Detected',
        text: result.speechReply,
        type: 'WARNING'
      });
      return;
    }

    if (result.intent === 'UBER_PING_SEARCH' || result.intent === 'CREATE_REQUISITION') {
      const targetSku = result.sku || (result.entities && result.entities.sku) || inventory[0];
      const qty = result.entities ? result.entities.quantity : 50;
      startUberStockistPing(targetSku, qty, result.entities ? result.entities.urgency : 'STANDARD');
      setLastAiMessage({
        title: 'Uber Reverse-Ping Active',
        text: result.speechReply,
        type: 'SUCCESS'
      });
      return;
    }

    if (result.intent === 'INVENTORY_REORDER_FORECAST') {
      setLastAiMessage({
        title: 'Inventory Reorder Forecast (Lilavati Hospital)',
        text: result.speechReply,
        type: 'INFO'
      });
      return;
    }

    if (result.intent === 'STOCKIST_DEMAND_RADAR') {
      setLastAiMessage({
        title: 'Mumbai Hospital Demand Radar',
        text: result.speechReply,
        type: 'SUCCESS'
      });
      return;
    }

    setLastAiMessage({
      title: 'Agent Response',
      text: result.speechReply,
      type: 'INFO'
    });
  };

  // Launch Uber-Style Stockist Ping
  const startUberStockistPing = (sku, quantity, urgency = 'STANDARD') => {
    // Generate realistic multi-stockist bids with travel times across Mumbai
    const quotes = MUMBAI_STOCKISTS.map((stk, idx) => {
      const distance = stk.distanceKm[selectedHospital.id] || 6.2;
      const basePrice = sku.stockistPrice;
      // Slight price variance per stockist
      const variance = idx === 0 ? -20 : (idx === 1 ? +10 : (idx === 2 ? -40 : +15));
      const quotedRate = basePrice + variance;
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
        availableStock: Math.floor(Math.random() * 400 + 120),
        creditTerms: stk.creditOffered,
        isBestPrice: idx === 2 || idx === 0,
        isFastest: idx === 1 || idx === 3
      };
    }).sort((a, b) => a.totalAmount - b.totalAmount);

    setActiveUberPing({
      sku,
      quantity,
      urgency,
      hospital: selectedHospital,
      quotes,
      timestamp: Date.now()
    });
  };

  // Confirm and Dispatch Order from Uber Ping
  const confirmOrderDispatch = (selectedQuote, customQty = null) => {
    if (!activeUberPing) return;

    const finalQty = customQty !== null ? customQty : activeUberPing.quantity;
    const finalTotal = selectedQuote.quotedRate * finalQty;

    const newOrder = {
      orderId: 'ORD-MUM-' + Math.floor(1000 + Math.random() * 9000),
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      stockistId: selectedQuote.stockistId,
      stockistName: selectedQuote.stockistName,
      mfgId: activeUberPing.sku.mfgId,
      mfgName: 'Authorized Manufacturer Hub',
      items: [
        {
          skuId: activeUberPing.sku.skuId,
          name: activeUberPing.sku.name,
          qty: finalQty,
          unit: activeUberPing.sku.unit,
          rate: selectedQuote.quotedRate,
          total: finalTotal
        }
      ],
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
    addTelemetryLog(selectedHospital.name, 'ORDER_DISPATCHED', `Order ${newOrder.orderId} awarded to ${selectedQuote.stockistName} for ${finalQty} ${activeUberPing.sku.unit}`);
    
    aiEngine.speak(`Order of ${finalQty} ${activeUberPing.sku.unit} confirmed with ${selectedQuote.stockistName}. Driver is en route with ETA ${selectedQuote.etaMinutes} minutes.`);

    setActiveUberPing(null);
  };

  // Hospital Ward Inventory Depletion (Direct link between consumption & replenishment)
  const consumeWardItem = (skuId, amount = 10, wardName = 'Operation Theatre 1') => {
    setInventory(prev => {
      const updated = prev.map(item => {
        if (item.skuId === skuId) {
          const newStock = Math.max(0, item.hospStockLilavati - amount);
          broadcastEvent('INVENTORY_CONSUMED', { skuId, newStock });

          // Check if below reorder level
          if (newStock <= item.reorderLevel) {
            const alertMsg = `Critical threshold breached: ${item.name} at ${newStock} units in ${wardName}. Auto-generating replenishment requisition...`;
            aiEngine.speak(alertMsg);
            setLastAiMessage({
              title: 'Auto-Replenishment Triggered',
              text: alertMsg,
              type: 'CRITICAL'
            });
            // Auto start uber ping
            setTimeout(() => {
              startUberStockistPing(item, 50, 'CRITICAL_EMERGENCY');
            }, 1200);
          } else {
            setLastAiMessage({
              title: 'Ward Item Consumed',
              text: `Consumed ${amount} units of ${item.name} in ${wardName}. Remaining Lilavati stock: ${newStock}.`,
              type: 'INFO'
            });
          }

          addTelemetryLog(selectedHospital.name, 'WARD_CONSUMPTION', `Consumed ${amount} ${item.unit} of ${item.name} in ${wardName}`);
          return { ...item, hospStockLilavati: newStock };
        }
        return item;
      });
      return updated;
    });
  };

  // Register New Entity (Conversational Onboarding)
  const registerNewEntity = (name, title, entityName, mobile, type = 'HOSPITAL') => {
    const newHosp = {
      id: 'hosp-' + Date.now(),
      name: entityName,
      type: 'Registered Care Provider',
      beds: 50,
      area: 'Mumbai Metropolitan Region',
      lat: 19.10,
      lng: 72.85,
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

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole: (r) => {
          setCurrentRole(r);
          broadcastEvent('ROLE_CHANGE', r);
        },
        selectedHospital,
        setSelectedHospital,
        selectedStockist,
        setSelectedStockist,
        selectedManufacturer,
        setSelectedManufacturer,
        deviceMode,
        setDeviceMode,
        inventory,
        orders,
        wards,
        dataLakeLogs,
        activeUberPing,
        setActiveUberPing,
        showUnknownEntityModal,
        setShowUnknownEntityModal,
        unknownEntityData,
        showPermissionsModal,
        setShowPermissionsModal,
        showDataLakeModal,
        setShowDataLakeModal,
        isListening,
        setIsListening,
        transcript,
        setTranscript,
        lastAiMessage,
        handleVoiceOrTextInput,
        startUberStockistPing,
        confirmOrderDispatch,
        consumeWardItem,
        registerNewEntity,
        addTelemetryLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
