// Mumbai Med-Transit Supply Chain Map (Subway Paradigm 2-Pipe Control Panel)
// Modeled directly after the MTA New York City Subway Map architecture enclosed in Ashu Dutt's assignment
// Provides:
// 1. Real Interactive Mumbai Map (OpenStreetMap & Satellite GIS with live GPS corridors, road arteries, Sea Link, and real coordinate markers)
// 2. MTA Subway Schematic (Angular transit diagram view)
// 3. Line G (Green): Physical Medical Goods Express Track (Moving Westbound ➔ Factory to Bedside)
// 4. Line P (Gold): Capital & Smart Escrow Payment Track (Moving Eastbound ➔ Hospital to Factory)

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import { MUMBAI_HOSPITALS } from '../data/mumbaiData.js';

export default function TwoPipeVisualizer() {
  const {
    orders,
    allStockists,
    allManufacturers,
    bridges,
    currentRole,
    loggedInHospital,
    selectedHospital,
    loggedInStockist,
    selectedStockist,
    loggedInManufacturer,
    selectedManufacturer,
    fastForwardDelivery,
    createOrUpdateBridge
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inspectedStation, setInspectedStation] = useState(null);
  const [viewMode, setViewMode] = useState('REAL_MAP'); // 'REAL_MAP' | 'SCHEMATIC'
  const [highlightLine, setHighlightLine] = useState('ALL'); // 'ALL' | 'G' | 'P' | 'B' | 'R'

  // Dynamic persona entities
  const activeHospital = (currentRole === 'HOSPITAL' && loggedInHospital)
    ? (loggedInHospital)
    : selectedHospital;

  const activeStockist = (currentRole === 'STOCKIST' && loggedInStockist)
    ? (allStockists.find(s => s.id === loggedInStockist.id) || loggedInStockist)
    : selectedStockist;

  const activeMfg = (currentRole === 'MANUFACTURER' && loggedInManufacturer)
    ? (allManufacturers.find(m => m.id === loggedInManufacturer.id) || loggedInManufacturer)
    : selectedManufacturer;

  // Strict Data Isolation: only show orders belonging to active role/entity
  const visibleOrders = useMemo(() => {
    if (currentRole === 'HOSPITAL') {
      return (orders || []).filter(o => o.hospitalId === activeHospital.id);
    }
    if (currentRole === 'STOCKIST') {
      return (orders || []).filter(o => o.stockistId === activeStockist.id);
    }
    if (currentRole === 'MANUFACTURER') {
      return (orders || []).filter(o => o.mfgId === activeMfg.id);
    }
    return orders || [];
  }, [orders, currentRole, activeHospital.id, activeStockist.id, activeMfg.id]);

  // Strict Data Isolation: only show persistent bridges belonging to active role/entity
  const visibleBridges = useMemo(() => {
    if (currentRole === 'HOSPITAL') {
      return (bridges || []).filter(b => b.hospitalId === activeHospital.id);
    }
    if (currentRole === 'STOCKIST') {
      return (bridges || []).filter(b => b.stockistId === activeStockist.id);
    }
    if (currentRole === 'MANUFACTURER') {
      return (bridges || []).filter(b => b.mfgId === activeMfg.id);
    }
    return bridges || [];
  }, [bridges, currentRole, activeHospital.id, activeStockist.id, activeMfg.id]);

  useEffect(() => {
    if (visibleOrders.length > 0) {
      if (!selectedOrder || !visibleOrders.find(o => o.orderId === selectedOrder.orderId)) {
        setSelectedOrder(visibleOrders[0]);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [visibleOrders]);

  const activeOrder = selectedOrder || visibleOrders[0] || null;

  // Dynamic role-based map center
  const activeCenter = currentRole === 'HOSPITAL'
    ? { lat: activeHospital.lat || 19.0515, lng: activeHospital.lng || 72.8291, zoom: 12.5 }
    : currentRole === 'STOCKIST'
      ? { lat: activeStockist.lat || 19.0178, lng: activeStockist.lng || 72.8478, zoom: 13 }
      : { lat: activeMfg.lat || 19.2968, lng: activeMfg.lng || 73.0631, zoom: 11.5 };

  // Dynamic authentic road waypoints for active order
  const activeStockistObj = (activeOrder && allStockists.find(s => s.id === activeOrder.stockistId)) || {
    lat: 19.0178, lng: 72.8478, name: activeOrder ? activeOrder.stockistName : 'Entero Healthcare'
  };
  const activeHospitalObj = (activeOrder && (loggedInHospital || selectedHospital)) || activeHospital;

  const sLat = activeStockistObj.lat || 19.0178;
  const sLng = activeStockistObj.lng || 72.8478;
  const hLat = activeHospitalObj.lat || 19.0515;
  const hLng = activeHospitalObj.lng || 72.8291;

  // Multi-Hospital specific authentic Mumbai corridors
  const orderRouteCoords = activeHospitalObj.id === 'hosp-4'
    ? [
        [sLat, sLng],              // Dadar West Hub
        [19.0182, 72.8430],        // Dadar East TT Circle
        [19.0100, 72.8420],        // Hindmata Corridor
        [19.0060, 72.8422],        // Parel TT Flyover
        [hLat, hLng]               // KEM Hospital Dock
      ]
    : activeHospitalObj.id === 'hosp-2'
      ? [
          [sLat, sLng],            // Dadar Hub
          [19.0250, 72.8410],      // Cadell Road
          [19.0300, 72.8390],      // Shivaji Park Bay
          [hLat, hLng]             // Hinduja Hospital Dock
        ]
      : activeHospitalObj.id === 'hosp-3'
        ? [
            [sLat, sLng],          // Suburban Hub (Andheri)
            [19.1150, 72.8420],    // SV Road Corridor
            [19.1280, 72.8310],    // Four Bungalows
            [hLat, hLng]           // Kokilaben Dock
          ]
        : [
            [sLat, sLng],          // Dadar Hub
            [19.0260, 72.8360],    // Mahim Causeway
            [19.0366, 72.8172],    // Bandra-Worli Sea Link Bridge
            [19.0480, 72.8230],    // Bandra Reclamation Dock feeder
            [hLat, hLng]           // Lilavati Dock
          ];

  // Subway Transit Stations positioned along the authentic Mumbai geographic corridor
  const STATIONS = [
    {
      id: 'stn-mfg',
      code: 'M1',
      name: 'Bhiwandi Central C&F Logistics Depot',
      area: 'Northern Freight & Bulk Warehousing Corridor (Thane/Bhiwandi)',
      lat: 19.2968,
      lng: 73.0631,
      type: 'Terminal Depot',
      lines: ['G', 'P'],
      operator: 'HMD Dispovan & Polymed National Depots',
      stockBuffer: '1,280,000 Units Factory Buffer',
      leadTime: '2-3 Days Bulk Freight (Heavy Trucks)',
      activeTrain: 'Freight Train #BHW-402 (Loading 500 Cartons)',
      escrowCondition: 'Escrow Released upon verified Dock Receipt',
      icon: 'industry',
      schematicCoords: { x: 860, y: 70 }
    },
    {
      id: 'stn-andheri',
      code: 'S4',
      name: 'Andheri West Suburban Depot',
      area: 'Western Suburbs Corridor (Link Road / S.V. Road)',
      lat: 19.1197,
      lng: 72.8464,
      type: 'Local Station',
      lines: ['G', 'P'],
      operator: 'Sagar Medical & Surgicals Depot',
      stockBuffer: '24,000 Units Local Buffer',
      leadTime: '30 Mins Express Van Dispatch',
      activeTrain: 'Suburban Shuttle #ADH-108 (Standby)',
      escrowCondition: 'Wholesale Margin Credited in 24 Hrs',
      icon: 'truck',
      schematicCoords: { x: 570, y: 155 }
    },
    {
      id: 'stn-dadar',
      code: 'D2',
      name: 'Dadar Central Dawa Bazar Interchange',
      area: 'Central Mumbai Wholesale Syndicate (Princess St / Dawa Bazar)',
      lat: 19.0178,
      lng: 72.8478,
      type: 'Major Transfer Interchange Hub',
      lines: ['G', 'P', 'B', 'R'],
      operator: activeOrder ? activeOrder.stockistName : 'Entero Healthcare Syndicate',
      stockBuffer: '42,000 Units High-Velocity Wholesale Buffer',
      leadTime: '18-45 Mins Express Delivery via Sea Link',
      activeTrain: 'Goods Express #MUM-8921 (Departed Dadar West)',
      escrowCondition: 'Smart Contract Escrow Active (₹91,200 Locked)',
      icon: 'exchange-alt',
      schematicCoords: { x: 420, y: 260 }
    },
    {
      id: 'stn-kem',
      code: 'K3',
      name: 'K.E.M. Parel Hospital Dock',
      area: 'Parel Central Medical Belt',
      lat: 19.0033,
      lng: 72.8424,
      type: 'Hospital Dock Bay',
      lines: ['G', 'P', 'R'],
      operator: 'Municipal Trauma & Emergency Stores',
      stockBuffer: 'Critical Emergency Stock Monitored',
      leadTime: '12 Mins via Dr. B.A. Road',
      activeTrain: 'STAT Emergency Shuttle #KEM-99',
      escrowCondition: 'MCGM Treasury Voucher Sync',
      icon: 'hospital',
      schematicCoords: { x: 420, y: 390 }
    },
    {
      id: 'stn-lilavati',
      code: 'H1',
      name: 'Lilavati Hospital Receiving Dock',
      area: 'Bandra West (Gate 2 Inward Store Dock)',
      lat: 19.0519,
      lng: 72.8291,
      type: 'Hospital Terminal Bay',
      lines: ['G', 'P', 'R'],
      operator: 'Lilavati Central Pharmacy & Materials Management',
      stockBuffer: 'Safety Stock Level: 150 Boxes Gloves, 80 Cartons Syringes',
      leadTime: 'Delivered in 18 Mins via Sea Link Express Corridor',
      activeTrain: 'Arriving: Delivery Van #MH-02-EE-8921',
      escrowCondition: '60-Day Hospital Credit with 2% Instant Discount',
      icon: 'hospital',
      schematicCoords: { x: 230, y: 260 }
    },
    {
      id: 'stn-hinduja',
      code: 'H2',
      name: 'P.D. Hinduja Hospital Dock',
      area: 'Mahim Bay Station & Receiving Dock',
      lat: 19.0330,
      lng: 72.8397,
      type: 'Hospital Terminal Bay',
      lines: ['G', 'P', 'B'],
      operator: 'Hinduja Healthcare Stores & Cold-Chain Vault',
      stockBuffer: 'Safety Stock: 2-8°C Vault Monitored',
      leadTime: '22 Mins Express via Veer Savarkar Marg',
      activeTrain: 'Cold-Chain Shuttle #HND-204 (Active)',
      escrowCondition: 'Automated Purchase Order Cleared',
      icon: 'hospital',
      schematicCoords: { x: 230, y: 350 }
    },
    {
      id: 'stn-ot',
      code: 'W1',
      name: 'OT & ICU Point-of-Care Terminal',
      area: '3rd & 4th Floor Clinical Surgical Suites',
      lat: 19.0525,
      lng: 72.8285,
      type: 'Clinical Endpoint',
      lines: ['G', 'P'],
      operator: 'Sister-in-Charge / OT Consumption Node',
      stockBuffer: 'Bedside Dispensary (Real-Time Consumption Trigger)',
      leadTime: 'Instant Replenishment Trigger upon Bedside Usage',
      activeTrain: 'Ward Trolley #W1-04 (Restocked)',
      escrowCondition: 'Requisition Auto-Generated to Central Data Lake',
      icon: 'heartbeat',
      schematicCoords: { x: 100, y: 260 }
    }
  ];

  // Self-contained Real Mumbai Map HTML using Leaflet, OpenStreetMap & Carto Positron
  const realMumbaiMapHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }

    /* Custom Subway Marker Styles */
    .mta-marker-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
    }
    .mta-marker-left {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
    }
    .mta-badge {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 11px;
      color: #fff;
      border: 2px solid #fff;
      flex-shrink: 0;
    }
    .badge-m1 { background: #0f172a; }
    .badge-s4 { background: #059669; }
    .badge-d2 { background: #d97706; }
    .badge-h1 { background: #0284c7; }
    .badge-h2 { background: #0284c7; }
    .badge-k3 { background: #dc2626; }
    .badge-w1 { background: #e11d48; }

    .mta-label {
      background: rgba(15, 23, 42, 0.95);
      color: #fff;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10.5px;
      font-weight: 800;
      white-space: nowrap;
      border: 1px solid rgba(255,255,255,0.25);
    }

    /* Live Animated Radar Blip for Newly Registered Suppliers */
    .radar-blip-container {
      position: relative;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .radar-ring {
      position: absolute;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 3px solid #10b981;
      animation: radarPulse 1.8s ease-out infinite;
    }
    .radar-ring-cyan {
      position: absolute;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 2px solid #06b6d4;
      animation: radarPulse 1.8s ease-out 0.9s infinite;
    }
    .radar-center-dot {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      background: #059669;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 16px #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #ffffff;
      font-weight: 900;
      z-index: 10;
    }
    @keyframes radarPulse {
      0% { transform: scale(0.3); opacity: 1; }
      80% { opacity: 0.6; }
      100% { transform: scale(2.4); opacity: 0; }
    }

    /* Dynamic Hospital Home Pin */
    .home-pin-container {
      position: relative;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .home-pin-ring {
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 3px solid #0284c7;
      animation: homePulse 2s ease-out infinite;
    }
    .home-pin-core {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background: #0284c7;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 18px #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #ffffff;
      z-index: 10;
    }
    @keyframes homePulse {
      0% { transform: scale(0.4); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    /* Persistent Mesh Bridge Node Marker */
    .bridge-node-marker {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      background: #06b6d4;
      border: 2px solid #ffffff;
      box-shadow: 0 0 12px #06b6d4;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      animation: bridgeGlow 2.5s infinite alternate;
    }
    @keyframes bridgeGlow {
      0% { transform: scale(0.9); box-shadow: 0 0 8px #06b6d4; }
      100% { transform: scale(1.15); box-shadow: 0 0 20px #10b981; }
    }

    /* Live Animated Vehicle Markers */
    .vehicle-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 19px;
      background: #10b981;
      border: 2.5px solid #fff;
      box-shadow: 0 0 18px #10b981;
      font-size: 20px;
      animation: pulseGreen 1.8s infinite;
    }
    .cash-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background: #f59e0b;
      border: 2.5px solid #fff;
      box-shadow: 0 0 16px #f59e0b;
      font-size: 16px;
      font-weight: 900;
      color: #78350f;
      animation: pulseGold 1.6s infinite;
    }

    @keyframes pulseGreen {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
      70% { transform: scale(1.15); box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    @keyframes pulseGold {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.8); }
      70% { transform: scale(1.15); box-shadow: 0 0 0 14px rgba(245, 158, 11, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }

    /* Floating Legend Box (MTA NYC Subway Style) */
    .floating-legend {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(8px);
      border: 2px solid #0f172a;
      border-radius: 12px;
      padding: 12px 14px;
      width: 290px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .legend-title {
      font-size: 12px;
      font-weight: 900;
      color: #0f172a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .legend-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
      font-size: 10px;
      color: #1e293b;
      font-weight: 700;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .legend-row:hover { background: #f1f5f9; }
    .bullet {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 900;
      font-size: 11px;
      flex-shrink: 0;
    }
    .b-g { background: #10b981; }
    .b-p { background: #f59e0b; }
    .b-b { background: #0284c7; }
    .b-r { background: #ef4444; }
    .b-mesh { background: #06b6d4; }

    /* Quick Map Controls Floating Bottom Left */
    .map-controls {
      position: absolute;
      bottom: 16px;
      left: 16px;
      z-index: 1000;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .control-btn {
      background: #0f172a;
      color: #fff;
      border: 1px solid #334155;
      padding: 7px 13px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.15s ease;
    }
    .control-btn:hover {
      background: #0284c7;
      transform: translateY(-1px);
    }

    /* Layer Switcher Floating Top Left */
    .layer-switcher {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 1000;
      display: flex;
      gap: 4px;
      background: rgba(255,255,255,0.96);
      padding: 4px;
      border-radius: 10px;
      border: 1.5px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    .layer-btn {
      border: none;
      background: transparent;
      padding: 6px 11px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      color: #475569;
      cursor: pointer;
    }
    .layer-btn.active {
      background: #0284c7;
      color: #fff;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <!-- Layer Switcher -->
  <div class="layer-switcher">
    <button id="btn-street" class="layer-btn active" onclick="setLayer('street')">🗺️ Street Map</button>
    <button id="btn-sat" class="layer-btn" onclick="setLayer('satellite')">🛰️ Satellite View</button>
    <button id="btn-dark" class="layer-btn" onclick="setLayer('dark')">🌙 Dark Mode</button>
  </div>

  <!-- MTA Subway Legend Box -->
  <div class="floating-legend">
    <div class="legend-title">
      <span>🚇 MTA SUBWAY & MESH</span>
      <span style="font-size: 8.5px; color: #64748b;">MUMBAI MED-GRID</span>
    </div>
    <div class="legend-row" onclick="toggleLine('G')">
      <div class="bullet b-g">G</div>
      <div>
        <div>Line G (Goods Express)</div>
        <div style="font-size: 8.5px; color: #64748b;">${activeStockistObj.name.split('(')[0]} ➔ ${activeHospitalObj.name.split(' ')[0]} OT (Live)</div>
      </div>
    </div>
    <div class="legend-row" onclick="toggleLine('P')">
      <div class="bullet b-p">P</div>
      <div>
        <div>Line P (Payment Escrow)</div>
        <div style="font-size: 8.5px; color: #64748b;">Hospital ➔ Smart Escrow Release</div>
      </div>
    </div>
    <div class="legend-row">
      <div class="bullet b-mesh">🌉</div>
      <div>
        <div>Web of Provenance (Mesh)</div>
        <div style="font-size: 8.5px; color: #0891b2;">${bridges.length} Permanent Supply Bridges Active</div>
      </div>
    </div>
  </div>

  <!-- Map Quick Focus Buttons -->
  <div class="map-controls">
    <button class="control-btn" onclick="focusMumbai()">📍 All Mumbai</button>
    <button class="control-btn" onclick="focusHome()">🏥 ${activeHospitalObj.name.split(' ')[0]} Dock</button>
    <button class="control-btn" onclick="focusDadar()">🚚 Dadar Hub</button>
    <button class="control-btn" onclick="focusBhiwandi()">🏭 Bhiwandi C&F</button>
  </div>

  <script>
    // Injected Dynamic Reactive State
    const CURRENT_ROLE = ${JSON.stringify(currentRole)};
    const ACTIVE_CENTER = ${JSON.stringify(activeCenter)};
    const ACTIVE_HOSPITAL = ${JSON.stringify(activeHospital)};
    const ALL_STOCKISTS = ${JSON.stringify(allStockists)};
    const ALL_MANUFACTURERS = ${JSON.stringify(allManufacturers)};
    const ALL_HOSPITALS = ${JSON.stringify(MUMBAI_HOSPITALS)};
    const BRIDGES = ${JSON.stringify(visibleBridges)};
    const ACTIVE_ORDER = ${JSON.stringify(activeOrder)};
    const ROUTE_COORDS = ${JSON.stringify(orderRouteCoords)};

    // 1. Initialize Map centered on active dynamic role
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([ACTIVE_CENTER.lat, ACTIVE_CENTER.lng], ACTIVE_CENTER.zoom || 12);

    // 2. Base Tile Layers
    const osmStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const esriStreetLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    osmStreetLayer.on('tileerror', function() {
      if (map.hasLayer(osmStreetLayer)) {
        map.removeLayer(osmStreetLayer);
        esriStreetLayer.addTo(map);
      }
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    const darkBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });
    const darkRefLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });
    const darkLayerGroup = L.layerGroup([darkBaseLayer, darkRefLayer]);

    function setLayer(mode) {
      map.removeLayer(osmStreetLayer);
      map.removeLayer(esriStreetLayer);
      map.removeLayer(satelliteLayer);
      map.removeLayer(darkLayerGroup);
      document.getElementById('btn-street').classList.remove('active');
      document.getElementById('btn-sat').classList.remove('active');
      document.getElementById('btn-dark').classList.remove('active');

      if (mode === 'street') {
        osmStreetLayer.addTo(map);
        document.getElementById('btn-street').classList.add('active');
      } else if (mode === 'satellite') {
        satelliteLayer.addTo(map);
        document.getElementById('btn-sat').classList.add('active');
      } else {
        darkLayerGroup.addTo(map);
        document.getElementById('btn-dark').classList.add('active');
      }
    }

    // 3. Render Hospital Markers & Dynamic Home Pin
    ALL_HOSPITALS.forEach(h => {
      const isHome = CURRENT_ROLE === 'HOSPITAL' && (h.id === ACTIVE_HOSPITAL.id || h.name === ACTIVE_HOSPITAL.name);
      const pos = [h.lat, h.lng];

      if (isHome) {
        const homeIcon = L.divIcon({
          html: '<div class="home-pin-container"><div class="home-pin-ring"></div><div class="home-pin-core">🏥</div></div>',
          className: '',
          iconSize: [48, 48],
          iconAnchor: [24, 24]
        });
        const m = L.marker(pos, { icon: homeIcon, zIndexOffset: 2000 }).addTo(map);
        m.bindPopup(
          '<div style="font-family:sans-serif;padding:6px;">' +
          '<div style="font-weight:900;color:#0284c7;font-size:12px;">🏥 HOME PROCUREMENT PIN</div>' +
          '<div style="font-weight:800;font-size:13px;color:#0f172a;margin-top:2px;">' + h.name + '</div>' +
          '<div style="font-size:11px;color:#64748b;margin:4px 0;">📍 ' + h.area + ' • Beds: ' + h.beds + '</div>' +
          '<div style="font-size:10.5px;color:#16a34a;font-weight:bold;">✓ Direct automated requisition hub active</div>' +
          '</div>'
        );
      } else {
        const hospIcon = L.divIcon({
          html: '<div class="mta-marker-left"><div class="mta-badge badge-h1">H</div><div class="mta-label">' + h.name.split(' ')[0] + '</div></div>',
          className: '',
          iconSize: [160, 32],
          iconAnchor: [146, 16]
        });
        const m = L.marker(pos, { icon: hospIcon }).addTo(map);
        m.bindPopup(
          '<div style="font-family:sans-serif;padding:4px;">' +
          '<div style="font-weight:900;font-size:12px;color:#0f172a;">' + h.name + '</div>' +
          '<div style="font-size:11px;color:#64748b;">📍 ' + h.area + ' • ' + h.contactPerson + '</div>' +
          '</div>'
        );
      }
    });

    // 4. Render All Stockists with Live Radar Blip for Newly Registered
    ALL_STOCKISTS.forEach(stk => {
      const pos = [stk.lat || 19.0178, stk.lng || 72.8478];

      if (stk.isNewBlip) {
        // Spawn pulsating animated radar blip ping!
        const blipIcon = L.divIcon({
          html: '<div class="radar-blip-container"><div class="radar-ring"></div><div class="radar-ring-cyan"></div><div class="radar-center-dot">⚡</div></div>',
          className: '',
          iconSize: [52, 52],
          iconAnchor: [26, 26]
        });
        const m = L.marker(pos, { icon: blipIcon, zIndexOffset: 3000 }).addTo(map);
        m.bindPopup(
          '<div style="font-family:sans-serif;padding:6px;min-width:210px;">' +
          '<div style="font-weight:900;color:#047857;font-size:12px;">⚡ NEW LIVE GEO-REGISTERED SUPPLIER</div>' +
          '<div style="font-weight:800;font-size:13.5px;color:#0f172a;margin-top:2px;">' + stk.name + '</div>' +
          '<div style="font-size:11px;color:#64748b;margin:4px 0;">📍 ' + (stk.area || stk.hub) + ' • Rating: ' + (stk.rating || 5.0) + '★</div>' +
          '<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:5px 8px;border-radius:6px;margin:4px 0;">' +
          '<div style="font-size:11px;font-weight:800;color:#15803d;">Opening Declared Stock:</div>' +
          '<div style="font-size:10.5px;color:#166534;">• Gloves 7.5: ' + (stk.stockLevels && stk.stockLevels["SKU-GLV-75"] !== undefined ? stk.stockLevels["SKU-GLV-75"] : 50) + ' boxes @ ₹' + (stk.stockPrices && stk.stockPrices["SKU-GLV-75"] ? stk.stockPrices["SKU-GLV-75"] : 750) + '</div>' +
          '<div style="font-size:10.5px;color:#166534;">• Syringes 5ml: ' + (stk.stockLevels && stk.stockLevels["SKU-SYR-5ML"] !== undefined ? stk.stockLevels["SKU-SYR-5ML"] : 30) + ' cartons @ ₹' + (stk.stockPrices && stk.stockPrices["SKU-SYR-5ML"] ? stk.stockPrices["SKU-SYR-5ML"] : 420) + '</div>' +
          '</div>' +
          '<div style="font-size:10px;color:#0284c7;font-weight:bold;">✓ Instantly synchronized across all Mumbai hospital maps</div>' +
          '</div>'
        );
      } else {
        const stkIcon = L.divIcon({
          html: '<div class="mta-marker-right"><div class="mta-badge badge-d2">S</div><div class="mta-label">' + stk.name.split('(')[0] + '</div></div>',
          className: '',
          iconSize: [180, 32],
          iconAnchor: [14, 16]
        });
        const m = L.marker(pos, { icon: stkIcon }).addTo(map);
        m.bindPopup(
          '<div style="font-family:sans-serif;padding:4px;">' +
          '<div style="font-weight:900;font-size:12px;color:#0f172a;">' + stk.name + '</div>' +
          '<div style="font-size:11px;color:#64748b;">📍 ' + stk.hub + ' • SLA: ' + stk.deliverySLA + '</div>' +
          '</div>'
        );
      }
    });

    // 5. Render Manufacturers
    ALL_MANUFACTURERS.forEach(mfg => {
      const pos = [mfg.lat || 19.2968, mfg.lng || 73.0631];
      const mfgIcon = L.divIcon({
        html: '<div class="mta-marker-right"><div class="mta-badge badge-m1">M</div><div class="mta-label">' + (mfg.brand || mfg.name).split('(')[0] + '</div></div>',
        className: '',
        iconSize: [180, 32],
        iconAnchor: [14, 16]
      });
      L.marker(pos, { icon: mfgIcon }).addTo(map)
        .bindPopup(
          '<div style="font-family:sans-serif;padding:4px;">' +
          '<div style="font-weight:900;font-size:12px;color:#0f172a;">🏭 ' + mfg.name + '</div>' +
          '<div style="font-size:11px;color:#64748b;">Brand: ' + mfg.brand + ' • Depot: ' + (mfg.area || mfg.primaryHub) + '</div>' +
          '</div>'
        );
    });

    // 6. Render Persistent Supply Bridges ("Web of Provenance")
    BRIDGES.forEach(bridge => {
      const hPos = [bridge.hospitalCoords.lat, bridge.hospitalCoords.lng];
      const sPos = [bridge.stockistCoords.lat, bridge.stockistCoords.lng];

      // Outer glowing luminous line
      L.polyline([hPos, sPos], {
        color: '#10b981',
        weight: 8,
        opacity: 0.45,
        lineCap: 'round'
      }).addTo(map);

      // Core cyan dash track
      L.polyline([hPos, sPos], {
        color: '#06b6d4',
        weight: 4.5,
        opacity: 0.95,
        dashArray: '8, 6',
        lineCap: 'round'
      }).addTo(map);

      // Midpoint bridge interactive badge
      const midLat = (hPos[0] + sPos[0]) / 2;
      const midLng = (hPos[1] + sPos[1]) / 2;
      const bridgeIcon = L.divIcon({
        html: '<div class="bridge-node-marker" title="Persistent Supply Bridge">🌉</div>',
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const bm = L.marker([midLat, midLng], { icon: bridgeIcon }).addTo(map);
      bm.bindPopup(
        '<div style="font-family:sans-serif;padding:6px;min-width:230px;">' +
        '<div style="font-weight:900;color:#0284c7;font-size:12px;">⚡ PERSISTENT SUPPLY BRIDGE</div>' +
        '<div style="font-weight:800;font-size:13px;color:#0f172a;margin-top:2px;">' + bridge.hospitalName + ' ⟷ ' + bridge.stockistName + '</div>' +
        '<hr style="border:none;border-top:1px solid #e2e8f0;margin:6px 0;"/>' +
        '<div style="font-size:11px;color:#475569;">📦 Lifetime Orders: <b>' + bridge.lifetimeOrders + ' Verified</b></div>' +
        '<div style="font-size:11px;color:#475569;">💰 Cleared Volume: <b>₹' + Number(bridge.totalValue).toLocaleString("en-IN") + '</b></div>' +
        '<div style="font-size:11px;color:#475569;">⚡ Avg Speed: <b>' + bridge.avgTransitMins + ' mins</b></div>' +
        '<div style="font-size:11px;color:#475569;">🔒 Smart Escrow: <b>' + bridge.activeCreditLine + '</b></div>' +
        '<div style="margin-top:6px;background:#dbeafe;padding:4px 6px;border-radius:4px;font-size:10px;font-weight:bold;color:#1e40af;">✓ ZERO-CLICK MIC REORDERING ACTIVE</div>' +
        '</div>'
      );
    });

    // 7. Swiggy-Style Live Delivery Tracking on Route G & P
    const lineG_outer = L.polyline(ROUTE_COORDS, {
      color: '#064e3b',
      weight: 9,
      opacity: 0.5,
      lineCap: 'round'
    }).addTo(map);

    const lineG = L.polyline(ROUTE_COORDS, {
      color: '#10b981',
      weight: 5.5,
      opacity: 0.95,
      lineCap: 'round'
    }).addTo(map);

    const lineP = L.polyline(ROUTE_COORDS, {
      color: '#f59e0b',
      weight: 4.5,
      opacity: 0.9,
      dashArray: '8, 6',
      lineCap: 'round'
    }).addTo(map);

    // Live Moving Delivery Vehicle on Line G
    const vanIcon = L.divIcon({
      html: '<div class="vehicle-marker">🚚</div>',
      className: '',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
    const vanMarker = L.marker(ROUTE_COORDS[0], { icon: vanIcon, zIndexOffset: 2500 }).addTo(map);

    // Live Moving Escrow Token on Line P
    const cashIcon = L.divIcon({
      html: '<div class="cash-marker">₹</div>',
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    const cashMarker = L.marker(ROUTE_COORDS[ROUTE_COORDS.length - 1], { icon: cashIcon, zIndexOffset: 2400 }).addTo(map);

    // Vehicle Animation Loop traversing road artery
    let vanStep = 0;
    let cashStep = ROUTE_COORDS.length - 1;

    setInterval(() => {
      vanStep += 0.08;
      if (vanStep >= ROUTE_COORDS.length - 1) vanStep = 0;
      const idx = Math.floor(vanStep);
      const frac = vanStep - idx;
      const p1 = ROUTE_COORDS[idx];
      const p2 = ROUTE_COORDS[Math.min(idx + 1, ROUTE_COORDS.length - 1)];
      const lat = p1[0] + (p2[0] - p1[0]) * frac;
      const lng = p1[1] + (p2[1] - p1[1]) * frac;
      vanMarker.setLatLng([lat, lng]);

      cashStep -= 0.07;
      if (cashStep <= 0) cashStep = ROUTE_COORDS.length - 1;
      const cIdx = Math.floor(cashStep);
      const cFrac = cashStep - cIdx;
      const cp1 = ROUTE_COORDS[cIdx];
      const cp2 = ROUTE_COORDS[Math.min(cIdx + 1, ROUTE_COORDS.length - 1)];
      const cLat = cp1[0] + (cp2[0] - cp1[0]) * cFrac;
      const cLng = cp1[1] + (cp2[1] - cp1[1]) * cFrac;
      cashMarker.setLatLng([cLat, cLng]);
    }, 70);

    // Navigation Focus Functions
    function focusMumbai() {
      map.fitBounds([
        [18.94, 72.80],
        [19.32, 73.10]
      ], { padding: [40, 40] });
    }

    function focusHome() {
      map.flyTo([ACTIVE_HOSPITAL.lat || 19.0515, ACTIVE_HOSPITAL.lng || 72.8291], 15, { duration: 1.2 });
    }

    function focusDadar() {
      map.flyTo([19.0178, 72.8478], 15, { duration: 1.2 });
    }

    function focusBhiwandi() {
      map.flyTo([19.2968, 73.0631], 14, { duration: 1.2 });
    }

    function toggleLine(code) {
      if (code === 'G') {
        if (map.hasLayer(lineG)) {
          map.removeLayer(lineG);
          map.removeLayer(lineG_outer);
        } else {
          lineG_outer.addTo(map);
          lineG.addTo(map);
        }
      } else if (code === 'P') {
        if (map.hasLayer(lineP)) {
          map.removeLayer(lineP);
        } else {
          lineP.addTo(map);
        }
      }
    }
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.card}>
      {/* 1. Official MTA-Style Black Subway Header */}
      <View style={styles.mtaTopHeader}>
        <View style={styles.mtaTitleRow}>
          {/* NYC MTA Style Bullet Logo */}
          <View style={styles.mtaLogoCircle}>
            <Text style={styles.mtaLogoText}>M</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.mtaMainTitle}>MTA MUMBAI MED-TRANSIT NETWORK</Text>
              <View style={styles.subwayBadgeGreen}>
                <Text style={styles.subwayBadgeText}>G</Text>
              </View>
              <View style={styles.subwayBadgeGold}>
                <Text style={styles.subwayBadgeText}>P</Text>
              </View>
            </View>
            <Text style={styles.mtaSubTitle}>
              Real Mumbai Map GPS Corridors • 2-Pipe Goods (Line G) & Smart Escrow (Line P)
            </Text>
          </View>
        </View>

        {/* View Mode Switcher: Real Mumbai Map vs MTA Subway Schematic */}
        <View style={styles.headerRight}>
          <View style={styles.modeToggleRow}>
            <TouchableOpacity
              onPress={() => setViewMode('REAL_MAP')}
              style={[styles.modeToggleBtn, viewMode === 'REAL_MAP' && styles.modeToggleBtnActive]}
            >
              <Ionicons name="map" size={13} color={viewMode === 'REAL_MAP' ? '#ffffff' : '#94a3b8'} />
              <Text style={[styles.modeToggleText, viewMode === 'REAL_MAP' && styles.modeToggleTextActive]}>
                📍 Real Mumbai Map
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode('SCHEMATIC')}
              style={[styles.modeToggleBtn, viewMode === 'SCHEMATIC' && styles.modeToggleBtnActive]}
            >
              <MaterialCommunityIcons name="subway-variant" size={13} color={viewMode === 'SCHEMATIC' ? '#ffffff' : '#94a3b8'} />
              <Text style={[styles.modeToggleText, viewMode === 'SCHEMATIC' && styles.modeToggleTextActive]}>
                🚇 Subway Schematic
              </Text>
            </TouchableOpacity>
          </View>

          {/* Order Chips (Private per entity) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.orderChips}>
            {visibleOrders.length === 0 ? (
              <View style={{ paddingVertical: 4, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
                  No active orders for {activeHospital.name.split(' ')[0]} • Tap nearest store below or use 🎤 mic to place order
                </Text>
              </View>
            ) : (
              visibleOrders.map((ord) => (
                <TouchableOpacity
                  key={ord.orderId}
                  onPress={() => setSelectedOrder(ord)}
                  style={[
                    styles.orderChip,
                    activeOrder && activeOrder.orderId === ord.orderId && styles.orderChipActive
                  ]}
                >
                  <Text
                    style={[
                      styles.orderChipText,
                      activeOrder && activeOrder.orderId === ord.orderId && styles.orderChipTextActive
                    ]}
                  >
                    {ord.orderId} ({ord.deliveryStatus})
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {/* 2. Main Map Display */}
      {viewMode === 'REAL_MAP' ? (
        /* A. REAL INTERACTIVE MUMBAI MAP (OpenStreetMap / Carto Positron / Satellite with Leaflet) */
        <View style={styles.realMapWrapper}>
          {Platform.OS === 'web' ? (
            <iframe
              title="Real Mumbai Healthcare Supply Chain Map"
              srcDoc={realMumbaiMapHtml}
              style={{
                width: '100%',
                height: 520,
                border: 'none',
                display: 'block'
              }}
            />
          ) : (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', color: '#16a34a' }}>LINE G: Real-world Western Express Highway Transit</Text>
              <Text style={{ fontWeight: '800', color: '#d97706', marginTop: 4 }}>LINE P: Reverse Capital Escrow Stream</Text>
            </View>
          )}
        </View>
      ) : (
        /* B. MTA SUBWAY SCHEMATIC VIEW (Angular Transit Map Diagram) */
        <View style={styles.subwayMapFrame}>
          {Platform.OS === 'web' ? (
            <svg
              viewBox="0 0 1000 460"
              style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: '#fcfbf7' }}
            >
              <defs>
                <filter id="trainGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#16a34a" floodOpacity="0.6" />
                </filter>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d97706" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Water Coastline & Zones */}
              <path d="M 0,0 L 260,0 Q 250,140 270,220 Q 280,260 210,300 Q 180,330 200,460 L 0,460 Z" fill="#dbeafe" opacity="0.6" />
              <path d="M 800,0 Q 860,180 820,320 Q 800,400 840,460 L 1000,460 L 1000,0 Z" fill="#dbeafe" opacity="0.6" />

              <text x="35" y="180" fill="#60a5fa" fontSize="12" fontWeight="700" letterSpacing="2" fontStyle="italic">
                ARABIAN SEA (पश्चिम सागर)
              </text>
              <text x="215" y="300" fill="#3b82f6" fontSize="10" fontWeight="700" letterSpacing="1">
                MAHIM BAY
              </text>
              <text x="840" y="380" fill="#60a5fa" fontSize="11" fontWeight="700" letterSpacing="1.5">
                THANE CREEK
              </text>

              {/* Bandra-Worli Sea Link Bridge */}
              <line x1="240" y1="260" x2="380" y2="260" stroke="#0284c7" strokeWidth="3" strokeDasharray="6,4" />
              <text x="250" y="250" fill="#0369a1" fontSize="9" fontWeight="800">
                BANDRA-WORLI SEA LINK
              </text>

              {/* Subway Tracks */}
              {/* Line G Casing & Line (Green) */}
              <path d="M 860,65 L 720,65 L 570,150 L 570,190 L 420,255 L 230,255 L 100,255" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 860,65 L 720,65 L 570,150 L 570,190 L 420,255 L 230,255 L 100,255" fill="none" stroke="#10b981" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 230,255 L 230,350" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Line P Casing & Line (Gold) */}
              <path d="M 860,75 L 720,75 L 570,160 L 570,200 L 420,265 L 230,265 L 100,265" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 860,75 L 720,75 L 570,160 L 570,200 L 420,265 L 230,265 L 100,265" fill="none" stroke="#f59e0b" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Animated Train on Line G */}
              <g>
                <animateMotion path="M 860,65 L 720,65 L 570,150 L 570,190 L 420,255 L 230,255 L 100,255" dur="16s" repeatCount="indefinite" rotate="auto" />
                <rect x="-14" y="-7" width="28" height="14" rx="4" fill="#047857" filter="url(#trainGlow)" />
                <rect x="-12" y="-5" width="24" height="10" rx="3" fill="#10b981" />
                <circle cx="11" cy="-2.5" r="2" fill="#ffffff" />
                <circle cx="11" cy="2.5" r="2" fill="#ffffff" />
                <text x="-8" y="3" fill="#ffffff" fontSize="8" fontWeight="900">📦 G</text>
              </g>

              {/* Animated Cash Token on Line P */}
              <g>
                <animateMotion path="M 100,265 L 230,265 L 420,265 L 570,200 L 570,160 L 720,75 L 860,75" dur="14s" repeatCount="indefinite" rotate="auto" />
                <circle cx="0" cy="0" r="8" fill="#f59e0b" filter="url(#goldGlow)" />
                <circle cx="0" cy="0" r="5" fill="#fef08a" />
                <text x="-3.5" y="3" fill="#78350f" fontSize="8" fontWeight="900">₹</text>
              </g>

              {/* Stations */}
              {STATIONS.map((stn) => {
                const isSelected = inspectedStation && inspectedStation.id === stn.id;
                const isInterchange = stn.type.includes('Interchange');
                const isTerminal = stn.type.includes('Terminal');
                const coords = stn.schematicCoords;

                return (
                  <g key={stn.id} onClick={() => setInspectedStation(stn)} style={{ cursor: 'pointer' }}>
                    {isInterchange ? (
                      <g>
                        <rect x={coords.x - 14} y={coords.y - 18} width="28" height="36" rx="14" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />
                        <circle cx={coords.x} cy={coords.y - 6} r="4" fill="#10b981" />
                        <circle cx={coords.x} cy={coords.y + 6} r="4" fill="#f59e0b" />
                      </g>
                    ) : isTerminal ? (
                      <g>
                        <circle cx={coords.x} cy={coords.y} r="12" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />
                        <circle cx={coords.x} cy={coords.y} r="6" fill="#10b981" />
                      </g>
                    ) : (
                      <g>
                        <circle cx={coords.x} cy={coords.y} r="8.5" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                        <circle cx={coords.x} cy={coords.y} r="3.5" fill="#10b981" />
                      </g>
                    )}

                    {isSelected && (
                      <circle cx={coords.x} cy={coords.y} r="18" fill="none" stroke="#0284c7" strokeWidth="3" strokeDasharray="4,3" />
                    )}

                    <g>
                      <rect x={coords.x + 14} y={coords.y - 16} width="24" height="14" rx="3" fill="#0f172a" />
                      <text x={coords.x + 26} y={coords.y - 6} fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">{stn.code}</text>
                      <text x={coords.x + 42} y={coords.y - 5} fill="#0f172a" fontSize="11.5" fontWeight="800" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">{stn.name}</text>
                      <text x={coords.x + 14} y={coords.y + 8} fill="#64748b" fontSize="9" fontWeight="700" stroke="#ffffff" strokeWidth="2" paintOrder="stroke">{stn.area.split('(')[0]}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
          ) : (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', color: '#16a34a' }}>LINE G: Goods Express</Text>
              <Text style={{ fontWeight: '800', color: '#d97706' }}>LINE P: Capital Escrow</Text>
            </View>
          )}
        </View>
      )}

      {/* 3. Interactive Station Inspection Departure Board (Opens upon tapping any station) */}
      {inspectedStation && (
        <View style={styles.stationInspectionCard}>
          <View style={styles.stationInspectionTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.inspectionCodeBadge}>
                <Text style={styles.inspectionCodeText}>{inspectedStation.code}</Text>
              </View>
              <View>
                <Text style={styles.inspectionStationName}>{inspectedStation.name}</Text>
                <Text style={styles.inspectionZone}>{inspectedStation.area}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setInspectedStation(null)} style={styles.closeInspectorBtn}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.inspectionDetailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxLabel}>On-Duty Operator / Facility:</Text>
              <Text style={styles.detailBoxValue}>{inspectedStation.operator}</Text>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.detailBoxLabel}>Live Transit Cargo / Train:</Text>
              <Text style={[styles.detailBoxValue, { color: '#047857' }]}>{inspectedStation.activeTrain}</Text>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.detailBoxLabel}>Stock Buffer at Station:</Text>
              <Text style={styles.detailBoxValue}>{inspectedStation.stockBuffer}</Text>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.detailBoxLabel}>Escrow & Payment Terms:</Text>
              <Text style={[styles.detailBoxValue, { color: '#b45309' }]}>{inspectedStation.escrowCondition}</Text>
            </View>
          </View>
        </View>
      )}

      {/* 4. Live Dual Telemetry Cards for Line G (Goods) and Line P (Payment Escrow) */}
      {activeOrder && (
        <View style={styles.dualTelemetryContainer}>
          {/* Card 1: Line G - Physical Goods Express */}
          <View style={styles.goodsTelemetryCard}>
            <View style={styles.telemetryCardTop}>
              <View style={styles.cardHeaderBadgeGreen}>
                <View style={styles.subwayBadgeTiny}><Text style={styles.subwayBadgeTinyText}>G</Text></View>
                <Text style={styles.telemetryCardTitleGreen}>LINE G: PHYSICAL GOODS EXPRESS (Westbound ➔)</Text>
              </View>
              <View style={styles.pillStatusGreen}>
                <Text style={styles.pillStatusGreenText}>{activeOrder.deliveryStatus}</Text>
              </View>
            </View>

            <Text style={styles.manifestSummary}>
              {activeOrder.items.map(i => `${i.qty} ${i.unit} ${i.name}`).join(', ')}
            </Text>

            {/* Swiggy-Style Visual Progression Ticker */}
            <View style={styles.tickerContainer}>
              <View style={styles.tickerBarBackground}>
                <View
                  style={[
                    styles.tickerBarFill,
                    {
                      width:
                        activeOrder.deliveryStatus === 'DELIVERED'
                          ? '100%'
                          : activeOrder.deliveryStatus === 'ARRIVING'
                            ? '90%'
                            : activeOrder.deliveryStatus === 'IN_TRANSIT'
                              ? '60%'
                              : '25%'
                    }
                  ]}
                />
              </View>
              <View style={styles.tickerStepsRow}>
                <View style={styles.tickerStepItem}>
                  <Text style={[styles.tickerStepDot, activeOrder.deliveryStatus && styles.tickerStepDotActive]}>●</Text>
                  <Text style={[styles.tickerStepLabel, activeOrder.deliveryStatus && styles.tickerStepLabelActive]}>DISPATCHED (20%)</Text>
                </View>
                <View style={styles.tickerStepItem}>
                  <Text style={[styles.tickerStepDot, ['IN_TRANSIT', 'ARRIVING', 'DELIVERED'].includes(activeOrder.deliveryStatus) && styles.tickerStepDotActive]}>●</Text>
                  <Text style={[styles.tickerStepLabel, ['IN_TRANSIT', 'ARRIVING', 'DELIVERED'].includes(activeOrder.deliveryStatus) && styles.tickerStepLabelActive]}>IN TRANSIT (60%)</Text>
                </View>
                <View style={styles.tickerStepItem}>
                  <Text style={[styles.tickerStepDot, ['ARRIVING', 'DELIVERED'].includes(activeOrder.deliveryStatus) && styles.tickerStepDotActive]}>●</Text>
                  <Text style={[styles.tickerStepLabel, ['ARRIVING', 'DELIVERED'].includes(activeOrder.deliveryStatus) && styles.tickerStepLabelActive]}>ARRIVING (90%)</Text>
                </View>
                <View style={styles.tickerStepItem}>
                  <Text style={[styles.tickerStepDot, activeOrder.deliveryStatus === 'DELIVERED' && styles.tickerStepDotActive]}>●</Text>
                  <Text style={[styles.tickerStepLabel, activeOrder.deliveryStatus === 'DELIVERED' && styles.tickerStepLabelActive]}>DELIVERED (100%)</Text>
                </View>
              </View>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Subway Express Track:</Text>
              <Text style={styles.specValueGreen}>Dadar West Hub ➔ Sea Link Corridor ➔ Lilavati Dock Gate 2</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Live Transit Van GPS:</Text>
              <Text style={styles.specValueGreen}>
                {activeOrder.deliveryStatus === 'DELIVERED'
                  ? 'Docked at Hospital Receiving Dock'
                  : activeOrder.currentLocation || 'Entero Express • 14 mins away • On Bandra-Worli Sea Link'}
              </Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Estimated Arrival (ETA):</Text>
              <Text style={styles.specValueBold}>{activeOrder.deliveredBy || '14 Mins'}</Text>
            </View>

            {/* Test Stage Control Buttons */}
            <View style={styles.deliveryActionRow}>
              {activeOrder.deliveryStatus !== 'DELIVERED' ? (
                <>
                  <TouchableOpacity
                    style={styles.fastForwardBtn}
                    onPress={() => fastForwardDelivery && fastForwardDelivery(activeOrder.orderId)}
                  >
                    <Ionicons name="play-forward" size={14} color="#ffffff" />
                    <Text style={styles.fastForwardBtnText}>⚡ Fast-Forward Stage</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.instantDeliverBtn}
                    onPress={() => {
                      if (createOrUpdateBridge) {
                        createOrUpdateBridge(activeOrder);
                      }
                      if (fastForwardDelivery) {
                        fastForwardDelivery(activeOrder.orderId);
                        fastForwardDelivery(activeOrder.orderId);
                        fastForwardDelivery(activeOrder.orderId);
                      }
                    }}
                  >
                    <Ionicons name="checkmark-done" size={14} color="#047857" />
                    <Text style={styles.instantDeliverBtnText}>✨ Instant Deliver & Bridge</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.bridgeFormedBanner}>
                  <Text style={styles.bridgeFormedBannerText}>
                    🌉 Persistent Supply Bridge Established • Zero-Click Mic Voice Reordering Unlocked
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Card 2: Line P - Capital & Smart Escrow Track */}
          <View style={styles.cashTelemetryCard}>
            <View style={styles.telemetryCardTop}>
              <View style={styles.cardHeaderBadgeGold}>
                <View style={[styles.subwayBadgeTiny, { backgroundColor: '#b45309' }]}>
                  <Text style={styles.subwayBadgeTinyText}>P</Text>
                </View>
                <Text style={styles.telemetryCardTitleGold}>LINE P: CAPITAL & PAYMENT ESCROW (Eastbound ➔)</Text>
              </View>
              <View style={styles.pillStatusGold}>
                <Text style={styles.pillStatusGoldText}>
                  {activeOrder.deliveryStatus === 'DELIVERED' ? 'ESCROW_RELEASED' : activeOrder.paymentStatus}
                </Text>
              </View>
            </View>

            <Text style={styles.escrowTotalAmount}>
              ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
            </Text>

            {/* Counter-Directional Payment Escrow Pipeline Milestone */}
            <View style={styles.escrowPipelineBox}>
              <View style={styles.escrowMilestoneRow}>
                <View style={[styles.escrowMilestone, styles.escrowMilestoneActive]}>
                  <Text style={styles.escrowMilestoneText}>🔒 1. Escrow Locked</Text>
                </View>
                <Ionicons name="arrow-forward" size={12} color="#b45309" />
                <View style={[
                  styles.escrowMilestone,
                  ['IN_TRANSIT', 'ARRIVING', 'DELIVERED'].includes(activeOrder.deliveryStatus) && styles.escrowMilestoneActive
                ]}>
                  <Text style={styles.escrowMilestoneText}>📦 2. Dock Verification</Text>
                </View>
                <Ionicons name="arrow-forward" size={12} color="#b45309" />
                <View style={[
                  styles.escrowMilestone,
                  activeOrder.deliveryStatus === 'DELIVERED' && styles.escrowMilestoneSuccess
                ]}>
                  <Text style={styles.escrowMilestoneText}>
                    {activeOrder.deliveryStatus === 'DELIVERED' ? '💰 3. Released to Supplier' : '⏳ 3. Release on Delivery'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Settlement Protocol:</Text>
              <Text style={styles.specValueGold}>Smart Contract Escrow (Automated Factory Clearing on Dock QR Scan)</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Hospital Credit Due Date:</Text>
              <Text style={styles.specValueGold}>{activeOrder.paymentDueBy} (60-Day Terms)</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Prompt Payment Incentive:</Text>
              <Text style={styles.specValueDiscount}>{activeOrder.earlyDiscountOffer}</Text>
            </View>
          </View>
        </View>
      )}

      {/* 5. Persistent Distributed Mesh Bridges ("Web of Provenance") */}
      <View style={styles.meshBridgesSection}>
        <View style={styles.meshBridgesHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 16 }}>🕸️</Text>
            <View>
              <Text style={styles.meshBridgesTitle}>PERSISTENT SUPPLY BRIDGES ("WEB OF PROVENANCE")</Text>
              <Text style={styles.meshBridgesSubtitle}>
                Permanent glowing supply lines on map with fast-track zero-click reordering
              </Text>
            </View>
          </View>
          <View style={styles.bridgesCountBadge}>
            <Text style={styles.bridgesCountText}>{visibleBridges.length} Bridges Active</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bridgesScroll}>
          {visibleBridges.length === 0 ? (
            <View style={{ padding: 14, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', minWidth: 280 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#0369a1' }}>
                ⚡ Private Web of Provenance: 0 Permanent Bridges
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 15 }}>
                Directly order from any nearest distributor or factory below to establish a permanent supply bridge for {activeHospital.name.split(' ')[0]}!
              </Text>
            </View>
          ) : (
            visibleBridges.map((bridge, bIdx) => (
              <View key={bridge.id || bridge.bridgeId || `bridge-${bIdx}`} style={styles.bridgeCard}>
                <View style={styles.bridgeCardTop}>
                  <Text style={styles.bridgeNodeIcon}>🌉</Text>
                  <View style={styles.fastTrackTag}>
                    <Ionicons name="flash" size={10} color="#047857" />
                    <Text style={styles.fastTrackTagText}>Fast-Track Unlocked</Text>
                  </View>
                </View>
                <Text style={styles.bridgePartiesText}>
                  {bridge.hospitalName || 'Hospital'} ⟷ {bridge.stockistName || 'Stockist'}
                </Text>
              <View style={styles.bridgeMetricsGrid}>
                <View style={styles.bridgeMetric}>
                  <Text style={styles.bridgeMetricLabel}>Orders:</Text>
                  <Text style={styles.bridgeMetricVal}>{bridge.lifetimeOrders || 1} Verified</Text>
                </View>
                <View style={styles.bridgeMetric}>
                  <Text style={styles.bridgeMetricLabel}>Cleared:</Text>
                  <Text style={styles.bridgeMetricVal}>₹{Number(bridge.totalValue || 0).toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.bridgeMetric}>
                  <Text style={styles.bridgeMetricLabel}>Avg SLA:</Text>
                  <Text style={styles.bridgeMetricVal}>{bridge.avgTransitMins || 18} mins</Text>
                </View>
                <View style={styles.bridgeMetric}>
                  <Text style={styles.bridgeMetricLabel}>Credit Terms:</Text>
                  <Text style={styles.bridgeMetricVal}>{bridge.activeCreditLine || 'Active'}</Text>
                </View>
              </View>
              <View style={styles.micReadyFooter}>
                <Ionicons name="mic" size={12} color="#0284c7" />
                <Text style={styles.micReadyText}>
                  Say: "Order from {(bridge.stockistName || 'Entero').split(' ')[0]}" for 0-click dispatch
                </Text>
              </View>
            </View>
          ))
        )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden'
  },
  mtaTopHeader: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
  },
  mtaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  mtaLogoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  mtaLogoText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -1
  },
  mtaMainTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  mtaSubTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  subwayBadgeGreen: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subwayBadgeGold: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subwayBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900'
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8
  },
  modeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#334155'
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9
  },
  modeToggleBtnActive: {
    backgroundColor: '#0284c7'
  },
  modeToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8'
  },
  modeToggleTextActive: {
    color: '#ffffff',
    fontWeight: '800'
  },
  orderChips: {
    flexGrow: 0
  },
  orderChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155'
  },
  orderChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8'
  },
  orderChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8'
  },
  orderChipTextActive: {
    color: '#ffffff'
  },
  realMapWrapper: {
    width: '100%',
    height: 520,
    backgroundColor: '#f8fafc',
    position: 'relative'
  },
  subwayMapFrame: {
    position: 'relative',
    backgroundColor: '#fcfbf7',
    borderBottomWidth: 2,
    borderBottomColor: '#cbd5e1'
  },
  stationInspectionCard: {
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#bae6fd',
    padding: 16
  },
  stationInspectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  inspectionCodeBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  inspectionCodeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900'
  },
  inspectionStationName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a'
  },
  inspectionZone: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  closeInspectorBtn: {
    padding: 4
  },
  inspectionDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  detailBox: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  detailBoxLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 2
  },
  detailBoxValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a'
  },
  dualTelemetryContainer: {
    flexDirection: 'row',
    padding: 18,
    gap: 16,
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc'
  },
  goodsTelemetryCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#bbf7d0'
  },
  cashTelemetryCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a'
  },
  telemetryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardHeaderBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  cardHeaderBadgeGold: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#d97706',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  subwayBadgeTiny: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subwayBadgeTinyText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900'
  },
  telemetryCardTitleGreen: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900'
  },
  telemetryCardTitleGold: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900'
  },
  pillStatusGreen: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  pillStatusGreenText: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: '800'
  },
  pillStatusGold: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  pillStatusGoldText: {
    color: '#92400e',
    fontSize: 10,
    fontWeight: '800'
  },
  manifestSummary: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10
  },
  escrowTotalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3
  },
  specLabel: {
    fontSize: 11,
    color: '#64748b'
  },
  specValueGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d'
  },
  specValueGold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d97706'
  },
  specValueBold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a'
  },
  specValueDiscount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a'
  },
  tickerContainer: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  tickerBarBackground: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8
  },
  tickerBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3
  },
  tickerStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tickerStepItem: {
    alignItems: 'center'
  },
  tickerStepDot: {
    fontSize: 10,
    color: '#94a3b8'
  },
  tickerStepDotActive: {
    color: '#10b981'
  },
  tickerStepLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 2
  },
  tickerStepLabelActive: {
    color: '#065f46',
    fontWeight: '800'
  },
  deliveryActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  fastForwardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  fastForwardBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  instantDeliverBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  instantDeliverBtnText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800'
  },
  bridgeFormedBanner: {
    flex: 1,
    backgroundColor: '#dbeafe',
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  bridgeFormedBannerText: {
    color: '#1e40af',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center'
  },
  escrowPipelineBox: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fef3c7'
  },
  escrowMilestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  escrowMilestone: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9'
  },
  escrowMilestoneActive: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a'
  },
  escrowMilestoneSuccess: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac'
  },
  escrowMilestoneText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#78350f'
  },
  meshBridgesSection: {
    padding: 16,
    backgroundColor: '#0f172a',
    borderTopWidth: 2,
    borderTopColor: '#334155'
  },
  meshBridgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  meshBridgesTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  meshBridgesSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  },
  bridgesCountBadge: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  bridgesCountText: {
    color: '#38bdf8',
    fontSize: 10.5,
    fontWeight: '800'
  },
  bridgesScroll: {
    flexDirection: 'row'
  },
  bridgeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 270,
    borderWidth: 1.5,
    borderColor: '#0ea5e9'
  },
  bridgeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  bridgeNodeIcon: {
    fontSize: 18
  },
  fastTrackTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  fastTrackTagText: {
    color: '#047857',
    fontSize: 9,
    fontWeight: '800'
  },
  bridgePartiesText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8
  },
  bridgeMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8
  },
  bridgeMetric: {
    width: '48%',
    backgroundColor: '#0f172a',
    padding: 5,
    borderRadius: 6
  },
  bridgeMetricLabel: {
    color: '#64748b',
    fontSize: 8.5,
    fontWeight: '700'
  },
  bridgeMetricVal: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800'
  },
  micReadyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0c4a6e',
    padding: 6,
    borderRadius: 6
  },
  micReadyText: {
    color: '#bae6fd',
    fontSize: 9,
    fontWeight: '700'
  }
});
