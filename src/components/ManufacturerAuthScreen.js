// ManufacturerAuthScreen — Login & Registration for MedTech Companies
// For factory owners and sales managers (Dispovan, Polymed, 3M, Cipla)

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function ManufacturerAuthScreen({ onBack }) {
  const { loginManufacturer, signupManufacturer, registeredManufacturers } = useApp();

  const [mode, setMode] = useState('CHOOSE');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login
  const [loginName, setLoginName] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Signup
  const [signupRepName, setSignupRepName] = useState('');
  const [signupTitle, setSignupTitle] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupBrand, setSignupBrand] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupPin2, setSignupPin2] = useState('');

  const handleLogin = () => {
    setErrorMsg('');
    if (!loginName.trim() || !loginPin.trim()) {
      setErrorMsg('Please enter company name and PIN.');
      return;
    }
    const found = registeredManufacturers.find(
      m => m.name.toLowerCase() === loginName.trim().toLowerCase() && m.pin === loginPin.trim()
    );
    if (!found) {
      setErrorMsg('Company not found or wrong PIN. Please check or register.');
      return;
    }
    setLoading(true);
    setTimeout(() => { loginManufacturer(found); setLoading(false); }, 800);
  };

  const handleSignup = () => {
    setErrorMsg('');
    if (!signupRepName.trim() || !signupCompany.trim() || !signupPhone.trim() || !signupPin.trim()) {
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
      const result = signupManufacturer({
        repName: signupRepName.trim(),
        title: signupTitle.trim() || 'Sales Manager',
        companyName: signupCompany.trim(),
        brand: signupBrand.trim() || signupCompany.trim(),
        phone: signupPhone.trim(),
        pin: signupPin.trim(),
      });
      setLoading(false);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setSuccessMsg('Registration successful! Welcome to PulseChain Manufacturer Network.');
        setTimeout(() => loginManufacturer(result.manufacturer), 1000);
      }
    }, 900);
  };

  if (mode === 'CHOOSE') {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onBack} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color="#64748b" />
            <Text style={styles.backText}>Back to Role Selection</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <FontAwesome5 name="industry" size={26} color="#16a34a" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Manufacturer Portal</Text>
              <Text style={styles.cardSub}>MedTech Companies — Bhiwandi, Thane, Navi Mumbai</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.chooseQ}>Are you already registered?</Text>

          <TouchableOpacity onPress={() => setMode('LOGIN')} style={[styles.choiceBtn, { backgroundColor: '#16a34a' }]}>
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.choiceBtnText}>Yes, Login to My Portal</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode('SIGNUP')} style={[styles.choiceBtn, { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#16a34a' }]}>
            <FontAwesome5 name="plus-square" size={18} color="#16a34a" />
            <Text style={[styles.choiceBtnText, { color: '#16a34a' }]}>New Company — Register Here</Text>
          </TouchableOpacity>

          <View style={styles.demoNote}>
            <Ionicons name="information-circle-outline" size={14} color="#0284c7" />
            <Text style={styles.demoNoteText}>
              Demo: Try "Hindustan Syringes & Medical Devices (HMD)" / PIN: 1234
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'LOGIN') {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { setMode('CHOOSE'); setErrorMsg(''); }} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color="#64748b" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="log-in" size={26} color="#16a34a" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Manufacturer Login</Text>
              <Text style={styles.cardSub}>Company name & sales PIN</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.formField}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Hindustan Syringes & Medical Devices (HMD)" value={loginName} onChangeText={setLoginName} autoCapitalize="words" />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>PIN</Text>
            <TextInput style={styles.input} placeholder="Enter PIN" value={loginPin} onChangeText={setLoginPin} keyboardType="numeric" secureTextEntry />
          </View>
          {errorMsg ? (
            <View style={styles.errorBox}><Ionicons name="alert-circle" size={16} color="#dc2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
          ) : null}
          <TouchableOpacity onPress={handleLogin} style={[styles.primaryBtn, { backgroundColor: '#16a34a' }]} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="log-in" size={18} color="#fff" /><Text style={styles.primaryBtnText}>Login</Text></>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setMode('SIGNUP'); setErrorMsg(''); }} style={styles.linkBtn}>
            <Text style={[styles.linkBtnText, { color: '#16a34a' }]}>New company? Register here →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => { setMode('CHOOSE'); setErrorMsg(''); }} style={styles.backRow}>
          <Ionicons name="arrow-back" size={18} color="#64748b" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
            <FontAwesome5 name="plus-square" size={22} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Register Your Company</Text>
            <Text style={styles.cardSub}>Join the PulseChain Manufacturer Network</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {[
          { label: "Sales Representative / Owner Name", value: signupRepName, setter: setSignupRepName, placeholder: 'e.g. Vikram Malhotra', keyboard: 'default' },
          { label: 'Designation / Title', value: signupTitle, setter: setSignupTitle, placeholder: 'e.g. Zonal Sales Director', keyboard: 'default' },
          { label: 'Company / Factory Name', value: signupCompany, setter: setSignupCompany, placeholder: 'e.g. Poly Medicure Ltd.', keyboard: 'default' },
          { label: 'Brand Name (if different)', value: signupBrand, setter: setSignupBrand, placeholder: 'e.g. Polymed', keyboard: 'default' },
          { label: 'Mobile / WhatsApp', value: signupPhone, setter: setSignupPhone, placeholder: '+91 98xxx xxxxx', keyboard: 'phone-pad' },
          { label: 'Create PIN (4+ digits)', value: signupPin, setter: setSignupPin, placeholder: 'e.g. 9012', keyboard: 'numeric', secure: true },
          { label: 'Confirm PIN', value: signupPin2, setter: setSignupPin2, placeholder: 'Repeat PIN', keyboard: 'numeric', secure: true },
        ].map(f => (
          <View key={f.label} style={styles.formField}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput style={styles.input} placeholder={f.placeholder} value={f.value} onChangeText={f.setter} keyboardType={f.keyboard} secureTextEntry={f.secure || false} autoCapitalize={f.keyboard === 'default' ? 'words' : 'none'} />
          </View>
        ))}

        {errorMsg ? (
          <View style={styles.errorBox}><Ionicons name="alert-circle" size={16} color="#dc2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
        ) : null}
        {successMsg ? (
          <View style={styles.successBox}><Ionicons name="checkmark-circle" size={16} color="#16a34a" /><Text style={styles.successText}>{successMsg}</Text></View>
        ) : null}

        <TouchableOpacity onPress={handleSignup} style={[styles.primaryBtn, { backgroundColor: '#16a34a' }]} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="checkmark-circle" size={18} color="#fff" /><Text style={styles.primaryBtnText}>Register & Enter Portal</Text></>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setMode('LOGIN'); setErrorMsg(''); }} style={styles.linkBtn}>
          <Text style={[styles.linkBtnText, { color: '#16a34a' }]}>Already registered? Login →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 560, borderWidth: 1, borderColor: '#bbf7d0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  backText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  cardSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#bbf7d0', marginBottom: 20 },
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
  linkBtnText: { fontSize: 13, fontWeight: '700' },
});
