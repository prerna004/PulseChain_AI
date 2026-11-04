// Mumbai Healthcare & MedTech Supply Chain Master Dataset
// Realistic ecosystem across Hospitals, Stockists, and Manufacturers

export const MUMBAI_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'Lilavati Hospital & Research Centre',
    type: 'Quaternary Care',
    beds: 323,
    area: 'Bandra West',
    lat: 19.0515,
    lng: 72.8291,
    contactPerson: 'Dr. Sunita Rao (Head of Procurement)',
    phone: '+91 98201 44521',
    whatsapp: '+91 98201 44521',
    creditDays: 60,
    monthlyBudget: '₹1.85 Cr'
  },
  {
    id: 'hosp-2',
    name: 'P.D. Hinduja National Hospital',
    type: 'Multi-Specialty Tertiary',
    beds: 392,
    area: 'Mahim',
    lat: 19.0330,
    lng: 72.8397,
    contactPerson: 'Mr. Arvind Joshi (Materials Manager)',
    phone: '+91 98192 33145',
    whatsapp: '+91 98192 33145',
    creditDays: 45,
    monthlyBudget: '₹2.10 Cr'
  },
  {
    id: 'hosp-3',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    type: 'Quaternary Super Specialty',
    beds: 750,
    area: 'Andheri West',
    lat: 19.1311,
    lng: 72.8252,
    contactPerson: 'Ms. Pooja Mehta (Director - Supply Chain)',
    phone: '+91 97693 88102',
    whatsapp: '+91 97693 88102',
    creditDays: 30,
    monthlyBudget: '₹3.40 Cr'
  },
  {
    id: 'hosp-4',
    name: 'KEM Hospital & Seth G.S. Medical College',
    type: 'BMC Municipal Apex Hospital',
    beds: 1800,
    area: 'Parel',
    lat: 19.0024,
    lng: 72.8423,
    contactPerson: 'Dr. Nitin Kulkarni (Chief Pharmacist & Store)',
    phone: '+91 98214 77219',
    whatsapp: '+91 98214 77219',
    creditDays: 90,
    monthlyBudget: '₹4.20 Cr'
  },
  {
    id: 'hosp-5',
    name: 'Nanavati Max Super Speciality Hospital',
    type: 'Tertiary Care',
    beds: 350,
    area: 'Vile Parle West',
    lat: 19.0968,
    lng: 72.8406,
    contactPerson: 'Mr. Rohan Desai (Supply Chain Lead)',
    phone: '+91 98335 11904',
    whatsapp: '+91 98335 11904',
    creditDays: 45,
    monthlyBudget: '₹1.95 Cr'
  },
  {
    id: 'hosp-6',
    name: 'Breach Candy Hospital Trust',
    type: 'Private Boutique Care',
    beds: 212,
    area: 'Bhulabhai Desai Road, South Mumbai',
    lat: 18.9715,
    lng: 72.8055,
    contactPerson: 'Ms. Zarine Contractor (Procurement Head)',
    phone: '+91 98205 66782',
    whatsapp: '+91 98205 66782',
    creditDays: 30,
    monthlyBudget: '₹1.40 Cr'
  }
];

