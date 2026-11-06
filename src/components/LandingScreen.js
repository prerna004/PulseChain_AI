// PulseChain AI — High-Aesthetic Award-Winning Landing Page & Persona Selection Screen
// Inspired by modern MedTech & Fintech platforms (Linear, Stripe, Apple Health)
// 100% Responsive, Glassmorphic, Bilingual (Hindi & English), Guaranteed Vector SVGs

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import SymbolIcon from './SymbolIcon';

export default function LandingScreen({ onSelectRole }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const isTablet = width >= 860 && width < 1120;

  const { handleVoiceOrTextInput, isListening, setIsListening } = useApp();
  const [demoInput, setDemoInput] = useState('');

  const handleQuickDemoVoice = (spokenText, targetRole) => {
    if (onSelectRole) {
      onSelectRole(targetRole);
    }
    if (handleVoiceOrTextInput) {
      setTimeout(() => {
        handleVoiceOrTextInput(spokenText);
      }, 600);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Decorative Ambient Radial Glows */}
      <View style={styles.ambientTopGlow} pointerEvents="none" />
      <View style={styles.ambientBottomGlow} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. FLOATING GLASSMORPHIC HEADER */}
        <View style={styles.glassHeader}>
          <View style={styles.brandGroup}>
            <View style={styles.logoBadge}>
              <SymbolIcon name="hospital" size={22} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.brandTitle}>PulseChain AI</Text>
              <Text style={styles.brandSubtitle}>MUMBAI HEALTHCARE MESH • बोलकर आर्डर करें</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.liveMeshPill}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.liveMeshPillText}>8 Mumbai Hospitals Connected</Text>
            </View>
          </View>
        </View>

        {/* 2. EYE-CATCHING HERO STAGE */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <SymbolIcon name="bolt" size={13} color="#0284c7" />
            <Text style={styles.heroBadgeText}>MUMBAI’S FIRST AUTONOMOUS MEDICAL SUPPLY MESH</Text>
          </View>

          <Text style={[styles.heroHeadline, isMobile && styles.heroHeadlineMobile]}>
            Next-Generation Hospital Supply Mesh.{'\n'}
            <Text style={styles.heroHeadlineGradient}>100% Zero-Form & Voice-Operated.</Text>
          </Text>

          <Text style={styles.heroBilingual}>
            अस्पताल, स्टॉकिस्ट और दवा फैक्ट्री के लिए मुंबई का पहला डायरेक्ट P2P नेटवर्क। बिना किसी फॉर्म या कागजी झंझट के — सिर्फ बोलकर आर्डर करें।
          </Text>

          <Text style={styles.heroDescription}>
            Autonomous healthcare procurement directly linking Lilavati, KEM, Hinduja, Dawa Bazar distributors, and Bhiwandi CFA factory depots with real-time ward telemetry and bank-verified escrow.
          </Text>

          {/* 3. INTERACTIVE FLOATING VOICE TEST PILL */}
          <View style={styles.voiceTryCard}>
            <View style={styles.voiceTryLeft}>
              <TouchableOpacity
                onPress={() => handleQuickDemoVoice('Order 50 boxes of Dispovan syringes urgently for Lilavati ICU', 'HOSPITAL')}
                style={styles.voiceTryMicBtn}
                accessibilityLabel="Try voice mic"
              >
                <SymbolIcon name="mic" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.voiceTryTitle}>Try Voice Requisition (बोलकर आज़माएं):</Text>
                  <View style={styles.voiceTryLiveBadge}>
                    <Text style={styles.voiceTryLiveBadgeText}>1-TAP DEMO</Text>
                  </View>
                </View>
                <Text style={styles.voiceTryPrompt}>
                  "Order 50 boxes of Dispovan syringes urgently for Lilavati ICU"
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleQuickDemoVoice('Order 50 boxes of Dispovan syringes urgently for Lilavati ICU', 'HOSPITAL')}
              style={styles.voiceTryActionBtn}
            >
              <Text style={styles.voiceTryActionBtnText}>Speak & Order ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. CHOOSE YOUR PERSONA SECTION HEADER */}
        <View style={styles.chooseSectionHeader}>
          <Text style={styles.chooseTitle}>Select Your Operational Role (आप कौन हैं?)</Text>
          <Text style={styles.chooseSub}>
            Dedicated portal designed specifically for your daily workflow. Choose your role below:
          </Text>
        </View>

        {/* 5. THREE EYE-CATCHING LUXURY ROLE CARDS */}
        <View style={[styles.roleCardsGrid, isMobile && styles.roleCardsGridMobile]}>
          {/* CARD 1: HOSPITAL */}
          <View style={[styles.roleCard, styles.roleCardHospital]}>
            <View style={styles.roleCardTopBanner}>
              <View style={styles.personaBadgeHospital}>
                <Text style={styles.personaBadgeTextHospital}>CLINICAL FACILITY</Text>
              </View>
              <View style={styles.dotPulseHospital} />
            </View>

            <View style={styles.roleHeaderRow}>
              <View style={[styles.roleIconCircle, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                <SymbolIcon name="hospital" size={32} color="#0284c7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleCardTitle}>1. Hospital Portal</Text>
                <Text style={styles.roleCardHindi}>अस्पताल / नर्सिंग होम / आईसीयू</Text>
              </View>
            </View>

            <Text style={styles.roleAudienceText}>
              For Chief Pharmacists, Ward Sisters, ICU Doctors & Storekeepers (Lilavati, Hinduja, KEM, Breach Candy)
            </Text>

            <View style={styles.rolePerksList}>
              <View style={styles.rolePerkItem}>
                <SymbolIcon name="mic" size={15} color="#0284c7" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>1-Tap Voice Orders:</Text> Speak in Hindi/English, zero form filling.
                </Text>
              </View>

              <View style={styles.rolePerkItem}>
                <SymbolIcon name="lock" size={15} color="#0284c7" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>Confidential P2P Mesh:</Text> Internal stock & rates completely private.
                </Text>
              </View>

              <View style={styles.rolePerkItem}>
                <SymbolIcon name="truck" size={15} color="#0284c7" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>18-Min Proximity Dispatch:</Text> Live radar scans closest MMR stores.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => onSelectRole('HOSPITAL')}
              style={[styles.enterRoleBtn, styles.enterRoleBtnHospital]}
            >
              <Text style={styles.enterRoleBtnText}>Login / Register Hospital ➔</Text>
            </TouchableOpacity>
          </View>

          {/* CARD 2: STOCKIST / DISTRIBUTOR */}
          <View style={[styles.roleCard, styles.roleCardStockist]}>
            <View style={styles.roleCardTopBanner}>
              <View style={styles.personaBadgeStockist}>
                <Text style={styles.personaBadgeTextStockist}>AUTHORIZED MMR CFA</Text>
              </View>
              <View style={styles.dotPulseStockist} />
            </View>

            <View style={styles.roleHeaderRow}>
              <View style={[styles.roleIconCircle, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
                <SymbolIcon name="truck" size={32} color="#d97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleCardTitle}>2. Stockist & Dealer</Text>
                <Text style={[styles.roleCardHindi, { color: '#d97706' }]}>थोक विक्रेता / होलसेल सप्लायर</Text>
              </View>
            </View>

            <Text style={styles.roleAudienceText}>
              For Medical Wholesalers & Authorized CFAs in Dadar, Princess Street, Dawa Bazar & Central Mumbai
            </Text>

            <View style={styles.rolePerksList}>
              <View style={styles.rolePerkItem}>
                <SymbolIcon name="radar" size={15} color="#d97706" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>Live Hospital Demand Radar:</Text> Instant alerts when wards need stock.
                </Text>
              </View>

              <View style={styles.rolePerkItem}>
                <SymbolIcon name="paper-plane" size={15} color="#d97706" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>Instant Spot Quotes:</Text> Submit competitive rates in 1 click.
                </Text>
              </View>

              <View style={styles.rolePerkItem}>
                <SymbolIcon name="factory" size={15} color="#d97706" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>Factory Direct Restocking:</Text> 2-day bulk replenishment via Bhiwandi.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => onSelectRole('STOCKIST')}
              style={[styles.enterRoleBtn, styles.enterRoleBtnStockist]}
            >
              <Text style={styles.enterRoleBtnText}>Login / Register Stockist ➔</Text>
            </TouchableOpacity>
          </View>

          {/* CARD 3: MANUFACTURER OEM */}
          <View style={[styles.roleCard, styles.roleCardMfg]}>
            <View style={styles.roleCardTopBanner}>
              <View style={styles.personaBadgeMfg}>
                <Text style={styles.personaBadgeTextMfg}>PHARMA & MEDTECH OEM</Text>
              </View>
              <View style={styles.dotPulseMfg} />
            </View>

            <View style={styles.roleHeaderRow}>
              <View style={[styles.roleIconCircle, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                <SymbolIcon name="factory" size={32} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleCardTitle}>3. Manufacturer OEM</Text>
                <Text style={[styles.roleCardHindi, { color: '#059669' }]}>दवा व उपकरण निर्माता फैक्ट्री</Text>
              </View>
            </View>

            <Text style={styles.roleAudienceText}>
              For Medical Equipment & Pharma Plants (HMD Dispovan, Polymed, 3M Healthcare, Cipla)
            </Text>

            <View style={styles.rolePerksList}>
              <View style={styles.rolePerkItem}>
                <SymbolIcon name="box" size={15} color="#059669" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>1.28M Unit Buffer Oversight:</Text> Live stock levels across all stockists.
                </Text>
              </View>

              <View style={styles.rolePerkItem}>
                <SymbolIcon name="truck" size={15} color="#059669" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>Automated CFA Dispatches:</Text> Zero stockout buffer guarantees.
                </Text>
              </View>

              <View style={styles.rolePerkItem}>
                <SymbolIcon name="shield" size={15} color="#059669" />
                <Text style={styles.rolePerkText}>
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>Guaranteed Escrow Settlement:</Text> Direct bank clearances on dock scan.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => onSelectRole('MANUFACTURER')}
              style={[styles.enterRoleBtn, styles.enterRoleBtnMfg]}
            >
              <Text style={styles.enterRoleBtnText}>Login / Register Factory ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. TRUST & PERFORMANCE METRICS FOOTER TICKER */}
        <View style={styles.metricsBar}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>8 Facilities</Text>
            <Text style={styles.metricLabel}>Mumbai BMC & Private Hospitals</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>18 Mins</Text>
            <Text style={styles.metricLabel}>Average Delivery Turnaround</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>100% Voice</Text>
            <Text style={styles.metricLabel}>Bilingual Hindi & English AI</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>₹4.2 Cr+</Text>
            <Text style={styles.metricLabel}>Verified Healthcare Escrow</Text>
          </View>
        </View>

        {/* Footer Subtext */}
        <View style={styles.footerNote}>
          <SymbolIcon name="shield" size={14} color="#0284c7" />
          <Text style={styles.footerNoteText}>
            PulseChain AI Mumbai Health Mesh • HIPAA & MMR Healthcare Compliant • Zero-Click WhatsApp Integration
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
    position: 'relative',
    overflow: 'hidden'
  },

  // Ambient Glows
  ambientTopGlow: {
    position: 'absolute',
    top: -160,
    left: '20%',
    width: 600,
    height: 400,
    borderRadius: 300,
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    filter: 'blur(90px)'
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -160,
    right: '10%',
    width: 500,
    height: 400,
    borderRadius: 250,
    backgroundColor: 'rgba(16, 185, 129, 0.07)',
    filter: 'blur(80px)'
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxWidth: 1320,
    alignSelf: 'center',
    width: '100%'
  },

  // Glass Header
  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 32,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOpacity: 0.25,
    shadowRadius: 8
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.4
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
    letterSpacing: 0.3
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  liveMeshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981'
  },
  liveMeshPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#065f46'
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 960,
    marginBottom: 36
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 18,
    shadowColor: '#0284c7',
    shadowOpacity: 0.15,
    shadowRadius: 8
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369a1',
    letterSpacing: 0.8
  },
  heroHeadline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 48,
    marginBottom: 14
  },
  heroHeadlineMobile: {
    fontSize: 28,
    lineHeight: 36
  },
  heroHeadlineGradient: {
    color: '#0284c7'
  },
  heroBilingual: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0369a1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
    maxWidth: 780
  },
  heroDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 820,
    marginBottom: 24
  },

  // Interactive Voice Demo Card
  voiceTryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
    maxWidth: 780,
    shadowColor: '#10b981',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    flexWrap: 'wrap',
    gap: 14
  },
  voiceTryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 280
  },
  voiceTryMicBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.45,
    shadowRadius: 10
  },
  voiceTryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  voiceTryLiveBadge: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  voiceTryLiveBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669'
  },
  voiceTryPrompt: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
    fontStyle: 'italic'
  },
  voiceTryActionBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: '#059669',
    shadowOpacity: 0.35,
    shadowRadius: 8
  },
  voiceTryActionBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '800'
  },

  // Choose Section Header
  chooseSectionHeader: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 24
  },
  chooseTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 6
  },
  chooseSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center'
  },

  // 3 Role Cards Grid
  roleCardsGrid: {
    flexDirection: 'row',
    gap: 22,
    width: '100%',
    marginBottom: 36
  },
  roleCardsGridMobile: {
    flexDirection: 'column'
  },
  roleCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 24,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  roleCardHospital: {
    borderColor: '#bae6fd',
    backgroundColor: '#ffffff'
  },
  roleCardStockist: {
    borderColor: '#fde68a',
    backgroundColor: '#ffffff'
  },
  roleCardMfg: {
    borderColor: '#bbf7d0',
    backgroundColor: '#ffffff'
  },
  roleCardTopBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  personaBadgeHospital: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe'
  },
  personaBadgeTextHospital: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: 0.5
  },
  dotPulseHospital: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284c7'
  },
  personaBadgeStockist: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fde68a'
  },
  personaBadgeTextStockist: {
    fontSize: 10,
    fontWeight: '800',
    color: '#d97706',
    letterSpacing: 0.5
  },
  dotPulseStockist: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d97706'
  },
  personaBadgeMfg: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  personaBadgeTextMfg: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5
  },
  dotPulseMfg: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669'
  },

  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  roleIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  roleCardHindi: {
    fontSize: 12.5,
    color: '#0284c7',
    fontWeight: '700',
    marginTop: 2
  },
  roleAudienceText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 18
  },

  // Perks list
  rolePerksList: {
    gap: 12,
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  rolePerkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  rolePerkText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    flex: 1
  },

  // CTA Button
  enterRoleBtn: {
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  enterRoleBtnHospital: {
    backgroundColor: '#0284c7',
    shadowColor: '#0284c7',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  enterRoleBtnStockist: {
    backgroundColor: '#d97706',
    shadowColor: '#d97706',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  enterRoleBtnMfg: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  enterRoleBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3
  },

  // Metrics Bar
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    width: '100%',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20
  },
  metricItem: {
    flex: 1,
    minWidth: 140,
    alignItems: 'center',
    textAlign: 'center'
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a'
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center'
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4
  },

  // Footer Note
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8
  },
  footerNoteText: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center'
  }
});

