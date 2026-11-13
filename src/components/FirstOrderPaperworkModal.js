// First Order Paperwork & Distributor Introduction Modal
// Shown ONLY on the very first order placed by a newly registered hospital.
// From the 2nd order onwards this is skipped : direct order placement.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function FirstOrderPaperworkModal({ onComplete, onCancel, selectedQuote, orderItem: _orderItem }) {
  const { loggedInHospital, addTelemetryLog } = useApp();
  const [step, setStep] = useState(1); // 1 = intro, 2 = documents, 3 = distributor, 4 = done
  const [gstNumber, setGstNumber] = useState('27AABCL1234F1Z9');
  const [regNumber, setRegNumber] = useState('MH/MUM/HOSP/2026/89');
  const [panNumber, setPanNumber] = useState('AABCL1234F');
  const [agreed, setAgreed] = useState(true);

  const hospitalName = loggedInHospital?.name || 'Your Hospital';

  const handleComplete = () => {
    if (!agreed) return;
    addTelemetryLog(
      hospitalName,
      'FIRST_ORDER_KYC_DONE',
      `First-order paperwork completed. Distributor: ${selectedQuote?.stockistName}`
    );
    if (onComplete) onComplete();
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconWrap}>
              <FontAwesome5 name="file-signature" size={20} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>First Order : Verification Required</Text>
              <Text style={styles.headerSub}>
                Step {step} of 3 • One-time process • Direct ordering from 2nd order
              </Text>
            </View>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Step progress bar */}
          <View style={styles.progressBar}>
            {[1, 2, 3].map(s => (
              <View key={s} style={styles.progressStep}>
                <View style={[styles.progressDot, step >= s && styles.progressDotActive]}>
                  <Text style={[styles.progressDotNum, step >= s && styles.progressDotNumActive]}>
                    {step > s ? '✓' : s}
                  </Text>
                </View>
                <Text style={[styles.progressLabel, step >= s && styles.progressLabelActive]}>
                  {s === 1 ? 'Overview' : s === 2 ? 'Documents' : 'Distributor'}
                </Text>
                {s < 3 && <View style={[styles.progressLine, step > s && styles.progressLineActive]} />}
              </View>
            ))}
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

            {/* STEP 1: Why this is needed */}
            {step === 1 && (
              <View>
                <View style={styles.yellowNotice}>
                  <Ionicons name="information-circle" size={22} color="#f59e0b" />
                  <Text style={styles.yellowNoticeText}>
                    As this is your <Text style={{ fontWeight: '900' }}>first order</Text> on PulseChain,
                    your distributor needs to verify your hospital credentials and sign a credit agreement.
                    This is a one-time step : from your 2nd order, you can order directly instantly.
                  </Text>
                </View>

                <Text style={styles.stepTitle}>What happens in this process?</Text>

                {[
                  {
                    icon: 'id-card',
                    title: 'Hospital Document Verification',
                    desc: 'GST Number, Drug License, and Hospital Registration will be recorded'
                  },
                  {
                    icon: 'handshake',
                    title: 'Distributor Introduction',
                    desc: `Meet ${selectedQuote?.stockistName || 'your assigned distributor'} : they will be your primary supplier`
                  },
                  {
                    icon: 'file-contract',
                    title: 'Credit Agreement Signing',
                    desc: 'Sign the credit terms (30 to 60 day payment window) to unlock escrow ordering'
                  },
                  {
                    icon: 'rocket',
                    title: 'Unlock Direct Ordering',
                    desc: 'All future orders go directly : no more paperwork, ever!'
                  }
                ].map((item, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepItemIcon}>
                      <FontAwesome5 name={item.icon} size={16} color="#f59e0b" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepItemTitle}>{item.title}</Text>
                      <Text style={styles.stepItemDesc}>{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* STEP 2: Document collection */}
            {step === 2 && (
              <View>
                <Text style={styles.stepTitle}>Hospital Credential Documents</Text>
                <Text style={styles.stepSubtitle}>
                  These details are required by the distributor for credit approval.
                  They will be stored securely in the Mumbai Central Data Lake.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>GST Number (Maharashtra) *</Text>
                  <TextInput
                    style={styles.input}
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    placeholderTextColor="#64748b"
                    autoCapitalize="characters"
                  />
                  <Text style={styles.fieldHint}>Maharashtra GST starts with 27</Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Hospital Registration / PCPNDT No.</Text>
                  <TextInput
                    style={styles.input}
                    value={regNumber}
                    onChangeText={setRegNumber}
                    placeholder="e.g. MH/MUM/2019/0234"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>PAN Number (for TDS / Credit) *</Text>
                  <TextInput
                    style={styles.input}
                    value={panNumber}
                    onChangeText={setPanNumber}
                    placeholder="e.g. AAAAA0000A"
                    placeholderTextColor="#64748b"
                    autoCapitalize="characters"
                    maxLength={10}
                  />
                </View>

                <View style={styles.docUploadBox}>
                  <FontAwesome5 name="cloud-upload-alt" size={20} color="#0284c7" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docUploadTitle}>
                      Drug License Copy (Scanned / Photo)
                    </Text>
                    <Text style={styles.docUploadSub}>
                      WhatsApp your drug license to: +91 98200 11223 (Distributor Verified Line)
                    </Text>
                  </View>
                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingPillText}>Via WhatsApp</Text>
                  </View>
                </View>
              </View>
            )}

            {/* STEP 3: Distributor intro */}
            {step === 3 && (
              <View>
                <Text style={styles.stepTitle}>Your Assigned Distributor</Text>
                <Text style={styles.stepSubtitle}>
                  This distributor will be your primary supplier on PulseChain. Review their details below.
                </Text>

                {selectedQuote && (
                  <View style={styles.distributorCard}>
                    <View style={styles.distributorHeader}>
                      <View style={styles.distributorIconWrap}>
                        <FontAwesome5 name="truck" size={20} color="#d97706" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.distributorName}>{selectedQuote.stockistName}</Text>
                        <Text style={styles.distributorHub}>{selectedQuote.hub}</Text>
                      </View>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#f59e0b" />
                        <Text style={styles.ratingText}>{selectedQuote.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.distributorDetailRow}>
                      <Ionicons name="location" size={14} color="#64748b" />
                      <Text style={styles.distributorDetail}>Distance: {selectedQuote.distanceKm} km from your hospital</Text>
                    </View>
                    <View style={styles.distributorDetailRow}>
                      <Ionicons name="time" size={14} color="#64748b" />
                      <Text style={styles.distributorDetail}>Delivery ETA: {selectedQuote.etaMinutes} mins express</Text>
                    </View>
                    <View style={styles.distributorDetailRow}>
                      <Ionicons name="card" size={14} color="#64748b" />
                      <Text style={styles.distributorDetail}>Credit Terms: {selectedQuote.creditTerms}</Text>
                    </View>
                    <View style={styles.distributorDetailRow}>
                      <Ionicons name="cash" size={14} color="#16a34a" />
                      <Text style={[styles.distributorDetail, { color: '#16a34a', fontWeight: '700' }]}>
                        This Order Total: ₹{selectedQuote.totalAmount?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.agreementBox}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setAgreed(!agreed)}
                  >
                    <View style={[styles.checkboxSquare, agreed && styles.checkboxSquareChecked]}>
                      {agreed && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                    </View>
                    <Text style={styles.checkboxText}>
                      I confirm that the hospital details and documents provided are accurate.
                      I agree to the standard credit terms (30 to 60 day escrow payment) for PulseChain procurement.
                      I understand that <Text style={{ fontWeight: '800' }}>from my 2nd order, I can place orders directly</Text> without any verification.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity
                onPress={() => setStep(step - 1)}
                style={styles.prevBtn}
              >
                <Ionicons name="arrow-back" size={16} color="#64748b" />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity
                onPress={() => setStep(step + 1)}
                style={styles.nextBtn}
              >
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleComplete}
                style={[styles.nextBtn, !agreed && styles.nextBtnDisabled]}
                disabled={!agreed}
              >
                <FontAwesome5 name="check-circle" size={16} color="#ffffff" />
                <Text style={styles.nextBtnText}>Complete & Place Order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,10,20,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245,158,11,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#0a111e',
    gap: 0,
  },
  progressStep: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  progressDotNum: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
  },
  progressDotNumActive: {
    color: '#000000',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  progressLabelActive: {
    color: '#f59e0b',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#1e293b',
    marginHorizontal: 6,
  },
  progressLineActive: {
    backgroundColor: '#f59e0b',
  },
  body: {
    padding: 18,
    maxHeight: 380,
  },
  yellowNotice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    padding: 14,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  yellowNoticeText: {
    flex: 1,
    color: '#fde68a',
    fontSize: 13,
    lineHeight: 20,
  },
  stepTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  stepSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245,158,11,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItemTitle: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  stepItemDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldHint: {
    color: '#475569',
    fontSize: 10,
    marginTop: 3,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    outlineStyle: 'none',
  },
  docUploadBox: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    padding: 14,
    marginTop: 4,
  },
  docUploadTitle: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '700',
  },
  docUploadSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  pendingPill: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pendingPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  distributorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#d97706',
    padding: 16,
    marginBottom: 16,
  },
  distributorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  distributorIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(217,119,6,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distributorName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  distributorHub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '800',
  },
  distributorDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  distributorDetail: {
    color: '#94a3b8',
    fontSize: 12,
  },
  agreementBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
  },
  checkbox: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxSquareChecked: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  checkboxText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#0a111e',
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  prevBtnText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },
  nextBtnDisabled: {
    backgroundColor: '#334155',
  },
  nextBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
});
