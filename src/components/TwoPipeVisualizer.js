// Mumbai Med-Transit Supply Chain Map (Subway Paradigm 2-Pipe Control Panel)
// Modeled directly after the MTA New York City Subway Map architecture enclosed in Ashu Dutt's assignment
// Provides:
// 1. Real Interactive Mumbai Map (OpenStreetMap & Satellite GIS with live GPS corridors, road arteries, Sea Link, and real coordinate markers)
// 2. MTA Subway Schematic (Angular transit diagram view)
// 3. Line G (Green): Physical Medical Goods Express Track (Moving Westbound ➔ Factory to Bedside)
// 4. Line P (Gold): Capital & Smart Escrow Payment Track (Moving Eastbound ➔ Hospital to Factory)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function TwoPipeVisualizer() {
  const { orders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);
  const [inspectedStation, setInspectedStation] = useState(null);
  const [viewMode, setViewMode] = useState('REAL_MAP'); // 'REAL_MAP' | 'SCHEMATIC'
  const [highlightLine, setHighlightLine] = useState('ALL'); // 'ALL' | 'G' | 'P' | 'B' | 'R'

  useEffect(() => {
    if (orders.length > 0 && (!selectedOrder || !orders.find(o => o.orderId === selectedOrder.orderId))) {
      setSelectedOrder(orders[0]);
    }
  }, [orders]);

  const activeOrder = selectedOrder || orders[0];

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

    /* Live Animated Vehicle Markers */
    .vehicle-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      background: #10b981;
      border: 2.5px solid #fff;
      box-shadow: 0 0 16px #10b981;
      font-size: 18px;
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
      width: 275px;
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
      <span>🚇 MTA SUBWAY LEGEND</span>
      <span style="font-size: 8.5px; color: #64748b;">MUMBAI MED-GRID</span>
    </div>
    <div class="legend-row" onclick="toggleLine('G')">
      <div class="bullet b-g">G</div>
      <div>
        <div>Line G (Goods Express)</div>
        <div style="font-size: 8.5px; color: #64748b;">Bhiwandi ➔ Dadar ➔ Lilavati OT (Live)</div>
      </div>
    </div>
    <div class="legend-row" onclick="toggleLine('P')">
      <div class="bullet b-p">P</div>
      <div>
        <div>Line P (Payment Escrow)</div>
        <div style="font-size: 8.5px; color: #64748b;">Lilavati ➔ Escrow ➔ Factory Release</div>
      </div>
    </div>
    <div class="legend-row" onclick="toggleLine('B')">
      <div class="bullet b-b">B</div>
      <div>
        <div>Line B (Cold-Chain Biologics)</div>
        <div style="font-size: 8.5px; color: #64748b;">2°C - 8°C Monitored Vaccine Line</div>
      </div>
    </div>
    <div class="legend-row" onclick="toggleLine('R')">
      <div class="bullet b-r">R</div>
      <div>
        <div>Line R (STAT Emergency Rush)</div>
        <div style="font-size: 8.5px; color: #64748b;">Dadar ➔ Lilavati Trauma ICU (6 Mins)</div>
      </div>
    </div>
  </div>

  <!-- Map Quick Focus Buttons -->
  <div class="map-controls">
    <button class="control-btn" onclick="focusMumbai()">📍 All Mumbai</button>
    <button class="control-btn" onclick="focusLilavati()">🏥 Lilavati Hospital & Sea Link</button>
    <button class="control-btn" onclick="focusDadar()">🔄 Dadar Dawa Bazar</button>
    <button class="control-btn" onclick="focusBhiwandi()">🏭 Bhiwandi C&F Hub</button>
  </div>

  <script>
    // 1. Initialize Map centered on Mumbai
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([19.14, 72.91], 11);

    // 2. Base Tile Layers (100% Free, Zero API Key Required, Zero Watermarks)
    // Official OpenStreetMap Standard
    const osmStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // High-Resolution Esri World Street Map (Backup Street Layer)
    const esriStreetLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; Esri'
    });

    // Fallback if OSM is throttled by ISP
    osmStreetLayer.on('tileerror', function() {
      if (map.hasLayer(osmStreetLayer)) {
        map.removeLayer(osmStreetLayer);
        esriStreetLayer.addTo(map);
      }
    });

    // Satellite Imagery Layer (Esri World Imagery)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; Esri'
    });

    // Dark Mode Layers (Esri Dark Gray Canvas - Official, Zero Watermark, No API Key)
    const darkBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; Esri'
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

    // 3. Real Mumbai Road Coordinates from Bhiwandi down to Lilavati & Hinduja
    const routeCoords = [
      [19.2968, 73.0631], // M1: Bhiwandi Central Depot
      [19.2780, 73.0450], // Bhiwandi Toll Plaza
      [19.2450, 73.0180], // Mankoli Naka
      [19.2183, 72.9781], // Majiwada Junction (Thane Central)
      [19.1820, 72.9650], // Mulund Check Naka (EEH)
      [19.1550, 72.9350], // Bhandup
      [19.1250, 72.9150], // JVLR East
      [19.1260, 72.8850], // JVLR Powai / IIT
      [19.1350, 72.8550], // JVLR / WEH Junction
      [19.1197, 72.8464], // S4: Andheri West Depot
      [19.0980, 72.8520], // Vile Parle / Domestic Airport
      [19.0750, 72.8480], // Santacruz
      [19.0550, 72.8420], // Bandra Kalanagar
      [19.0178, 72.8478], // D2: Dadar Central Dawa Bazar Interchange
      [19.0260, 72.8360], // Shivaji Park / Mahim Causeway
      [19.0366, 72.8172], // Bandra-Worli Sea Link Bridge
      [19.0519, 72.8291], // H1: Lilavati Hospital Receiving Dock (Bandra West)
    ];

    const kemBranchCoords = [
      [19.0178, 72.8478], // Dadar Interchange
      [19.0033, 72.8424]  // K3: KEM Hospital Parel
    ];

    const hindujaBranchCoords = [
      [19.0519, 72.8291], // Lilavati
      [19.0330, 72.8397]  // H2: Hinduja Hospital
    ];

    // 4. Overlaid 2-Pipe Subway Lines on the Real Map
    // Line G: Physical Goods Express (Green)
    const lineG_outer = L.polyline(routeCoords, {
      color: '#064e3b',
      weight: 9,
      opacity: 0.5,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const lineG = L.polyline(routeCoords, {
      color: '#10b981',
      weight: 5.5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Line P: Capital & Payment Escrow Track (Gold)
    const lineP = L.polyline(routeCoords, {
      color: '#f59e0b',
      weight: 4.5,
      opacity: 0.9,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Line B & R Branches
    const lineB = L.polyline(hindujaBranchCoords, {
      color: '#0284c7',
      weight: 4,
      dashArray: '6, 4'
    }).addTo(map);

    const lineR = L.polyline(kemBranchCoords, {
      color: '#ef4444',
      weight: 4,
      dashArray: '5, 3'
    }).addTo(map);

    // 5. Station Markers on Real Locations with Smart Directional Layout
    const stations = [
      {
        id: 'm1',
        code: 'M1',
        name: 'Bhiwandi C&F Terminal',
        badgeClass: 'badge-m1',
        align: 'right',
        pos: [19.2968, 73.0631],
        desc: 'HMD Dispovan & Polymed National Depots • 1,280,000 Units Factory Buffer'
      },
      {
        id: 's4',
        code: 'S4',
        name: 'Andheri West Depot',
        badgeClass: 'badge-s4',
        align: 'right',
        pos: [19.1197, 72.8464],
        desc: 'Sagar Medical & Surgicals Depot • 24,000 Units Buffer'
      },
      {
        id: 'h1',
        code: 'H1',
        name: 'Lilavati Hospital Dock',
        badgeClass: 'badge-h1',
        align: 'left', // Points LEFT into Arabian Sea space to avoid any overlap!
        pos: [19.0519, 72.8291],
        desc: 'Bandra West (Gate 2 Dock) • Inward Stores & Central Pharmacy'
      },
      {
        id: 'h2',
        code: 'H2',
        name: 'Hinduja Hospital Dock',
        badgeClass: 'badge-h2',
        align: 'left', // Points LEFT into Mahim Bay space to avoid any overlap!
        pos: [19.0330, 72.8397],
        desc: 'Mahim Bay Receiving Dock • 2-8°C Cold-Chain Vault'
      },
      {
        id: 'd2',
        code: 'D2',
        name: 'Dadar Interchange',
        badgeClass: 'badge-d2',
        align: 'right', // Points RIGHT into Central Mumbai space!
        pos: [19.0178, 72.8478],
        desc: 'Entero Healthcare Syndicate • 42,000 Units Wholesale Buffer'
      },
      {
        id: 'k3',
        code: 'K3',
        name: 'K.E.M. Hospital Bay',
        badgeClass: 'badge-k3',
        align: 'right', // Points RIGHT into Parel space!
        pos: [19.0033, 72.8424],
        desc: 'Municipal Trauma & Emergency Medical Stores'
      }
    ];

    stations.forEach(stn => {
      const isLeft = stn.align === 'left';
      const markerClass = isLeft ? 'mta-marker-left' : 'mta-marker-right';
      const html = '<div class="' + markerClass + '">' +
        '<div class="mta-badge ' + stn.badgeClass + '">' + stn.code + '</div>' +
        '<div class="mta-label">' + stn.name + '</div>' +
        '</div>';

      const icon = L.divIcon({
        html: html,
        className: '',
        iconSize: [180, 32],
        iconAnchor: isLeft ? [166, 16] : [14, 16]
      });

      const marker = L.marker(stn.pos, { icon: icon }).addTo(map);
      marker.bindPopup(
        '<div style="font-family: sans-serif; padding: 4px;">' +
        '<div style="font-weight: 900; font-size: 13px; color: #0f172a;">[' + stn.code + '] ' + stn.name + '</div>' +
        '<div style="font-size: 11px; color: #64748b; margin: 4px 0;">' + stn.desc + '</div>' +
        '<div style="font-size: 11px; font-weight: 800; color: #16a34a;">✓ Real-time inventory sync active</div>' +
        '</div>'
      );
    });

    // 6. Live Moving Delivery Van on Line G
    const vanIcon = L.divIcon({
      html: '<div class="vehicle-marker">🚚</div>',
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const vanMarker = L.marker(routeCoords[0], { icon: vanIcon }).addTo(map);

    // Live Moving Escrow Token on Line P
    const cashIcon = L.divIcon({
      html: '<div class="cash-marker">₹</div>',
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    const cashMarker = L.marker(routeCoords[routeCoords.length - 1], { icon: cashIcon }).addTo(map);

    // Animation Loop
    let vanStep = 0;
    let cashStep = routeCoords.length - 1;

    setInterval(() => {
      // Move Van Westbound towards Lilavati
      vanStep += 0.08;
      if (vanStep >= routeCoords.length - 1) vanStep = 0;
      const idx = Math.floor(vanStep);
      const frac = vanStep - idx;
      const p1 = routeCoords[idx];
      const p2 = routeCoords[Math.min(idx + 1, routeCoords.length - 1)];
      const lat = p1[0] + (p2[0] - p1[0]) * frac;
      const lng = p1[1] + (p2[1] - p1[1]) * frac;
      vanMarker.setLatLng([lat, lng]);

      // Move Cash Eastbound towards Factory
      cashStep -= 0.07;
      if (cashStep <= 0) cashStep = routeCoords.length - 1;
      const cIdx = Math.floor(cashStep);
      const cFrac = cashStep - cIdx;
      const cp1 = routeCoords[cIdx];
      const cp2 = routeCoords[Math.min(cIdx + 1, routeCoords.length - 1)];
      const cLat = cp1[0] + (cp2[0] - cp1[0]) * cFrac;
      const cLng = cp1[1] + (cp2[1] - cp1[1]) * cFrac;
      cashMarker.setLatLng([cLat, cLng]);
    }, 70);

    // 7. Map Navigation Functions
    function focusMumbai() {
      map.fitBounds([
        [18.98, 72.80],
        [19.32, 73.10]
      ], { padding: [40, 40] });
    }

    function focusLilavati() {
      map.flyTo([19.0519, 72.8291], 15, { duration: 1.2 });
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

    // Default view: fit full Mumbai corridor
    focusMumbai();
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

          {/* Order Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.orderChips}>
            {orders.map((ord) => (
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
            ))}
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

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Subway Express Track:</Text>
              <Text style={styles.specValueGreen}>Dadar West Hub ➔ Sea Link Corridor ➔ Lilavati Dock Gate 2</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Live Transit Van GPS:</Text>
              <Text style={styles.specValueGreen}>{activeOrder.currentLocation}</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Estimated Arrival (ETA):</Text>
              <Text style={styles.specValueBold}>{activeOrder.deliveredBy}</Text>
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
                <Text style={styles.pillStatusGoldText}>{activeOrder.paymentStatus}</Text>
              </View>
            </View>

            <Text style={styles.escrowTotalAmount}>
              ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
            </Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
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
  }
});
