// Stockist / Distributor Command Center — v2
// Logged-in stockist view with demand radar and factory reorder

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import TwoPipeVisualizer from './TwoPipeVisualizer';
import VoiceRequisitionBar from './VoiceRequisitionBar';

export default function StockistDashboard() {
  const {
    selectedStockist,
    loggedInStockist,
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
      <VoiceRequisitionBar />
      <TwoPipeVisualizer />

      {/* Logged-in Stockist Banner */}
      {loggedInStockist && (
        <View style={styles.authBanner}>
          <View style={styles.authBannerIconWrap}>
            <FontAwesome5 name="truck" size={14} color="#d97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.authBannerName}>{loggedInStockist.name}</Text>
            <Text style={styles.authBannerSub}>{loggedInStockist.ownerName} | 📍 {loggedInStockist.hub}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#d97706" />
            <Text style={[styles.verifiedText, { color: '#92400e' }]}>Verified</Text>
          </View>
        </View>
      )}

      {/* Store Banner */}
      <View style={styles.storeBanner}>
        <View style={styles.bannerLeft}>
          <View style={styles.storeAvatar}>
            <FontAwesome5 name="store" size={20} color="#d97706" />
          </View>
          <View>
            <Text style={styles.storeTitle}>{activeStockist.name}</Text>
            <Text style={styles.storeSub}>
              📍 Hub: {activeStockist.hub} • Brands: {(activeStockist.authorizedBrands || []).join(', ')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleVoiceOrTextInput('show me which hospitals need our products')}
          style={styles.scanDemandBtn}
        >
          <Ionicons name="radar" size={18} color="#ffffff" />
          <Text style={styles.scanDemandBtnText}>Scan Hospital Demand (अस्पतालों की मांग)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridRow}>
        {/* Left Column: Which Hospitals Need Our Products */}
        <View style={styles.colHalf}>
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleWrap}>
                <Ionicons name="flame" size={20} color="#dc2626" />
                <Text style={styles.cardTitle}>Hospitals Needing Supplies (आर्डर की मांग)</Text>
              </View>
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>3 LIVE ORDERS</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>
              Mumbai hospital wards requesting spot quotes right now:
            </Text>

            <View style={styles.demandCardsList}>
              {/* Demand 1 */}
              <View style={styles.demandBox}>
                <View style={styles.demandTopRow}>
                  <Text style={styles.hospTitle}>Lilavati Hospital & Research Centre</Text>
                  <Text style={styles.hospDist}>4.2 km (Bandra)</Text>
                </View>
                <Text style={styles.demandItems}>• Urgent: 60 Boxes Sterile Latex Gloves 7.5</Text>
                <Text style={styles.demandItems}>• Urgent: 15 Cartons Dispovan 5ml Syringes</Text>

                <View style={styles.demandFooter}>
                  <Text style={styles.demandValue}>Bill: ₹91,200</Text>
                  <TouchableOpacity
                    onPress={() => handleVoiceOrTextInput('Quote ₹790 for gloves and ₹2450 for Dispovan to Lilavati')}
                    style={styles.sendQuoteBtn}
                  >
                    <Text style={styles.sendQuoteBtnText}>Send Quote (रेट भेजें)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Demand 2 */}
              <View style={styles.demandBox}>
                <View style={styles.demandTopRow}>
                  <Text style={styles.hospTitle}>P.D. Hinduja Hospital</Text>
                  <Text style={styles.hospDist}>1.8 km (Mahim)</Text>
                </View>
                <Text style={styles.demandItems}>• Standard: 25 Boxes Polymed IV Cannula 20G</Text>

                <View style={styles.demandFooter}>
                  <Text style={styles.demandValue}>Bill: ₹45,500</Text>
                  <TouchableOpacity
                    onPress={() => handleVoiceOrTextInput('Quote ₹1650 for Polymed Cannula to Hinduja')}
                    style={styles.sendQuoteBtn}
                  >
                    <Text style={styles.sendQuoteBtnText}>Send Quote (रेट भेजें)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Demand 3 */}
              <View style={styles.demandBox}>
                <View style={styles.demandTopRow}>
                  <Text style={styles.hospTitle}>KEM Hospital (Apex BMC)</Text>
                  <Text style={styles.hospDist}>2.1 km (Parel)</Text>
                </View>
                <Text style={styles.demandItems}>• 100 Boxes 3M N95 Respirators</Text>

                <View style={styles.demandFooter}>
                  <Text style={styles.demandValue}>Bill: ₹1,18,000</Text>
                  <TouchableOpacity
                    onPress={() => handleVoiceOrTextInput('Quote ₹1180 for 3M masks to KEM Parel')}
                    style={styles.sendQuoteBtn}
                  >
                    <Text style={styles.sendQuoteBtnText}>Send Quote (रेट भेजें)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column: Reorder from Factory */}
        <View style={styles.colHalf}>
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleWrap}>
                <FontAwesome5 name="industry" size={18} color="#16a34a" />
                <Text style={styles.cardTitle}>Order from Factory (फैक्ट्री से मंगवाएं)</Text>
              </View>
              <Text style={styles.hubTag}>Bhiwandi CFA Hub</Text>
            </View>

            <Text style={styles.cardDesc}>
              Bulk restock from manufacturers to prevent warehouse stockouts:
            </Text>

            <View style={styles.factoryList}>
              <View style={styles.factoryCard}>
                <View style={styles.factoryTop}>
                  <Text style={styles.factoryName}>HMD Dispovan Syringes</Text>
                  <Text style={styles.factoryLead}>2 Days Lead Time</Text>
                </View>
                <Text style={styles.factoryDesc}>Dispovan 2ml & 5ml Syringes (₹2,100 / carton)</Text>
                <TouchableOpacity
                  onPress={() => triggerUpstreamOrder('HMD Dispovan', 'Dispovan 5ml', '50 Cartons')}
                  style={styles.orderFactoryBtn}
                >
                  <Text style={styles.orderFactoryBtnText}>Order 50 Cartons from Factory</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.factoryCard}>
                <View style={styles.factoryTop}>
                  <Text style={styles.factoryName}>Poly Medicure Ltd. (Polymed)</Text>
                  <Text style={styles.factoryLead}>3 Days Lead Time</Text>
                </View>
                <Text style={styles.factoryDesc}>Polymed IV Cannulas 20G & 22G (₹1,400 / box)</Text>
                <TouchableOpacity
                  onPress={() => triggerUpstreamOrder('Poly Medicure', 'IV Cannula 20G', '100 Boxes')}
                  style={styles.orderFactoryBtn}
                >
                  <Text style={styles.orderFactoryBtnText}>Order 100 Boxes from Factory</Text>
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
  authBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fffbeb', borderRadius: 14, borderWidth: 1.5, borderColor: '#fde68a', padding: 12, marginBottom: 14 },
  authBannerIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  authBannerName: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  authBannerSub: { fontSize: 11, color: '#d97706', marginTop: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  verifiedText: { fontSize: 10, fontWeight: '800', color: '#92400e' },
  storeBanner: {
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
  storeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  storeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  storeSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  scanDemandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d97706',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10
  },
  scanDemandBtnText: {
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
  urgentBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  urgentBadgeText: {
    color: '#dc2626',
    fontSize: 10,
    fontWeight: '800'
  },
  hubTag: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '800'
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 14
  },
  demandCardsList: {
    gap: 12
  },
  demandBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 14
  },
  demandTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  hospTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  hospDist: {
    fontSize: 11,
    color: '#0284c7',
    fontWeight: '700'
  },
  demandItems: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18
  },
  demandFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginTop: 8
  },
  demandValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16a34a'
  },
  sendQuoteBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  sendQuoteBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  factoryList: {
    gap: 12
  },
  factoryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 14
  },
  factoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  factoryName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  factoryLead: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: '700'
  },
  factoryDesc: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10
  },
  orderFactoryBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  orderFactoryBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  }
});