export const MUMBAI_STOCKISTS = [
  {
    id: 'stock-1',
    name: 'Entero Healthcare Solutions (Central Mumbai)',
    hub: 'Dadar West / Lower Parel',
    rating: 4.9,
    distanceKm: { 'hosp-1': 4.2, 'hosp-2': 1.8, 'hosp-3': 11.5, 'hosp-4': 2.1, 'hosp-5': 9.8, 'hosp-6': 6.5 },
    deliverySLA: '45 mins (Express)',
    contactPerson: 'Mr. Rajesh Shah (Owner)',
    whatsapp: '+91 98200 11223',
    authorizedBrands: ['Poly Medicure', 'HMD Dispovan', '3M Healthcare', 'BD India'],
    creditOffered: '30-45 Days',
    warehouseStockLevel: 'High (₹4.2 Cr)'
  },
  {
    id: 'stock-2',
    name: 'Babuline Pharma & Surgical Distribution',
    hub: 'Dadar East (Near Railway Station)',
    rating: 4.8,
    distanceKm: { 'hosp-1': 5.1, 'hosp-2': 2.6, 'hosp-3': 12.8, 'hosp-4': 1.4, 'hosp-5': 10.4, 'hosp-6': 7.1 },
    deliverySLA: '60 mins',
    contactPerson: 'Mr. Nilesh Babuline (Director)',
    whatsapp: '+91 98209 88776',
    authorizedBrands: ['HMD Dispovan', 'Romsons', 'Cipla Critical Care'],
    creditOffered: '15-30 Days',
    warehouseStockLevel: 'High (₹3.1 Cr)'
  },
  {
    id: 'stock-3',
    name: 'Princess Street / Dawa Bazar Wholesalers Syndicate',
    hub: 'Kalbadevi / Marine Lines (Old Mumbai Hub)',
    rating: 4.7,
    distanceKm: { 'hosp-1': 14.2, 'hosp-2': 11.8, 'hosp-3': 22.1, 'hosp-4': 8.9, 'hosp-5': 19.5, 'hosp-6': 3.2 },
    deliverySLA: '90 mins',
    contactPerson: 'Mr. Ketan Parekh (Wholesale Secretary)',
    whatsapp: '+91 98190 55443',
    authorizedBrands: ['Poly Medicure', 'HMD Dispovan', 'Ethicon J&J', 'Healthium Sutures', 'Ansell'],
    creditOffered: 'Cash / 15 Days',
    warehouseStockLevel: 'Very High (₹12 Cr)'
  },
  {
    id: 'stock-4',
    name: 'Sagar Medical & Surgicals (Suburban Hub)',
    hub: 'Andheri West (Near Link Road)',
    rating: 4.85,
    distanceKm: { 'hosp-1': 8.5, 'hosp-2': 10.9, 'hosp-3': 1.6, 'hosp-4': 14.8, 'hosp-5': 3.2, 'hosp-6': 18.2 },
    deliverySLA: '30 mins (Suburban Express)',
    contactPerson: 'Mr. Sandeep Gada (Managing Partner)',
    whatsapp: '+91 98211 99884',
    authorizedBrands: ['Poly Medicure', 'BD India', '3M Healthcare', 'Teleflex'],
    creditOffered: '30 Days',
    warehouseStockLevel: 'Medium (₹2.4 Cr)'
  }
];

export const MUMBAI_MANUFACTURERS = [
  {
    id: 'mfg-1',
    name: 'Hindustan Syringes & Medical Devices (HMD)',
    brand: 'Dispovan',
    primaryHub: 'Faridabad Plant & Bhiwandi C&F Warehouse',
    productLine: 'Hypodermic Syringes, Single-Use Needles, Scalp Vein Sets',
    keyRep: 'Mr. Vikram Malhotra (Zonal Sales Director - West)',
    contact: '+91 98101 22334',
    leadTimeDays: 2,
    minimumOrderQty: 50000
  },
  {
    id: 'mfg-2',
    name: 'Poly Medicure Ltd. (Polymed)',
    brand: 'Polymed',
    primaryHub: 'Plant Hub & Vashi / Thane Logistics Depot',
    productLine: 'IV Cannulas, Central Venous Catheters, Infusion Sets, Dialysis Lines',
    keyRep: 'Ms. Deepa Singhal (VP Institutional Sales)',
    contact: '+91 98118 77665',
    leadTimeDays: 3,
    minimumOrderQty: 20000
  },
  {
    id: 'mfg-3',
    name: '3M Healthcare India',
    brand: '3M MedTech',
    primaryHub: 'Bhiwandi Super Logistics Depot',
    productLine: 'Tegaderm Dressings, Micropore Surgical Tapes, N95 Masks, Steri-Drapes',
    keyRep: 'Mr. Anuj Saxena (Enterprise Healthcare Lead)',
    contact: '+91 98200 44321',
    leadTimeDays: 2,
    minimumOrderQty: 10000
  },
  {
    id: 'mfg-4',
    name: 'Becton Dickinson India (BD)',
    brand: 'BD Venflon & Vacutainer',
    primaryHub: 'Bhiwandi Central Stockyard',
    productLine: 'BD Venflon Pro IV Cannula, Vacutainer Blood Collection Tubes, Spinal Needles',
    keyRep: 'Dr. Rajiv Merchant (Clinical Director)',
    contact: '+91 98202 88990',
    leadTimeDays: 3,
    minimumOrderQty: 15000
  },
  {
    id: 'mfg-5',
    name: 'Cipla Critical Care & Hospital Supplies',
    brand: 'Cipla Med',
    primaryHub: 'Vikhroli & Kurla Central Distribution Hub',
    productLine: 'Noradrenaline Vials, Propofol, Saline Infusions, Emergency Antibiotics',
    keyRep: 'Mr. Hemant Kothari (Institutional Sales Head)',
    contact: '+91 98203 11445',
    leadTimeDays: 1,
    minimumOrderQty: 5000
  }
];

