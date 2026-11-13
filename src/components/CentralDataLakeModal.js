// Central Data Lake Analytics Dashboard
// Full analytics: event feed, charts, entity stats, category breakdown, CSV export

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, ScrollView, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

const EVENT_COLORS = {
  VOICE_QUERY: '#0284c7',
  ORDER_CREATED: '#16a34a',
  ORDER_DISPATCHED: '#d97706',
  STOCKIST_PING: '#7c3aed',
  MFG_SYNC: '#16a34a',
  WARD_CONSUMPTION: '#dc2626',
  HOSPITAL_LOGIN: '#0284c7',
  HOSPITAL_SIGNUP: '#0284c7',
  STOCKIST_LOGIN: '#d97706',
  MFG_LOGIN: '#16a34a',
  FIRST_ORDER_KYC_DONE: '#16a34a',
  NEW_ENTITY_ONBOARDED: '#7c3aed',
  UPSTREAM_MFG_ORDER: '#dc2626',
  WHATSAPP_ORDER_EXTRACTED: '#16a34a',
  RECORDED: '#64748b',
  AUTO_REORDER: '#dc2626',
};

function MiniBar({ value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <View style={mbStyles.track}>
      <View style={[mbStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}
const mbStyles = StyleSheet.create({
  track: { flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});

export default function CentralDataLakeModal() {
  const { showDataLakeModal, setShowDataLakeModal, dataLakeLogs, orders, inventory } = useApp();
  const [activeTab, setActiveTab] = useState('FEED'); // FEED | ANALYTICS | INVENTORY
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('ALL');

  // ── Stats calculation ─────────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const eventCounts = {};
    const sourceCounts = {};
    dataLakeLogs.forEach(log => {
      eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
      sourceCounts[log.source] = (sourceCounts[log.source] || 0) + 1;
    });

    const topEvents = Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const topSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxEvent = topEvents[0]?.[1] || 1;
    const maxSource = topSources[0]?.[1] || 1;

    const totalOrderValue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const lowStockItems = inventory.filter(i => i.hospStockLilavati <= i.reorderLevel);
    const criticalItems = inventory.filter(i => i.hospStockLilavati <= i.reorderLevel * 0.5);

    // Category breakdown
    const catBreakdown = {};
    inventory.forEach(i => {
      catBreakdown[i.category] = (catBreakdown[i.category] || 0) + 1;
    });

    return { topEvents, topSources, maxEvent, maxSource, totalOrderValue, lowStockItems, criticalItems, catBreakdown, eventCounts, sourceCounts };
  }, [dataLakeLogs, orders, inventory]);

  // ── Filtered logs ─────────────────────────────────────────────────────────────
  const filteredLogs = useMemo(() => {
    let logs = [...dataLakeLogs];
    if (filterEvent !== 'ALL') logs = logs.filter(l => l.event === filterEvent);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter(l =>
        l.source.toLowerCase().includes(q) ||
        l.event.toLowerCase().includes(q) ||
        l.detail.toLowerCase().includes(q)
      );
    }
    return logs;
  }, [dataLakeLogs, filterEvent, searchQuery]);

  const uniqueEvents = ['ALL', ...new Set(dataLakeLogs.map(l => l.event))];

  // Simulated CSV export
  const handleExport = () => {
    const csv = ['Timestamp,Source,Event,Detail,Status',
      ...filteredLogs.map(l => `${l.timestamp},"${l.source}","${l.event}","${l.detail}","${l.status}"`)
    ].join('\n');
    console.log('[DataLake CSV Export]:\n', csv.substring(0, 500) + '...');
    alert('CSV export ready! In production, this downloads to your device. (Logged to console)');
  };

  return (
    <Modal visible={showDataLakeModal} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Ionicons name="server" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Central Data Lake</Text>
                <Text style={styles.headerSub}>{dataLakeLogs.length} events recorded • Mumbai Healthcare Network</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleExport} style={styles.exportBtn}>
                <Ionicons name="download-outline" size={14} color="#7c3aed" />
                <Text style={styles.exportBtnText}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDataLakeModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stat Cards */}
          <View style={styles.statRow}>
            <View style={[styles.statCard, { borderLeftColor: '#0284c7' }]}>
              <Text style={styles.statValue}>{dataLakeLogs.length}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#16a34a' }]}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders Placed</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#dc2626' }]}>
              <Text style={styles.statValue}>{analytics.lowStockItems.length}</Text>
              <Text style={styles.statLabel}>Low Stock SKUs</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#7c3aed' }]}>
              <Text style={styles.statValue}>₹{(analytics.totalOrderValue / 100000).toFixed(1)}L</Text>
              <Text style={styles.statLabel}>Order Value</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {[
              { id: 'FEED', icon: 'list', label: 'Live Feed' },
              { id: 'ANALYTICS', icon: 'bar-chart', label: 'Analytics' },
              { id: 'INVENTORY', icon: 'cube', label: 'Stock Status' },
            ].map(t => (
              <TouchableOpacity
                key={t.id}
                onPress={() => setActiveTab(t.id)}
                style={[styles.tabBtn, activeTab === t.id && styles.tabBtnActive]}
              >
                <Ionicons name={t.icon} size={14} color={activeTab === t.id ? '#7c3aed' : '#64748b'} />
                <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

            {/* ── LIVE FEED TAB ─────────────────────────────────────────────────── */}
            {activeTab === 'FEED' && (
              <>
                {/* Search & Filter */}
                <View style={styles.filterRow}>
                  <View style={styles.searchBox}>
                    <Ionicons name="search" size={14} color="#94a3b8" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search events, sources..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={14} color="#94a3b8" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
                  {uniqueEvents.map(ev => (
                    <TouchableOpacity
                      key={ev}
                      onPress={() => setFilterEvent(ev)}
                      style={[styles.chip, filterEvent === ev && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, filterEvent === ev && styles.chipTextActive]}>
                        {ev === 'ALL' ? 'All' : ev.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.feedCount}>{filteredLogs.length} events</Text>

                <View style={styles.logList}>
                  {filteredLogs.map((log, idx) => {
                    const color = EVENT_COLORS[log.event] || '#64748b';
                    return (
                      <View key={log.id || idx} style={styles.logRow}>
                        <View style={[styles.logDot, { backgroundColor: color }]} />
                        <View style={styles.logContent}>
                          <View style={styles.logTopRow}>
                            <Text style={[styles.logEvent, { color }]}>{log.event}</Text>
                            <Text style={styles.logTime}>{log.timestamp}</Text>
                          </View>
                          <Text style={styles.logSource}>{log.source}</Text>
                          <Text style={styles.logDetail} numberOfLines={2}>{log.detail}</Text>
                        </View>
                        <View style={[styles.logStatusPill, { backgroundColor: color + '20' }]}>
                          <Text style={[styles.logStatusText, { color }]}>
                            {log.status}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* ── ANALYTICS TAB ─────────────────────────────────────────────────── */}
            {activeTab === 'ANALYTICS' && (
              <>
                <Text style={styles.analyticsSection}>Top Event Types</Text>
                <View style={styles.barChartCard}>
                  {analytics.topEvents.map(([event, count]) => (
                    <View key={event} style={styles.barRow}>
                      <Text style={styles.barLabel} numberOfLines={1}>{event.replace(/_/g, ' ')}</Text>
                      <MiniBar value={count} max={analytics.maxEvent} color={EVENT_COLORS[event] || '#0284c7'} />
                      <Text style={styles.barValue}>{count}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.analyticsSection}>Top Data Sources</Text>
                <View style={styles.barChartCard}>
                  {analytics.topSources.map(([source, count]) => (
                    <View key={source} style={styles.barRow}>
                      <Text style={styles.barLabel} numberOfLines={1}>{source}</Text>
                      <MiniBar value={count} max={analytics.maxSource} color="#7c3aed" />
                      <Text style={styles.barValue}>{count}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.analyticsSection}>Catalog Category Distribution</Text>
                <View style={styles.categoryGrid}>
                  {Object.entries(analytics.catBreakdown).map(([cat, count]) => (
                    <View key={cat} style={styles.catCard}>
                      <Text style={styles.catCount}>{count}</Text>
                      <Text style={styles.catName} numberOfLines={2}>{cat}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.analyticsSection}>Order Summary</Text>
                <View style={styles.orderSummaryCard}>
                  {orders.map(o => (
                    <View key={o.orderId} style={styles.orderSummaryRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderSummaryId}>{o.orderId}</Text>
                        <Text style={styles.orderSummaryName} numberOfLines={1}>{o.hospitalName} to {o.stockistName}</Text>
                      </View>
                      <View style={styles.orderSummaryRight}>
                        <Text style={styles.orderSummaryAmt}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</Text>
                        <View style={[styles.orderStatusDot, {
                          backgroundColor: o.deliveryStatus === 'DELIVERED' ? '#16a34a' : o.deliveryStatus === 'IN_TRANSIT' ? '#d97706' : '#0284c7'
                        }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* ── STOCK STATUS TAB ──────────────────────────────────────────────── */}
            {activeTab === 'INVENTORY' && (
              <>
                {analytics.criticalItems.length > 0 && (
                  <View style={styles.criticalAlert}>
                    <Ionicons name="warning" size={18} color="#dc2626" />
                    <Text style={styles.criticalAlertText}>
                      {analytics.criticalItems.length} items critically low (below 50% reorder level)
                    </Text>
                  </View>
                )}

                <View style={styles.stockTable}>
                  <View style={styles.stockTableHeader}>
                    <Text style={[styles.stockHeaderCell, { flex: 2 }]}>Item</Text>
                    <Text style={styles.stockHeaderCell}>Category</Text>
                    <Text style={styles.stockHeaderCell}>Stock</Text>
                    <Text style={styles.stockHeaderCell}>Status</Text>
                  </View>
                  {inventory.map(item => {
                    const isCritical = item.hospStockLilavati <= item.reorderLevel * 0.5;
                    const isLow = item.hospStockLilavati <= item.reorderLevel;
                    const statusColor = isCritical ? '#dc2626' : isLow ? '#d97706' : '#16a34a';
                    const statusLabel = isCritical ? 'CRITICAL' : isLow ? 'LOW' : 'OK';
                    return (
                      <View key={item.skuId} style={[styles.stockRow, isCritical && styles.stockRowCritical]}>
                        <Text style={[styles.stockCell, { flex: 2 }]} numberOfLines={2}>{item.name}</Text>
                        <Text style={[styles.stockCell, { fontSize: 10 }]} numberOfLines={2}>{item.category}</Text>
                        <Text style={[styles.stockCell, { fontWeight: '800', color: statusColor }]}>{item.hospStockLilavati}</Text>
                        <Text style={[styles.stockCell, { color: statusColor, fontSize: 10, fontWeight: '800' }]}>{statusLabel}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%', paddingBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#0f172a' },
  headerSub: { fontSize: 11, color: '#64748b' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f5f3ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#ddd6fe' },
  exportBtnText: { fontSize: 11, fontWeight: '800', color: '#7c3aed' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', padding: 12, gap: 8, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 70, backgroundColor: '#f8fafc', borderRadius: 12, padding: 10, borderLeftWidth: 3, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  statLabel: { fontSize: 9, color: '#64748b', fontWeight: '700', textAlign: 'center', marginTop: 2 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 4 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#f1f5f9', paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: 'transparent' },
  tabBtnActive: { backgroundColor: '#f5f3ff', borderColor: '#7c3aed' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  tabTextActive: { color: '#7c3aed' },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  filterRow: { marginBottom: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  filterChips: { marginBottom: 10 },
  chip: { backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  chipActive: { backgroundColor: '#f5f3ff', borderColor: '#7c3aed' },
  chipText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  chipTextActive: { color: '#7c3aed' },
  feedCount: { fontSize: 11, color: '#94a3b8', marginBottom: 8 },
  logList: { gap: 6, paddingBottom: 20 },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#f8fafc', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  logDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  logContent: { flex: 1 },
  logTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  logEvent: { fontSize: 11, fontWeight: '800' },
  logTime: { fontSize: 10, color: '#94a3b8' },
  logSource: { fontSize: 12, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  logDetail: { fontSize: 11, color: '#64748b', lineHeight: 15 },
  logStatusPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  logStatusText: { fontSize: 9, fontWeight: '800' },
  analyticsSection: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 16, marginBottom: 10 },
  barChartCard: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, gap: 10, marginBottom: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 120, fontSize: 11, fontWeight: '700', color: '#475569' },
  barValue: { width: 24, fontSize: 11, fontWeight: '900', color: '#0f172a', textAlign: 'right' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catCard: { backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, minWidth: 100, alignItems: 'center', borderWidth: 1, borderColor: '#ddd6fe' },
  catCount: { fontSize: 20, fontWeight: '900', color: '#7c3aed' },
  catName: { fontSize: 10, fontWeight: '700', color: '#64748b', textAlign: 'center', marginTop: 4 },
  orderSummaryCard: { backgroundColor: '#f8fafc', borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  orderSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  orderSummaryId: { fontSize: 12, fontWeight: '800', color: '#0284c7' },
  orderSummaryName: { fontSize: 11, color: '#64748b', marginTop: 2 },
  orderSummaryRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderSummaryAmt: { fontSize: 14, fontWeight: '900', color: '#16a34a' },
  orderStatusDot: { width: 8, height: 8, borderRadius: 4 },
  criticalAlert: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: '#fca5a5', marginBottom: 14 },
  criticalAlertText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#dc2626' },
  stockTable: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  stockTableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  stockHeaderCell: { flex: 1, fontSize: 10, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  stockRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 8, alignItems: 'center' },
  stockRowCritical: { backgroundColor: '#fef2f2' },
  stockCell: { flex: 1, fontSize: 11, color: '#0f172a' },
});
