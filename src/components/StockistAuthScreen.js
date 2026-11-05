// StockistAuthScreen — Friendly login & signup for Wholesalers / Distributors
// Easy for store owners & staff in Dadar, Princess Street, Dawa Bazar

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Animated
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

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
  const [signupHub, setSignupHub] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupPin2, setSignupPin2] = useState('');

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
        hub: signupHub.trim() || 'Mumbai',
        phone: signupPhone.trim(),
        pin: signupPin.trim(),
      });
      setLoading(false);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setSuccessMsg('Registration successful! Logging you in...');
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
          <Text style={styles.chooseQ}>Are you already registered?</Text>

          <TouchableOpacity onPress={() => setMode('LOGIN')} style={[styles.choiceBtn, { backgroundColor: '#d97706' }]}>
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.choiceBtnText}>Yes, Login to My Portal</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode('SIGNUP')} style={[styles.choiceBtn, { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#d97706' }]}>
            <Ionicons name="business-outline" size={20} color="#d97706" />
            <Text style={[styles.choiceBtnText, { color: '#d97706' }]}>New Business — Register Here</Text>
          </TouchableOpacity>

          <View style={styles.demoNote}>
            <Ionicons name="information-circle-outline" size={14} color="#0284c7" />
            <Text style={styles.demoNoteText}>
              Demo: Try "Entero Healthcare Solutions" / PIN: 1234
            </Text>
          </View>
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

        <View style={styles.divider} />

        {[
          { label: "Owner's / Manager's Name", value: signupOwnerName, setter: setSignupOwnerName, placeholder: 'e.g. Rajesh Shah', keyboard: 'default' },
          { label: 'Business / Firm Name', value: signupBusinessName, setter: setSignupBusinessName, placeholder: 'e.g. Sagar Medical & Surgicals', keyboard: 'default' },
          { label: 'Hub Area (Where is your warehouse?)', value: signupHub, setter: setSignupHub, placeholder: 'e.g. Andheri West, Dadar', keyboard: 'default' },
          { label: 'Mobile / WhatsApp Number', value: signupPhone, setter: setSignupPhone, placeholder: '+91 98xxx xxxxx', keyboard: 'phone-pad' },
          { label: 'Create PIN (4+ digits)', value: signupPin, setter: setSignupPin, placeholder: 'e.g. 5678', keyboard: 'numeric', secure: true },
          { label: 'Confirm PIN', value: signupPin2, setter: setSignupPin2, placeholder: 'Repeat PIN', keyboard: 'numeric', secure: true },
        ].map(f => (
          <View key={f.label} style={styles.formField}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={f.placeholder}
              value={f.value}
              onChangeText={f.setter}
              keyboardType={f.keyboard}
              secureTextEntry={f.secure || false}
              autoCapitalize={f.keyboard === 'default' ? 'words' : 'none'}
            />
          </View>
        ))}

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
              <Text style={styles.primaryBtnText}>Register & Enter Portal</Text>
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
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 560, borderWidth: 1, borderColor: '#fde68a', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  backText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  cardSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#fde68a', marginBottom: 20 },
  chooseQ: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  choiceBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, marginBottom: 12, justifyContent: 'center' },
  choiceBtnText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  demoNote: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0f9ff', borderRadius: 10, padding: 10, marginTop: 8 },
  demoNoteText: { fontSize: 11, color: '#0369a1', fontWeight: '600' },
  formField: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '800', color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
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
