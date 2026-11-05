// StockistAuthScreen — Friendly login & signup for Wholesalers / Distributors
// Easy for store owners & staff in Dadar, Princess Street, Dawa Bazar

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Animated
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import { MUMBAI_GEO_AREAS } from '../data/mumbaiData';

export default function StockistAuthScreen({ onBack }) {
  const { loginStockist, signupStockist, registeredStockists } = useApp();

  const [mode, setMode] = useState('CHOOSE'); // 'CHOOSE' | 'LOGIN' | 'SIGNUP'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login fields
  const [loginName, setLoginName] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Signup fields
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupArea, setSignupArea] = useState('Dadar West');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupPin2, setSignupPin2] = useState('');

  // Initial Warehouse Stock & Pricing fields (Phase 1)
  const [glovesStock, setGlovesStock] = useState('50');
  const [glovesPrice, setGlovesPrice] = useState('750');
  const [syringesStock, setSyringesStock] = useState('30');
  const [syringesPrice, setSyringesPrice] = useState('420');

  const autofillXyzStockist = () => {
    setSignupOwnerName('Vikram Somani');
    setSignupBusinessName('XYZ Surgical Supplies');
    setSignupArea('Dadar West');
    setSignupPhone('+91 98205 12345');
    setSignupPin('1234');
    setSignupPin2('1234');
    setGlovesStock('50');
    setGlovesPrice('750');
    setSyringesStock('30');
    setSyringesPrice('420');
  };

  const handleLogin = () => {
    setErrorMsg('');
    if (!loginName.trim() || !loginPin.trim()) {
      setErrorMsg('Please enter business name and PIN.');
      return;
    }
    const found = registeredStockists.find(
      s => s.name.toLowerCase() === loginName.trim().toLowerCase() && s.pin === loginPin.trim()
    );
    if (!found) {
      setErrorMsg('Business not found or wrong PIN. Please check or register below.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      loginStockist(found);
      setLoading(false);
    }, 800);
  };

  const handleSignup = () => {
    setErrorMsg('');
    if (!signupOwnerName.trim() || !signupBusinessName.trim() || !signupPhone.trim() || !signupPin.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (signupPin !== signupPin2) {
      setErrorMsg('PINs do not match.');
      return;
    }
    if (signupPin.length < 4) {
      setErrorMsg('PIN must be at least 4 digits.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signupStockist({
        ownerName: signupOwnerName.trim(),
        businessName: signupBusinessName.trim(),
        hub: signupArea || 'Dadar West',
        area: signupArea || 'Dadar West',
        phone: signupPhone.trim(),
        pin: signupPin.trim(),
        initialStock: {
          'SKU-GLV-75': parseInt(glovesStock, 10) || 50,
          'SKU-SYR-5ML': parseInt(syringesStock, 10) || 30
        },
        initialPrices: {
          'SKU-GLV-75': parseInt(glovesPrice, 10) || 750,
          'SKU-SYR-5ML': parseInt(syringesPrice, 10) || 420
        }
      });
      setLoading(false);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setSuccessMsg('Registration successful! Pulsating radar blip spawned on Mumbai Supply Mesh. Logging you in...');
        setTimeout(() => loginStockist(result.stockist), 1000);
      }
    }, 900);
  };

  // ── CHOOSE screen ──────────────────────────────────────────────────
  if (mode === 'CHOOSE') {
    return (
      <ScrollView contentContainerStyle={styles.outerScroll}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onBack} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color="#64748b" />
            <Text style={styles.backText}>Back to Role Selection</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
              <FontAwesome5 name="truck" size={28} color="#d97706" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Stockist / Distributor Portal</Text>
              <Text style={styles.cardSub}>Mumbai Wholesale & Distribution Network</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.chooseQ}>Registered Distributors in Mumbai:</Text>

          {/* Quick Demo 1-Click Access */}
          <View style={{ gap: 8, marginVertical: 10 }}>
            {registeredStockists.map(stk => (
              <View key={stk.id} style={{
                backgroundColor: '#fffbeb',
                borderWidth: 1,
                borderColor: '#fde68a',
                borderRadius: 10,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a' }}>{stk.name.split('(')[0]}</Text>
                  <Text style={{ fontSize: 10.5, color: '#78350f', marginTop: 2 }}>📍 {stk.hub} • PIN: 1234</Text>
                </View>
                <TouchableOpacity
                  onPress={() => loginStockist(stk)}
                  style={{
                    backgroundColor: '#d97706',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Ionicons name="log-in" size={13} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>Login</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={() => setMode('LOGIN')} style={[styles.choiceBtn, { backgroundColor: '#d97706' }]}>
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.choiceBtnText}>Manual Business Name Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode('SIGNUP')} style={[styles.choiceBtn, { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#d97706' }]}>
            <Ionicons name="business-outline" size={20} color="#d97706" />
            <Text style={[styles.choiceBtnText, { color: '#d97706' }]}>New Business — Register Here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── LOGIN screen ────────────────────────────────────────────────────
  if (mode === 'LOGIN') {
    return (
      <ScrollView contentContainerStyle={styles.outerScroll}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { setMode('CHOOSE'); setErrorMsg(''); }} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color="#64748b" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="log-in" size={26} color="#d97706" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Stockist Login</Text>
              <Text style={styles.cardSub}>Enter your business name & PIN</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.formField}>
            <Text style={styles.label}>Business / Firm Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Entero Healthcare Solutions"
              value={loginName}
              onChangeText={setLoginName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>PIN (4+ digits)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter PIN"
              value={loginPin}
              onChangeText={setLoginPin}
              keyboardType="numeric"
              secureTextEntry
            />
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.primaryBtn, { backgroundColor: '#d97706' }]}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="log-in" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Login to Portal</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMode('SIGNUP'); setErrorMsg(''); }} style={styles.linkBtn}>
            <Text style={styles.linkBtnText}>New business? Register here →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── SIGNUP screen ───────────────────────────────────────────────────
  const mumbaiAreasList = [
    'Dadar West', 'Dadar East', 'Kalbadevi / Dawa Bazar', 'Andheri West',
    'Parel', 'Bandra West', 'Bhiwandi C&F', 'Vashi / Navi Mumbai', 'Vikhroli'
  ];

  return (
    <ScrollView contentContainerStyle={styles.outerScroll}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => { setMode('CHOOSE'); setErrorMsg(''); }} style={styles.backRow}>
          <Ionicons name="arrow-back" size={18} color="#64748b" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
            <FontAwesome5 name="plus-square" size={24} color="#d97706" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Register Your Business</Text>
            <Text style={styles.cardSub}>Join the Mumbai MedSupply Network</Text>
          </View>
        </View>

        {/* 1-Tap Quick Fill for Acceptance Test #1 (XYZ Surgical Supplies) */}
        <TouchableOpacity onPress={autofillXyzStockist} style={styles.autofillBanner}>
          <Ionicons name="flash" size={16} color="#d97706" />
          <View style={{ flex: 1 }}>
            <Text style={styles.autofillTitle}>⚡ Quick-Fill: "XYZ Surgical Supplies"</Text>
            <Text style={styles.autofillSub}>Dadar West • 50 Boxes Gloves @ ₹750 • 1234 PIN</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.formField}>
          <Text style={styles.label}>Owner's / Manager's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Vikram Somani"
            value={signupOwnerName}
            onChangeText={setSignupOwnerName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Business / Firm Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. XYZ Surgical Supplies"
            value={signupBusinessName}
            onChangeText={setSignupBusinessName}
            autoCapitalize="words"
          />
        </View>

        {/* Physical Address / Hub Selection */}
        <View style={styles.formField}>
          <Text style={styles.label}>Warehouse Hub / Physical Area</Text>
          <Text style={styles.fieldHint}>Select area for instant GIS GPS geocoding and live map blip:</Text>
          <View style={styles.areaChipsGrid}>
            {mumbaiAreasList.map(area => (
              <TouchableOpacity
                key={area}
                onPress={() => setSignupArea(area)}
                style={[styles.areaChip, signupArea === area && styles.areaChipActive]}
              >
                <Text style={[styles.areaChipText, signupArea === area && styles.areaChipTextActive]}>
                  {signupArea === area ? '✓ ' : ''}{area}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Mobile / WhatsApp Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98xxx xxxxx"
            value={signupPhone}
            onChangeText={setSignupPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Initial Warehouse Stock & Pricing Declaration Section */}
        <View style={styles.stockDeclarationCard}>
          <View style={styles.stockDeclarationHeader}>
            <Ionicons name="cube" size={18} color="#d97706" />
            <Text style={styles.stockDeclarationTitle}>Declare Initial Warehouse Stock & Rates</Text>
          </View>
          <Text style={styles.stockDeclarationNotice}>
            ⚡ Your declared stock will be immediately visible to Lilavati, Hinduja & KEM Hospitals upon registration with an animated map radar blip.
          </Text>

          {/* Item 1: Surgical Gloves */}
          <View style={styles.stockItemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stockItemTitle}>Sterile Latex Gloves (7.5)</Text>
              <Text style={styles.stockItemUnit}>Box of 50 pairs</Text>
            </View>
            <View style={styles.stockInputGroup}>
              <View style={styles.stockInputWrap}>
                <Text style={styles.stockInputMiniLabel}>Stock</Text>
                <TextInput
                  style={styles.miniInput}
                  value={glovesStock}
                  onChangeText={setGlovesStock}
                  keyboardType="numeric"
                  placeholder="50"
                />
              </View>
              <View style={styles.stockInputWrap}>
                <Text style={styles.stockInputMiniLabel}>Rate (₹)</Text>
                <TextInput
                  style={styles.miniInput}
                  value={glovesPrice}
                  onChangeText={setGlovesPrice}
                  keyboardType="numeric"
                  placeholder="750"
                />
              </View>
            </View>
          </View>

          {/* Item 2: Dispovan Syringes */}
          <View style={styles.stockItemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stockItemTitle}>HMD Dispovan 5ml Syringes</Text>
              <Text style={styles.stockItemUnit}>Carton (1,000 pcs)</Text>
            </View>
            <View style={styles.stockInputGroup}>
              <View style={styles.stockInputWrap}>
                <Text style={styles.stockInputMiniLabel}>Stock</Text>
                <TextInput
                  style={styles.miniInput}
                  value={syringesStock}
                  onChangeText={setSyringesStock}
                  keyboardType="numeric"
                  placeholder="30"
                />
              </View>
              <View style={styles.stockInputWrap}>
                <Text style={styles.stockInputMiniLabel}>Rate (₹)</Text>
                <TextInput
                  style={styles.miniInput}
                  value={syringesPrice}
                  onChangeText={setSyringesPrice}
                  keyboardType="numeric"
                  placeholder="420"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Create PIN (4+ digits)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1234"
            value={signupPin}
            onChangeText={setSignupPin}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Confirm PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Repeat PIN"
            value={signupPin2}
            onChangeText={setSignupPin2}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#dc2626" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleSignup}
          style={[styles.primaryBtn, { backgroundColor: '#d97706' }]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Register & Spawn Radar Blip</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setMode('LOGIN'); setErrorMsg(''); }} style={styles.linkBtn}>
          <Text style={styles.linkBtnText}>Already registered? Login →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffbeb', padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 620, borderWidth: 1, borderColor: '#fde68a', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  backText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  cardSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  autofillBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fef3c7', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#fcd34d', marginBottom: 16 },
  autofillTitle: { fontSize: 12, fontWeight: '800', color: '#92400e' },
  autofillSub: { fontSize: 11, color: '#b45309' },
  divider: { height: 1, backgroundColor: '#fde68a', marginBottom: 20 },
  chooseQ: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  choiceBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, marginBottom: 12, justifyContent: 'center' },
  choiceBtnText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  demoNote: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0f9ff', borderRadius: 10, padding: 10, marginTop: 8 },
  demoNoteText: { fontSize: 11, color: '#0369a1', fontWeight: '600' },
  formField: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '800', color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldHint: { fontSize: 11, color: '#64748b', marginBottom: 8 },
  areaChipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  areaChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  areaChipActive: { backgroundColor: '#d97706', borderColor: '#b45309' },
  areaChipText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  areaChipTextActive: { color: '#ffffff' },
  stockDeclarationCard: { backgroundColor: '#fffbeb', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#fde68a', marginBottom: 16 },
  stockDeclarationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stockDeclarationTitle: { fontSize: 13, fontWeight: '800', color: '#92400e' },
  stockDeclarationNotice: { fontSize: 11, color: '#78350f', marginBottom: 12, lineHeight: 16 },
  stockItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#fef3c7', gap: 10 },
  stockItemTitle: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  stockItemUnit: { fontSize: 10, color: '#64748b' },
  stockInputGroup: { flexDirection: 'row', gap: 8 },
  stockInputWrap: { alignItems: 'center' },
  stockInputMiniLabel: { fontSize: 9, fontWeight: '700', color: '#64748b', marginBottom: 2 },
  miniInput: { width: 68, borderWidth: 1.5, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, fontWeight: '800', color: '#0f172a', backgroundColor: '#ffffff', textAlign: 'center' },
  input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#0f172a', backgroundColor: '#f8fafc' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fef2f2', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#fecaca' },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '600', flex: 1 },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#bbf7d0' },
  successText: { color: '#16a34a', fontSize: 13, fontWeight: '600', flex: 1 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 14, marginTop: 4 },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  linkBtn: { alignItems: 'center', marginTop: 14 },
  linkBtnText: { fontSize: 13, color: '#d97706', fontWeight: '700' },
});
