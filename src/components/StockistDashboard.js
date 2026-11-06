// Stockist / Distributor Command Center — v3 High-Aesthetic Fintech & Health SaaS Redesign
// Inspired by modern multi-account, card-driven, subtle pastel & symbol hierarchy

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import TwoPipeVisualizer from './TwoPipeVisualizer';
import VoiceRequisitionBar from './VoiceRequisitionBar';
import SymbolIcon from './SymbolIcon';

export default function StockistDashboard() {
  const {
    selectedStockist,
    setSelectedStockist,
    loggedInStockist,
    loginStockist,
    allStockists,
    orders,
    handleVoiceOrTextInput,
    addTelemetryLog
  } = useApp();

  const activeStockist = loggedInStockist
    ? { ...selectedStockist, name: loggedInStockist.name, hub: loggedInStockist.hub || selectedStockist.hub }
    : selectedStockist;

  const triggerUpstreamOrder = (mfgName, itemName, qty) => {
    addTelemetryLog(selectedStockist.name, 'UPSTREAM_MFG_ORDER', `Placed bulk order for ${qty} of ${itemName} to ${mfgName}`);
    handleVoiceOrTextInput(`Reordering ${qty} of ${itemName} from ${mfgName} plant via Bhiwandi CFA`);
  };

  return (
    <View style={styles.container}>
      {/* 1. CONNECTED DISTRIBUTOR ACCOUNTS BAR (Subtle Card Row) */}
      <View style={styles.networkCard}>
        <View style={styles.networkHeader}>
          <View style={styles.networkTitleRow}>
            <View style={styles.symbolIconBoxAmber}>
              <Ionicons name="business" size={14} color="#d97706" />
            </View>
            <View>
              <Text style={styles.networkTitle}>MUMBAI REGISTERED DISTRIBUTORS NETWORK</Text>
              <Text style={styles.networkSub}>Connected Authorized Distribution Hubs across Mumbai MMR</Text>
            </View>
          </View>
          <Text style={styles.networkHint}>1-Tap to Switch Distributor Account</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.networkScroll}>
          {(allStockists || []).map(stk => {
            const isActive = (loggedInStockist?.id === stk.id) || (selectedStockist?.id === stk.id);
            return (
              <TouchableOpacity
                key={stk.id}
                onPress={() => {
                  if (loginStockist) loginStockist(stk);
                  if (setSelectedStockist) setSelectedStockist(stk);
                }}
                style={[styles.accountCard, isActive && styles.accountCardActive]}
              >
                <View style={[styles.accountIconBox, isActive && styles.accountIconBoxActive]}>
                  <SymbolIcon name="truck" size={16} color={isActive ? '#ffffff' : '#d97706'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountName, isActive && styles.accountNameActive]} numberOfLines={1}>
                    {stk.name.split('(')[0]}
                  </Text>
                  <Text style={[styles.accountMeta, isActive && styles.accountMetaActive]}>
                    📍 {stk.hub || stk.area}
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

      {/* 2. EXECUTIVE DISTRIBUTOR HERO CARD (Subtle Slate/Cobalt Gradient Card) */}
      <View style={styles.heroGradientCard}>
        {/* Background glow circle effect */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroEntityLeft}>
            <View style={styles.heroAvatarBox}>
              <SymbolIcon name="truck" size={24} color="#38bdf8" />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.heroTitle}>{activeStockist.name}</Text>
                <View style={styles.heroVerifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#34d399" />
                  <Text style={styles.heroVerifiedText}>MMR Authorized CFA</Text>
                </View>
              </View>
              <Text style={styles.heroSub}>
                📍 Central Hub: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{activeStockist.hub}</Text> • Authorized Brands: {(activeStockist.authorizedBrands || ['HMD Dispovan', 'Polymed', '3M', 'Cipla']).join(', ')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleVoiceOrTextInput('show me which hospitals need our products')}
            style={styles.heroActionBtn}
          >
            <Ionicons name="radar" size={16} color="#ffffff" />
            <Text style={styles.heroActionBtnText}>Scan Hospital Demand (अस्पतालों की मांग)</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Metrics Row (Fintech/Health Style) */}
        <View style={styles.heroMetricsGrid}>
          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>ACTIVE DEMAND PIPELINE</Text>
              <Ionicons name="trending-up" size={13} color="#34d399" />
            </View>
            <Text style={styles.heroMetricValue}>₹2,54,700</Text>
            <Text style={styles.heroMetricSub}>3 Hospital wards requesting quotes</Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>NETWORK COVERAGE</Text>
              <Ionicons name="business" size={13} color="#38bdf8" />
            </View>
            <Text style={styles.heroMetricValue}>8 Hospitals</Text>
            <Text style={styles.heroMetricSub}>Connected via private P2P channel</Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>DISPATCH SLA SPEED</Text>
              <Ionicons name="time" size={13} color="#fbbf24" />
            </View>
            <Text style={styles.heroMetricValue}>18 Mins</Text>
            <Text style={styles.heroMetricSub}>Avg delivery turnaround time</Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.heroMetricLabel}>FACTORY DIRECT BRIDGE</Text>
              <Ionicons name="checkmark-circle" size={13} color="#a78bfa" />
            </View>
            <Text style={styles.heroMetricValue}>Bhiwandi CFA</Text>
            <Text style={styles.heroMetricSub}>Instant upstream manufacturer restocking</Text>
          </View>
        </View>
      </View>

      {/* 3. VOICE REQUISITION BAR & LIVING 2-PIPE MAP */}
      <VoiceRequisitionBar />
      <TwoPipeVisualizer />

      {/* 4. MAIN ACTION GRID (Hospitals Needing Supplies & Restock From Factory) */}
      <View style={styles.gridRow}>
        {/* Left Column: Which Hospitals Need Our Products */}
        <View style={styles.colHalf}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.symbolIconBoxRed}>
                  <Ionicons name="flame" size={18} color="#e11d48" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Hospitals Needing Supplies (आर्डर की मांग)</Text>
                  <Text style={styles.sectionSubtitle}>Live spot requisitions waiting for distributor quote</Text>
                </View>
              </View>
              <View style={styles.urgentCounterBadge}>
                <View style={styles.redPulseDot} />
                <Text style={styles.urgentCounterText}>3 LIVE ORDERS</Text>
              </View>
            </View>

            <View style={styles.demandCardsList}>
              {/* Demand 1: Lilavati */}
              <View style={styles.demandCardItem}>
                <View style={styles.demandCardHeader}>
                  <View style={styles.demandEntityRow}>
                    <View style={styles.symbolIconBoxBlue}>
                      <SymbolIcon name="hospital" size={16} color="#0284c7" />
                    </View>
                    <View>
                      <Text style={styles.hospTitle}>Lilavati Hospital & Research Centre</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Ionicons name="location-sharp" size={11} color="#64748b" />
                        <Text style={styles.hospDist}>4.2 km • Bandra West</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <View style={styles.badgeUrgentOT}>
                          <Text style={styles.badgeUrgentOTText}>Emergency OT Restock</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.demandItemsList}>
                  <View style={styles.demandItemPill}>
                    <Ionicons name="cube-outline" size={12} color="#0284c7" />
                    <Text style={styles.demandItemPillText}>60 Boxes Sterile Latex Gloves 7.5</Text>
                  </View>
                  <View style={styles.demandItemPill}>
                    <Ionicons name="cube-outline" size={12} color="#0284c7" />
                    <Text style={styles.demandItemPillText}>15 Cartons Dispovan 5ml Syringes</Text>
                  </View>
                </View>

                <View style={styles.demandFooter}>
                  <View>
                    <Text style={styles.billLabel}>ESTIMATED BILL VALUE</Text>
                    <Text style={styles.demandValue}>₹91,200</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleVoiceOrTextInput('Quote ₹790 for gloves and ₹2450 for Dispovan to Lilavati')}
                    style={styles.sendQuoteBtn}
                  >
                    <SymbolIcon name="paper-plane" size={13} color="#ffffff" />
                    <Text style={styles.sendQuoteBtnText}>Send Quote (रेट भेजें) ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Demand 2: P.D. Hinduja */}
              <View style={styles.demandCardItem}>
                <View style={styles.demandCardHeader}>
                  <View style={styles.demandEntityRow}>
                    <View style={styles.symbolIconBoxBlue}>
                      <SymbolIcon name="hospital" size={16} color="#0284c7" />
                    </View>
                    <View>
                      <Text style={styles.hospTitle}>P.D. Hinduja Hospital</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Ionicons name="location-sharp" size={11} color="#64748b" />
                        <Text style={styles.hospDist}>1.8 km • Mahim Central</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <View style={styles.badgeStandardOT}>
                          <Text style={styles.badgeStandardOTText}>Standard Ward Ward replenishment</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.demandItemsList}>
                  <View style={styles.demandItemPill}>
                    <Ionicons name="cube-outline" size={12} color="#0284c7" />
                    <Text style={styles.demandItemPillText}>25 Boxes Polymed IV Cannula 20G</Text>
                  </View>
                </View>

                <View style={styles.demandFooter}>
                  <View>
                    <Text style={styles.billLabel}>ESTIMATED BILL VALUE</Text>
                    <Text style={styles.demandValue}>₹45,500</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleVoiceOrTextInput('Quote ₹1650 for Polymed Cannula to Hinduja')}
                    style={styles.sendQuoteBtn}
                  >
                    <SymbolIcon name="paper-plane" size={13} color="#ffffff" />
                    <Text style={styles.sendQuoteBtnText}>Send Quote (रेट भेजें) ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Demand 3: KEM Hospital */}
              <View style={styles.demandCardItem}>
                <View style={styles.demandCardHeader}>
                  <View style={styles.demandEntityRow}>
                    <View style={styles.symbolIconBoxBlue}>
                      <SymbolIcon name="hospital" size={16} color="#0284c7" />
                    </View>
                    <View>
                      <Text style={styles.hospTitle}>KEM Hospital (Apex BMC)</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Ionicons name="location-sharp" size={11} color="#64748b" />
                        <Text style={styles.hospDist}>2.1 km • Parel</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <View style={styles.badgeUrgentOT}>
                          <Text style={styles.badgeUrgentOTText}>Critical PPE Shortage</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.demandItemsList}>
                  <View style={styles.demandItemPill}>
                    <Ionicons name="cube-outline" size={12} color="#0284c7" />
                    <Text style={styles.demandItemPillText}>100 Boxes 3M N95 Respirators</Text>
                  </View>
                </View>

                <View style={styles.demandFooter}>
                  <View>
                    <Text style={styles.billLabel}>ESTIMATED BILL VALUE</Text>
                    <Text style={styles.demandValue}>₹1,18,000</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleVoiceOrTextInput('Quote ₹1180 for 3M masks to KEM Parel')}
                    style={styles.sendQuoteBtn}
                  >
                    <SymbolIcon name="paper-plane" size={13} color="#ffffff" />
                    <Text style={styles.sendQuoteBtnText}>Send Quote (रेट भेजें) ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column: Reorder from Factory */}
        <View style={styles.colHalf}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.symbolIconBoxGreen}>
                  <SymbolIcon name="factory" size={18} color="#059669" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Order from Factory (फैक्ट्री से मंगवाएं)</Text>
                  <Text style={styles.sectionSubtitle}>Bulk OEM restock via Bhiwandi C&F central depot</Text>
                </View>
              </View>
              <View style={styles.factoryHubTag}>
                <Ionicons name="location" size={11} color="#059669" />
                <Text style={styles.factoryHubTagText}>Bhiwandi CFA Hub</Text>
              </View>
            </View>

            <View style={styles.factoryList}>
              {/* Factory 1: HMD */}
              <View style={styles.factoryCardItem}>
                <View style={styles.factoryCardTop}>
                  <View style={styles.factoryEntityRow}>
                    <View style={styles.symbolIconBoxEmerald}>
                      <SymbolIcon name="box" size={16} color="#059669" />
                    </View>
                    <View>
                      <Text style={styles.factoryName}>HMD Dispovan Syringes</Text>
                      <Text style={styles.factorySub}>Primary OEM • Faridabad & Bhiwandi Depot</Text>
                    </View>
                  </View>
                  <View style={styles.leadTimeBadge}>
                    <Ionicons name="flash" size={11} color="#d97706" />
                    <Text style={styles.leadTimeBadgeText}>2 Days Lead Time</Text>
                  </View>
                </View>

                <View style={styles.factoryRatesBox}>
                  <Text style={styles.factoryRatesLabel}>WHOLESALE CFA RATE:</Text>
                  <Text style={styles.factoryRatesVal}>Dispovan 2ml & 5ml Syringes @ ₹2,100 / carton</Text>
                </View>

                <TouchableOpacity
                  onPress={() => triggerUpstreamOrder('HMD Dispovan', 'Dispovan 5ml', '50 Cartons')}
                  style={styles.orderFactoryBtn}
                >
                  <SymbolIcon name="truck" size={15} color="#ffffff" />
                  <Text style={styles.orderFactoryBtnText}>Order 50 Cartons from Factory ➔</Text>
                </TouchableOpacity>
              </View>

              {/* Factory 2: Poly Medicure */}
              <View style={styles.factoryCardItem}>
                <View style={styles.factoryCardTop}>
                  <View style={styles.factoryEntityRow}>
                    <View style={styles.symbolIconBoxEmerald}>
                      <SymbolIcon name="box" size={16} color="#059669" />
                    </View>
                    <View>
                      <Text style={styles.factoryName}>Poly Medicure Ltd. (Polymed)</Text>
                      <Text style={styles.factorySub}>Infusion & Vascular OEM • Mumbai Depot</Text>
                    </View>
                  </View>
                  <View style={styles.leadTimeBadge}>
                    <Ionicons name="flash" size={11} color="#d97706" />
                    <Text style={styles.leadTimeBadgeText}>3 Days Lead Time</Text>
                  </View>
                </View>

                <View style={styles.factoryRatesBox}>
                  <Text style={styles.factoryRatesLabel}>WHOLESALE CFA RATE:</Text>
                  <Text style={styles.factoryRatesVal}>Polymed IV Cannulas 20G & 22G @ ₹1,400 / box</Text>
                </View>

                <TouchableOpacity
                  onPress={() => triggerUpstreamOrder('Poly Medicure', 'IV Cannula 20G', '100 Boxes')}
                  style={styles.orderFactoryBtn}
                >
                  <SymbolIcon name="truck" size={15} color="#ffffff" />
                  <Text style={styles.orderFactoryBtnText}>Order 100 Boxes from Factory ➔</Text>
                </TouchableOpacity>
              </View>

              {/* Factory 3: 3M India */}
              <View style={styles.factoryCardItem}>
                <View style={styles.factoryCardTop}>
                  <View style={styles.factoryEntityRow}>
                    <View style={styles.symbolIconBoxEmerald}>
                      <SymbolIcon name="box" size={16} color="#059669" />
                    </View>
                    <View>
                      <Text style={styles.factoryName}>3M Healthcare India</Text>
                      <Text style={styles.factorySub}>Respiratory & Sterilization OEM</Text>
                    </View>
                  </View>
                  <View style={styles.leadTimeBadge}>
                    <Ionicons name="flash" size={11} color="#d97706" />
                    <Text style={styles.leadTimeBadgeText}>1 Day Lead Time</Text>
                  </View>
                </View>

                <View style={styles.factoryRatesBox}>
                  <Text style={styles.factoryRatesLabel}>WHOLESALE CFA RATE:</Text>
                  <Text style={styles.factoryRatesVal}>3M N95 Respirators (Box of 20) @ ₹890 / box</Text>
                </View>

                <TouchableOpacity
                  onPress={() => triggerUpstreamOrder('3M Healthcare', '3M N95 Respirators', '50 Boxes')}
                  style={styles.orderFactoryBtn}
                >
                  <SymbolIcon name="truck" size={15} color="#ffffff" />
                  <Text style={styles.orderFactoryBtnText}>Order 50 Boxes from Factory ➔</Text>
                </TouchableOpacity>
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

  // 1. CONNECTED DISTRIBUTOR ACCOUNTS BAR
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
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  accountIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  accountIconBoxActive: {
    backgroundColor: '#d97706'
  },
  accountName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a'
  },
  accountNameActive: {
    fontWeight: '800',
    color: '#92400e'
  },
  accountMeta: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 1
  },
  accountMetaActive: {
    color: '#b45309'
  },
  activeCheckPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#d97706',
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

  // 2. EXECUTIVE DISTRIBUTOR HERO GRADIENT CARD
  heroGradientCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#0284c7',
    shadowOpacity: 0.18,
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
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
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
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
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
    color: '#94a3b8',
    marginTop: 4
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: '#0284c7',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#94a3b8',
    letterSpacing: 0.6
  },
  heroMetricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff'
  },
  heroMetricSub: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 3
  },
  heroMetricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4
  },

  // 4. MAIN ACTION GRID
  gridRow: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: 'wrap',
    marginTop: 4
  },
  colHalf: {
    flex: 1,
    minWidth: 340
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2
  },
  urgentCounterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  redPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#dc2626'
  },
  urgentCounterText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 0.3
  },
  factoryHubTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  factoryHubTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669'
  },

  // SUBTLE SYMBOL BOXES (Inspired by image)
  symbolIconBoxAmber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  symbolIconBoxBlue: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  symbolIconBoxRed: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  symbolIconBoxGreen: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  symbolIconBoxEmerald: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // DEMAND CARDS
  demandCardsList: {
    gap: 14
  },
  demandCardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8
  },
  demandCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  demandEntityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  hospTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  hospDist: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  dotSeparator: {
    color: '#cbd5e1',
    fontSize: 10
  },
  badgeUrgentOT: {
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  badgeUrgentOTText: {
    color: '#dc2626',
    fontSize: 9.5,
    fontWeight: '800'
  },
  badgeStandardOT: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  badgeStandardOTText: {
    color: '#475569',
    fontSize: 9.5,
    fontWeight: '700'
  },
  demandItemsList: {
    gap: 6,
    marginBottom: 14
  },
  demandItemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  demandItemPillText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600'
  },
  demandFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    marginTop: 4
  },
  billLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5
  },
  demandValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#059669',
    marginTop: 1
  },
  sendQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#0284c7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  },
  sendQuoteBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },

  // FACTORY RESTOCK CARDS
  factoryList: {
    gap: 14
  },
  factoryCardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8
  },
  factoryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  factoryEntityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  factoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  factorySub: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 2
  },
  leadTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  leadTimeBadgeText: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '800'
  },
  factoryRatesBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  factoryRatesLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5
  },
  factoryRatesVal: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
    marginTop: 2
  },
  orderFactoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 12,
    shadowColor: '#059669',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  },
  orderFactoryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  }
});
