# 🚀 Step-by-Step From-Scratch Guide for Prerna
## How to Build & Vibe-Code the Mumbai Hospital Supply Chain MVP from Literal Zero

> **Target Audience**: Prerna Chotwani (Zero coding background needed)  
> **Philosophy**: **Vibe Coding** — Architecting the system, prompting AI, and assembling production-grade code without writing syntax by hand.  
> **Target Evaluator**: Ashu Dutt / WildCatter Ventures  

---

## 🧭 Step 0: The 3 Software Tools to Install on Your Laptop

If you are setting this up on a fresh laptop, you only need to download and install 3 free tools:

1. **Node.js (LTS version)**:
   - Go to 👉 [https://nodejs.org/](https://nodejs.org/)
   - Download the green button that says **"LTS (Recommended for Most Users)"**.
   - Run the installer and click **Next ➔ Next ➔ Finish**.
2. **VS Code (Code Editor)**:
   - Go to 👉 [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Download for Windows/Mac and install.
3. **Google Chrome** (to view and test the web app).

*That's it! You are ready to build.*

---

## ⚡ Step 1: Create a Fresh Expo Project (1 Terminal Command)

1. Open **Command Prompt** (cmd) or **PowerShell** or VS Code Terminal.
2. Go to your preferred folder (e.g. `cd Desktop` or `cd "D:\2026 Projects"`).
3. Type this single command and press **Enter**:

```bash
npx create-expo-app@latest PrernaPulseChain --template blank
```

*(If it asks `Need to install the following packages: create-expo-app? Press y`, type `y` and press Enter).*  
Wait 1 minute while it creates the folder.

4. Enter the new folder:
```bash
cd PrernaPulseChain
```

---

## 📦 Step 2: Install the Exact Packages Needed (1 Command)

In the same terminal window, run this command to install web support and icons:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime @expo/vector-icons
```

---

## 📁 Step 3: Create the Folder Structure

In your project folder (`PrernaPulseChain`), open it inside **VS Code** (`File ➔ Open Folder ➔ PrernaPulseChain`).

Create the following folder hierarchy inside:

```text
PrernaPulseChain/
├── App.js                     <-- (Already exists, we will replace its code)
├── package.json               <-- (Already exists)
└── src/
    ├── data/
    │   └── mumbaiData.js      <-- (Master data: Mumbai hospitals, stockists, catalog)
    ├── store/
    │   └── stateManager.js    <-- (Central brain: 2-pipe sync, ward inventory)
    ├── ai/
    │   └── agentEngine.js     <-- (Voice mic listener & Hinglish AI parser)
    └── components/
        ├── VoiceRequisitionBar.js   <-- (Giant WhatsApp green mic bar)
        ├── TwoPipeVisualizer.js     <-- (Real Mumbai Map + MTA Subway control panel)
        ├── UberPingModal.js         <-- (Uber-style stockist ranker & quantity selector)
        ├── HospitalDashboard.js     <-- (Hospital inventory & ward consumption twin)
        ├── StockistDashboard.js     <-- (Stockist demand radar & dispatch)
        ├── ManufacturerDashboard.js <-- (Factory C&F inventory oversight)
        ├── PermissionsModal.js      <-- (WhatsApp Business & Excel permissions)
        ├── CentralDataLakeModal.js  <-- (Central Data Lake logs & telemetry)
        └── UnknownEntityModal.js    <-- (Unlisted clinic voice onboarding)
```

> 💡 **Tip in VS Code**: Right-click on the left sidebar ➔ **New Folder** ➔ name it `src`. Inside `src`, right-click ➔ **New Folder** ➔ `data`, `store`, `ai`, `components`. Inside each, right-click ➔ **New File**.

---

## 💻 Step 4: The 11 Core Files & How They Work (Copy-Paste Sequence)

Here is the exact order in which you paste the files:

### 1. `src/data/mumbaiData.js`
- **What it does**: Holds all real Mumbai healthcare data:
  - 4 Hospitals: *Lilavati (Bandra), Hinduja (Mahim), KEM (Parel), Kokilaben (Andheri)*.
  - 4 Stockists: *Entero Healthcare (Dadar), Princess St Syndicate (Dawa Bazar), Babuline Pharma (Dadar East), Sagar Medical (Andheri)*.
  - 2 Manufacturers: *HMD Dispovan (Faridabad) & Polymed (Faridabad)*.
  - 50+ Medical SKUs (*Gloves 7.5, Syringes 5ml, Cannula 20G, Masks*).

### 2. `src/store/stateManager.js`
- **What it does**: The **Central Brain** of the app.
  - Keeps hospital stock numbers updated.
  - Connects ward consumption directly to reorders: when a nurse uses 10 gloves in OT, stock drops; if below safety level, it automatically triggers an order!
  - Manages the **2 Pipes**: updates physical goods transit status and smart contract escrow balance (₹91,200).

### 3. `src/ai/agentEngine.js`
- **What it does**: The **Native AI Voice Engine**.
  - Uses the browser's Web Speech API to listen to speech in English, Hindi, or Hinglish (*"100 box gloves bhejo"*).
  - Uses NLP to extract: Product Name, Size (`7.5`), Quantity (`100`), Urgency (`STAT/urgent`), Ward (`ICU`).
  - Speaks back in voice to confirm orders!

### 4. `src/components/VoiceRequisitionBar.js`
- **What it does**: The **Senior-Friendly Voice Interface**.
  - Big WhatsApp-style green mic button: tap and speak.
  - 1-Tap Quick buttons: `Surgical Gloves 7.5`, `Dispovan 5ml`, `IV Cannula 20G`, `Find Best Price`.
  - Zero form typing needed!

### 5. `src/components/TwoPipeVisualizer.js`
- **What it does**: The **Real Mumbai Map & MTA Subway Control Panel**.
  - Embeds the **Real Interactive Mumbai Map** using Leaflet GIS with:
    - 🗺️ **Street Map**: OpenStreetMap / Esri Streets (roads, highways, coastlines).
    - 🛰️ **Satellite View**: Real satellite imagery of Mumbai and Bandra Sea Link.
    - 🌙 **Dark Mode**: Midnight transit mode with zero watermarks.
  - 🟢 **Line G**: Green Goods Express track with a live moving Delivery Van (`🚚`) running along the Western Express Highway and Sea Link.
  - 🟡 **Line P**: Gold Payment Escrow track with live moving Rupee Token (`₹`).
  - Floating **MTA Subway Legend Box** in top-right corner.
  - Toggle between **Real Mumbai Map** and **Subway Schematic Diagram**.

### 6. `src/components/UberPingModal.js`
- **What it does**: **Uber-Style Stockist Ping & Order Customizer**.
  - Pings 4 Mumbai stockists like Uber driver dispatch.
  - Ranks suppliers by price (*Princess Street @ ₹750 vs Entero @ ₹790*).
  - Gives interactive `[-]` / `[+]` quantity customizer with quick pills (`25, 50, 100, 200, 500`).
  - Prominent **"Confirm Order (आर्डर पक्का करें)"** button!

### 7. `src/components/HospitalDashboard.js`
- **What it does**: Hospital procurement view:
  - Pharmacy Stock meter (Green = In Stock, Red = Low Stock).
  - **Ward Digital Twin**: Buttons to simulate bedside usage (`-10 Gloves in OT 1`, `-5 Syringes in ICU`).
  - Active Orders tracking table.

### 8. `src/components/StockistDashboard.js`
- **What it does**: Stockist portal:
  - "Hospitals Needing Supplies" demand radar.
  - 1-click spot quoting and delivery van dispatch.

### 9. `src/components/ManufacturerDashboard.js`
- **What it does**: Factory portal:
  - Real-time stockist inventory oversight across Mumbai.
  - Bulk C&F truck dispatch and escrow clearance.

### 10. `src/components/PermissionsModal.js` & `CentralDataLakeModal.js` & `UnknownEntityModal.js`
- **What they do**:
  - Permissions simulation (WhatsApp Business & Excel ERP sheet sync).
  - Central Data Lake search audit logs.
  - Voice onboarding for clinics not in database.

### 11. `App.js`
- **What it does**: Main root shell:
  - Opening screen: **Who are you? (आप कौन हैं?)** with 3 friendly cards: 🏥 Hospital, 🏬 Stockist, 🏭 Manufacturer.
  - Responsive multi-device layout: adapts to full width on desktop, and clean touch layout on phone!

---

## 🏃 Step 5: How to Run the App (1 Command)

In your VS Code terminal, run:

```bash
npx expo start --web
```

- Metro Bundler starts in a few seconds.
- Open your browser (Google Chrome) and go to:  
  👉 **`http://localhost:8081`**

🎉 **Boom! Your app is running live!**

---

## 🎯 Step 6: The 3-Minute Demo Flow (What to Click During Interview)

Follow this exact script when showing the app to Ashu Dutt or anyone:

1. **Start Screen (15 sec)**:
   - *"The app starts by asking your role. I'll click **1. Hospital (Lilavati Hospital)**."*
2. **Zero-Form Voice Requisition (30 sec)**:
   - *"Notice there are zero form inputs. A nurse can tap the **Giant Green Mic** or tap **`Surgical Gloves 7.5`**."*
3. **Uber-Style Stockist Ping & Quantity Customizer (45 sec)**:
   - *"It immediately searches Mumbai stockists like Uber. Princess Street is lowest at ₹750, Entero is fastest at ₹790. I can tap `[+]` to customize quantity to 200 boxes. The total recalculates live. Now I click **Confirm Order**."*
4. **Real Mumbai Map & 2-Pipe Flow (45 sec)**:
   - *"Here is the 2-Pipe Control Panel. It runs on the **Real Mumbai Map** with OpenStreetMap and Satellite layers. Line G shows goods moving from Bhiwandi down the Western Express Highway and Sea Link with a live delivery van. Line P shows ₹91,200 payment locked in escrow moving in reverse. In the corner is the MTA Subway Legend from your attachment."*
5. **Ward Consumption Auto-Replenish (30 sec)**:
   - *"Go to `Ward Usage` tab. When a doctor uses 10 gloves in OT 1, I tap `-10 Gloves`. The hospital stock drops in real time, and auto-orders before stockout occurs."*

---

## 💬 Step 7: How Prerna Should Answer "How Did You Build This?" (The Vibe-Coding Script)

If Ashu Dutt asks:
> *"Did you code this entire system line-by-line?"*

**Prerna's Answer**:
> *"Sir, I approached this as an AI-native builder using modern **Vibe Coding**.  
> In 2026, writing boilerplate syntax manually is outdated. Instead, I designed the system architecture, mapped the commercial realities of the Mumbai supply chain (factories in Bhiwandi, stockists in Dadar/Dawa Bazar, hospitals in Bandra), and decoded your MTA New York Subway Map reference into a 2-pipe transit control panel.  
> Then, I leveraged advanced AI agentic coding to scaffold the React Native components, synthesize the Web Speech NLP voice engine, and integrate Leaflet GIS maps.  
> This allowed me to deliver a fully synchronized, multi-tiered commercial MVP in 48 hours — which directly embodies the Native AI philosophy of WildCatter Ventures."*

**Why this answer wins**:
- It demonstrates high emotional intelligence and honesty.
- Evaluators don't want junior syntax-typists; they want product visionaries who know how to use AI to build real software fast.
- It directly references the company's culture.

