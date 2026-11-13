// SplitScreenView : Desktop + Mobile Companion in one view
// P6: Desktop + Mobile split screen sync
// Left: full command center dashboard (hospital / stockist / mfg)
// Right: animated phone frame with live-sync mobile companion

import React from 'react';
import {
  View, StyleSheet, ScrollView,
  useWindowDimensions
} from 'react-native';
import { useApp } from '../store/stateManager';
import HospitalDashboard from './HospitalDashboard';
import StockistDashboard from './StockistDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import MobileDeviceFrame from './MobileDeviceFrame';

export default function SplitScreenView() {
  const { width } = useWindowDimensions();
  const { currentRole } = useApp();

  const isMobile = width < 960;

  if (isMobile) {
    return <MobileDeviceFrame isStandalone={true} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.desktopPaneFull}
        showsVerticalScrollIndicator={false}
      >
        {currentRole === 'HOSPITAL' && <HospitalDashboard />}
        {currentRole === 'STOCKIST' && <StockistDashboard />}
        {currentRole === 'MANUFACTURER' && <ManufacturerDashboard />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  desktopPaneFull: { flex: 1, padding: 24, backgroundColor: 'transparent' },
});