export const MEDICAL_CATALOG = [
  {
    skuId: 'SKU-GLV-75',
    name: 'Sterile Latex Surgical Gloves (Size 7.5)',
    category: 'Surgical Disposables',
    brand: 'Surgicare / Ansell',
    unit: 'Box of 50 pairs',
    mrp: 1450,
    mfgPrice: 680,
    stockistPrice: 790,
    hospitalRate: 850,
    mfgId: 'mfg-3',
    popularStockists: ['stock-1', 'stock-2', 'stock-3'],
    shelfLifeMonths: 36,
    hospStockLilavati: 140, // Boxes
    reorderLevel: 50,
    consumptionRateDaily: 25
  },
  {
    skuId: 'SKU-GLV-70',
    name: 'Sterile Latex Surgical Gloves (Size 7.0)',
    category: 'Surgical Disposables',
    brand: 'Surgicare / Ansell',
    unit: 'Box of 50 pairs',
    mrp: 1450,
    mfgPrice: 680,
    stockistPrice: 790,
    hospitalRate: 850,
    mfgId: 'mfg-3',
    popularStockists: ['stock-1', 'stock-3', 'stock-4'],
    shelfLifeMonths: 36,
    hospStockLilavati: 95,
    reorderLevel: 40,
    consumptionRateDaily: 20
  },
  {
    skuId: 'SKU-CAN-20G',
    name: 'Polymed IV Cannula 20G (Pink with Port)',
    category: 'Infusion & Vascular Access',
    brand: 'Poly Medicure',
    unit: 'Box of 100 pcs',
    mrp: 3200,
    mfgPrice: 1400,
    stockistPrice: 1650,
    hospitalRate: 1820,
    mfgId: 'mfg-2',
    popularStockists: ['stock-1', 'stock-2', 'stock-4'],
    shelfLifeMonths: 60,
    hospStockLilavati: 38, // Trigger warning!
    reorderLevel: 45,
    consumptionRateDaily: 15
  },
  {
    skuId: 'SKU-CAN-22G',
    name: 'Polymed IV Cannula 22G (Blue with Port)',
    category: 'Infusion & Vascular Access',
    brand: 'Poly Medicure',
    unit: 'Box of 100 pcs',
    mrp: 3200,
    mfgPrice: 1400,
    stockistPrice: 1650,
    hospitalRate: 1820,
    mfgId: 'mfg-2',
    popularStockists: ['stock-1', 'stock-3', 'stock-4'],
    shelfLifeMonths: 60,
    hospStockLilavati: 72,
    reorderLevel: 35,
    consumptionRateDaily: 12
  },
  {
    skuId: 'SKU-SYR-5ML',
    name: 'HMD Dispovan 5ml Single-Use Syringes with Needle',
    category: 'Injections & Syringes',
    brand: 'Dispovan (HMD)',
    unit: 'Carton of 1000 pcs',
    mrp: 4500,
    mfgPrice: 2100,
    stockistPrice: 2450,
    hospitalRate: 2680,
    mfgId: 'mfg-1',
    popularStockists: ['stock-1', 'stock-2', 'stock-3'],
    shelfLifeMonths: 60,
    hospStockLilavati: 22, // Critical low!
    reorderLevel: 30,
    consumptionRateDaily: 8
  },
  {
    skuId: 'SKU-SYR-2ML',
    name: 'HMD Dispovan 2ml Single-Use Syringes with Needle',
    category: 'Injections & Syringes',
    brand: 'Dispovan (HMD)',
    unit: 'Carton of 1000 pcs',
    mrp: 4100,
    mfgPrice: 1900,
    stockistPrice: 2200,
    hospitalRate: 2390,
    mfgId: 'mfg-1',
    popularStockists: ['stock-1', 'stock-2', 'stock-3'],
    shelfLifeMonths: 60,
    hospStockLilavati: 48,
    reorderLevel: 25,
    consumptionRateDaily: 10
  },
  {
    skuId: 'SKU-VAC-EDTA',
    name: 'BD Vacutainer K2 EDTA Blood Collection Tubes (Lavender)',
    category: 'Diagnostics & Pathology',
    brand: 'Becton Dickinson (BD)',
    unit: 'Pack of 100 tubes',
    mrp: 1800,
    mfgPrice: 850,
    stockistPrice: 1020,
    hospitalRate: 1150,
    mfgId: 'mfg-4',
    popularStockists: ['stock-1', 'stock-4'],
    shelfLifeMonths: 18,
    hospStockLilavati: 80,
    reorderLevel: 30,
    consumptionRateDaily: 14
  },
  {
    skuId: 'SKU-MSK-N95',
    name: '3M 1860 Health Care Particulate N95 Respirators',
    category: 'Infection Prevention',
    brand: '3M MedTech',
    unit: 'Box of 20 masks',
    mrp: 2200,
    mfgPrice: 950,
    stockistPrice: 1180,
    hospitalRate: 1320,
    mfgId: 'mfg-3',
    popularStockists: ['stock-1', 'stock-3', 'stock-4'],
    shelfLifeMonths: 60,
    hospStockLilavati: 65,
    reorderLevel: 25,
    consumptionRateDaily: 10
  },
  {
    skuId: 'SKU-NOR-2MG',
    name: 'Noradrenaline Bitartrate Injection 2mg/2ml',
    category: 'Critical Care ICU Drugs',
    brand: 'Cipla Med',
    unit: 'Box of 10 ampoules',
    mrp: 950,
    mfgPrice: 420,
    stockistPrice: 510,
    hospitalRate: 590,
    mfgId: 'mfg-5',
    popularStockists: ['stock-2', 'stock-1'],
    shelfLifeMonths: 24,
    hospStockLilavati: 12, // Critical low!
    reorderLevel: 20,
    consumptionRateDaily: 6
  }
];

