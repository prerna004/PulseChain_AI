// PulseChain AI — Clean, Friendly, Human-First Medical Supply Chain App
// Designed so that any nurse, senior doctor, or wholesale store uncle can operate it effortlessly

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/store/stateManager';
import HospitalDashboard from './src/components/HospitalDashboard';
import StockistDashboard from './src/components/StockistDashboard';
import ManufacturerDashboard from './src/components/ManufacturerDashboard';
import UberPingModal from './src/components/UberPingModal';
import UnknownEntityModal from './src/components/UnknownEntityModal';
import PermissionsModal from './src/components/PermissionsModal';
import CentralDataLakeModal from './src/components/CentralDataLakeModal';

function MainScreen() {
  const { width } = useWindowDimensions();
  const isMobileScreen = width < 820;

  const {
    currentRole,
    setCurrentRole,
    deviceMode,
    setDeviceMode,
    setShowPermissionsModal,
    setShowDataLakeModal
  } = useApp();

  const [hasChosenRole, setHasChosenRole] = useState(false);

  // 1. Clean & Friendly Opening Screen (Who are you? / आप कौन हैं?)
  if (!hasChosenRole) {
    return (
      <SafeAreaView style={styles.splashBg}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.splashCard}>
          {/* Logo Header */}
          <View style={styles.splashHeader}>
            <View style={styles.appIconWrap}>
              <Ionicons name="medical" size={32} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.appName}>PulseChain AI</Text>
              <Text style={styles.appSubtitle}>Mumbai Hospital Supply Chain • बोलकर आर्डर करें</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.chooseTitle}>Who are you? (आप कौन हैं?)</Text>
          <Text style={styles.chooseSub}>
            Please select your role below to start. No technical skills required.
          </Text>

          {/* 3 Friendly Role Cards */}
          <View style={styles.rolesRow}>
            {/* Role 1: Hospital */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRole('HOSPITAL');
                setHasChosenRole(true);
              }}
              style={styles.roleCard}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <FontAwesome5 name="hospital" size={28} color="#0284c7" />
              </View>
              <Text style={styles.roleTitle}>1. Hospital</Text>
              <Text style={styles.roleHindi}>अस्पताल / नर्सिंग होम</Text>
              <Text style={styles.roleDesc}>
                For Doctors, Ward Sisters, and Hospital Storekeepers (Lilavati, Hinduja, KEM)
              </Text>
              <View style={styles.enterBtn}>
                <Text style={styles.enterBtnText}>Open Hospital Portal ➔</Text>
              </View>
            </TouchableOpacity>

            {/* Role 2: Stockist */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRole('STOCKIST');
                setHasChosenRole(true);
              }}
              style={styles.roleCard}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: '#fef3c7' }]}>
                <FontAwesome5 name="truck" size={28} color="#d97706" />
              </View>
              <Text style={styles.roleTitle}>2. Stockist / Dealer</Text>
              <Text style={styles.roleHindi}>सप्लायर / होलसेलर</Text>
              <Text style={styles.roleDesc}>
                For Medical Wholesalers in Dadar, Princess Street & Dawa Bazar
              </Text>
              <View style={[styles.enterBtn, { backgroundColor: '#d97706' }]}>
                <Text style={styles.enterBtnText}>Open Stockist Portal ➔</Text>
              </View>
            </TouchableOpacity>

            {/* Role 3: Manufacturer */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRole('MANUFACTURER');
                setHasChosenRole(true);
              }}
              style={styles.roleCard}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: '#dcfce7' }]}>
                <FontAwesome5 name="industry" size={28} color="#16a34a" />
              </View>
              <Text style={styles.roleTitle}>3. Manufacturer</Text>
              <Text style={styles.roleHindi}>फैक्ट्री / निर्माता</Text>
              <Text style={styles.roleDesc}>
                For MedTech Companies (HMD Dispovan, Polymed, 3M, Cipla)
              </Text>
              <View style={[styles.enterBtn, { backgroundColor: '#16a34a' }]}>
                <Text style={styles.enterBtnText}>Open Manufacturer Portal ➔</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerNote}>
            <Ionicons name="sparkles" size={14} color="#0284c7" />
            <Text style={styles.footerText}>
              100% Voice Operated • Never Ask for Filling Form Fields • Direct Hospital Inventory Link
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Main Portal Shell (Clean, Light, Readable Top Bar)
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Clean White Top Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity onPress={() => setHasChosenRole(false)} style={styles.brandRow}>
            <View style={styles.navLogoWrap}>
              <Ionicons name="medical" size={20} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.navBrandText}>PulseChain AI</Text>
              <Text style={styles.navSubBrand}>Mumbai Healthcare Procurement</Text>
            </View>
          </TouchableOpacity>

          {/* Role Switcher Pills */}
          <View style={styles.roleSwitchRow}>
            <TouchableOpacity
              onPress={() => setCurrentRole('HOSPITAL')}
              style={[styles.roleSwitchPill, currentRole === 'HOSPITAL' && styles.pillActiveHospital]}
            >
              <FontAwesome5 name="hospital" size={12} color={currentRole === 'HOSPITAL' ? '#ffffff' : '#64748b'} />
              <Text style={[styles.pillText, currentRole === 'HOSPITAL' && styles.pillTextActive]}>Hospital</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentRole('STOCKIST')}
              style={[styles.roleSwitchPill, currentRole === 'STOCKIST' && styles.pillActiveStockist]}
            >
              <FontAwesome5 name="truck" size={12} color={currentRole === 'STOCKIST' ? '#ffffff' : '#64748b'} />
              <Text style={[styles.pillText, currentRole === 'STOCKIST' && styles.pillTextActive]}>Stockist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentRole('MANUFACTURER')}
              style={[styles.roleSwitchPill, currentRole === 'MANUFACTURER' && styles.pillActiveMfg]}
            >
              <FontAwesome5 name="industry" size={12} color={currentRole === 'MANUFACTURER' ? '#ffffff' : '#64748b'} />
              <Text style={[styles.pillText, currentRole === 'MANUFACTURER' && styles.pillTextActive]}>Manufacturer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navRight}>
          <TouchableOpacity onPress={() => setShowPermissionsModal(true)} style={styles.quickNavBtn}>
            <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
            {!isMobileScreen && <Text style={styles.quickNavText}>WhatsApp & Excel</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowDataLakeModal(true)} style={styles.quickNavBtn}>
            <Ionicons name="server" size={16} color="#7c3aed" />
            {!isMobileScreen && <Text style={styles.quickNavText}>Data Lake</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Body View - 100% Fully Responsive (Adapts automatically to Mobile and Desktop screens) */}
      <View style={styles.contentBody}>
        <ScrollView style={styles.dashboardScrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.dashboardWrapper, isMobileScreen && styles.dashboardWrapperMobile]}>
            {currentRole === 'HOSPITAL' && <HospitalDashboard />}
            {currentRole === 'STOCKIST' && <StockistDashboard />}
            {currentRole === 'MANUFACTURER' && <ManufacturerDashboard />}
          </View>
        </ScrollView>
      </View>

      {/* Modals */}
      <UberPingModal />
      <UnknownEntityModal />
      <PermissionsModal />
      <CentralDataLakeModal />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  splashBg: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  splashCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 960,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20
  },
  splashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16
  },
  appIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a'
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748b'
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20
  },
  chooseTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4
  },
  chooseSub: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 20
  },
  roleCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 18,
    display: 'flex',
    flexDirection: 'column'
  },
  roleIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  roleHindi: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '700',
    marginBottom: 8
  },
  roleDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
    marginBottom: 16,
    flex: 1
  },
  enterBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  enterBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 14
  },
  footerText: {
    fontSize: 11,
    color: '#64748b'
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexWrap: 'wrap',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  navLogoWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBrandText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a'
  },
  navSubBrand: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700'
  },
  roleSwitchRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 3,
    gap: 4
  },
  roleSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  pillActiveHospital: {
    backgroundColor: '#0284c7'
  },
  pillActiveStockist: {
    backgroundColor: '#d97706'
  },
  pillActiveMfg: {
    backgroundColor: '#16a34a'
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b'
  },
  pillTextActive: {
    color: '#ffffff'
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  quickNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  quickNavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    gap: 2
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  toggleTextActive: {
    color: '#0284c7'
  },
  contentBody: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  dashboardScrollView: {
    flex: 1
  },
  dashboardWrapper: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    paddingBottom: 40
  },
  dashboardWrapperMobile: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: '100%'
  }
});
