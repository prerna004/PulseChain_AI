// Conversational Unknown Entity Voice Onboarding Modal
// "We dont seem to have you on our database. Please share your name, title, hospital and mobile no or Whatsapp business account for us to do your search better"

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function UnknownEntityModal() {
  const {
    showUnknownEntityModal,
    setShowUnknownEntityModal,
    unknownEntityData,
    registerNewEntity
  } = useApp();

  const [name, setName] = useState('Dr. Rajesh Mehta');
  const [title, setTitle] = useState('Chief Medical Officer & SCM');
  const [entityName, setEntityName] = useState('Asha Critical Care & Nursing Home');
  const [mobile, setMobile] = useState('+91 98205 99312');

  if (!showUnknownEntityModal) return null;

  const handleRegister = () => {
    if (!name || !entityName || !mobile) return;
    registerNewEntity(name, title, entityName, mobile, 'HOSPITAL');
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add" size={20} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Unregistered Healthcare Entity</Text>
              <Text style={styles.subtitle}>Mumbai Central Data Lake Verification</Text>
            </View>
            <TouchableOpacity onPress={() => setShowUnknownEntityModal(false)}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Voice Prompt Box */}
          <View style={styles.speechBox}>
            <Ionicons name="mic-circle" size={24} color="#f59e0b" />
            <Text style={styles.speechText}>
              "We don't seem to have you on our database. Please share your name, title, hospital and mobile no or WhatsApp business account for us to do your search better."
            </Text>
          </View>

          {/* Extracted / Input Fields */}
          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Your Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Dr. Rajesh Mehta"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Designation / Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Procurement Lead / Owner"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Hospital / Entity Name (Mumbai)</Text>
              <TextInput
                style={styles.input}
                value={entityName}
                onChangeText={setEntityName}
                placeholder="e.g. Asha Nursing Home, Borivali"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mobile / WhatsApp Business Number</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="+91 98XXX XXXXX"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity onPress={handleRegister} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Verify & Add to Mumbai Data Lake</Text>
            <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
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
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    width: '100%',
    maxWidth: 520,
    padding: 20,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.25,
    shadowRadius: 20
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
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
  speechBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 12,
    marginBottom: 14,
    alignItems: 'center'
  },
  speechText: {
    flex: 1,
    color: '#fde68a',
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic'
  },
  fields: {
    gap: 10,
    marginBottom: 16
  },
  fieldGroup: {},
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    outlineStyle: 'none'
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 10
  },
  submitBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800'
  }
});
