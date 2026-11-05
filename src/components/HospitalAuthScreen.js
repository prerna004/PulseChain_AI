// Hospital Auth Screen — Signup & Login
// New hospitals register here. Returning hospitals log in.

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function HospitalAuthScreen({ onBack }) {
  const { registeredHospitals, loginHospital, signupHospital } = useApp();
  const [mode, setMode] = useState('CHOOSE'); // 'CHOOSE' | 'LOGIN' | 'SIGNUP'

  // Login form state
  const [loginHospitalId, setLoginHospitalId] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupTitle, setSignupTitle] = useState('');
  const [signupHospitalName, setSignupHospitalName] = useState('');
  const [signupArea, setSignupArea] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupConfirmPin, setSignupConfirmPin] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = () => {
    setLoginError('');
    const found = registeredHospitals.find(h =>
      h.id === loginHospitalId && h.pin === loginPin
    );
    if (!found) {
      setLoginError('Invalid Hospital ID or PIN. Please check and try again.');
      return;
    }
    loginHospital(found);
  };

  const handleSignup = () => {
    setSignupError('');
    if (!signupName.trim() || !signupHospitalName.trim() || !signupPhone.trim() || !signupPin.trim()) {
      setSignupError('Please fill all required fields.');
      return;
    }
    if (signupPin.length < 4) {
      setSignupError('PIN must be at least 4 digits.');
      return;
    }
    if (signupPin !== signupConfirmPin) {
      setSignupError('PINs do not match. Please re-enter.');
      return;
    }
    const result = signupHospital({
      name: signupName.trim(),
      title: signupTitle.trim(),
      hospitalName: signupHospitalName.trim(),
      area: signupArea.trim(),
      phone: signupPhone.trim(),
      pin: signupPin.trim()
    });
    if (result.error) {
      setSignupError(result.error);
      return;
    }
    setSignupSuccess(true);
    // Auto-login after 1.5s
    setTimeout(() => loginHospital(result.hospital), 1500);
  };

  // ── CHOOSE MODE ──────────────────────────────────────────────
  if (mode === 'CHOOSE') {
    return (
      <SafeAreaView style={styles.bg}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          <View style={styles.card}>
            {/* Back */}
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#64748b" />
              <Text style={styles.backText}>Back to Role Selection</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.chooseHeader}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="hospital" size={28} color="#0284c7" />
              </View>
              <Text style={styles.chooseTitle}>Hospital Portal</Text>
              <Text style={styles.chooseSub}>
                Access requires a registered account. New hospitals must sign up first.
              </Text>
            </View>

            {/* Stats bar */}
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{registeredHospitals.length}</Text>
                <Text style={styles.statLabel}>Registered</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>Mumbai</Text>
                <Text style={styles.statLabel}>Region</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>4</Text>
                <Text style={styles.statLabel}>Distributors</Text>
              </View>
            </View>

            {/* Quick Demo 1-Click Access for Interview & Presentation */}
            <View style={styles.demoShowcaseBox}>
              <View style={styles.demoShowcaseHeader}>
                <Ionicons name="flash" size={16} color="#0284c7" />
                <Text style={styles.demoShowcaseTitle}>Demo Showcase: Registered Hospitals</Text>
              </View>
              <Text style={styles.demoShowcaseSubtitle}>
                Tap any hospital below for instant 1-click login (PIN: 1234 pre-configured):
              </Text>

              <View style={styles.demoHospitalGrid}>
                {registeredHospitals.map(h => (
                  <View key={h.id} style={styles.demoHospitalCard}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.demoHospitalName}>{h.name}</Text>
                        {h.id === 'hosp-1' && (
                          <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>Primary</Text></View>
                        )}
                        {h.id === 'hosp-4' && (
                          <View style={[styles.primaryBadge, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
                            <Text style={[styles.primaryBadgeText, { color: '#b45309' }]}>Concurrency Demo</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.demoHospitalMeta}>
                        📍 {h.area} • ID: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{h.id}</Text> • PIN: <Text style={{ fontWeight: '800', color: '#0f172a' }}>1234</Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => loginHospital(h)}
                      style={styles.demoLoginBtn}
                    >
                      <Ionicons name="log-in" size={14} color="#ffffff" />
                      <Text style={styles.demoLoginBtnText}>Instant Login</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Two big buttons */}
            <TouchableOpacity
              onPress={() => setMode('LOGIN')}
              style={[styles.bigBtn, styles.bigBtnPrimary]}
            >
              <View style={styles.bigBtnIcon}>
                <Ionicons name="log-in-outline" size={24} color="#0284c7" />
              </View>
              <View style={styles.bigBtnText}>
                <Text style={styles.bigBtnTitle}>Returning Hospital (Manual Login)</Text>
                <Text style={styles.bigBtnSub}>Already registered? Log in with your Hospital ID & PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0284c7" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('SIGNUP')}
              style={[styles.bigBtn, styles.bigBtnSecondary]}
            >
              <View style={[styles.bigBtnIcon, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="add-circle-outline" size={24} color="#16a34a" />
              </View>
              <View style={styles.bigBtnText}>
                <Text style={[styles.bigBtnTitle, { color: '#166534' }]}>New Hospital Registration</Text>
                <Text style={styles.bigBtnSub}>Register your hospital to start ordering from distributors</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#16a34a" />
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              🔒  Each hospital account is private. No other hospital can see your orders or data.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── LOGIN MODE ───────────────────────────────────────────────
  if (mode === 'LOGIN') {
    return (
      <SafeAreaView style={styles.bg}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setMode('CHOOSE')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#64748b" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.formHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="log-in" size={24} color="#0284c7" />
              </View>
              <Text style={styles.formTitle}>Hospital Login</Text>
              <Text style={styles.formSub}>Enter your Hospital ID and 4-digit PIN</Text>
            </View>

            {/* Registered hospitals quick list */}
            {registeredHospitals.length > 0 && (
              <View style={styles.quickPickBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.quickPickLabel}>Quick select your hospital (PIN auto-fills):</Text>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#0284c7' }}>Demo PIN: 1234</Text>
                </View>
                <View style={styles.quickPickList}>
                  {registeredHospitals.map(h => (
                    <TouchableOpacity
                      key={h.id}
                      onPress={() => {
                        setLoginHospitalId(h.id);
                        setLoginPin(h.pin || '1234');
                      }}
                      style={[
                        styles.quickPickChip,
                        loginHospitalId === h.id && styles.quickPickChipActive
                      ]}
                    >
                      <Text style={[
                        styles.quickPickChipText,
                        loginHospitalId === h.id && styles.quickPickChipTextActive
                      ]}>🏥 {h.name.split(' ')[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Hospital ID</Text>
              <TextInput
                style={styles.input}
                value={loginHospitalId}
                onChangeText={setLoginHospitalId}
                placeholder="e.g. HOSP-MUM-1001"
                placeholderTextColor="#94a3b8"
                autoCapitalize="characters"
              />
              <Text style={styles.fieldHint}>Your Hospital ID was given when you signed up</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>4-Digit PIN</Text>
              <TextInput
                style={styles.input}
                value={loginPin}
                onChangeText={setLoginPin}
                placeholder="Enter your PIN"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />
            </View>

            {loginError ? (
              <View style={styles.errorBox}>
                <Ionicons name="warning" size={16} color="#dc2626" />
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            ) : null}

            <TouchableOpacity onPress={handleLogin} style={styles.submitBtn}>
              <Ionicons name="log-in" size={18} color="#ffffff" />
              <Text style={styles.submitBtnText}>Log In to Hospital Portal</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode('SIGNUP')} style={styles.switchModeBtn}>
              <Text style={styles.switchModeBtnText}>
                New hospital? <Text style={{ color: '#16a34a', fontWeight: '800' }}>Register here →</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── SIGNUP MODE ──────────────────────────────────────────────
  if (mode === 'SIGNUP') {

    if (signupSuccess) {
      return (
        <SafeAreaView style={styles.bg}>
          <View style={styles.card}>
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={56} color="#16a34a" />
              <Text style={styles.successTitle}>Registration Successful!</Text>
              <Text style={styles.successSub}>
                {signupHospitalName} is now registered in the Mumbai PulseChain network.
                Logging you in automatically...
              </Text>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.bg}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setMode('CHOOSE')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#64748b" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.formHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                <FontAwesome5 name="hospital-alt" size={22} color="#16a34a" />
              </View>
              <Text style={[styles.formTitle, { color: '#166534' }]}>New Hospital Registration</Text>
              <Text style={styles.formSub}>
                Register your hospital to access distributors and place orders.
                Your data will always be private — other hospitals cannot see your orders.
              </Text>
            </View>

            {/* Info notice */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={18} color="#0284c7" />
              <Text style={styles.infoText}>
                First order will include a verification step (paperwork & distributor introduction).
                From your 2nd order onwards, you can order directly without any paperwork.
              </Text>
            </View>

            {/* Form fields */}
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>👤  Your Contact Details</Text>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Your Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={signupName}
                  onChangeText={setSignupName}
                  placeholder="Dr. Rajesh Mehta"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Designation / Title</Text>
                <TextInput
                  style={styles.input}
                  value={signupTitle}
                  onChangeText={setSignupTitle}
                  placeholder="Procurement Head"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>🏥  Hospital Details</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Hospital / Nursing Home Name *</Text>
              <TextInput
                style={styles.input}
                value={signupHospitalName}
                onChangeText={setSignupHospitalName}
                placeholder="Asha Critical Care & Nursing Home"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Area / Location in Mumbai</Text>
                <TextInput
                  style={styles.input}
                  value={signupArea}
                  onChangeText={setSignupArea}
                  placeholder="Borivali West"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>WhatsApp / Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  value={signupPhone}
                  onChangeText={setSignupPhone}
                  placeholder="+91 98XXX XXXXX"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>🔒  Set Account PIN</Text>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Create PIN (4-6 digits) *</Text>
                <TextInput
                  style={styles.input}
                  value={signupPin}
                  onChangeText={setSignupPin}
                  placeholder="e.g. 1234"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={6}
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Confirm PIN *</Text>
                <TextInput
                  style={styles.input}
                  value={signupConfirmPin}
                  onChangeText={setSignupConfirmPin}
                  placeholder="Re-enter PIN"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={6}
                />
              </View>
            </View>

            {signupError ? (
              <View style={styles.errorBox}>
                <Ionicons name="warning" size={16} color="#dc2626" />
                <Text style={styles.errorText}>{signupError}</Text>
              </View>
            ) : null}

            <TouchableOpacity onPress={handleSignup} style={[styles.submitBtn, { backgroundColor: '#16a34a' }]}>
              <FontAwesome5 name="hospital" size={16} color="#ffffff" />
              <Text style={styles.submitBtnText}>Register Hospital & Get Access</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode('LOGIN')} style={styles.switchModeBtn}>
              <Text style={styles.switchModeBtnText}>
                Already registered? <Text style={{ color: '#0284c7', fontWeight: '800' }}>Log in →</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 800,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    alignSelf: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  chooseHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  chooseTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6,
  },
  chooseSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0284c7',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e2e8f0',
  },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
  },
  bigBtnPrimary: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  bigBtnSecondary: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  bigBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtnText: {
    flex: 1,
  },
  bigBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0369a1',
    marginBottom: 3,
  },
  bigBtnSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  formSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  quickPickBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 16,
  },
  quickPickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickPickList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPickChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickPickChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  quickPickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  quickPickChipTextActive: {
    color: '#ffffff',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 5,
  },
  fieldHint: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    color: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    outlineStyle: 'none',
  },
  sectionLabel: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionLabelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 12,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1d4ed8',
    lineHeight: 18,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  switchModeBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchModeBtnText: {
    fontSize: 13,
    color: '#64748b',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#166534',
  },
  successSub: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  demoShowcaseBox: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16
  },
  demoShowcaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  demoShowcaseTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0369a1'
  },
  demoShowcaseSubtitle: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 10
  },
  demoHospitalGrid: {
    gap: 8
  },
  demoHospitalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  demoHospitalName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a'
  },
  demoHospitalMeta: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 2
  },
  primaryBadge: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284c7'
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  demoLoginBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff'
  }
});