export const INITIAL_SUPPLY_CHAIN_ORDERS = [
  {
    orderId: 'ORD-MUM-8921',
    hospitalId: 'hosp-1',
    hospitalName: 'Lilavati Hospital & Research Centre',
    stockistId: 'stock-1',
    stockistName: 'Entero Healthcare Solutions',
    mfgId: 'mfg-1',
    mfgName: 'Hindustan Syringes (HMD)',
    items: [
      { skuId: 'SKU-SYR-5ML', name: 'HMD Dispovan 5ml Syringes', qty: 15, unit: 'Cartons (15,000 pcs)', rate: 2680, total: 40200 },
      { skuId: 'SKU-GLV-75', name: 'Sterile Latex Gloves 7.5', qty: 60, unit: 'Boxes', rate: 850, total: 51000 }
    ],
    totalAmount: 91200,
    orderDate: '01 Nov 2026, 09:30 AM',
    deliveredBy: '01 Nov 2026, 02:30 PM (Today)',
    deliveryStatus: 'IN_TRANSIT', // 'QUEUED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'
    transitRoute: 'Dadar West via Senapati Bapat Marg -> Bandra Reclamation -> Lilavati Gate 2',
    currentLocation: 'Mahim Causeway Bridge (ETA 18 mins)',
    goodsProgressPct: 75,
    temperatureC: 'Ambient (24°C)',
    // Payment Pipe details
    paymentStatus: 'ESCROW_LOCKED', // 'PENDING', 'ESCROW_LOCKED', 'RELEASED_TO_STOCKIST', 'SETTLED_TO_MFG'
    paymentDueBy: '31 Dec 2026 (60-day credit)',
    cashProgressPct: 35,
    creditAgingDays: 60,
    earlyDiscountOffer: '2% instant discount if settled within 10 days (Save ₹1,824)'
  },
  {
    orderId: 'ORD-MUM-8922',
    hospitalId: 'hosp-2',
    hospitalName: 'P.D. Hinduja Hospital',
    stockistId: 'stock-2',
    stockistName: 'Babuline Pharma & Surgical',
    mfgId: 'mfg-2',
    mfgName: 'Poly Medicure Ltd.',
    items: [
      { skuId: 'SKU-CAN-20G', name: 'Polymed IV Cannula 20G', qty: 25, unit: 'Boxes (2,500 pcs)', rate: 1820, total: 45500 }
    ],
    totalAmount: 45500,
    orderDate: '01 Nov 2026, 11:15 AM',
    deliveredBy: '01 Nov 2026, 04:00 PM',
    deliveryStatus: 'DISPATCHED',
    transitRoute: 'Dadar Station Hub -> Lady Jamshedji Road -> Hinduja Central Pharmacy',
    currentLocation: 'Shivaji Park junction (ETA 28 mins)',
    goodsProgressPct: 45,
    temperatureC: 'Ambient',
    paymentStatus: 'ESCROW_LOCKED',
    paymentDueBy: '15 Dec 2026 (45-day credit)',
    cashProgressPct: 25,
    creditAgingDays: 45,
    earlyDiscountOffer: '1.5% discount if settled in 7 days'
  },
  {
    orderId: 'ORD-MUM-8919',
    hospitalId: 'hosp-3',
    hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
    stockistId: 'stock-4',
    stockistName: 'Sagar Medical & Surgicals',
    mfgId: 'mfg-3',
    mfgName: '3M Healthcare India',
    items: [
      { skuId: 'SKU-MSK-N95', name: '3M 1860 N95 Respirators', qty: 40, unit: 'Boxes (800 masks)', rate: 1320, total: 52800 },
      { skuId: 'SKU-GLV-70', name: 'Sterile Latex Gloves 7.0', qty: 30, unit: 'Boxes', rate: 850, total: 25500 }
    ],
    totalAmount: 78300,
    orderDate: '31 Oct 2026, 03:00 PM',
    deliveredBy: '31 Oct 2026, 06:15 PM',
    deliveryStatus: 'DELIVERED',
    transitRoute: 'Andheri Link Road -> Four Bungalows -> Kokilaben Receiving Bay',
    currentLocation: 'Delivered & Received by Chief Storekeeper',
    goodsProgressPct: 100,
    temperatureC: 'Verified 22°C',
    paymentStatus: 'RELEASED_TO_STOCKIST',
    paymentDueBy: '30 Nov 2026 (30-day credit)',
    cashProgressPct: 70,
    creditAgingDays: 30,
    earlyDiscountOffer: 'Settled to distributor via Smart Contract Escrow'
  }
];

export const HOSPITAL_WARDS = [
  { id: 'ward-ot-1', name: 'Operation Theatre 1 (Cardiac Surgery)', floor: '3rd Floor - OT Wing', activeBeds: 2, status: 'IN_SURGERY' },
  { id: 'ward-ot-2', name: 'Operation Theatre 2 (Orthopedics)', floor: '3rd Floor - OT Wing', activeBeds: 1, status: 'IN_SURGERY' },
  { id: 'ward-icu-a', name: 'Intensive Care Unit (Medical ICU)', floor: '4th Floor - Tower B', activeBeds: 18, status: 'HIGH_OCCUPANCY' },
  { id: 'ward-emg', name: 'Emergency & Trauma Bay', floor: 'Ground Floor', activeBeds: 12, status: 'CRITICAL_TRIAGE' }
];
