// Ultra-Simple Manufacturer Production & Stockist Oversight Dashboard
// Easy for plant managers, sales directors, and logistics staff

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import TwoPipeVisualizer from './TwoPipeVisualizer';
import VoiceRequisitionBar from './VoiceRequisitionBar';
import { MUMBAI_STOCKISTS } from '../data/mumbaiData';

export default function ManufacturerDashboard() {
  const {
    selectedManufacturer,
    handleVoiceOrTextInput,
    addTelemetryLog
  } = useApp();

  const handleBulkDispatch = (stockistName, skuName, qty) => {
    addTelemetryLog(selectedManufacturer.name, 'BULK_DISPATCH_CFA', `Dispatched ${qty} of ${skuName} to ${stockistName}`);
    handleVoiceOrTextInput(`Dispatched 50,000 units of ${skuName} via Bhiwandi C&F depot to ${stockistName}`);
  };

  return (
    <View style={styles.container}>
      {/* Voice Bar */}
      <VoiceRequisitionBar />

      {/* Living 2-Pipe Visualizer */}
      <TwoPipeVisualizer />

      {/* Factory Banner */}
      <View style={styles.factoryBanner}>
        <View style={styles.bannerLeft}>
          <View style={styles.factoryIcon}>
            <FontAwesome5 name="industry" size={20} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.factoryTitle}>{selectedManufacturer.name} ({selectedManufacturer.brand})</Text>
            <Text style={styles.factorySub}>
              🏭 Plant Hub: {selectedManufacturer.primaryHub} • Contact: {selectedManufacturer.keyRep}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleVoiceOrTextInput('Show current stockist inventory across Mumbai for our brand')}
          style={styles.queryBtn}
        >
          <Ionicons name="stats-chart" size={16} color="#ffffff" />
          <Text style={styles.queryBtnText}>Check Distributor Stocks (स्टॉक चेक करें)</Text>
        </TouchableOpacity>
      </View>

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
              {MUMBAI_STOCKISTS.map((stk) => (
                <View key={stk.id} style={styles.stockistCard}>
                  <View style={styles.stockistTop}>
                    <Text style={styles.stkName}>{stk.name}</Text>
                    <Text style={styles.stkHub}>📍 {stk.hub}</Text>
                  </View>

                  <View style={styles.metricsBox}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Warehouse Stock</Text>
                      <Text style={styles.metricVal}>{stk.warehouseStockLevel}</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Credit Terms</Text>
                      <Text style={styles.metricVal}>{stk.creditOffered}</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Delivery SLA</Text>
                      <Text style={styles.metricVal}>{stk.deliverySLA}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleBulkDispatch(stk.name, selectedManufacturer.brand, '50,000 Units')}
                    style={styles.dispatchBtn}
                  >
                    <FontAwesome5 name="truck" size={12} color="#ffffff" />
                    <Text style={styles.dispatchBtnText}>Dispatch Bulk C&F Truck to Mumbai (गाड़ी रवाना करें)</Text>
                  </TouchableOpacity>
                </View>
              ))}
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
  container: {
    flex: 1
  },
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
