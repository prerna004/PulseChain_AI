// Data Permissions & Ingestion Modal (WhatsApp Business & Excel Sheet Connectors)
// Explicit requirement: Hospital/Stockist/Manufacturer permissions to WhatsApp & Excel

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function PermissionsModal() {
  const { showPermissionsModal, setShowPermissionsModal, currentRole } = useApp();

  const [whatsappGranted, setWhatsappGranted] = useState(true);
  const [excelGranted, setExcelGranted] = useState(true);
  const [uploadedFile, setUploadedFile] = useState('Lilavati_CSSD_Inventory_Nov2026.xlsx');

  if (!showPermissionsModal) return null;

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="key" size={20} color="#38bdf8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Data Connectors & System Permissions</Text>
              <Text style={styles.subtitle}>
                Configured for {currentRole} Persona • Zero-Form AI Data Sync
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowPermissionsModal(false)}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* Permission 1: WhatsApp Business Account */}
            <View style={styles.connectorCard}>
              <View style={styles.connectorHeader}>
                <View style={styles.connectorLeft}>
                  <View style={[styles.appIconWrap, { backgroundColor: '#25D366' }]}>
                    <FontAwesome5 name="whatsapp" size={18} color="#ffffff" />
                  </View>
                  <View>
                    <Text style={styles.connectorName}>WhatsApp Business API Connector</Text>
                    <Text style={styles.connectorDesc}>
                      {currentRole === 'HOSPITAL' && 'Syncs procurement voice notes & chat orders from Head of Stores'}
                      {currentRole === 'STOCKIST' && 'Ingests hospital demand queries & POs directly from Dadar/Dawa Bazar chats'}
                      {currentRole === 'MANUFACTURER' && 'Connects C&F dispatch dispatch notes & distributor allocations'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setWhatsappGranted(!whatsappGranted)}
                  style={[styles.toggleBtn, whatsappGranted && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleBtnText, whatsappGranted && styles.toggleBtnTextActive]}>
                    {whatsappGranted ? 'GRANTED' : 'REVOKED'}
                  </Text>
                </TouchableOpacity>
              </View>

              {whatsappGranted && (
                <View style={styles.previewBox}>
                  <Text style={styles.previewTitle}>Live WhatsApp Stream Telemetry:</Text>
                  <Text style={styles.previewSnippet}>
                    • 18:04: [Lilavati Stores] "Please send 50 boxes 7.5 gloves by 8 PM" ➔ Parsed to SKU-GLV-75
                  </Text>
                  <Text style={styles.previewSnippet}>
                    • 18:11: [Entero Stockist] "Dispatched via Western Express Highway" ➔ In-Transit
                  </Text>
                </View>
              )}
            </View>

            {/* Permission 2: Excel / ERP Sheet Ingestion */}
            <View style={styles.connectorCard}>
              <View style={styles.connectorHeader}>
                <View style={styles.connectorLeft}>
                  <View style={[styles.appIconWrap, { backgroundColor: '#107C41' }]}>
                    <FontAwesome5 name="file-excel" size={18} color="#ffffff" />
                  </View>
                  <View>
                    <Text style={styles.connectorName}>Excel / ERP Inventory Sheet Feed</Text>
                    <Text style={styles.connectorDesc}>
                      {currentRole === 'HOSPITAL' && 'Auto-reads CSSD / OT Excel sheet & updates hospital safety stocks'}
                      {currentRole === 'STOCKIST' && 'Reads distributor warehouse stock availability & batch expirations'}
                      {currentRole === 'MANUFACTURER' && 'Imports factory production output & Bhiwandi C&F depot allocations'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setExcelGranted(!excelGranted)}
                  style={[styles.toggleBtn, excelGranted && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleBtnText, excelGranted && styles.toggleBtnTextActive]}>
                    {excelGranted ? 'SYNCED' : 'PAUSED'}
                  </Text>
                </TouchableOpacity>
              </View>

              {excelGranted && (
                <View style={styles.previewBox}>
                  <View style={styles.fileRow}>
                    <Ionicons name="document-attach" size={16} color="#34d399" />
                    <Text style={styles.fileName}>{uploadedFile}</Text>
                    <Text style={styles.fileSize}>(48 KB • Auto-Synced)</Text>
                  </View>
                  <Text style={styles.previewSnippet}>
                    ✓ 9 Medical SKUs mapped • 4 Wards indexed • Reorder Points locked
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity onPress={() => setShowPermissionsModal(false)} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Close & Return to Dashboard</Text>
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
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    width: '100%',
    maxWidth: 620,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 10
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
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
  scroll: {
    maxHeight: 400
  },
  connectorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  connectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  connectorLeft: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    paddingRight: 10
  },
  appIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  connectorName: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700'
  },
  connectorDesc: {
    color: '#94a3b8',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2
  },
  toggleBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  toggleBtnActive: {
    backgroundColor: '#10b981'
  },
  toggleBtnText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800'
  },
  toggleBtnTextActive: {
    color: '#ffffff'
  },
  previewBox: {
    backgroundColor: '#090d16',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  previewTitle: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },
  previewSnippet: {
    color: '#cbd5e1',
    fontSize: 10,
    lineHeight: 15
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  fileName: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700'
  },
  fileSize: {
    color: '#64748b',
    fontSize: 10
  },
  doneBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  }
});
