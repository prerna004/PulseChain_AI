// Agentic Voice & Natural Language Processing Engine — v2
// 100% Zero-Click Field Population from Speech/Text
// Enhanced: Full entity extraction — item, qty, urgency, ward, hospital, stockist

import { MEDICAL_CATALOG, MUMBAI_HOSPITALS, MUMBAI_STOCKISTS } from '../data/mumbaiData';

export class AgentEngine {
  constructor() {
    this.speechRecognition = null;
    this.isListening = false;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.lang = 'en-IN'; // Indian English / Hinglish
      }
    }
  }

  // Text to Speech
  speak(text) {
    if (typeof window !== 'undefined' && this.synthesis) {
      try {
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-IN';
        this.synthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  }

  // ── MAIN PARSER ──────────────────────────────────────────────────────────────
  parseVoiceOrText(inputString, currentEntity = null) {
    const raw = (inputString || '').trim();
    const lower = raw.toLowerCase();

    // 1. Unknown entity check
    if (this.detectUnknownEntity(raw, currentEntity)) {
      return {
        intent: 'UNKNOWN_ENTITY',
        rawText: raw,
        confidence: 0.95,
        speechReply: "We don't seem to have you on our database. Please share your name, title, hospital and mobile number or WhatsApp Business account so we can assist you better.",
        requiresOnboarding: true
      };
    }

    // 2. Inventory reorder forecast
    if (
      lower.includes('inventory') &&
      (lower.includes('order tomorrow') || lower.includes('need to order') || lower.includes('low') || lower.includes('reorder') || lower.includes('tomorrow') || lower.includes('kal'))
    ) {
      const lowStockItems = MEDICAL_CATALOG.filter(item => item.hospStockLilavati <= item.reorderLevel + 10);
      const itemNames = lowStockItems.slice(0, 3).map(i => i.name).join(', ');
      return {
        intent: 'INVENTORY_REORDER_FORECAST',
        rawText: raw,
        confidence: 0.96,
        speechReply: `Found ${lowStockItems.length} items below safety threshold. Priority items to order: ${itemNames}. Shall I ping stockists for these items now?`,
        data: lowStockItems
      };
    }

    // 3. Stockist demand radar
    if (
      (lower.includes('which hospitals') || lower.includes('hospitals need') || lower.includes('who needs') || lower.includes('demand') || lower.includes('kaun chahiye'))
      && (lower.includes('product') || lower.includes('stock') || lower.includes('supplies') || lower.includes('order'))
    ) {
      return {
        intent: 'STOCKIST_DEMAND_RADAR',
        rawText: raw,
        confidence: 0.94,
        speechReply: 'Lilavati Hospital urgently needs 15 cartons Dispovan 5ml and IV Cannulas. Hinduja Hospital requires 25 boxes Polymed 20G. KEM needs N95 masks urgently. Total demand across Mumbai: ₹2.14 Lakhs.',
        data: {
          targetHospitals: ['Lilavati Hospital & Research Centre', 'P.D. Hinduja National Hospital', 'KEM Hospital'],
          totalValue: '₹2,14,500',
          urgency: 'HIGH'
        }
      };
    }

    // 4. WhatsApp integration request
    if (lower.includes('whatsapp') || lower.includes('watsapp') || lower.includes('wa ') || lower.includes('import conversation')) {
      return {
        intent: 'WHATSAPP_IMPORT',
        rawText: raw,
        confidence: 0.97,
        speechReply: 'Opening WhatsApp import. Paste your WhatsApp Business conversation and I will automatically extract and fill all order fields for you.'
      };
    }

    // 5. Best price / Uber ping search
    if (
      lower.includes('best price') || lower.includes('find price') || lower.includes('ping') ||
      lower.includes('rate') || lower.includes('cheapest') || lower.includes('sabse sasta') ||
      lower.includes('quote') || lower.includes('compare')
    ) {
      const matchedSku = this.matchSkuFromText(lower) || MEDICAL_CATALOG[0];
      return {
        intent: 'UBER_PING_SEARCH',
        rawText: raw,
        confidence: 0.92,
        sku: matchedSku,
        speechReply: `Pinging all Mumbai stockists in Dadar and Dawa Bazar for ${matchedSku.name}. Searching best price now...`,
        triggerPingModal: true
      };
    }

    // 6. Requisition / Order placement — Full entity extraction (NO MANUAL FIELDS NEEDED)
    const orderEntities = this.extractOrderEntities(raw);
    if (orderEntities && orderEntities.sku) {
      const { sku, quantity, urgency, targetWard, estimatedTotal } = orderEntities;
      const confirmText = `Requisition auto-filled: ${quantity} ${sku.unit} of ${sku.name} for ${targetWard}. ` +
        `Urgency: ${urgency === 'CRITICAL_EMERGENCY' ? 'URGENT' : urgency === 'NEXT_DAY_MORNING' ? 'Tomorrow morning' : 'Standard'}. ` +
        `Estimated cost: ₹${estimatedTotal.toLocaleString('en-IN')}. Pinging stockists now.`;
      return {
        intent: 'CREATE_REQUISITION',
        rawText: raw,
        confidence: 0.91,
        speechReply: confirmText,
        entities: orderEntities,
        triggerPingModal: true
      };
    }

    // 7. Show orders / delivery status
    if (lower.includes('order status') || lower.includes('delivery') || lower.includes('track') || lower.includes('kahan hai')) {
      return {
        intent: 'TRACK_ORDER',
        rawText: raw,
        confidence: 0.89,
        speechReply: 'Your last order ORD-MUM-8921 is currently at Mahim Causeway, ETA 18 minutes. Payment status: Escrow locked for 60-day credit.'
      };
    }

    // 8. Show stockist contacts
    if (lower.includes('stockist') && (lower.includes('contact') || lower.includes('number') || lower.includes('call'))) {
      const stk = MUMBAI_STOCKISTS[0];
      return {
        intent: 'STOCKIST_CONTACT',
        rawText: raw,
        confidence: 0.88,
        speechReply: `Nearest stockist: ${stk.name} at ${stk.hub}. Contact: ${stk.contactPerson}, WhatsApp: ${stk.whatsapp}. Delivery SLA: ${stk.deliverySLA}.`
      };
    }

    // 9. Payment / financial query
    if (lower.includes('payment') || lower.includes('credit') || lower.includes('payment due') || lower.includes('bill')) {
      return {
        intent: 'PAYMENT_STATUS',
        rawText: raw,
        confidence: 0.87,
        speechReply: 'Outstanding: ₹91,200 due 31 Dec 2026 (Lilavati). ₹45,500 due 15 Dec 2026 (Hinduja). Early settlement discount available: 2% if paid within 10 days.'
      };
    }

    // Default
    return {
      intent: 'GENERAL_ASSISTANCE',
      rawText: raw,
      confidence: 0.85,
      speechReply: `Processing: "${raw}". Checking Mumbai healthcare data lake for relevant information.`
    };
  }

  // ── FULL ENTITY EXTRACTION — fills ALL fields from voice, no manual input ────
  extractOrderEntities(text) {
    const lower = text.toLowerCase();

    // 1. SKU matching
    const matchedSku = this.matchSkuFromText(lower);
    if (!matchedSku) return null;

    // 2. Quantity extraction — numbers + Hindi numerals
    let quantity = 50;
    const hindiNumbers = { 'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'das': 10, 'bis': 20, 'pachas': 50, 'sau': 100 };
    const numMatch = text.match(/(\d+)\s*(boxes?|cartons?|packs?|units?|pairs?|vials?|tubes?|pcs?|bottles?)?/i);
    if (numMatch && numMatch[1]) {
      quantity = parseInt(numMatch[1], 10);
    } else {
      for (const [word, num] of Object.entries(hindiNumbers)) {
        if (lower.includes(word)) { quantity = num; break; }
      }
    }

    // 3. Urgency
    let urgency = 'STANDARD';
    if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('immediately') ||
        lower.includes('jaldi') || lower.includes('critical') || lower.includes('abhi') || lower.includes('turant')) {
      urgency = 'CRITICAL_EMERGENCY';
    } else if (lower.includes('tomorrow') || lower.includes('kal') || lower.includes('morning') || lower.includes('subah')) {
      urgency = 'NEXT_DAY_MORNING';
    } else if (lower.includes('week') || lower.includes('hafte')) {
      urgency = 'WEEKLY_STOCK';
    }

    // 4. Target ward / location
    let targetWard = 'Central Hospital Stores';
    if (lower.includes('ot') || lower.includes('operation theatre') || lower.includes('operation theater') || lower.includes('ot-') || lower.includes('cardiac')) {
      targetWard = 'Operation Theatre Complex (3rd Floor)';
    } else if (lower.includes('icu') || lower.includes('intensive care') || lower.includes('critical care')) {
      targetWard = 'Medical ICU (4th Floor)';
    } else if (lower.includes('emergency') || lower.includes('trauma') || lower.includes('casualty')) {
      targetWard = 'Emergency & Trauma Bay';
    } else if (lower.includes('pharmacy') || lower.includes('pharma') || lower.includes('dispensary')) {
      targetWard = 'Hospital Pharmacy';
    } else if (lower.includes('lab') || lower.includes('pathology') || lower.includes('diagnostic')) {
      targetWard = 'Pathology Lab';
    } else if (lower.includes('ward') || lower.includes('general')) {
      targetWard = 'General Ward';
    }

    // 5. Delivery time preference
    let deliveryPreference = null;
    if (lower.includes('by tonight') || lower.includes('aaj raat') || lower.includes('evening')) {
      deliveryPreference = 'By Evening Today';
    } else if (lower.includes('by morning') || lower.includes('subah tak')) {
      deliveryPreference = 'By Tomorrow Morning (8 AM)';
    }

    // 6. Target hospital / stockist from text
    let targetHospital = null;
    for (const h of MUMBAI_HOSPITALS) {
      if (lower.includes(h.name.toLowerCase().substring(0, 8))) {
        targetHospital = h.name;
        break;
      }
    }

    return {
      sku: matchedSku,
      quantity,
      urgency,
      targetWard,
      deliveryPreference,
      targetHospital,
      estimatedTotal: quantity * matchedSku.hospitalRate,
      autoFilledFields: ['item', 'quantity', 'urgency', 'ward', 'estimatedTotal'] // For UI to highlight
    };
  }

  // ── SKU MATCHING ————— Extended for full catalog ──────────────────────────────
  matchSkuFromText(lower) {
    // Surgical gloves
    if (lower.includes('glove') || lower.includes('latex') || lower.includes('haath ke dastaane') ||
        (lower.includes('surgical') && (lower.includes('7.5') || lower.includes('7.0') || lower.includes('70') || lower.includes('75')))) {
      if (lower.includes('7.0') || lower.includes('70') || lower.includes('size 7')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-GLV-70');
      if (lower.includes('nitrile') || lower.includes('exam')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-GLV-NTRLE');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-GLV-75');
    }

    // IV Cannula
    if (lower.includes('cannula') || lower.includes('iv set') || lower.includes('polymed') || lower.includes('venflon') || lower.includes('iv line')) {
      if (lower.includes('22') || lower.includes('blue')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-CAN-22G');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-CAN-20G');
    }

    // Infusion set
    if (lower.includes('infusion set') || lower.includes('drip set') || lower.includes('iv set')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-IFS-15DR');
    }

    // Syringes
    if (lower.includes('syringe') || lower.includes('dispovan') || lower.includes('hmd') || lower.includes('injection') || lower.includes('needle')) {
      if (lower.includes('2ml') || lower.includes('2 ml')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SYR-2ML');
      if (lower.includes('10ml') || lower.includes('10 ml')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SYR-10ML');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SYR-5ML');
    }

    // Blood collection tubes
    if (lower.includes('vacutainer') || lower.includes('edta') || lower.includes('blood tube') || lower.includes('bd tube') || lower.includes('lavender')) {
      if (lower.includes('plain') || lower.includes('sst') || lower.includes('yellow')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-VAC-PLAIN');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-VAC-EDTA');
    }

    // Masks
    if (lower.includes('mask') || lower.includes('n95') || lower.includes('respirator') || lower.includes('3m 1860')) {
      if (lower.includes('surgical') || lower.includes('3 ply') || lower.includes('three ply') || lower.includes('blue mask')) {
        return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-MSK-SRG3PLY');
      }
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-MSK-N95');
    }

    // Hand sanitizer / disinfectant
    if (lower.includes('sanitiz') || lower.includes('disinfect') || lower.includes('sterillium') || lower.includes('hand rub')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-INF-HAB');
    }

    // Critical care / ICU drugs
    if (lower.includes('norad') || lower.includes('noradrenaline') || lower.includes('nor')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-NOR-2MG');
    }
    if (lower.includes('propofol') || lower.includes('anaesthesia') || lower.includes('anesthesia')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-PRF-200MG');
    }

    // Dressings
    if (lower.includes('tegaderm') || lower.includes('transparent dressing') || lower.includes('film dressing')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-DRS-TGD');
    }
    if (lower.includes('micropore') || lower.includes('surgical tape') || lower.includes('adhesive tape')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-DRS-MCP');
    }

    // Sutures
    if (lower.includes('vicryl') || lower.includes('absorbable suture') || lower.includes('polyglactin')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SUT-VCR');
    }
    if (lower.includes('ethilon') || lower.includes('nylon suture') || lower.includes('silk suture') || lower.includes('non absorbable')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SUT-ETH');
    }
    if (lower.includes('suture') || lower.includes('stitch') || lower.includes('tikanka')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SUT-VCR');
    }

    // IV fluids
    if (lower.includes('saline') || lower.includes('nacl') || lower.includes('normal saline') || lower.includes('ns bottle')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-FLD-SAL');
    }
    if (lower.includes("ringer") || lower.includes('rl ') || lower.includes("lactate")) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-FLD-RL');
    }
    if (lower.includes('dextrose') || lower.includes('d5') || lower.includes('glucose drip')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-FLD-DEXT');
    }
    if (lower.includes('iv fluid') || lower.includes('drip') || lower.includes('bottle') || lower.includes('saline bottle')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-FLD-SAL');
    }

    // Equipment
    if (lower.includes('nebulizer') || lower.includes('nebuliser') || lower.includes('compressor')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SPL-NEB');
    }
    if (lower.includes('blood pressure') || lower.includes('bp monitor') || lower.includes('bp machine') || lower.includes('sphygm')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SPL-BPM');
    }
    if (lower.includes('oximeter') || lower.includes('spo2') || lower.includes('oxygen saturation') || lower.includes('pulse ox')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SPL-OXM');
    }

    // Catheter / foley
    if (lower.includes('foley') || lower.includes('catheter') || lower.includes('ryles') || lower.includes('urine bag')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SPL-FOLEY');
    }

    // OT drapes / surgical gowns
    if (lower.includes('drape') || lower.includes('ot drape') || lower.includes('surgical drape')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-OTT-DRAPE');
    }
    if (lower.includes('gown') || lower.includes('apron') || lower.includes('surgical gown')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SRG-GOWN');
    }

    // Cipla / generic drug
    if (lower.includes('cipla') || lower.includes('vial') || lower.includes('ampoule') || lower.includes('ampule')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-NOR-2MG');
    }

    return null;
  }

  // Detect unknown entity
  detectUnknownEntity(text, currentEntity) {
    const lower = text.toLowerCase();
    return (
      lower.includes('i am from') ||
      lower.includes('new clinic') ||
      lower.includes('unknown hospital') ||
      lower.includes('not registered') ||
      lower.includes('asha clinic') ||
      lower.includes('borivali clinic') ||
      lower.includes('my name is') && (lower.includes('hospital') || lower.includes('clinic') || lower.includes('doctor'))
    );
  }
}

export const aiEngine = new AgentEngine();
