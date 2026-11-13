// SplitScreenView : Desktop + Mobile Companion in one view
// P6: Desktop + Mobile split screen sync
// Left: full command center dashboard (hospital / stockist / mfg)
// Right: animated phone frame with live-sync mobile companion

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  useWindowDimensions, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import HospitalDashboard from './HospitalDashboard';
import StockistDashboard from './StockistDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import MobileDeviceFrame from './MobileDeviceFrame';

export default function SplitScreenView() {
  const { width } = useWindowDimensions();
  const {
    currentRole,
    deviceMode, setDeviceMode,
    addTelemetryLog,
    orders,
    isDarkMode,
    theme
  } = useApp();

  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncPulse] = useState(new Animated.Value(1));
  const prevOrdersLen = useRef(orders.length);

  // Pulse animation when sync event occurs
  const triggerSyncPulse = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(syncPulse, { toValue: 1.4, duration: 180, useNativeDriver: true }),
      Animated.spring(syncPulse, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setLastSyncTime(new Date());
  }, [syncPulse]);

  // Listen to BroadcastChannel events (shows sync banner update)
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    let ch;
    try {
      ch = new BroadcastChannel('mumbai_medpulse_sync');
      ch.onmessage = () => triggerSyncPulse();
    } catch (_e) {}
    return () => { if (ch) ch.close(); };
  }, [triggerSyncPulse]);

  // When orders change after mount, trigger a sync pulse
  useEffect(() => {
    if (orders.length !== prevOrdersLen.current) {
      prevOrdersLen.current = orders.length;
      triggerSyncPulse();
    }
  }, [orders.length, triggerSyncPulse]);

  const isSplit = width >= 960; // On narrow screens, just show desktop, hide phone frame
  const roleName = currentRole === 'HOSPITAL' ? 'Hospital' : currentRole === 'STOCKIST' ? 'Stockist' : 'Manufacturer';
  const roleColor = currentRole === 'HOSPITAL' ? '#0284c7' : currentRole === 'STOCKIST' ? '#d97706' : '#16a34a';

  return (
    <View style={styles.container}>
      {/* Sync Status Header */}
      <View style={[styles.syncHeader, { borderBottomColor: roleColor + '40' }]}>
        <View style={styles.syncLeft}>
          <Animated.View style={[styles.syncDot, { backgroundColor: roleColor, transform: [{ scale: syncPulse }] }]} />
          <Text style={styles.syncStatusText}>
            LIVE SYNC : {roleName} View
          </Text>
          <Text style={styles.syncTimeText}>Last sync: {lastSyncTime.toLocaleTimeString('en-IN', { hour12: false })}</Text>
        </View>

        <View style={styles.syncRight}>
          {/* View Mode Switcher */}
          {[
            { id: 'DESKTOP_ONLY', icon: 'desktop-outline', label: 'Laptop View' },
            { id: 'SPLIT_SYNC', icon: 'tablet-landscape-outline', label: 'Split Screen (Both)' },
            { id: 'MOBILE_ONLY', icon: 'phone-portrait-outline', label: 'Mobile View' },
          ].map(mode => (
            <TouchableOpacity
              key={mode.id}
              onPress={() => {
                setDeviceMode(mode.id);
                addTelemetryLog('UI', 'VIEW_MODE_CHANGE', `Switched to ${mode.id}`);
              }}
              style={[
                styles.modeBtn,
                isDarkMode && { backgroundColor: theme.surface, borderColor: theme.border },
                deviceMode === mode.id && { ...styles.modeBtnActive, borderColor: roleColor, backgroundColor: roleColor + '15' }
              ]}
            >
              <Ionicons name={mode.icon} size={14} color={deviceMode === mode.id ? roleColor : (isDarkMode ? '#94a3b8' : '#64748b')} />
              <Text style={[styles.modeBtnText, isDarkMode && { color: '#94a3b8' }, deviceMode === mode.id && { color: roleColor }]}>{mode.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.splitContent}>

        {/* Desktop / Dashboard Side */}
        {deviceMode !== 'MOBILE_ONLY' && (
          <ScrollView
            style={[styles.desktopPane, deviceMode === 'DESKTOP_ONLY' && styles.desktopPaneFull]}
            showsVerticalScrollIndicator={false}
          >
            {currentRole === 'HOSPITAL' && <HospitalDashboard />}
            {currentRole === 'STOCKIST' && <StockistDashboard />}
            {currentRole === 'MANUFACTURER' && <ManufacturerDashboard />}
          </ScrollView>
        )}

        {/* Divider */}
        {deviceMode === 'SPLIT_SYNC' && isSplit && (
          <View style={styles.splitDivider}>
            <View style={[styles.dividerLine, { backgroundColor: roleColor + '30' }]} />
            <View style={[styles.dividerPill, { borderColor: roleColor + '40' }]}>
              <Animated.View style={[styles.dividerDot, { backgroundColor: roleColor, transform: [{ scale: syncPulse }] }]} />
              <Text style={[styles.dividerText, { color: roleColor }]}>SYNC</Text>
            </View>
            <View style={[styles.dividerLine, { backgroundColor: roleColor + '30' }]} />
          </View>
        )}

        {/* Mobile Companion Frame Side */}
        {deviceMode !== 'DESKTOP_ONLY' && isSplit && (
          <View style={styles.mobilePane}>
            <View style={styles.mobilePaneHeader}>
              <Ionicons name="phone-portrait" size={16} color={roleColor} />
              <Text style={[styles.mobilePanelTitle, { color: roleColor }]}>Mobile Companion</Text>
              <Text style={styles.mobilePaneSubtitle}>iOS / Android App</Text>
            </View>

            {/* Sync Events Panel (above phone) */}
            <View style={styles.syncEventsPanel}>
              <Text style={styles.syncEventsPanelTitle}>Real-time Sync Events:</Text>
              <View style={styles.syncEventsList}>
                {[
                  { icon: 'radio', label: 'Voice order → Mobile mic synced', color: '#0284c7' },
                  { icon: 'cube', label: 'Stock update from ward tap', color: '#d97706' },
                  { icon: 'logo-whatsapp', label: 'WhatsApp import → Desktop table', color: '#16a34a' },
                ].map((e, i) => (
                  <View key={i} style={styles.syncEvent}>
                    <Ionicons name={e.icon} size={12} color={e.color} />
                    <Text style={[styles.syncEventText, { color: e.color }]}>{e.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Phone frame */}
            <MobileDeviceFrame />
          </View>
        )}

        {/* Mobile Only Mode */}
        {deviceMode === 'MOBILE_ONLY' && (
          <View style={styles.mobileOnlyCenter}>
            <MobileDeviceFrame />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(226, 232, 240, 0.75)',
    flexWrap: 'wrap',
    gap: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  syncLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  syncDot: { width: 10, height: 10, borderRadius: 5 },
  syncStatusText: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  syncTimeText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  syncRight: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  modeBtnActive: {
    shadowOpacity: 0.12,
    shadowRadius: 8
  },
  modeBtnText: { fontSize: 11.5, fontWeight: '800', color: '#64748b' },
  splitContent: { flex: 1, flexDirection: 'row' },
  desktopPane: { flex: 1, padding: 24, backgroundColor: 'transparent' },
  desktopPaneFull: { flex: 1 },
  splitDivider: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 0,
    flexDirection: 'column',
  },
  dividerLine: { flex: 1, width: 2, borderRadius: 1 },
  dividerPill: {
    borderRadius: 16, borderWidth: 1.5, padding: 8,
    alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 255, 255, 0.85)',
    marginVertical: 10,
    borderColor: 'rgba(226, 232, 240, 0.85)',
  },
  dividerDot: { width: 8, height: 8, borderRadius: 4 },
  dividerText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  mobilePane: {
    width: 390,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(226, 232, 240, 0.75)',
    backgroundColor: 'rgba(248, 250, 252, 0.70)',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  mobilePaneHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 10,
  },
  mobilePanelTitle: { fontSize: 13, fontWeight: '800' },
  mobilePaneSubtitle: { fontSize: 10, color: '#64748b' },
  syncEventsPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    marginBottom: 12,
    width: '100%',
  },
  syncEventsPanelTitle: { fontSize: 10, fontWeight: '800', color: '#64748b', marginBottom: 6 },
  syncEventsList: { gap: 5 },
  syncEvent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  syncEventText: { fontSize: 10, fontWeight: '600' },
  mobileOnlyCenter: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
});
