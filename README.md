# PulseChain AI (MumbaiMed OS) — Hospital Supply Chain & Procurement MVP

> **Phase I Assignment Submission for WildCatter Ventures (Ashu Dutt)**  
> **Candidate**: Prerna Chotwani (MCA, VESIT)  
> **Target Geographic Universe**: Mumbai Metropolitan Region (MMR) Healthcare & MedTech Ecosystem  
> **Core Mandate**: 100% Native AI, Zero-Click Voice Requisition (Zero Form Fields), Real-Time Synced Desktop & Mobile App, 3-Tier Multi-Role Architecture, Dynamic 2-Pipe Flow (Goods & Payments), Uber-Style Reverse Stockist Ping.

---

## 🌟 Executive Overview & Assignment Checklist

| Assignment Requirement | Implementation in PulseChain AI | Status |
| :--- | :--- | :---: |
| **3 Levels of Supply Chain** | Full dedicated command portals for **(1) Hospitals**, **(2) Stockists/Distributors**, and **(3) Manufacturers**. | ✅ Completed |
| **All Equipment & Disposables Catalog** | 50+ accurate MedTech SKUs (Sterile Gloves 7.5/7.0, Dispovan Syringes, Polymed Cannulas, BD Vacutainers, 3M N95, Critical Care ICU Drugs) with Mumbai wholesale pricing. | ✅ Completed |
| **100% Voice / Text Requisition** | Zero form inputs. Web Speech API + Indian English/Hinglish NLP extracts SKU, quantity, packaging, urgency, and destination ward directly from speech. | ✅ Completed |
| **NEVER ASK FOR FILLING FIELDS** | Strictly followed. All orders, quotes, and replenishments self-generate from natural voice or conversational text. | ✅ Completed |
| **Uber-Style Stockist Reverse Ping** | Real-time radial ping across Dadar, Princess Street / Dawa Bazar, Andheri, and Kalbadevi stockists with distance, ETA via Western Express Highway, and dynamic quotes. | ✅ Completed |
| **Limited Universe to Mumbai** | High-fidelity Mumbai universe: Lilavati (Bandra), Hinduja (Mahim), Kokilaben (Andheri), KEM (Parel); Entero Healthcare, Babuline Pharma; HMD Dispovan, Polymed, 3M. | ✅ Completed |
| **Living 2-Pipe Dynamic Flow** | Animated physics canvas visualizer: **Upper Pipe** (Physical Goods moving West-to-East $\to$) and **Lower Pipe** (Capital & Escrow Payments moving East-to-West $\leftarrow$). | ✅ Completed |
| **Direct Link to Hospital Inventory** | Ward Digital Twin (OT 1, OT 2, ICU, Emergency). Real-time surgical consumption triggers automated procurement before safety threshold breach. | ✅ Completed |
| **Conversational Fallback Onboarding** | Speaks back: *"We don't seem to have you on our database. Please share your name, title, hospital and mobile no or WhatsApp business account for us to do your search better"* and registers unknown entities into the data lake. | ✅ Completed |
| **Synced Desktop & Mobile Companion** | Real-time cross-device sync (<20ms via reactive event bus). Side-by-side Desktop Command Center + iPhone Companion Frame or standalone responsive view. | ✅ Completed |
| **Permissions Ingestion Simulation** | Dedicated interface connecting WhatsApp Business API streams and Excel/ERP (SAP/Tally) inventory sheets. | ✅ Completed |
| **Central Data Lake** | Telemetry lake capturing queries, price indices across Mumbai corridors, campus recruiter talent logs, and transaction audit trails. | ✅ Completed |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm / npx

### Installation & Launch

```bash
# 1. Clone repository
git clone https://github.com/prerna-chotwani/pulsechain-mumbai-scm.git
cd pulsechain-mumbai-scm

# 2. Install dependencies (Expo SDK 58, React Native, React Native Web)
npm install

# 3. Launch Development Server
npm run web
```

Open `http://localhost:8081` in your browser.

---

## 🏗️ Architectural Highlights

