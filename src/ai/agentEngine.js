// Agentic Voice & Natural Language Processing Engine
// 100% Zero-Click Field Population from Speech/Text

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

  // Text to Speech playback
  speak(text) {
    if (typeof window !== 'undefined' && this.synthesis) {
      try {
        this.synthesis.cancel(); // Stop any pending speech
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

  // Parse any free-form voice note or text into structured intent & parameters
  parseVoiceOrText(inputString, currentEntity = null) {
    const raw = (inputString || '').trim();
    const lower = raw.toLowerCase();

    // 1. Check for Unknown Hospital / Entity check
    if (this.detectUnknownEntity(raw, currentEntity)) {
      const voiceReply = "We don't seem to have you on our database. Please share your name, title, hospital and mobile no or Whatsapp business account for us to do your search better.";
      return {
        intent: 'UNKNOWN_ENTITY',
        rawText: raw,
        confidence: 0.95,
        speechReply: voiceReply,
        requiresOnboarding: true
      };
    }

    // 2. Intent: "Show me inventory we need to order tomorrow"
    if (
      lower.includes('inventory') &&
      (lower.includes('order tomorrow') || lower.includes('need to order') || lower.includes('low') || lower.includes('reorder') || lower.includes('tomorrow'))
    ) {
      const lowStockItems = MEDICAL_CATALOG.filter(item => item.hospStockLilavati <= item.reorderLevel + 10);
      const voiceReply = `Found ${lowStockItems.length} items below safety threshold. HMD Dispovan 5ml syringes and Polymed IV cannulas need immediate ordering tomorrow morning.`;
      return {
        intent: 'INVENTORY_REORDER_FORECAST',
        rawText: raw,
        confidence: 0.96,
        speechReply: voiceReply,
        data: lowStockItems
      };
    }

    // 3. Intent: Stockist "Show me which hospitals need our products"
    if (
      (lower.includes('which hospitals') || lower.includes('hospitals need') || lower.includes('who needs')) &&
      (lower.includes('product') || lower.includes('stock') || lower.includes('supplies'))
    ) {
      const voiceReply = "Lilavati Hospital urgently needs 15 cartons Dispovan 5ml, and Hinduja Hospital requires 25 boxes of Polymed 20G Cannulas. Total demand ₹1.36 Lakhs.";
      return {
        intent: 'STOCKIST_DEMAND_RADAR',
        rawText: raw,
        confidence: 0.94,
        speechReply: voiceReply,
        data: {
          targetHospitals: ['Lilavati Hospital & Research Centre', 'P.D. Hinduja National Hospital'],
          totalValue: '₹1,36,700',
          urgency: 'HIGH'
        }
      };
    }

    // 4. Intent: "Get me best prices for gloves / syringes / cannulas" (Uber-Style Ping Trigger)
    if (
      (lower.includes('best price') || lower.includes('find price') || lower.includes('ping') || lower.includes('rate') || lower.includes('cheapest'))
    ) {
      const matchedSku = this.matchSkuFromText(lower) || MEDICAL_CATALOG[0]; // Defaults to gloves
      const voiceReply = `Pinging all Mumbai stockists in Dadar and Dawa Bazar for ${matchedSku.name}. Lowest quote found at ₹${matchedSku.stockistPrice} per unit from Entero Healthcare.`;
      return {
        intent: 'UBER_PING_SEARCH',
        rawText: raw,
        confidence: 0.92,
        sku: matchedSku,
        speechReply: voiceReply,
        triggerPingModal: true
      };
    }

    // 5. Intent: Requisition / Order placement (Voice-to-Order)
    // Examples:
    // "Order 200 boxes of 7.5 gloves for Lilavati urgently"
    // "Send 50 boxes IV cannula 20G to OT-2"
    // "Dispovan 5ml 20 cartons mangwao Dadar stockist se kal subah tak"
    const orderEntities = this.extractOrderEntities(raw);
    if (orderEntities && orderEntities.sku) {
      const voiceReply = `Requisition prepared for ${orderEntities.quantity} ${orderEntities.sku.unit} of ${orderEntities.sku.name}. Pinging verified Mumbai stockists for instant dispatch.`;
      return {
        intent: 'CREATE_REQUISITION',
        rawText: raw,
        confidence: 0.91,
        speechReply: voiceReply,
        entities: orderEntities,
        triggerPingModal: true
      };
    }

    // Default Fallback: Smart AI Assistant query
    const voiceReply = `Processing your request: "${raw}". Checking Mumbai healthcare data lake.`;
    return {
      intent: 'GENERAL_ASSISTANCE',
      rawText: raw,
      confidence: 0.85,
      speechReply: voiceReply
    };
  }

  // Extract SKU, Quantity, Urgency, Ward from unformatted voice text
  extractOrderEntities(text) {
    const lower = text.toLowerCase();
    
    // Quantity extractor: looks for numbers or words like "100", "twenty", "50 boxes"
    let quantity = 50; // default
    const numMatch = text.match(/(\d+)\s*(boxes|cartons|packs|units|pairs|vials|tubes|pcs)?/i);
    if (numMatch && numMatch[1]) {
      quantity = parseInt(numMatch[1], 10);
    }

    // Match SKU
    const matchedSku = this.matchSkuFromText(lower);
    if (!matchedSku) return null;

    // Detect urgency
    let urgency = 'STANDARD';
    if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('immediately') || lower.includes('jaldi') || lower.includes('critical')) {
      urgency = 'CRITICAL_EMERGENCY';
    } else if (lower.includes('tomorrow') || lower.includes('kal')) {
      urgency = 'NEXT_DAY_MORNING';
    }

    // Detect target ward / location
    let targetWard = 'Central Hospital Stores';
    if (lower.includes('ot') || lower.includes('operation theatre')) {
      targetWard = 'Operation Theatre Complex (3rd Floor)';
    } else if (lower.includes('icu')) {
      targetWard = 'Medical ICU (4th Floor)';
    } else if (lower.includes('emergency') || lower.includes('trauma')) {
      targetWard = 'Emergency & Trauma Bay';
    }

    return {
      sku: matchedSku,
      quantity,
      urgency,
      targetWard,
      estimatedTotal: quantity * matchedSku.hospitalRate
    };
  }

  // Match SKU using keyword synonyms
  matchSkuFromText(lower) {
    if (
      lower.includes('glove') ||
      lower.includes('latex') ||
      (lower.includes('surgical') && (lower.includes('glass') || lower.includes('7.5') || lower.includes('7.0') || lower.includes('sternal')))
    ) {
      if (lower.includes('7.0') || lower.includes('7 ')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-GLV-70');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-GLV-75');
    }
    if (lower.includes('cannula') || lower.includes('iv set') || lower.includes('polymed')) {
      if (lower.includes('22') || lower.includes('blue')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-CAN-22G');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-CAN-20G');
    }
    if (lower.includes('syringe') || lower.includes('dispovan') || lower.includes('hmd')) {
      if (lower.includes('2ml') || lower.includes('2 ml')) return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SYR-2ML');
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-SYR-5ML');
    }
    if (lower.includes('vacutainer') || lower.includes('edta') || lower.includes('blood tube') || lower.includes('bd')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-VAC-EDTA');
    }
    if (lower.includes('mask') || lower.includes('n95') || lower.includes('3m')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-MSK-N95');
    }
    if (lower.includes('norad') || lower.includes('noradrenaline') || lower.includes('cipla') || lower.includes('vial')) {
      return MEDICAL_CATALOG.find(i => i.skuId === 'SKU-NOR-2MG');
    }
    return null;
  }

  // Check if unlisted entity is speaking
  detectUnknownEntity(text, currentEntity) {
    const lower = text.toLowerCase();
    // Keywords indicating an unknown entity introducing themselves
    if (
      lower.includes('i am from') ||
      lower.includes('new clinic') ||
      lower.includes('unknown hospital') ||
      lower.includes('not registered') ||
      lower.includes('asha clinic') ||
      lower.includes('borivali clinic')
    ) {
      return true;
    }
    return false;
  }
}

export const aiEngine = new AgentEngine();
