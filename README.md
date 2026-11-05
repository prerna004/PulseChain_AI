# PulseChain AI — Mumbai Hospital Supply Chain (Native AI App)
> **WildCatter Ventures Assignment** | Built by Prerna Chotwani

[![Expo](https://img.shields.io/badge/Expo-SDK%2052-blue)](https://expo.dev) [![React Native](https://img.shields.io/badge/React%20Native-0.76-green)](https://reactnative.dev) [![AI Powered](https://img.shields.io/badge/AI-Agentic%20Voice--to--Order-purple)](./src/ai/agentEngine.js)

---

## 📋 Assignment Requirements → Implementation Map

| Requirement | Implemented Feature |
|---|---|
| Hospital / Stockist / Manufacturer roles | ✅ Role selection + Auth for all 3 roles |
| Voice/Text ordering (no manual fields) | ✅ `agentEngine.js` — full entity extraction |
| NEVER ask for filling fields | ✅ All fields auto-filled from voice/text |
| Uber-style ping for best prices | ✅ `UberPingModal.js` — live multi-stockist bidding |
| 2-pipe goods + payment flow | ✅ `TwoPipeVisualizer.js` animated dual-flow |
| Direct hospital inventory link | ✅ Ward consumption → auto-reorder trigger |
| Central Data Lake | ✅ Full analytics: events, charts, stock status |
| WhatsApp Business import | ✅ `WhatsAppImportModal.js` — paste & extract |
| Unknown entity onboarding | ✅ `UnknownEntityModal.js` voice registration |
| Mumbai hospital/stockist/mfg database | ✅ 8 hospitals, 4 stockists, 7 manufacturers |
| First-order KYC paperwork | ✅ `FirstOrderPaperworkModal.js` (skipped on 2nd+) |
| Desktop + Mobile sync | ✅ BroadcastChannel cross-tab sync |
| Per-hospital data isolation | ✅ Orders scoped per logged-in hospital |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (Expo)
npx expo start

# Run on web (Desktop view)
npx expo start --web

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

---

## 🏗️ Architecture

```
PulseChain-main/
├── App.js                          # Root: role selection + all auth gates
├── src/
│   ├── ai/
│   │   └── agentEngine.js          # Voice NLP — 28 SKU patterns + Hindi synonyms
│   ├── data/
│   │   └── mumbaiData.js           # Full Mumbai healthcare dataset
│   ├── store/
│   │   └── stateManager.js         # React Context — Auth + Supply Chain state
│   └── components/
│       ├── HospitalAuthScreen.js   # Hospital login / signup
│       ├── StockistAuthScreen.js   # Stockist login / signup
│       ├── ManufacturerAuthScreen.js # Manufacturer login / signup
│       ├── HospitalDashboard.js    # Hospital control panel
│       ├── StockistDashboard.js    # Stockist demand radar + factory orders
│       ├── ManufacturerDashboard.js # Mfg stockist stock oversight
│       ├── TwoPipeVisualizer.js    # Animated 2-pipe goods + payment flow
│       ├── VoiceRequisitionBar.js  # Voice mic + text input bar
│       ├── UberPingModal.js        # Uber-style stockist bidding
│       ├── WhatsAppImportModal.js  # WA conversation → auto order
│       ├── CentralDataLakeModal.js # Analytics: feed, charts, stock table
│       ├── PermissionsModal.js     # WhatsApp + Excel permissions
│       ├── UnknownEntityModal.js   # Conversational onboarding
│       ├── FirstOrderPaperworkModal.js # First-order KYC (auto-skipped after)
│       └── MobileDeviceFrame.js    # Mobile preview frame
```

---

## 🎤 Voice Commands Supported

```text
"Order 500 Dispovan 5ml syringes urgently for OT ward"
→ Auto-fills: Item=Dispovan 5ml | Qty=500 | Ward=OT | Urgency=CRITICAL

"Get me best prices for Polymed IV cannula 20G"
→ Triggers Uber-style ping across all Mumbai stockists

"Show me inventory to order tomorrow"
→ Lists all items below safety threshold with supplier quotes

"Show me which hospitals need our products"
→ (Stockist) — Mumbai hospital demand radar with live values

"Kal subah tak 100 boxes N95 masks chahiye ICU ke liye"
→ Hindi/Hinglish supported• All fields extracted
```

---

## 📦 Medical Catalog — 28 SKUs across 10 Categories

| Category | SKUs |
|---|---|
| Surgical Disposables | Latex Gloves 7.5 / 7.0, Nitrile Exam Gloves, OT Drape Set, Surgical Gowns |
| Infusion & Vascular | IV Cannula 20G/22G, IV Infusion Set |
| Injections & Syringes | Dispovan 2ml / 5ml / 10ml |
| Diagnostics & Pathology | BD Vacutainer EDTA, BD Vacutainer Plain |
| Infection Prevention | 3M N95 Respirators, 3-Ply Surgical Masks, Sterillium Hand Rub |
| Critical Care Drugs | Noradrenaline 2mg, Propofol 200mg |
| Wound Care & Dressings | Tegaderm Film, Micropore Tape |
| Wound Care & Sutures | Vicryl Absorbable, Ethilon Nylon |
| IV Fluids | Normal Saline, Ringer's Lactate, Dextrose 5% |
| Medical Equipment | Nebulizer, BP Monitor, Pulse Oximeter, Foley Catheter |

---

## 🔐 Authentication

| Role | Demo Credentials |
|---|---|
| Hospital | "Lilavati Hospital & Research Centre" / PIN: 1234 |
| Stockist | "Entero Healthcare Solutions (Central Mumbai)" / PIN: 1234 |
| Manufacturer | "Hindustan Syringes & Medical Devices (HMD)" / PIN: 1234 |

All 3 roles support: **Sign Up** (new entity registration) + **Login** (existing entity).

---

## 🏥 Mumbai Database (Pre-seeded)

- **8 Hospitals**: Lilavati, Hinduja, Kokilaben, KEM, Nanavati, Breach Candy, Reliance Foundation, Jaslok
- **4 Stockists**: Entero Healthcare, Babuline Pharma, Princess Street Syndicate, Sagar Medical
- **7 Manufacturers**: HMD Dispovan, Poly Medicure, 3M Healthcare, BD India, Cipla, Healthium, Romsons

---

## 📊 Central Data Lake Features

- **Live Event Feed** — searchable + filterable by event type
- **Analytics Charts** — top event types, top data sources (bar charts)
- **Category Distribution** — how catalog items are distributed across categories
- **Inventory Status Table** — all 28 SKUs with CRITICAL / LOW / OK status
- **CSV Export** — one-click export of all events

---

## 🤖 AI Agent Engine

The `agentEngine.js` is a zero-dependency NLP engine that:

1. **Parses** free-form voice text (English + Hindi + Hinglish)
2. **Extracts** structured fields: `item`, `quantity`, `urgency`, `ward`, `hospital`, `deliveryPreference`
3. **Matches** 28 SKUs using keyword synonyms (brand names, generic names, Hindi words)
4. **Speaks** confirmation back via Web Speech API (`speechSynthesis`)
5. **Records** every intent to the Central Data Lake

---

## ⚡ Key Features

- **Zero Manual Form Filling** — Voice or text fills everything automatically
- **First-Order KYC Gate** — New hospitals do paperwork once; skipped forever after
- **Per-Hospital Data Isolation** — Hospital A cannot see Hospital B's orders
- **Auto-Replenishment** — Ward depletion below threshold → auto ping stockist
- **WhatsApp Import** — Paste any WA conversation → AI extracts order
- **Cross-Device Sync** — BroadcastChannel keeps desktop + mobile in sync

---

## 📄 License

© 2026 WildCatter Ventures — Internal Assignment. All rights reserved.
Not for public distribution.
