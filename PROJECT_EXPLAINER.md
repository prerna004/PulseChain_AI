# 🏥 PulseChain AI — Hospital Supply Chain & Procurement MVP
## Simple, Quick-Read Project Explainer & Interview Guide

> **Prepared for**: Prerna Chotwani  
> **Company**: WildCatter Ventures (Interview Evaluation by Ashu Dutt)  
> **Target Region**: Mumbai Healthcare & MedTech Ecosystem  
> **Submission Deadline**: Friday, November 13th  

---

## 1. What is this Project in Simple Words?

Imagine a busy head nurse or doctor in a hospital like **Lilavati (Bandra)** or **Hinduja (Mahim)** during surgery. 
They realize they are running out of surgical gloves or syringes.

- **The Old Way**: They have to log into complex hospital software (like SAP/ERP), search through 5,000 items, type quantities into form boxes, find distributor phone numbers, and call stockists in Dawa Bazar.
- **The PulseChain AI Way**: They simply tap a big green mic button and speak in normal Hindi or English:  
  👉 *"Send 100 boxes of 7.5 gloves to ICU urgently."*  
  **The app does 100% of the work automatically!** It pings Mumbai suppliers like an Uber driver ping, picks the lowest price, tracks the delivery van on Western Express Highway, and connects directly to the hospital's ward inventory.

---

## 2. What is the Interviewer (WildCatter Ventures) Expecting?

Ashu Dutt and WildCatter Ventures want to see if a candidate understands **commercial reality and true AI autonomy**, not just basic textbook coding.

### Their Core Expectations:
1. **Domain Understanding of Mumbai Healthcare**:
   - In Mumbai, hospitals almost **never buy directly from factory manufacturers** (like HMD Dispovan or Polymed).
   - They buy from local **stockists and distributors** in Dadar and Princess Street / Dawa Bazar (Kalbadevi) because they need deliveries within 45 to 90 minutes.
2. **Native AI — Zero Form Filling**:
   - The user must **never** be asked to type into input boxes or select dropdowns.
   - Everything must be handled by voice speech or natural WhatsApp messages parsed by AI.
3. **The 2-Pipe Supply Chain Flow (The NYC Subway Map Attachment)**:
   - All movement must show **two opposite pipes** organized like a subway transit network:
     - 🚚 **Line G (Goods Express Track)**: Moving physical supplies towards the hospital (*Factory ➔ Stockist ➔ Hospital OT*).
     - 💵 **Line P (Payment Escrow Track)**: Moving capital backwards (*Hospital ➔ Escrow ➔ Stockist ➔ Factory*).
4. **Auto-Replenishment Link to Ward Inventory**:
   - When supplies are used during surgery, the hospital inventory automatically drops.
   - If stock falls below safety limits, the app auto-orders before the hospital runs out.
5. **Adaptive Multi-Platform (Desktop & Mobile Phone)**:
   - Must adapt naturally to both desktop screens (full command-center dashboard) and mobile phones (clean edge-to-edge touch UI), staying 100% synchronized in real time.

---

## 3. Checklist of Required Features & How We Built Them

| Requirement from Interviewer | What It Means | How We Solved It in PulseChain AI |
| :--- | :--- | :--- |
| **1. 3 Supply Chain Tiers** | Must have 3 user portals: Hospital, Stockist, and Manufacturer. | Opening screen lets you select your role: 🏥 Hospital, 🏬 Stockist, or 🏭 Manufacturer with customized views. |
| **2. Medical Catalog** | Disposables & equipment used in Mumbai hospitals. | 50+ real Mumbai SKUs: Sterile Gloves 7.5/7.0, Dispovan Syringes, Polymed Cannulas, BD Vacutainers, 3M N95 masks. |
| **3. Zero-Form Voice/Text** | "NEVER ASK FOR FILLING FIELDS. ALL FIELDS MUST BE FILLED BY VOICE/TEXT". | Giant WhatsApp-style green mic button. Speaks back audio confirmation in natural Indian English/Hindi. |
| **4. Uber-Style Supplier Ping & Order Customizer** | Requisition triggers a live search like Uber driver dispatch with options to pick supplier as per price and customize quantity. | Live radar ping across 4 Mumbai hubs (*Dadar West, Dadar East, Dawa Bazar, Andheri*), ranking by price. Features interactive quantity selector (`[-]`/`[+]` & quick chips), live bill recalculation, and 1-click **Confirm Order** button! |
| **5. 2-Pipe Subway Transit Map** | Control panel modeled after the MTA New York City Subway Map attached by Ashu Dutt. | Full Mumbai Med-Transit Subway Map with landmasses, Arabian Sea, Mahim Bay, Bandra-Worli Sea Link, 4 transit lines (Line G Goods, Line P Escrow, Line B Cold Chain, Line R STAT Emergency), station interchanges, moving transit trains, and an authentic MTA Subway Legend Box! |
| **6. Direct Link to Inventory** | Items used in wards must automatically appear on order list. | Interactive Ward Digital Twin: Tap "Used 10 Gloves in OT 1" ➔ stock drops ➔ auto-replenishment triggers before stockout! |
| **7. Unknown Entity Fallback** | If an unlisted clinic speaks, prompt them by voice/text. | Voice prompt: *"We don't seem to have you on our database. Please share your name, title, hospital and mobile no..."* and auto-onboards them. |
| **8. Permissions Simulation** | WhatsApp Business & Excel sheet access. | Dedicated connector modal simulating live WhatsApp procurement feeds and Excel inventory sheet sync. |

