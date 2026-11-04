// Ultra-Simple Hospital Procurement & Ward Dashboard
// Easy for any age nurse, doctor, or storekeeper to use without technical knowledge

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import TwoPipeVisualizer from './TwoPipeVisualizer';
import VoiceRequisitionBar from './VoiceRequisitionBar';

export default function HospitalDashboard() {
  const {
    selectedHospital,
    inventory,
    orders,
    wards,
    consumeWardItem,
    startUberStockistPing
  } = useApp();

  const [activeTab, setActiveTab] = useState('INVENTORY'); // 'INVENTORY' | 'WARDS' | 'ORDERS'

  return (
    <View style={styles.container}>
      {/* 1. Giant Voice Mic & 1-Tap Orders Bar */}
      <VoiceRequisitionBar />

      {/* 2. Living 2-Pipe Goods & Payment Flow */}
      <TwoPipeVisualizer />

      {/* 3. Simple Tab Buttons (Big, readable, bilingual) */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('INVENTORY')}
          style={[styles.tabBtn, activeTab === 'INVENTORY' && styles.tabBtnActive]}
        >
          <Ionicons name="cube" size={18} color={activeTab === 'INVENTORY' ? '#0284c7' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'INVENTORY' && styles.tabTextActive]}>
            1. Hospital Stock (दवाइयां और सामान)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('WARDS')}
          style={[styles.tabBtn, activeTab === 'WARDS' && styles.tabBtnActive]}
        >
          <Ionicons name="pulse" size={18} color={activeTab === 'WARDS' ? '#0284c7' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'WARDS' && styles.tabTextActive]}>
            2. Ward Usage (वार्ड में इस्तेमाल)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('ORDERS')}
          style={[styles.tabBtn, activeTab === 'ORDERS' && styles.tabBtnActive]}
        >
          <Ionicons name="receipt" size={18} color={activeTab === 'ORDERS' ? '#0284c7' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'ORDERS' && styles.tabTextActive]}>
            3. Active Orders (डिलीवरी स्टेटस)
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: Hospital Stock with Big 1-Tap Reorder Buttons */}
      {activeTab === 'INVENTORY' && (
        <View style={styles.whiteCard}>
          <View style={styles.cardTopHeader}>
            <View>
              <Text style={styles.sectionTitle}>Hospital Pharmacy Stock ({selectedHospital.name})</Text>
              <Text style={styles.sectionSub}>Green = Stock Good • Red = Low Stock (Auto-orders when low)</Text>
            </View>
          </View>

          <View style={styles.catalogGrid}>
            {inventory.map((sku) => {
              const isLow = sku.hospStockLilavati <= sku.reorderLevel;
              return (
                <View
                  key={sku.skuId}
                  style={[styles.skuCard, isLow && styles.skuCardLow]}
                >
                  <View style={styles.skuTopRow}>
                    <Text style={styles.skuCategory}>{sku.category}</Text>
                    <View style={[styles.statusBadge, isLow ? styles.badgeLow : styles.badgeOk]}>
                      <Text style={[styles.statusBadgeText, isLow ? styles.badgeTextLow : styles.badgeTextOk]}>
                        {isLow ? '⚠️ LOW STOCK' : '✓ IN STOCK'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.skuTitle}>{sku.name}</Text>
                  <Text style={styles.skuBrandName}>Brand: {sku.brand}</Text>

                  {/* Big Readable Stock Numbers */}
                  <View style={styles.stockCountBox}>
                    <Text style={styles.stockCountNumber}>{sku.hospStockLilavati}</Text>
                    <Text style={styles.stockCountUnit}>{sku.unit}</Text>
                  </View>

                  {/* Reorder Button */}
                  <TouchableOpacity
                    onPress={() => startUberStockistPing(sku, 50, isLow ? 'CRITICAL_EMERGENCY' : 'STANDARD')}
                    style={[styles.reorderBtn, isLow && styles.reorderBtnUrgent]}
                  >
                    <Ionicons name="radio" size={16} color="#ffffff" />
                    <Text style={styles.reorderBtnText}>
                      {isLow ? 'Urgent Reorder (मंगवाएं)' : 'Find Best Price (रेट चेक करें)'}
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
                      <Text style={styles.wardTitle}>{ward.name}</Text>
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
                    onPress={() => consumeWardItem('SKU-GLV-75', 10, ward.name)}
                    style={styles.consumeActionBtn}
                  >
                    <FontAwesome5 name="hands-wash" size={14} color="#0284c7" />
                    <Text style={styles.consumeBtnLabel}>Used 10 Gloves 7.5</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => consumeWardItem('SKU-CAN-20G', 10, ward.name)}
                    style={styles.consumeActionBtn}
                  >
                    <FontAwesome5 name="tint" size={14} color="#0284c7" />
                    <Text style={styles.consumeBtnLabel}>Used 10 IV Cannulas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => consumeWardItem('SKU-SYR-5ML', 5, ward.name)}
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

      {/* TAB 3: Active Orders List */}
      {activeTab === 'ORDERS' && (
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Active Orders & Live Delivery Tracker</Text>

          <View style={styles.ordersList}>
            {orders.map((ord) => (
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
              </View>
            ))}
          </View>
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  tabBtnActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0284c7'
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b'
  },
  tabTextActive: {
    color: '#0284c7'
  },
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15
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
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    width: '31.5%',
    minWidth: 260,
    flexGrow: 1
  },
  skuCardLow: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5'
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
    gap: 6,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 10
  },
  reorderBtnUrgent: {
    backgroundColor: '#dc2626'
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
  }
});
