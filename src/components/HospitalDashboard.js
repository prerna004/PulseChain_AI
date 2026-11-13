// Hospital Procurement & Ward Dashboard : v2
// Category-filtered inventory, ward usage, per-hospital orders

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import TwoPipeVisualizer from './TwoPipeVisualizer';
import VoiceRequisitionBar from './VoiceRequisitionBar';
import { CATALOG_CATEGORIES, calculateDistanceKm } from '../data/mumbaiData';
import SymbolIcon from './SymbolIcon';

export default function HospitalDashboard() {
  const {
    selectedHospital,
    inventory,
    orders,
    wards,
    consumeWardItem,
    startUberStockistPing,
    loggedInHospital,
    logoutHospital,
    registeredHospitals,
    allStockists,
    allManufacturers,
    placeDirectOrder,
    bridges
  } = useApp();

  const [activeTab, setActiveTab] = useState('INVENTORY');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [supplierTypeFilter, setSupplierTypeFilter] = useState('ALL'); // 'ALL' | 'STOCKIST' | 'MANUFACTURER'
  const [onboardingSupplier, setOnboardingSupplier] = useState(null);
  const [selectedSkuToOrder] = useState(null);
  const [orderQty] = useState('50');
  const [licenseNo, setLicenseNo] = useState('MH-MUM-DL-2026-8819');
  const [receivingDock, setReceivingDock] = useState('Gate 2 - OT Emergency Bay');
  const [orderFeedback, setOrderFeedback] = useState(null);

  const activeHosp = loggedInHospital || selectedHospital || registeredHospitals[0];
  const hLat = activeHosp.lat || 19.0515;
  const hLng = activeHosp.lng || 72.8291;

  // 1. Calculate & Rank Nearest Stockists strictly by proximity
  const nearestStockists = useMemo(() => {
    return (allStockists || [])
      .map(stk => {
        const dist = calculateDistanceKm(hLat, hLng, stk.lat || 19.0178, stk.lng || 72.8478);
        const isBridged = (bridges || []).some(b => b.hospitalId === activeHosp.id && b.stockistId === stk.id);
        const isUnlocked = activeHosp.completedFirstOrder || isBridged;
        const eta = dist < 3 ? '15-20 mins (Express)' : dist < 6 ? '25-35 mins' : dist < 12 ? '40-50 mins' : '1 hr';
        return { ...stk, distanceKm: dist, eta, isUnlocked };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allStockists, activeHosp, bridges, hLat, hLng]);

  // 2. Calculate & Rank Nearest Primary Manufacturers (OEMs) strictly by logistics proximity
  const nearestManufacturers = useMemo(() => {
    return (allManufacturers || [])
      .map(mfg => {
        const dist = calculateDistanceKm(hLat, hLng, mfg.lat || 19.2968, mfg.lng || 73.0631);
        const isBridged = (bridges || []).some(b => b.hospitalId === activeHosp.id && b.mfgId === mfg.id);
        const isUnlocked = activeHosp.completedFirstOrder || isBridged;
        const eta = dist < 20 ? '45 mins (Priority Freight)' : '1.5-2 hrs (National Highway)';
        return { ...mfg, distanceKm: dist, eta, isUnlocked };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allManufacturers, activeHosp, bridges, hLat, hLng]);

  // Quick 1-tap direct order handler
  const handleQuickDirectOrder = (supplier, isMfg = false) => {
    const sku = inventory.find(i => i.skuId === 'SKU-GLV-75') || inventory[0];
    const newOrd = placeDirectOrder({
      hospital: activeHosp,
      supplier,
      sku,
      qty: 50,
      isManufacturer: isMfg
    });
    setOrderFeedback(`Order ${newOrd.orderId} dispatched from ${supplier.name}! Transit pipeline generated.`);
    setTimeout(() => setOrderFeedback(null), 5000);
  };

  // Submit 1-time onboarding registration
  const submitOnboardingAndOrder = () => {
    if (!onboardingSupplier) return;
    const isMfg = onboardingSupplier.type === 'MANUFACTURER';
    const sku = selectedSkuToOrder || inventory.find(i => i.skuId === 'SKU-GLV-75') || inventory[0];
    const newOrd = placeDirectOrder({
      hospital: activeHosp,
      supplier: onboardingSupplier.supplier,
      sku,
      qty: parseInt(orderQty, 10) || 50,
      isManufacturer: isMfg,
      essentialDetails: {
        licenseNo,
        receivingDock,
        verifiedAt: new Date().toISOString()
      }
    });
    setOnboardingSupplier(null);
    setOrderFeedback(`1-Time KYC Verified! Direct ordering now unlocked permanently. Order ${newOrd.orderId} dispatched.`);
    setTimeout(() => setOrderFeedback(null), 6000);
  };

  // Helper to get private isolated inventory stock for this hospital
  const getStockForHospital = (sku, hospitalId) => {
    if (sku.hospitalStock && sku.hospitalStock[hospitalId] !== undefined) {
      return sku.hospitalStock[hospitalId];
    }
    if (hospitalId === 'hosp-1') return sku.hospStockLilavati;
    return sku.hospStockLilavati || Math.round(sku.reorderLevel * 1.5);
  };

  // Only show this hospital's orders : strict data isolation
  const myOrders = useMemo(() => {
    return (orders || []).filter(o => o.hospitalId === activeHosp.id);
  }, [orders, activeHosp.id]);

  // Filtered inventory by category
  const filteredInventory = useMemo(() => {
    if (categoryFilter === 'All') return inventory;
    return inventory.filter(i => i.category === categoryFilter);
  }, [inventory, categoryFilter]);

  // Inventory summary stats for THIS hospital
  const inventoryStats = useMemo(() => ({
    total: inventory.length,
    low: inventory.filter(i => getStockForHospital(i, activeHosp.id) <= i.reorderLevel).length,
    critical: inventory.filter(i => getStockForHospital(i, activeHosp.id) <= i.reorderLevel * 0.5).length,
    ok: inventory.filter(i => getStockForHospital(i, activeHosp.id) > i.reorderLevel).length,
  }), [inventory, activeHosp.id]);

  return (
    <View style={styles.container}>
      {/* Hospital Facility Secure Session & Security Header */}
      <View style={styles.hospitalSecureHeader}>
        <View style={styles.hospitalSecureLeft}>
          <View style={styles.hospitalIconCircle}>
            <SymbolIcon name="hospital" size={24} color="#0284c7" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={styles.hospitalSecureName}>{activeHosp.name}</Text>
              <View style={styles.verifiedHospBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#047857" />
                <Text style={styles.verifiedHospBadgeText}>Licensed MMR Facility</Text>
              </View>
            </View>

            <Text style={styles.hospitalSecureMeta}>
              {activeHosp.area} • ID: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{activeHosp.id}</Text> • Capacity: {activeHosp.beds || 350} Beds • Contact: {activeHosp.contactPerson || 'Procurement Incharge'}
            </Text>

            <View style={styles.privacyGuaranteeRow}>
              <Ionicons name="lock-closed" size={13} color="#0284c7" />
              <Text style={styles.privacyGuaranteeText}>
                <Text style={{ fontWeight: '800', color: '#0369a1' }}>Confidential P2P Channel:</Text> Direct independent transactions with Mumbai stockists & factories. Your purchase orders, internal pharmacy inventory, and financial escrow are strictly isolated and invisible to other hospitals.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.hospitalSecureRight}>
          <View style={[styles.kycStatusCard, { backgroundColor: activeHosp.completedFirstOrder ? '#f0fdf4' : '#fffbeb', borderColor: activeHosp.completedFirstOrder ? '#bbf7d0' : '#fde68a' }]}>
            <Text style={[styles.kycStatusLabel, { color: activeHosp.completedFirstOrder ? '#166534' : '#b45309' }]}>
              SUPPLY CHAIN ONBOARDING
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons
                name={activeHosp.completedFirstOrder ? "checkmark-circle" : "alert-circle"}
                size={14}
                color={activeHosp.completedFirstOrder ? "#16a34a" : "#d97706"}
              />
              <Text style={[styles.kycStatusValue, { color: activeHosp.completedFirstOrder ? '#15803d' : '#b45309' }]}>
                {activeHosp.completedFirstOrder ? 'Direct Ordering Active' : '1-Time KYC Required'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => logoutHospital()}
            style={styles.switchHospitalBtn}
          >
            <Ionicons name="swap-horizontal" size={14} color="#475569" />
            <Text style={styles.switchHospitalBtnText}>Switch Hospital</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Giant Voice Mic & 1-Tap Orders Bar */}
      <VoiceRequisitionBar />

      {/* 2. Living 2-Pipe Goods & Payment Flow */}
      <TwoPipeVisualizer />

      {/* Order Feedback Toast Banner */}
      {orderFeedback && (
        <View style={styles.orderFeedbackBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#047857" />
          <Text style={styles.orderFeedbackText}>{orderFeedback}</Text>
        </View>
      )}

      {/* 2.5 NEAREST STORES & MANUFACTURERS (Ranked by Proximity & Live Working) */}
      <View style={styles.nearestMeshCard}>
        <View style={styles.nearestMeshHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.radarIconCircle}>
              <Ionicons name="navigate" size={18} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.nearestMeshTitle}>
                NEAREST STORES & MANUFACTURERS FOR {activeHosp.name.toUpperCase()}
              </Text>
              <Text style={styles.nearestMeshSubtitle}>
                Ranked strictly by distance from {activeHosp.area} • Direct ordering or 1-time KYC link
              </Text>
            </View>
          </View>

          {/* Filter Chips */}
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              onPress={() => setSupplierTypeFilter('ALL')}
              style={[styles.filterPill, supplierTypeFilter === 'ALL' && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, supplierTypeFilter === 'ALL' && styles.filterPillTextActive]}>
                All Nearby ({nearestStockists.length + nearestManufacturers.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSupplierTypeFilter('STOCKIST')}
              style={[styles.filterPill, supplierTypeFilter === 'STOCKIST' && styles.filterPillActiveStockist]}
            >
              <Text style={[styles.filterPillText, supplierTypeFilter === 'STOCKIST' && styles.filterPillTextActiveStockist]}>
                Distributors / Stores ({nearestStockists.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSupplierTypeFilter('MANUFACTURER')}
              style={[styles.filterPill, supplierTypeFilter === 'MANUFACTURER' && styles.filterPillActiveMfg]}
            >
              <Text style={[styles.filterPillText, supplierTypeFilter === 'MANUFACTURER' && styles.filterPillTextActiveMfg]}>
                OEM Factories ({nearestManufacturers.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Ranked Nearest Suppliers List */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suppliersHorizontalScroll}>
          {/* Nearest Stockists (Stores) */}
          {(supplierTypeFilter === 'ALL' || supplierTypeFilter === 'STOCKIST') &&
            nearestStockists.map((stk, sIdx) => (
              <View key={stk.id} style={styles.supplierProximityCard}>
                <View style={styles.proximityRankRow}>
                  <View style={styles.rankBadgeStockist}>
                    <Text style={styles.rankBadgeText}>#{sIdx + 1} CLOSEST STORE ({stk.distanceKm} km)</Text>
                  </View>
                  <View style={styles.slaBadge}>
                    <Ionicons name="time" size={10} color="#047857" />
                    <Text style={styles.slaBadgeText}>{stk.eta}</Text>
                  </View>
                </View>

                <View style={styles.supplierEntityRow}>
                  <View style={styles.symbolIconBoxAmber}>
                    <SymbolIcon name="truck" size={16} color="#d97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.supplierCardName} numberOfLines={1}>{stk.name.split('(')[0]}</Text>
                    <Text style={styles.supplierCardArea}>{stk.hub || stk.area} • Rating: {stk.rating || 4.9} / 5</Text>
                  </View>
                </View>

                {/* Live Stock & Pricing snippet */}
                <View style={styles.stockSnippetBox}>
                  <View style={styles.stockSnippetItem}>
                    <Text style={styles.stockSnippetLabel}>Surgical Gloves 7.5:</Text>
                    <Text style={styles.stockSnippetVal}>
                      {stk.stockLevels?.['SKU-GLV-75'] !== undefined ? stk.stockLevels?.['SKU-GLV-75'] : 50} boxes @ ₹{stk.stockPrices?.['SKU-GLV-75'] || 760}
                    </Text>
                  </View>
                  <View style={styles.stockSnippetItem}>
                    <Text style={styles.stockSnippetLabel}>Dispovan 5ml Syringes:</Text>
                    <Text style={styles.stockSnippetVal}>
                      {stk.stockLevels?.['SKU-SYR-5ML'] !== undefined ? stk.stockLevels?.['SKU-SYR-5ML'] : 340} cartons @ ₹{stk.stockPrices?.['SKU-SYR-5ML'] || 430}
                    </Text>
                  </View>
                </View>

                {/* Status & Action */}
                <View style={styles.supplierActionBottom}>
                  {stk.isUnlocked ? (
                    <>
                      <View style={styles.unlockedTag}>
                        <Ionicons name="flash" size={10} color="#047857" />
                        <Text style={styles.unlockedTagText}>Verified • Direct Order Unlocked</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleQuickDirectOrder(stk, false)}
                        style={styles.directOrderBtn}
                      >
                        <Ionicons name="send" size={12} color="#ffffff" />
                        <Text style={styles.directOrderBtnText}>Instant Order (50 Boxes)</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <View style={styles.lockedTag}>
                        <Ionicons name="information-circle" size={10} color="#b45309" />
                        <Text style={styles.lockedTagText}>1-Time Hospital KYC Needed</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setOnboardingSupplier({ supplier: stk, type: 'STOCKIST' })}
                        style={styles.onboardOrderBtn}
                      >
                        <Ionicons name="document-text" size={12} color="#ffffff" />
                        <Text style={styles.onboardOrderBtnText}>1-Time Register & Order</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}

          {/* Nearest Manufacturers (OEM Plants) */}
          {(supplierTypeFilter === 'ALL' || supplierTypeFilter === 'MANUFACTURER') &&
            nearestManufacturers.map((mfg, mIdx) => (
              <View key={mfg.id} style={[styles.supplierProximityCard, styles.mfgCardBorder]}>
                <View style={styles.proximityRankRow}>
                  <View style={styles.rankBadgeMfg}>
                    <Text style={styles.rankBadgeText}>#{mIdx + 1} OEM FACTORY ({mfg.distanceKm} km)</Text>
                  </View>
                  <View style={[styles.slaBadge, { backgroundColor: '#f0fdf4' }]}>
                    <Ionicons name="train" size={10} color="#15803d" />
                    <Text style={[styles.slaBadgeText, { color: '#15803d' }]}>{mfg.eta}</Text>
                  </View>
                </View>

                <View style={styles.supplierEntityRow}>
                  <View style={styles.symbolIconBoxGreen}>
                    <SymbolIcon name="factory" size={16} color="#059669" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.supplierCardName} numberOfLines={1}>{mfg.brand || mfg.name} Primary Plant</Text>
                    <Text style={styles.supplierCardArea}>{mfg.area || mfg.primaryHub} • Official OEM</Text>
                  </View>
                </View>

                {/* Factory Buffer Stock snippet */}
                <View style={[styles.stockSnippetBox, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                  <View style={styles.stockSnippetItem}>
                    <Text style={[styles.stockSnippetLabel, { color: '#166534' }]}>Central Factory Buffer:</Text>
                    <Text style={[styles.stockSnippetVal, { color: '#15803d' }]}>1,280,000 Units (Bulk Freight Depot)</Text>
                  </View>
                  <View style={styles.stockSnippetItem}>
                    <Text style={[styles.stockSnippetLabel, { color: '#166534' }]}>Primary Plant Lines:</Text>
                    <Text style={[styles.stockSnippetVal, { color: '#15803d' }]}>Dispovan Syringes, IV Cannulas, N95</Text>
                  </View>
                </View>

                {/* Status & Action */}
                <View style={styles.supplierActionBottom}>
                  {mfg.isUnlocked ? (
                    <>
                      <View style={styles.unlockedTag}>
                        <Ionicons name="flash" size={10} color="#047857" />
                        <Text style={styles.unlockedTagText}>Direct OEM Bridge Active</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleQuickDirectOrder(mfg, true)}
                        style={[styles.directOrderBtn, { backgroundColor: '#15803d' }]}
                      >
                        <FontAwesome5 name="industry" size={12} color="#ffffff" />
                        <Text style={styles.directOrderBtnText}>Direct Factory Order (50 Boxes)</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <View style={styles.lockedTag}>
                        <Ionicons name="information-circle" size={10} color="#b45309" />
                        <Text style={styles.lockedTagText}>1-Time OEM Link Needed</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setOnboardingSupplier({ supplier: mfg, type: 'MANUFACTURER' })}
                        style={[styles.onboardOrderBtn, { backgroundColor: '#059669' }]}
                      >
                        <Ionicons name="document-text" size={12} color="#ffffff" />
                        <Text style={styles.onboardOrderBtnText}>1-Time Connect & Order</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
        </ScrollView>
      </View>

      {/* 1-TIME HOSPITAL ONBOARDING & ESSENTIAL DETAILS MODAL */}
      {onboardingSupplier && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalDialogCard}>
              <View style={styles.modalDialogTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={styles.modalDialogIconCircle}>
                    <FontAwesome5 name="hospital-user" size={18} color="#0284c7" />
                  </View>
                  <View>
                    <Text style={styles.modalDialogTitle}>1-Time Hospital Verification & Supplier Link</Text>
                    <Text style={styles.modalDialogSubtitle}>
                      Connecting {activeHosp.name} to {onboardingSupplier.supplier.name}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setOnboardingSupplier(null)} style={{ padding: 4 }}>
                  <Ionicons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalExplainerBanner}>
                <Ionicons name="shield-checkmark" size={18} color="#0284c7" />
                <Text style={styles.modalExplainerText}>
                  Enter essential details once. After this 1st order verification, direct zero-click ordering will be permanently unlocked. You will never have to re-enter paperwork again.
                </Text>
              </View>

              <ScrollView style={{ maxHeight: 340 }}>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>Hospital Registered Name</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalInputDisabled]}
                    value={activeHosp.name}
                    editable={false}
                  />
                </View>

                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>Hospital Area & Region</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalInputDisabled]}
                    value={`${activeHosp.area} (Beds: ${activeHosp.beds || 350})`}
                    editable={false}
                  />
                </View>

                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>Inward Receiving Dock & Gate</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={receivingDock}
                    onChangeText={setReceivingDock}
                    placeholder="e.g. Gate 2 - OT Emergency Bay"
                  />
                </View>

                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>Hospital Drug License / Health Registration No.</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={licenseNo}
                    onChangeText={setLicenseNo}
                    placeholder="e.g. MH-MUM-DL-2026-8819"
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={[styles.modalFieldGroup, { flex: 1 }]}>
                    <Text style={styles.modalFieldLabel}>Head of Procurement</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={activeHosp.contactPerson}
                      editable={false}
                    />
                  </View>
                  <View style={[styles.modalFieldGroup, { flex: 1 }]}>
                    <Text style={styles.modalFieldLabel}>Phone / WhatsApp</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={activeHosp.phone}
                      editable={false}
                    />
                  </View>
                </View>

                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>Initial Item & Quantity to Dispatch Immediately</Text>
                  <View style={styles.modalItemConfirmRow}>
                    <Text style={styles.modalItemNameText}>Surgical Gloves 7.5 (Box of 100)</Text>
                    <Text style={styles.modalItemQtyText}>50 Boxes</Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalDialogFooter}>
                <TouchableOpacity
                  onPress={() => setOnboardingSupplier(null)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={submitOnboardingAndOrder}
                  style={styles.modalConfirmBtn}
                >
                  <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                  <Text style={styles.modalConfirmBtnText}>Verify, Connect & Dispatch Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 3. Simple Tab Buttons (Big, readable, bilingual) */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('INVENTORY')}
          style={[styles.tabBtn, activeTab === 'INVENTORY' && styles.tabBtnActive]}
        >
          <SymbolIcon name="box" size={18} color={activeTab === 'INVENTORY' ? '#ffffff' : '#0284c7'} />
          <Text style={[styles.tabText, activeTab === 'INVENTORY' && styles.tabTextActive]}>
            1. Hospital Stock (दवाइयां और सामान)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('WARDS')}
          style={[styles.tabBtn, activeTab === 'WARDS' && styles.tabBtnActive]}
        >
          <SymbolIcon name="pulse" size={18} color={activeTab === 'WARDS' ? '#ffffff' : '#0284c7'} />
          <Text style={[styles.tabText, activeTab === 'WARDS' && styles.tabTextActive]}>
            2. Ward Usage (वार्ड में इस्तेमाल)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('ORDERS')}
          style={[styles.tabBtn, activeTab === 'ORDERS' && styles.tabBtnActive]}
        >
          <SymbolIcon name="receipt" size={18} color={activeTab === 'ORDERS' ? '#ffffff' : '#0284c7'} />
          <Text style={[styles.tabText, activeTab === 'ORDERS' && styles.tabTextActive]}>
            3. Active Orders ({myOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: Hospital Stock with Category Filter + Stats */}
      {activeTab === 'INVENTORY' && (
        <View style={styles.whiteCard}>
          {/* Summary Stats */}
          <View style={styles.inventoryStatsRow}>
            <View style={[styles.invStatCard, { borderLeftColor: '#0284c7' }]}>
              <Text style={styles.invStatNum}>{inventoryStats.total}</Text>
              <Text style={styles.invStatLabel}>Total SKUs</Text>
            </View>
            <View style={[styles.invStatCard, { borderLeftColor: '#16a34a' }]}>
              <Text style={[styles.invStatNum, { color: '#16a34a' }]}>{inventoryStats.ok}</Text>
              <Text style={styles.invStatLabel}>In Stock</Text>
            </View>
            <View style={[styles.invStatCard, { borderLeftColor: '#d97706' }]}>
              <Text style={[styles.invStatNum, { color: '#d97706' }]}>{inventoryStats.low}</Text>
              <Text style={styles.invStatLabel}>Low Stock</Text>
            </View>
            <View style={[styles.invStatCard, { borderLeftColor: '#dc2626' }]}>
              <Text style={[styles.invStatNum, { color: '#dc2626' }]}>{inventoryStats.critical}</Text>
              <Text style={styles.invStatLabel}>Critical</Text>
            </View>
          </View>

          <View style={styles.cardTopHeader}>
            <View>
              <Text style={styles.sectionTitle}>Hospital Pharmacy Stock ({activeHosp.name})</Text>
              <Text style={styles.sectionSub}>Green = Stock Good • Red = Low Stock (Auto-orders when low)</Text>
            </View>
          </View>

          {/* Category Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATALOG_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoryFilter(cat)}
                style={[styles.catChip, categoryFilter === cat && styles.catChipActive]}
              >
                <Text style={[styles.catChipText, categoryFilter === cat && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterResultCount}>
            {filteredInventory.length} items{categoryFilter !== 'All' ? ` in "${categoryFilter}"` : ''}
          </Text>

          <View style={styles.catalogGrid}>
            {filteredInventory.map((sku) => {
              const currentStock = getStockForHospital(sku, activeHosp.id);
              const isLow = currentStock <= sku.reorderLevel;
              const isCritical = currentStock <= sku.reorderLevel * 0.5;
              return (
                <View
                  key={sku.skuId}
                  style={[styles.skuCard, isLow && styles.skuCardLow, isCritical && styles.skuCardCritical]}
                >
                  <View style={styles.skuTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[
                        styles.skuCategoryIconBox,
                        (sku.category.includes('Consumable') || sku.category.includes('Glove')) ? styles.catIconAmber :
                        (sku.category.includes('Injection') || sku.category.includes('Infusion')) ? styles.catIconBlue :
                        sku.category.includes('Critical') ? styles.catIconRed : styles.catIconGreen
                      ]}>
                        <SymbolIcon
                          name={
                            (sku.category.includes('Consumable') || sku.category.includes('Glove')) ? "gloves" :
                            (sku.category.includes('Injection') || sku.category.includes('Infusion')) ? "cannula" :
                            sku.category.includes('Critical') ? "mask" : "syringe"
                          }
                          size={13}
                          color={
                            (sku.category.includes('Consumable') || sku.category.includes('Glove')) ? "#d97706" :
                            (sku.category.includes('Injection') || sku.category.includes('Infusion')) ? "#0284c7" :
                            sku.category.includes('Critical') ? "#e11d48" : "#059669"
                          }
                        />
                      </View>
                      <Text style={styles.skuCategory}>{sku.category}</Text>
                    </View>
                    <View style={[styles.statusBadge, isCritical ? styles.badgeCritical : isLow ? styles.badgeLow : styles.badgeOk]}>
                      <Text style={[styles.statusBadgeText, isCritical ? styles.badgeTextCritical : isLow ? styles.badgeTextLow : styles.badgeTextOk]}>
                        {isCritical ? 'CRITICAL' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.skuTitle}>{sku.name}</Text>
                  <Text style={styles.skuBrandName}>Brand: {sku.brand} • {sku.unit}</Text>

                  {/* Stock Numbers + Reorder Level */}
                  <View style={styles.stockCountBox}>
                    <View>
                      <Text style={[styles.stockCountNumber, (isLow || isCritical) && { color: '#dc2626' }]}>
                        {currentStock}
                      </Text>
                      <Text style={styles.stockCountUnit}>{sku.unit}</Text>
                    </View>
                    <View style={styles.stockReorderBox}>
                      <Text style={styles.stockReorderLabel}>Reorder at</Text>
                      <Text style={styles.stockReorderValue}>{sku.reorderLevel}</Text>
                      <Text style={styles.stockRateLabel}>Rate: ₹{sku.hospitalRate?.toLocaleString('en-IN')}</Text>
                    </View>
                  </View>

                  {/* Reorder Button */}
                  <TouchableOpacity
                    onPress={() => startUberStockistPing(sku, 50, isCritical ? 'CRITICAL_EMERGENCY' : isLow ? 'CRITICAL_EMERGENCY' : 'STANDARD')}
                    style={[styles.reorderBtn, (isLow || isCritical) && styles.reorderBtnUrgent]}
                  >
                    <Ionicons name="radio" size={16} color="#ffffff" />
                    <Text style={styles.reorderBtnText}>
                      {isCritical ? 'CRITICAL: Order Now!' : isLow ? 'Urgent Reorder (मंगवाएं)' : 'Find Best Price (रेट चेक करें)'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* TAB 2: Ward Usage (Digital Twin Simulation) */}
      {activeTab === 'WARDS' && (
        <View style={styles.whiteCard}>
          <View style={styles.wardNoticeBox}>
            <Ionicons name="information-circle" size={24} color="#0284c7" />
            <Text style={styles.wardNoticeText}>
              Direct Link to Inventory: When doctors/nurses use items in surgery, just tap the button below. As soon as stock drops low, the AI automatically orders more!
            </Text>
          </View>

          <View style={styles.wardsList}>
            {wards.map((ward) => (
              <View key={ward.id} style={styles.wardRowCard}>
                <View style={styles.wardHeader}>
                  <View style={styles.wardNameWrap}>
                    <FontAwesome5 name="hospital-alt" size={18} color="#0284c7" />
                    <View>
                      <Text style={styles.wardTitle}>{ward.name} • {activeHosp.name.split(' ')[0]}</Text>
                      <Text style={styles.wardSubtitle}>{ward.floor} • Active Beds: {ward.activeBeds}</Text>
                    </View>
                  </View>
                  <View style={styles.inUsePill}>
                    <Text style={styles.inUseText}>{ward.status}</Text>
                  </View>
                </View>

                {/* Big Action Buttons to Consume Items in Wards */}
                <View style={styles.consumeActionsGrid}>
                  <TouchableOpacity
                    onPress={() => consumeWardItem('SKU-GLV-75', 10, `${ward.name} (${activeHosp.name})`)}
                    style={styles.consumeActionBtn}
                  >
                    <FontAwesome5 name="hands-wash" size={14} color="#0284c7" />
                    <Text style={styles.consumeBtnLabel}>Used 10 Gloves 7.5</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => consumeWardItem('SKU-CAN-20G', 10, `${ward.name} (${activeHosp.name})`)}
                    style={styles.consumeActionBtn}
                  >
                    <FontAwesome5 name="tint" size={14} color="#0284c7" />
                    <Text style={styles.consumeBtnLabel}>Used 10 IV Cannulas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => consumeWardItem('SKU-SYR-5ML', 5, `${ward.name} (${activeHosp.name})`)}
                    style={styles.consumeActionBtn}
                  >
                    <FontAwesome5 name="syringe" size={14} color="#0284c7" />
                    <Text style={styles.consumeBtnLabel}>Used 5 Dispovan Syringes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* TAB 3: Active Orders List : ONLY this hospital's orders */}
      {activeTab === 'ORDERS' && (
        <View style={styles.whiteCard}>
          <View style={styles.cardTopHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Orders & Live Delivery Tracker</Text>
              <Text style={styles.sectionSub}>
                Private P2P Orders : only {activeHosp.name}&apos;s purchase transactions are shown here
              </Text>
            </View>
          </View>

          {myOrders.length === 0 ? (
            <View style={styles.emptyOrdersBox}>
              <Ionicons name="receipt-outline" size={36} color="#94a3b8" />
              <Text style={styles.emptyOrdersTitle}>No orders yet</Text>
              <Text style={styles.emptyOrdersDesc}>
                Place your first order using the mic or tap &apos;Urgent Reorder&apos; on any item above.
              </Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {myOrders.map((ord) => (
                <View key={ord.orderId} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderIdBadge}>{ord.orderId}</Text>
                      <Text style={styles.orderTimeText}>{ord.orderDate}</Text>
                    </View>
                    <View style={styles.deliveryStatusBadge}>
                      <Text style={styles.deliveryStatusText}>{ord.deliveryStatus}</Text>
                    </View>
                  </View>

                  <Text style={styles.orderItemListText}>
                    {ord.items.map(i => `${i.qty} ${i.unit} ${i.name}`).join(' • ')}
                  </Text>

                  <View style={styles.orderBottomBar}>
                    <Text style={styles.supplierText}>
                      Supplier: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{ord.stockistName}</Text>
                    </Text>
                    <Text style={styles.totalPayable}>₹{ord.totalAmount.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={styles.orderLocationRow}>
                    <Ionicons name="location" size={16} color="#16a34a" />
                    <Text style={styles.orderLocationText}>Truck Location: {ord.currentLocation}</Text>
                  </View>

                  {/* WildCatter 4-Point Compliance: Items Ordered, Date Ordered, Delivered By, Payment Due By */}
                  <View style={styles.orderMetaPointsRow}>
                    <View style={styles.orderMetaPoint}>
                      <Text style={styles.orderMetaLabel}>Items Ordered:</Text>
                      <Text style={styles.orderMetaValue}>{ord.items.map(i => `${i.qty} ${i.unit} ${i.name}`).join(', ')}</Text>
                    </View>
                    <View style={styles.orderMetaPoint}>
                      <Text style={styles.orderMetaLabel}>Date Ordered:</Text>
                      <Text style={styles.orderMetaValue}>{ord.orderDate}</Text>
                    </View>
                    <View style={styles.orderMetaPoint}>
                      <Text style={styles.orderMetaLabel}>Delivered By:</Text>
                      <Text style={[styles.orderMetaValue, { color: '#047857' }]}>{ord.deliveredBy || '18 Mins (Emergency Dispatch)'}</Text>
                    </View>
                    <View style={styles.orderMetaPoint}>
                      <Text style={styles.orderMetaLabel}>Payment Due By:</Text>
                      <Text style={[styles.orderMetaValue, { color: '#b45309' }]}>{ord.paymentDueBy || '60 Days Credit Terms (Net 60)'}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap'
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  tabBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
    shadowColor: '#0284c7',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b'
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '800'
  },
  whiteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 }
  },
  cardTopHeader: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },
  skuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    width: '31.5%',
    minWidth: 260,
    flexGrow: 1,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 10
  },
  skuCardLow: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5'
  },
  skuCardCritical: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  // Inventory stats row
  inventoryStatsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  invStatCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  invStatNum: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  invStatLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', textAlign: 'center', marginTop: 2 },
  // Category filter chips
  categoryScroll: { marginBottom: 12 },
  catChip: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0'
  },
  catChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
    shadowColor: '#0284c7',
    shadowOpacity: 0.25,
    shadowRadius: 8
  },
  catChipText: { fontSize: 11.5, fontWeight: '700', color: '#64748b' },
  catChipTextActive: { color: '#ffffff', fontWeight: '800' },
  filterResultCount: { fontSize: 11, color: '#94a3b8', marginBottom: 8 },
  // Critical badge
  badgeCritical: { backgroundColor: '#fef2f2' },
  badgeTextCritical: { color: '#dc2626' },
  // Reorder level + rate sub-display on stock card
  stockReorderBox: { alignItems: 'flex-end' },
  stockReorderLabel: { fontSize: 9, color: '#94a3b8', fontWeight: '700' },
  stockReorderValue: { fontSize: 16, fontWeight: '900', color: '#d97706' },
  stockRateLabel: { fontSize: 10, color: '#64748b', marginTop: 2 },
  skuCategoryIconBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconAmber: {
    backgroundColor: '#fef3c7',
  },
  catIconBlue: {
    backgroundColor: '#eff6ff',
  },
  catIconRed: {
    backgroundColor: '#fef2f2',
  },
  catIconGreen: {
    backgroundColor: '#ecfdf5',
  },
  supplierEntityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  symbolIconBoxAmber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolIconBoxGreen: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skuTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  skuCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeOk: {
    backgroundColor: '#dcfce7'
  },
  badgeLow: {
    backgroundColor: '#fee2e2'
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800'
  },
  badgeTextOk: {
    color: '#166534'
  },
  badgeTextLow: {
    color: '#991b1b'
  },
  skuTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    minHeight: 38
  },
  skuBrandName: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 10
  },
  stockCountBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  stockCountNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a'
  },
  stockCountUnit: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingVertical: 11,
    borderRadius: 12,
    shadowColor: '#0284c7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  },
  reorderBtnUrgent: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  reorderBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  wardNoticeBox: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    padding: 14,
    marginBottom: 16
  },
  wardNoticeText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
    fontWeight: '600'
  },
  wardsList: {
    gap: 12
  },
  wardRowCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14
  },
  wardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  wardNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  wardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  wardSubtitle: {
    fontSize: 11,
    color: '#64748b'
  },
  inUsePill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  inUseText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800'
  },
  consumeActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  consumeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  consumeBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a'
  },
  ordersList: {
    gap: 12,
    marginTop: 14
  },
  orderCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  orderIdBadge: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0284c7'
  },
  orderTimeText: {
    fontSize: 11,
    color: '#64748b'
  },
  deliveryStatusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  deliveryStatusText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800'
  },
  orderItemListText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8
  },
  orderBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginBottom: 6
  },
  supplierText: {
    fontSize: 12,
    color: '#64748b'
  },
  totalPayable: {
    fontSize: 15,
    fontWeight: '900',
    color: '#16a34a'
  },
  orderLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  orderLocationText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '700'
  },
  // Account Banner (top of hospital dashboard)
  accountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    padding: 12,
    marginBottom: 14
  },
  accountBannerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  accountBannerSub: {
    fontSize: 11,
    color: '#0369a1',
    marginTop: 2
  },
  firstOrderPill: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  firstOrderPillText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800'
  },
  // Empty state for orders
  emptyOrdersBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10
  },
  emptyOrdersTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569'
  },
  emptyOrdersDesc: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20
  },
  // Hospital Facility Secure Session Header
  hospitalSecureHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.8)',
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  hospitalSecureLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    minWidth: 280
  },
  hospitalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#bae6fd'
  },
  hospitalSecureName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a'
  },
  verifiedHospBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0'
  },
  verifiedHospBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#047857'
  },
  hospitalSecureMeta: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 3
  },
  privacyGuaranteeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  privacyGuaranteeText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
    flex: 1
  },
  hospitalSecureRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  kycStatusCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5
  },
  kycStatusLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  kycStatusValue: {
    fontSize: 11.5,
    fontWeight: '800'
  },
  switchHospitalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10
  },
  switchHospitalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569'
  },
  orderFeedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dcfce7',
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14
  },
  orderFeedbackText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
    flex: 1
  },
  nearestMeshCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  nearestMeshHeader: {
    marginBottom: 14
  },
  radarIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nearestMeshTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5
  },
  nearestMeshSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  filterPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  filterPillActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0369a1'
  },
  filterPillActiveStockist: {
    backgroundColor: '#d97706',
    borderColor: '#b45309'
  },
  filterPillActiveMfg: {
    backgroundColor: '#16a34a',
    borderColor: '#15803d'
  },
  filterPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748b'
  },
  filterPillTextActive: {
    color: '#ffffff',
    fontWeight: '800'
  },
  filterPillTextActiveStockist: {
    color: '#ffffff',
    fontWeight: '800'
  },
  filterPillTextActiveMfg: {
    color: '#ffffff',
    fontWeight: '800'
  },
  suppliersHorizontalScroll: {
    flexDirection: 'row'
  },
  supplierProximityCard: {
    width: 300,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 }
  },
  mfgCardBorder: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0'
  },
  proximityRankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  rankBadgeStockist: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  rankBadgeMfg: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  rankBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0f172a'
  },
  slaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  slaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857'
  },
  supplierCardName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2
  },
  supplierCardArea: {
    fontSize: 10.5,
    color: '#64748b',
    marginBottom: 10
  },
  stockSnippetBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10
  },
  stockSnippetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1.5
  },
  stockSnippetLabel: {
    fontSize: 10,
    color: '#64748b'
  },
  stockSnippetVal: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f172a'
  },
  supplierActionBottom: {
    gap: 6
  },
  unlockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  unlockedTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#047857'
  },
  directOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#059669',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  },
  directOrderBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  lockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  lockedTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#b45309'
  },
  onboardOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#d97706',
    paddingVertical: 8,
    borderRadius: 8
  },
  onboardOrderBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalDialogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    maxWidth: 540,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 }
  },
  modalDialogTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalDialogIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalDialogTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a'
  },
  modalDialogSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1
  },
  modalExplainerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12
  },
  modalExplainerText: {
    fontSize: 11,
    color: '#0369a1',
    flex: 1,
    lineHeight: 16
  },
  modalFieldGroup: {
    marginBottom: 10
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
    color: '#0f172a'
  },
  modalInputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#64748b'
  },
  modalItemConfirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 10
  },
  modalItemNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065f46'
  },
  modalItemQtyText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857'
  },
  modalDialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#f1f5f9'
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b'
  },
  modalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8
  },
  modalConfirmBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff'
  },
  orderMetaPointsRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    gap: 4
  },
  orderMetaPoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderMetaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  orderMetaValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a'
  }
});