---

## 4. The "Out-of-the-Box" Extra Features We Added (The Standouts!)

To make this assignment a **top 1% standout submission**, we built several high-value innovations that standard candidates will miss:

1. **Human-First, Senior-Friendly UI**:
   - Clean, high-contrast hospital white and soothing blue theme.
   - Designed specifically so that a 55-year-old nurse with reading glasses or an uncle at a Dawa Bazar wholesale shop can use it effortlessly.
2. **1-Tap Quick Buttons & Voice with Live Customization**:
   - Tap buttons like **Surgical Gloves 7.5**, **Dispovan 5ml Syringes**, **IV Cannula 20G**, or speak by voice:
     👉 *"Order 100 boxes of 7.5 surgical gloves for Lilavati ICU"*
   - The app instantly opens the **Supplier Options ranked as per Price**:
     - *Princess Street Syndicate* (★ Lowest Price — ₹750/box)
     - *Entero Healthcare Dadar* (⚡ Fastest Delivery — ₹790/box)
     - *Babuline Pharma Dadar* (₹800/box)
     - *Sagar Medical Andheri* (₹805/box)
   - Staff can easily **customize the quantity** right there using `[-]` / `[+]` or quick pills (`25, 50, 100, 200, 500`). Total bills dynamically recalculate in real-time.
   - Tap **"Confirm Order (आर्डर पक्का करें)"** to finalize and dispatch!
3. **MTA New York Subway Map Control Panel on REAL MUMBAI MAP**:
   - **Real Interactive Mumbai Map (OpenStreetMap & Satellite GIS)**: Features real geographic road corridors (Western Express Highway, Eastern Express, JVLR, and Bandra-Worli Sea Link across Mahim Bay).
   - Real GPS station markers on actual locations: Lilavati Hospital (Bandra West), P.D. Hinduja Hospital (Mahim), KEM Hospital (Parel), Dadar Dawa Bazar, Andheri West, and Bhiwandi C&F Hub.
   - Live moving **Delivery Van 🚚** along the real road path and live moving **Gold Escrow Token 💰** in reverse!
   - Floating **MTA Subway Legend Box** and layer switcher (`🗺️ Street Map`, `🛰️ Satellite View`, `🌙 Dark Mode`).
   - 1-click view switcher to toggle between `📍 Real Mumbai Map` and `🚇 Subway Schematic`.
4. **Adaptive Fluid Layout (Desktop & Mobile)**:
   - Zero fake phone frames on desktop: on desktop, the dashboard spans the full width like a professional logistics command center.
   - On mobile phones, it naturally adapts into a clean, edge-to-edge touch layout with large touch targets.
5. **Bilingual Voice & Text Support**:
   - Understands everyday Hinglish phrases like *"50 box gloves and 20 syringes jaldi bhejo"*.
6. **Central Data Lake Telemetry**:
   - Records all search streams, price fluctuations across Mumbai corridors, and placement recruiter logs.

---

## 5. The Subway Map Mystery Decoded: Why Ashu Dutt Enclosed the NYC Subway Map

In the assignment email, requirement **(g)** states:
> *"All movement in the Supply chain should appear as 2 pipes showing payments moving one way and goods moving the other way (an Image of what the Control panel for the Hospital should look like is enclosed)"*

The enclosed PDF file was titled `Hospital Supply Chain panel.pdf` and showed the **New York City Subway Map (MTA)**.

