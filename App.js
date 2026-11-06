// PulseChain AI — v3 Full Implementation
// Hospital + Stockist + Manufacturer Auth | Full Catalog | Voice-to-Order | WhatsApp Import | Data Lake Analytics

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/store/stateManager';
import UberPingModal from './src/components/UberPingModal';
import UnknownEntityModal from './src/components/UnknownEntityModal';
import PermissionsModal from './src/components/PermissionsModal';
import CentralDataLakeModal from './src/components/CentralDataLakeModal';
import WhatsAppImportModal from './src/components/WhatsAppImportModal';
import HospitalAuthScreen from './src/components/HospitalAuthScreen';
import StockistAuthScreen from './src/components/StockistAuthScreen';
import ManufacturerAuthScreen from './src/components/ManufacturerAuthScreen';
import FirstOrderPaperworkModal from './src/components/FirstOrderPaperworkModal';
import SplitScreenView from './src/components/SplitScreenView';

function MainScreen() {
  const { width } = useWindowDimensions();
  const isMobileScreen = width < 820;

  const {
    currentRole, setCurrentRole,
    deviceMode, setDeviceMode,
    setShowPermissionsModal,
    setShowDataLakeModal,
    setShowWhatsAppModal,
    // Hospital auth
    loggedInHospital, logoutHospital,
    // Stockist auth
    loggedInStockist, logoutStockist,
    // Manufacturer auth
    loggedInManufacturer, logoutManufacturer,
  } = useApp();

  // Which auth screen to show
  const [showHospitalAuth, setShowHospitalAuth] = useState(false);
  const [showStockistAuth, setShowStockistAuth] = useState(false);
  const [showManufacturerAuth, setShowManufacturerAuth] = useState(false);
  const [hasChosenRole, setHasChosenRole] = useState(true);

  // Auto-close auth screens once an entity logs in
  useEffect(() => {
    if (loggedInHospital && showHospitalAuth) {
      setShowHospitalAuth(false);
      setHasChosenRole(true);
    }
  }, [loggedInHospital]);

  useEffect(() => {
    if (loggedInStockist && showStockistAuth) {
      setShowStockistAuth(false);
      setHasChosenRole(true);
    }
  }, [loggedInStockist]);

  useEffect(() => {
    if (loggedInManufacturer && showManufacturerAuth) {
      setShowManufacturerAuth(false);
      setHasChosenRole(true);
    }
  }, [loggedInManufacturer]);

  // ── AUTH SCREENS ─────────────────────────────────────────────────────────────
  if (showHospitalAuth) {
    return <HospitalAuthScreen onBack={() => setShowHospitalAuth(false)} />;
  }
  if (showStockistAuth) {
    return <StockistAuthScreen onBack={() => setShowStockistAuth(false)} />;
  }
  if (showManufacturerAuth) {
    return <ManufacturerAuthScreen onBack={() => setShowManufacturerAuth(false)} />;
  }

  // ── After login, show dashboard. If role chosen but not logged in, redirect to auth ─
  if (hasChosenRole) {
    if (currentRole === 'HOSPITAL' && !loggedInHospital) {
      setShowHospitalAuth(true);
      setHasChosenRole(false);
    } else if (currentRole === 'STOCKIST' && !loggedInStockist) {
      setShowStockistAuth(true);
      setHasChosenRole(false);
    } else if (currentRole === 'MANUFACTURER' && !loggedInManufacturer) {
      setShowManufacturerAuth(true);
      setHasChosenRole(false);
    }
  }

  // ── OPENING ROLE SELECTION SCREEN ────────────────────────────────────────────
  if (!hasChosenRole) {
    return (
      <SafeAreaView style={styles.splashBg}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.splashScrollContent}>
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
              Select your role below. No forms to fill — just speak or tap.
            </Text>

            {/* 3 Role Cards */}
            <View style={styles.rolesRow}>
              {/* Hospital */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRole('HOSPITAL');
                  setShowHospitalAuth(true);
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
                  <Text style={styles.enterBtnText}>Login / Register Hospital ➤</Text>
                </View>
              </TouchableOpacity>

              {/* Stockist */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRole('STOCKIST');
                  setShowStockistAuth(true);
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
                  <Text style={styles.enterBtnText}>Login / Register Stockist ➔</Text>
                </View>
              </TouchableOpacity>

              {/* Manufacturer */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRole('MANUFACTURER');
                  setShowManufacturerAuth(true);
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
                  <Text style={styles.enterBtnText}>Login / Register Company ➔</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.footerNote}>
              <Ionicons name="sparkles" size={14} color="#0284c7" />
              <Text style={styles.footerText}>
                100% Voice Operated • Never Ask for Filling Form Fields • Auto WhatsApp Import
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Guard — if no one is logged in for the active role, go back to splash
  const isLoggedIn = (currentRole === 'HOSPITAL' && loggedInHospital)
    || (currentRole === 'STOCKIST' && loggedInStockist)
    || (currentRole === 'MANUFACTURER' && loggedInManufacturer);

  if (!isLoggedIn && hasChosenRole) {
    setHasChosenRole(false);
  }

  // ── ACTIVE ENTITY DISPLAY NAME ────────────────────────────────────────────────
  const activeEntityName = currentRole === 'HOSPITAL'
    ? loggedInHospital?.name
    : currentRole === 'STOCKIST'
      ? loggedInStockist?.name
      : loggedInManufacturer?.name;

  const handleLogout = () => {
    if (currentRole === 'HOSPITAL') logoutHospital();
    else if (currentRole === 'STOCKIST') logoutStockist();
    else logoutManufacturer();
    setHasChosenRole(false);
  };

  const roleColor = currentRole === 'HOSPITAL' ? '#0284c7' : currentRole === 'STOCKIST' ? '#d97706' : '#16a34a';
  const roleIcon = currentRole === 'HOSPITAL' ? 'hospital' : currentRole === 'STOCKIST' ? 'truck' : 'industry';

  // ── MAIN PORTAL ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Global High-Aesthetic Web CSS */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

            * {
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            body {
              background-color: #f6f8fc;
            }

            /* Universal Graceful Button & Tile Hover Effects */
            button, [role="button"], [data-focusable="true"] {
              transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), filter 0.22s ease !important;
              cursor: pointer !important;
              user-select: none;
            }

            button:hover, [role="button"]:hover {
              transform: translateY(-2px) !important;
              filter: brightness(1.02) !important;
              box-shadow: 0 10px 22px -4px rgba(15, 23, 42, 0.12) !important;
            }

            button:active, [role="button"]:active {
              transform: translateY(0px) scale(0.97) !important;
              filter: brightness(0.96) !important;
            }

            /* Subtle floating card shadow enhancements */
            .elevated-card {
              box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03) !important;
            }

            /* Custom Slim Sleek Scrollbars */
            ::-webkit-scrollbar {
              width: 7px;
              height: 7px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 999px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }

            @keyframes haloGlow {
              0% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.4); }
              70% { box-shadow: 0 0 0 12px rgba(2, 132, 199, 0); }
              100% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0); }
            }

            .halo-active {
              animation: haloGlow 2.5s infinite;
            }
          `
        }} />
      )}

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity onPress={() => setHasChosenRole(false)} style={styles.brandRow}>
            <View style={styles.navLogoWrap}>
              <Ionicons name="medical" size={20} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.navBrandText}>PulseChain AI</Text>
              <Text style={styles.navSubBrand}>MUMBAI HEALTHCARE MESH</Text>
            </View>
          </TouchableOpacity>

          {/* Role Switcher — only if logged in for that role */}
          <View style={styles.roleSwitchRow}>
            {[
              { role: 'HOSPITAL', icon: 'hospital', label: 'Hospital', color: '#0284c7', style: styles.pillActiveHospital },
              { role: 'STOCKIST', icon: 'truck', label: 'Stockist', color: '#d97706', style: styles.pillActiveStockist },
              { role: 'MANUFACTURER', icon: 'industry', label: 'Mfg', color: '#16a34a', style: styles.pillActiveMfg },
            ].map(r => (
              <TouchableOpacity
                key={r.role}
                onPress={() => {
                  if (r.role === 'HOSPITAL' && !loggedInHospital) { setCurrentRole(r.role); setShowHospitalAuth(true); }
                  else if (r.role === 'STOCKIST' && !loggedInStockist) { setCurrentRole(r.role); setShowStockistAuth(true); }
                  else if (r.role === 'MANUFACTURER' && !loggedInManufacturer) { setCurrentRole(r.role); setShowManufacturerAuth(true); }
                  else setCurrentRole(r.role);
                }}
                style={[styles.roleSwitchPill, currentRole === r.role && r.style]}
              >
                <FontAwesome5 name={r.icon} size={12} color={currentRole === r.role ? '#fff' : '#64748b'} />
                <Text style={[styles.pillText, currentRole === r.role && styles.pillTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.navRight}>
          {/* Logged-in entity badge */}
          {activeEntityName && (
            <View style={[styles.loggedInBadge, { borderColor: roleColor + '40', backgroundColor: roleColor + '10' }]}>
              <FontAwesome5 name={roleIcon} size={11} color={roleColor} />
              <Text style={[styles.loggedInBadgeText, { color: roleColor }]} numberOfLines={1}>
                {activeEntityName.split(' ').slice(0, 3).join(' ')}
              </Text>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={13} color="#dc2626" />
                {!isMobileScreen && <Text style={styles.logoutBtnText}>Logout</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* WhatsApp Import */}
          <TouchableOpacity onPress={() => setShowWhatsAppModal(true)} style={styles.quickNavBtn}>
            <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
            {!isMobileScreen && <Text style={styles.quickNavText}>WA Import</Text>}
          </TouchableOpacity>

          {/* Permissions */}
          <TouchableOpacity onPress={() => setShowPermissionsModal(true)} style={styles.quickNavBtn}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#d97706" />
            {!isMobileScreen && <Text style={styles.quickNavText}>Permissions</Text>}
          </TouchableOpacity>

          {/* Data Lake */}
          <TouchableOpacity onPress={() => setShowDataLakeModal(true)} style={styles.quickNavBtn}>
            <Ionicons name="server" size={16} color="#7c3aed" />
            {!isMobileScreen && <Text style={styles.quickNavText}>Data Lake</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Body — SplitScreenView handles desktop/split/mobile layout */}
      <View style={styles.contentBody}>
        <SplitScreenView />
      </View>

      {/* Modals */}
      <UberPingModal />
      <UnknownEntityModal />
      <PermissionsModal />
      <CentralDataLakeModal />
      <WhatsAppImportModal />
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
  splashBg: { flex: 1, backgroundColor: '#f1f5f9' },
  splashScrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  splashCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 1000, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20 },
  splashHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  appIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  appSubtitle: { fontSize: 13, color: '#64748b' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 20 },
  chooseTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  chooseSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  rolesRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginBottom: 20 },
  roleCard: { flex: 1, minWidth: 260, backgroundColor: '#f8fafc', borderRadius: 18, borderWidth: 1.5, borderColor: '#e2e8f0', padding: 18, display: 'flex', flexDirection: 'column' },
  roleIconCircle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  roleTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  roleHindi: { fontSize: 12, color: '#0284c7', fontWeight: '700', marginBottom: 8 },
  roleDesc: { fontSize: 12, color: '#64748b', lineHeight: 17, marginBottom: 16, flex: 1 },
  enterBtn: { backgroundColor: '#0284c7', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  enterBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 14 },
  footerText: { fontSize: 11, color: '#64748b' },
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 }
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navLogoWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    shadowColor: '#0284c7',
    shadowOpacity: 0.15,
    shadowRadius: 8
  },
  navBrandText: { fontSize: 17, fontWeight: '900', color: '#0f172a', letterSpacing: -0.3 },
  navSubBrand: { fontSize: 9.5, color: '#0284c7', fontWeight: '800', letterSpacing: 0.6 },
  roleSwitchRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  roleSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18
  },
  pillActiveHospital: {
    backgroundColor: '#0284c7',
    shadowColor: '#0284c7',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  pillActiveStockist: {
    backgroundColor: '#d97706',
    shadowColor: '#d97706',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  pillActiveMfg: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  pillText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  pillTextActive: { color: '#ffffff' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  loggedInBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    maxWidth: 240,
    backgroundColor: '#ffffff'
  },
  loggedInBadgeText: { fontSize: 12, fontWeight: '800', flexShrink: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fecaca'
  },
  logoutBtnText: { fontSize: 10.5, fontWeight: '800', color: '#dc2626' },
  quickNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  quickNavText: { fontSize: 11.5, fontWeight: '800', color: '#334155' },
  contentBody: { flex: 1, backgroundColor: '#f8fafc' },
  dashboardScrollView: { flex: 1 },
  dashboardWrapper: { width: '100%', maxWidth: 1360, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 18, paddingBottom: 40 },
  dashboardWrapperMobile: { paddingHorizontal: 10, paddingVertical: 10, maxWidth: '100%' },
});
