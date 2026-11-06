// Manufacturer Production & Stockist Oversight Dashboard — v2
// Shows logged-in manufacturer's brand + real stockist stock levels per SKU

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import TwoPipeVisualizer from './TwoPipeVisualizer';
import VoiceRequisitionBar from './VoiceRequisitionBar';
import { MUMBAI_STOCKISTS, MEDICAL_CATALOG } from '../data/mumbaiData';

export default function ManufacturerDashboard() {
  const {
    selectedManufacturer,
    setSelectedManufacturer,
    loggedInManufacturer,
    loginManufacturer,
    allManufacturers,
    handleVoiceOrTextInput,
    addTelemetryLog,
    inventory
  } = useApp();

  const activeMfg = loggedInManufacturer || selectedManufacturer;
  const [selectedStockistId, setSelectedStockistId] = useState(null);

  const handleBulkDispatch = (stockistName, skuName, qty) => {
    addTelemetryLog(selectedManufacturer.name, 'BULK_DISPATCH_CFA', `Dispatched ${qty} of ${skuName} to ${stockistName}`);
    handleVoiceOrTextInput(`Dispatched 50,000 units of ${skuName} via Bhiwandi C&F depot to ${stockistName}`);
  };

  // My brand's SKUs
  const mySkus = MEDICAL_CATALOG.filter(s => s.mfgId === activeMfg.id);

  // Get total units across all stockists for a given sku
  const getTotalStockistUnits = (skuId) => {
    return MUMBAI_STOCKISTS.reduce((sum, stk) => sum + (stk.stockLevels?.[skuId] || 0), 0);
  };

  return (
    <View style={styles.container}>
      {/* 1. CONNECTED MANUFACTURER ACCOUNTS BAR (Subtle Card Row) */}
      <View style={styles.networkCard}>
        <View style={styles.networkHeader}>
          <View style={styles.networkTitleRow}>
            <View style={styles.symbolIconBoxGreen}>
              <Ionicons name="business" size={14} color="#16a34a" />
            </View>
            <View>
              <Text style={styles.networkTitle}>MUMBAI REGISTERED MANUFACTURERS NETWORK</Text>
              <Text style={styles.networkSub}>Connected Official OEM Production Plants & Primary Hubs</Text>
            </View>
          </View>
          <Text style={styles.networkHint}>1-Tap to Switch Manufacturer Account</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.networkScroll}>
          {(allManufacturers || []).map(mfg => {
            const isActive = (loggedInManufacturer?.id === mfg.id) || (selectedManufacturer?.id === mfg.id);
            return (
              <TouchableOpacity
                key={mfg.id}
                onPress={() => {
                  if (loginManufacturer) loginManufacturer(mfg);
                  if (setSelectedManufacturer) setSelectedManufacturer(mfg);
                }}
                style={[styles.accountCard, isActive && styles.accountCardActive]}
              >
                <View style={[styles.accountIconBox, isActive && styles.accountIconBoxActive]}>
                  <FontAwesome5 name="industry" size={13} color={isActive ? '#ffffff' : '#16a34a'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountName, isActive && styles.accountNameActive]} numberOfLines={1}>
                    {mfg.brand || mfg.name.split(' ')[0]}
                  </Text>
                  <Text style={[styles.accountMeta, isActive && styles.accountMetaActive]}>
                    🏭 {mfg.area || mfg.primaryHub || 'Mumbai Depot'}
                  </Text>
                </View>
                {isActive ? (
                  <View style={styles.activeCheckPill}>
                    <Ionicons name="checkmark" size={10} color="#ffffff" />
                    <Text style={styles.activeCheckText}>Active</Text>
                  </View>
                ) : (
                  <View style={styles.inactiveDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. EXECUTIVE OEM PRODUCTION HERO CARD */}
      <View style={styles.heroGradientCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroEntityLeft}>
            <View style={styles.heroAvatarBox}>
              <FontAwesome5 name="industry" size={20} color="#34d399" />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.heroTitle}>{activeMfg.name || activeMfg.companyName} ({activeMfg.brand})</Text>
                <View style={styles.heroVerifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#34d399" />
                  <Text style={styles.heroVerifiedText}>Certified OEM Plant</Text>
                </View>
              </View>
              <Text style={styles.heroSub}>
                🏭 Production Hub: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{activeMfg.primaryHub || 'Mumbai Hub'}</Text> • Key Representative: {activeMfg.keyRep || activeMfg.repName || 'Official OEM Desk'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleVoiceOrTextInput('Show current stockist inventory across Mumbai for our brand')}
            style={styles.heroActionBtn}
          >
            <Ionicons name="stats-chart" size={16} color="#ffffff" />
            <Text style={styles.heroActionBtnText}>Check Distributor Stocks (स्टॉक चेक करें)</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Metrics Row */}
        <View style={styles.heroMetricsGrid}>
          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>MUMBAI BUFFER STOCK</Text>
              <Ionicons name="cube" size={13} color="#34d399" />
            </View>
            <Text style={styles.heroMetricValue}>1,280,000</Text>
            <Text style={styles.heroMetricSub}>Units ready across central CFA depots</Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>AUTHORIZED STOCKISTS</Text>
              <Ionicons name="business" size={13} color="#38bdf8" />
            </View>
            <Text style={styles.heroMetricValue}>4 Hubs</Text>
            <Text style={styles.heroMetricSub}>Direct delivery partners in MMR</Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>RESTOCK LEAD TIME</Text>
              <Ionicons name="flash" size={13} color="#fbbf24" />
            </View>
            <Text style={styles.heroMetricValue}>2 Days</Text>
            <Text style={styles.heroMetricSub}>Bhiwandi to Hospital turnaround</Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>FINANCIAL ESCROW</Text>
              <Ionicons name="shield-checkmark" size={13} color="#a78bfa" />
            </View>
            <Text style={styles.heroMetricValue}>100% P2P</Text>
            <Text style={styles.heroMetricSub}>Bank escrow verified</Text>
          </View>
        </View>
      </View>

      <VoiceRequisitionBar />
      <TwoPipeVisualizer />

      {/* My Brand SKUs — Stockist Coverage */}
      {mySkus.length > 0 && (
        <View style={[styles.whiteCard, { marginBottom: 16 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWrap}>
              <Ionicons name="cube" size={18} color="#16a34a" />
              <Text style={styles.cardTitle}>My Brand's SKUs — Stockist Coverage</Text>
            </View>
            <Text style={styles.liveTag}>LIVE</Text>
          </View>
          <Text style={styles.cardDesc}>Total units of your products across all Mumbai stockists:</Text>
          <View style={styles.skuCoverageList}>
            {mySkus.map(sku => {
              const total = getTotalStockistUnits(sku.skuId);
              const isLow = total < sku.reorderLevel * 10;
              return (
                <View key={sku.skuId} style={[styles.skuCoverageRow, isLow && styles.skuCoverageRowLow]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.skuCoverageName}>{sku.name}</Text>
                    <Text style={styles.skuCoverageUnit}>{sku.unit}</Text>
                  </View>
                  <View style={styles.skuCoverageRight}>
                    <Text style={[styles.skuCoverageUnits, isLow && { color: '#dc2626' }]}>
                      {total.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.skuCoverageLabel}>{isLow ? '⚠️ LOW' : '✓ OK'}</Text>
                  </View>
                  {isLow && (
                    <TouchableOpacity
                      onPress={() => handleBulkDispatch(MUMBAI_STOCKISTS[0].name, sku.name, '50,000 Units')}
                      style={styles.replenishBtn}
                    >
                      <Text style={styles.replenishBtnText}>Replenish</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.gridRow}>
        {/* Left Column: Distributor Warehouse Stocks */}
        <View style={styles.colHalf}>
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleWrap}>
                <Ionicons name="eye" size={20} color="#0284c7" />
                <Text style={styles.cardTitle}>Mumbai Stockist Inventory (डिस्ट्रीब्यूटर का स्टॉक)</Text>
              </View>
              <Text style={styles.liveTag}>LIVE SYNC</Text>
            </View>

            <Text style={styles.cardDesc}>
              Real-time stock levels in Mumbai to prevent emergency shortages:
            </Text>

            <View style={styles.stockistsList}>
              {MUMBAI_STOCKISTS.map((stk) => {
                // Per-SKU stock for this manufacturer at this stockist
                const mySkuStocks = mySkus.map(sku => ({
                  name: sku.name.substring(0, 30),
                  units: stk.stockLevels?.[sku.skuId] || 0,
                  isLow: (stk.stockLevels?.[sku.skuId] || 0) < sku.reorderLevel * 5
                }));
                const hasLow = mySkuStocks.some(s => s.isLow);
                return (
                  <View key={stk.id} style={[styles.stockistCard, hasLow && styles.stockistCardLow]}>
                    <View style={styles.stockistTop}>
                      <View>
                        <Text style={styles.stkName}>{stk.name}</Text>
                        <Text style={styles.stkHub}>📍 {stk.hub} • ⭐{stk.rating}</Text>
                      </View>
                      {hasLow && <View style={styles.lowBadge}><Text style={styles.lowBadgeText}>⚠️ LOW</Text></View>}
                    </View>

                    {/* Per-SKU stock levels */}
                    {mySkuStocks.length > 0 && (
                      <View style={styles.skuStockGrid}>
                        {mySkuStocks.map((s, i) => (
                          <View key={i} style={[styles.skuStockItem, s.isLow && styles.skuStockItemLow]}>
                            <Text style={styles.skuStockUnits}>{s.units.toLocaleString('en-IN')}</Text>
                            <Text style={styles.skuStockName} numberOfLines={2}>{s.name}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.metricsBox}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Total Stock</Text>
                        <Text style={styles.metricVal}>{stk.warehouseStockLevel}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Credit Terms</Text>
                        <Text style={styles.metricVal}>{stk.creditOffered}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>SLA</Text>
                        <Text style={styles.metricVal}>{stk.deliverySLA}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleBulkDispatch(stk.name, activeMfg.brand, '50,000 Units')}
                      style={styles.dispatchBtn}
                    >
                      <FontAwesome5 name="truck" size={12} color="#ffffff" />
                      <Text style={styles.dispatchBtnText}>Dispatch C&F Truck to {stk.hub}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Right Column: Factory Production & Payments */}
        <View style={styles.colHalf}>
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleWrap}>
                <Ionicons name="shield-checkmark" size={20} color="#16a34a" />
                <Text style={styles.cardTitle}>Payment Clearing & Escrow (पेमेंट स्टेटस)</Text>
              </View>
              <View style={styles.secureBadge}>
                <Text style={styles.secureBadgeText}>100% SECURE</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>
              Direct automated clearing as soon as hospital signs the delivery challan:
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Daily Production</Text>
                <Text style={styles.statNumber}>3,50,000 Pcs</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Bhiwandi Buffer</Text>
                <Text style={styles.statNumber}>12,80,000 Pcs</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Receivables</Text>
                <Text style={[styles.statNumber, { color: '#16a34a' }]}>₹68.4 Lakhs</Text>
              </View>
            </View>

            {/* Recent Clearances */}
            <View style={styles.clearancesList}>
              <Text style={styles.clearanceTitle}>Recent Automated Settlements:</Text>

              <View style={styles.clearanceItem}>
                <View>
                  <Text style={styles.clearanceName}>Entero Healthcare ➔ Lilavati Hospital</Text>
                  <Text style={styles.clearanceSub}>ORD-MUM-8921 • Delivery Verified</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.clearanceAmount}>₹91,200</Text>
                  <Text style={styles.clearanceStatus}>Escrow Locked</Text>
                </View>
              </View>

              <View style={styles.clearanceItem}>
                <View>
                  <Text style={styles.clearanceName}>Sagar Medical ➔ Kokilaben Hospital</Text>
                  <Text style={styles.clearanceSub}>ORD-MUM-8919 • Delivered & Paid</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.clearanceAmount}>₹78,300</Text>
                  <Text style={[styles.clearanceStatus, { color: '#16a34a' }]}>Settled to Factory</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // CONNECTED MANUFACTURER ACCOUNTS BAR
  networkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 }
  },
  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8
  },
  networkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  networkTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.4
  },
  networkSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1
  },
  networkHint: {
    fontSize: 10.5,
    color: '#94a3b8',
    fontWeight: '600'
  },
  networkScroll: {
    flexDirection: 'row'
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 220
  },
  accountCardActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  accountIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  accountIconBoxActive: {
    backgroundColor: '#16a34a'
  },
  accountName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a'
  },
  accountNameActive: {
    fontWeight: '800',
    color: '#15803d'
  },
  accountMeta: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 1
  },
  accountMetaActive: {
    color: '#166534'
  },
  activeCheckPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#16a34a',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3
  },
  activeCheckText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#ffffff'
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1'
  },
  symbolIconBoxGreen: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // EXECUTIVE OEM PRODUCTION HERO CARD
  heroGradientCard: {
    backgroundColor: '#064e3b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#047857',
    shadowColor: '#059669',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 }
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    flexWrap: 'wrap',
    gap: 16
  },
  heroEntityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 280
  },
  heroAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff'
  },
  heroVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  heroVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34d399'
  },
  heroSub: {
    fontSize: 12,
    color: '#a7f3d0',
    marginTop: 4
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }
  },
  heroActionBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '800'
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap',
    gap: 12
  },
  heroMetricItem: {
    flex: 1,
    minWidth: 140
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  heroMetricLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#a7f3d0',
    letterSpacing: 0.6
  },
  heroMetricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff'
  },
  heroMetricSub: {
    fontSize: 10.5,
    color: '#6ee7b7',
    marginTop: 3
  },
  heroMetricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 4
  },
  authBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f0fdf4', borderRadius: 14, borderWidth: 1.5, borderColor: '#bbf7d0', padding: 12, marginBottom: 14 },
  authBannerIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' },
  authBannerName: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  authBannerSub: { fontSize: 11, color: '#16a34a', marginTop: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#dcfce7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  verifiedText: { fontSize: 10, fontWeight: '800', color: '#166534' },
  skuCoverageList: { gap: 8 },
  skuCoverageRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  skuCoverageRowLow: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  skuCoverageName: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  skuCoverageUnit: { fontSize: 10, color: '#64748b' },
  skuCoverageRight: { alignItems: 'flex-end' },
  skuCoverageUnits: { fontSize: 15, fontWeight: '900', color: '#16a34a' },
  skuCoverageLabel: { fontSize: 9, fontWeight: '800', color: '#64748b' },
  replenishBtn: { backgroundColor: '#dc2626', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  replenishBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  stockistCardLow: { borderColor: '#fca5a5', backgroundColor: '#fef2f2' },
  lowBadge: { backgroundColor: '#fee2e2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  lowBadgeText: { fontSize: 10, fontWeight: '800', color: '#dc2626' },
  skuStockGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  skuStockItem: { backgroundColor: '#f0fdf4', borderRadius: 8, padding: 6, borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center', minWidth: 80 },
  skuStockItemLow: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  skuStockUnits: { fontSize: 14, fontWeight: '900', color: '#16a34a' },
  skuStockName: { fontSize: 9, color: '#64748b', textAlign: 'center', marginTop: 2 },
  factoryBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  factoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  factoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  factorySub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  queryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10
  },
  queryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap'
  },
  colHalf: {
    flex: 1,
    minWidth: 320
  },
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  liveTag: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '800'
  },
  secureBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  secureBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800'
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 14
  },
  stockistsList: {
    gap: 12
  },
  stockistCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 14
  },
  stockistTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  stkName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  stkHub: {
    fontSize: 11,
    color: '#64748b'
  },
  metricsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  metricItem: {
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b'
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 10
  },
  dispatchBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 4
  },
  clearancesList: {
    gap: 10
  },
  clearanceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4
  },
  clearanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  clearanceName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a'
  },
  clearanceSub: {
    fontSize: 11,
    color: '#64748b'
  },
  clearanceAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a'
  },
  clearanceStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#d97706'
  }
});
