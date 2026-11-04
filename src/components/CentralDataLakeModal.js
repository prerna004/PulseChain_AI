// Central Data Lake & Telemetry Viewer Modal
// Captures Mumbai health supply chain queries, transactions, and campus placement logs

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function CentralDataLakeModal() {
  const { showDataLakeModal, setShowDataLakeModal, dataLakeLogs } = useApp();

  if (!showDataLakeModal) return null;

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="server" size={20} color="#a855f7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Mumbai Central Healthcare Data Lake</Text>
              <Text style={styles.subtitle}>
                Capturing Real-Time Queries, Price Telemetry & Campus Placement Streams
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowDataLakeModal(false)}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>15</Text>
              <Text style={styles.metricLabel}>Mumbai Hospitals</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>12</Text>
              <Text style={styles.metricLabel}>Verified Stockists</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>8</Text>
              <Text style={styles.metricLabel}>MedTech Plants</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>₹8.6 Cr</Text>
              <Text style={styles.metricLabel}>Weekly Throughput</Text>
            </View>
          </View>

          {/* Real-time Ingestion Stream */}
          <Text style={styles.sectionHeader}>Live Event Telemetry Stream:</Text>
          <ScrollView style={styles.logList} showsVerticalScrollIndicator={false}>
            {dataLakeLogs.map((log) => (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.timeWrap}>
                  <Text style={styles.timeText}>{log.timestamp}</Text>
                  <View style={styles.sourcePill}>
                    <Text style={styles.sourceText}>{log.source}</Text>
                  </View>
                </View>

                <View style={styles.eventWrap}>
                  <Text style={styles.eventType}>{log.event}</Text>
                  <Text style={styles.eventDetail}>{log.detail}</Text>
                </View>

                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{log.status}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={() => setShowDataLakeModal(false)} style={styles.closeModalBtn}>
            <Text style={styles.closeModalText}>Return to Command Center</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#a855f7',
    width: '100%',
    maxWidth: 720,
    padding: 20,
    maxHeight: '90%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 10
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11
  },
  metricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14
  },
  metricItem: {
    alignItems: 'center'
  },
  metricValue: {
    color: '#c084fc',
    fontSize: 16,
    fontWeight: '800'
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2
  },
  sectionHeader: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8
  },
  logList: {
    maxHeight: 340,
    marginBottom: 12
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141e33',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 10
  },
  timeWrap: {
    width: 130
  },
  timeText: {
    color: '#64748b',
    fontSize: 10,
    fontFamily: 'monospace'
  },
  sourcePill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    alignSelf: 'flex-start'
  },
  sourceText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '700'
  },
  eventWrap: {
    flex: 1
  },
  eventType: {
    color: '#a855f7',
    fontSize: 10,
    fontWeight: '800'
  },
  eventDetail: {
    color: '#f8fafc',
    fontSize: 11,
    marginTop: 2
  },
  statusPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  statusText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '800'
  },
  closeModalBtn: {
    backgroundColor: '#7e22ce',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  closeModalText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  }
});