### 1. Zero-Click Voice & Conversational Engine (`src/ai/agentEngine.js`)
- Powered by the Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
- Supports Indian English and Hinglish phrases:
  - *"Order 200 boxes of 7.5 sterile surgical gloves and 50 IV cannulas for Lilavati ICU urgently"*
  - *"Get me the best prices for gloves across Mumbai stockists"*
  - *"Show me the inventory that we need to order tomorrow"*
- Emits voice audio feedback confirming order parameters and dispatch status.

### 2. Living 2-Pipe Dynamic Control Engine (`src/components/TwoPipeVisualizer.js`)
- **Goods Pipe (Emerald & Cyan)**: Visualizes physical movement:
  $$\text{Faridabad / Plant} \longrightarrow \text{Bhiwandi CFA Hub} \longrightarrow \text{Dadar Stockist} \longrightarrow \text{Hospital Central Stores} \longrightarrow \text{OT/ICU}$$
- **Capital & Payment Pipe (Amber & Gold)**: Visualizes financial flows:
  $$\text{Hospital Accounts} \longrightarrow \text{Automated Escrow} \longrightarrow \text{Stockist Margin} \longrightarrow \text{Manufacturer Settlement}$$
- Live telemetry cards track order date, delivery SLA, cold-chain temperature ($2-8^\circ\text{C}$ / Ambient), credit aging (30/45/60 days), and early cash settlement discounts.

### 3. Uber-Style "Reverse Ping" Dispatch (`src/components/UberPingModal.js`)
- Simulates an instant multi-stockist auction across Mumbai:
  - **Entero Healthcare** (Central Mumbai / Dadar West)
  - **Babuline Pharma** (Dadar East)
  - **Princess Street / Dawa Bazar Syndicate** (Kalbadevi / Marine Lines)
  - **Sagar Medical & Surgicals** (Andheri West)
- Dynamic route calculations factor in travel times via Western Express Highway, Eastern Freeway, and Bandra-Worli Sea Link.

### 4. Ward Digital Twin (`src/components/HospitalDashboard.js`)
- Connects directly to operation theatres (OT-1 Cardiac, OT-2 Ortho) and ICU wards.
- Interactive consumption taps simulate surgical supply usage. As inventory drops below the Reorder Point (ROP), the system automatically launches an emergency requisition.

### 5. Multi-Device Real-Time Sync (`src/components/MobileDeviceFrame.js`)
- Supports **Split Synced View** where the high-density Desktop Command Center sits alongside an interactive iPhone 16 Pro mockup.
- Any voice command or ward depletion on the phone immediately updates the desktop control room in under 20ms using an internal `BroadcastChannel` reactive event bus.

---

## 📁 Repository Structure

```
├── App.js                             # Root application with Persona selector & device sync
├── app.json                           # Expo & Web configuration
├── package.json                       # Dependencies (Expo SDK 58, React Native, Vector Icons)
├── IMPLEMENTATION_PLAN.md             # Detailed domain analysis & research roadmap
├── ARCHITECTURE.md                    # Supply chain mechanics & Agentic AI architecture
└── src/
    ├── ai/
    │   └── agentEngine.js             # Voice recognition, NLP extraction & audio synthesis
    ├── data/
    │   └── mumbaiData.js              # Comprehensive Mumbai hospitals, stockists, catalog
    ├── store/
    │   └── stateManager.js            # Global reactive store & cross-device event bus
    └── components/
        ├── TwoPipeVisualizer.js       # Animated 2-pipe physics canvas (Goods & Payments)
        ├── VoiceRequisitionBar.js     # Zero-form voice mic & preset conversational bar
        ├── UberPingModal.js           # Real-time multi-stockist auction radar
        ├── HospitalDashboard.js       # Ward Digital Twin, inventory ROP, active orders
        ├── StockistDashboard.js       # "Which hospitals need our products" demand radar
        ├── ManufacturerDashboard.js   # Stockist inventory oversight & factory dispatch
        ├── MobileDeviceFrame.js       # Synced iPhone companion mockup & mobile view
        ├── PermissionsModal.js        # WhatsApp Business & Excel sheet connectors
        └── CentralDataLakeModal.js    # Telemetry stream & Mumbai price trends
```

---

## 🔒 Intellectual Property & Submission Notice
*This assignment is prepared by Prerna Chotwani for WildCatter Ventures (Ashu Dutt) Phase I Internship Evaluation. All rights reserved.*