### Why did he enclose a Subway Map for a Mumbai Healthcare Project?
This is a brilliant **Transit Network UI Paradigm**:
1. **The Transit Map Metaphor**:
   - Traditional hospital supply chain software uses cluttered database tables that medical staff hate.
   - A subway map is the universal standard for visualizing **bidirectional network flow**:
     - **Stations (Junctions)**: Nodes where goods pause or transfer:
       - 🏭 *Bhiwandi Central C&F Logistics Terminal [M1]* (Manufacturing Hub)
       - 🏬 *Andheri West Suburban Depot [S4]* (Wholesale Buffer)
       - 🔄 *Dadar Central Dawa Bazar Interchange [D2]* (Major Multi-Line Transfer Hub)
       - 🏥 *Lilavati Hospital Receiving Dock [H1]* (Facility Inward Bay)
       - 🏥 *P.D. Hinduja Hospital Bay [H2]* (Cold-Chain Vault Dock)
       - 🩺 *Operation Theatre (OT 1) / ICU Bedside [W1]* (Clinical Point-of-Care)
     - **Subway Lines (The 2 Pipes)**:
       - 🟢 **Line G (Goods Express Track ➔)**: Moving forward from Factory ➔ Stockist ➔ Hospital OT.
       - 🟡 **Line P (Payment Escrow Track ➔)**: Moving in reverse from Hospital ➔ Smart Escrow ➔ Stockist ➔ Factory.
       - 🔵 **Line B (Biologics Cold-Chain ➔)**: Dedicated 2°C - 8°C temperature-monitored vaccine line.
       - 🔴 **Line R (STAT Emergency Rush ➔)**: Priority trauma rush route connecting wholesale depots to ICU.
2. **Mumbai Universe with Transit Architecture**:
   - The NYC map is **purely the visual paradigm**; the actual business universe is **100% Mumbai** (*Lilavati, Hinduja, KEM, Dadar West, Dawa Bazar, Bandra-Worli Sea Link*).
   - In our app, the 2-Pipe visualizer is designed with Mumbai's real coastline (Arabian Sea, Mahim Bay, Thane Creek), live moving trains, and the official MTA Subway Legend Box!

---

## 6. Connecting Prerna's Resume to WildCatter Ventures (Ashu Dutt)

When reviewing Prerna Chotwani's profile, it is clear why Ashu Dutt selected her for Phase I:
1. **Academic Excellence**: MCA candidate at VESIT, Mumbai with a **9.61 CGPA**.
2. **AI Voice Agent Experience**: Built a Real-Estate CRM with a **Twilio-powered AI voice agent**, explicitly highlighting: *"demonstrating API design and backend integration skills required for dataSAVI module development"*.
3. **Medical IoT Background**: Built an **IoT-Based Medical Emergency Response Platform** with **PostGIS geospatial search** for hospitals.
4. **Why this project is the perfect match**:
   - WildCatter Ventures builds agentic multi-sided network platforms (like dataSAVI).
   - Ashu Dutt gave her this challenge to test if she can combine her **AI Voice Agent** skills and **Medical Geospatial** knowledge into a commercial, voice-driven supply chain operating system.

---

## 7. How to Demo This Project in 3 Minutes (Cheat Sheet)

If you have only 3 minutes to present to Ashu Dutt or an interviewer, follow this simple 5-step flow:

1. **Step 1 — Role Selection (15 sec)**:  
   Show opening screen ➔ Click **`Open Hospital Portal (Lilavati Hospital)`**.
2. **Step 2 — Zero-Click Voice Requisition & Customizer (30 sec)**:  
   Click the **Giant Green Mic** or tap **`Surgical Gloves 7.5`**. Show how the AI extracted SKU, quantity, and urgency with **zero form filling**.
3. **Step 3 — Pick Supplier as per Price & Quantity Customizer (45 sec)**:  
   Show the 4 Mumbai stockists ranked by price (Princess St @ ₹750 vs Entero @ ₹790). Tap `[+]` to customize quantity to 200 boxes and see total bill recalculate live ➔ Click **`Confirm Order (आर्डर पक्का करें)`**.
4. **Step 4 — The Subway-Style 2-Pipe Transit Map (30 sec)**:  
   Point to **Line G** (Goods Express arriving in 18 mins via Sea Link) and **Line P** (60-Day Hospital Credit Escrow). Tap on Dadar Interchange on the map to show the live departure board and stock buffer!
5. **Step 5 — Ward Auto-Replenish & Responsive Design (60 sec)**:  
   Go to `Ward Usage` tab ➔ Tap `Used 10 Gloves` ➔ Show low-stock auto-order alert ➔ Resize browser or open on phone to show how the interface smoothly adapts to mobile without any artificial phone frames.

---

## 8. Technology Stack Used

- **Framework**: React Native with Expo (SDK 58) & React Native Web.
- **Cross-Platform**: Runs on Desktop Browser, Mobile Phone Browser, and Native Android/iOS via Expo Go.
- **Audio & NLP Engine**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) + semantic intent parser.
- **Visual Engine**: High-performance SVG transit network map with authentic NYC Subway styling, landmass contours, moving trains, and MTA legend box.
- **Sync Protocol**: Multi-device reactive event bus using `BroadcastChannel`.
- **Repository**: Fully committed with clean Git history and detailed GitHub-ready documentation.
