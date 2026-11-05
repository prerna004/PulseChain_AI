// WhatsAppImportModal — Simulated WhatsApp Business Message Import
// Paste any WA conversation → AI extracts order intent → Auto-fills order (no manual entry)

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import { aiEngine } from '../ai/agentEngine';

const DEMO_CONVERSATIONS = [
  {
    label: 'Procure Manager → Stockist (Gloves)',
    text: `[09:15 AM] Dr. Priya Rao: Hello Rajesh bhai, urgent hai!\n[09:15 AM] Dr. Priya Rao: We need 60 boxes sterile latex gloves size 7.5 before 1pm today\n[09:16 AM] Rajesh Shah: Yes doctor ji, Entero ke paas stock hai\n[09:16 AM] Rajesh Shah: ₹790 per box, delivery in 45 mins from Dadar\n[09:17 AM] Dr. Priya Rao: Please send. OT has 2 cardiac surgeries at 2pm`
  },
  {
    label: 'Ward Sister → Pharmacist (Syringes)',
    text: `[11:30 AM] Sister Meena: Bhai IV ward mein Dispovan 5ml khatam ho raha hai\n[11:31 AM] Sister Meena: Please 20 cartons order karo jaldi\n[11:31 AM] Suresh Pharmacist: OK sister, emergency order deta hoon abhi\n[11:32 AM] Sister Meena: ICU mein bhi chahiye, 5 cartons extra`
  },
  {
    label: 'KEM Hospital → Stockist (N95 Masks)',
    text: `[02:00 PM] KEM Procurement: We need 100 boxes of 3M 1860 N95 masks urgently\n[02:01 PM] KEM Procurement: Infection control committee approved requisition\n[02:02 PM] Ketan Parekh: Princess Street warehouse mein available hai\n[02:02 PM] Ketan Parekh: ₹1180/box, cash/15days credit, delivery 90 mins`
  }
];

export default function WhatsAppImportModal() {
  const { showWhatsAppModal, setShowWhatsAppModal, handleVoiceOrTextInput, addTelemetryLog } = useApp();

  const [inputText, setInputText] = useState('');
  const [extractedOrder, setExtractedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processConversation = (text) => {
    setIsProcessing(true);
    setExtractedOrder(null);

    setTimeout(() => {
      const lines = text.split('\n').map(l => l.replace(/\[\d+:\d+ [AP]M\]\s*\w[\w\s]*:\s*/i, '').trim()).join(' ');
      const result = aiEngine.parseVoiceOrText(lines);

      const extracted = {
        rawConverstation: text,
        intent: result.intent,
        entities: result.entities || null,
        sku: result.sku || (result.entities && result.entities.sku) || null,
        speechReply: result.speechReply,
        suggestedAction: result.intent === 'UNKNOWN_ENTITY' ? 'ONBOARD' : 'CREATE_ORDER',
      };

      // Supplement extraction by scanning the raw text
      const lower = text.toLowerCase();
      if (!extracted.sku) {
        if (lower.includes('glove')) extracted.sku = { name: 'Sterile Latex Gloves 7.5', unit: 'Boxes', stockistPrice: 790 };
        else if (lower.includes('dispovan') || lower.includes('syringe')) extracted.sku = { name: 'Dispovan 5ml Syringes', unit: 'Cartons', stockistPrice: 2450 };
        else if (lower.includes('n95') || lower.includes('mask')) extracted.sku = { name: '3M 1860 N95 Respirators', unit: 'Boxes', stockistPrice: 1180 };
        else if (lower.includes('cannula')) extracted.sku = { name: 'Polymed IV Cannula 20G', unit: 'Boxes', stockistPrice: 1650 };
      }

      // Extract quantity from text
      const numMatch = text.match(/(\d+)\s*(boxes|cartons|packs|units|box|carton)/i);
      if (numMatch) extracted.quantity = parseInt(numMatch[1]);
      else extracted.quantity = 50;

      // Extract urgency
      if (lower.includes('urgent') || lower.includes('jaldi') || lower.includes('surgery')) {
        extracted.urgency = 'CRITICAL_EMERGENCY';
      } else {
        extracted.urgency = 'STANDARD';
      }

      // Extract contact name
      const contactMatch = text.match(/\[[\d:]+\s*[AP]M\]\s*([\w\s.]+):/);
      extracted.fromContact = contactMatch ? contactMatch[1].trim() : 'Unknown Contact';

      setExtractedOrder(extracted);
      setIsProcessing(false);
    }, 1200);
  };

  const confirmOrder = () => {
    if (!extractedOrder?.sku) return;
    const orderText = `Order ${extractedOrder.quantity} ${extractedOrder.sku.unit} of ${extractedOrder.sku.name}`;
    handleVoiceOrTextInput(orderText);
    addTelemetryLog('WhatsApp Import', 'WHATSAPP_ORDER_EXTRACTED', `Auto-extracted from WA: ${orderText}`);
    setShowWhatsAppModal(false);
    setInputText('');
    setExtractedOrder(null);
  };

  return (
    <Modal visible={showWhatsAppModal} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.waIcon}>
                <Ionicons name="logo-whatsapp" size={22} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.sheetTitle}>WhatsApp Import</Text>
                <Text style={styles.sheetSub}>Paste WA conversation → AI auto-creates order</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => { setShowWhatsAppModal(false); setExtractedOrder(null); setInputText(''); }} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Demo Buttons */}
            <Text style={styles.sectionLabel}>Try a sample conversation:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.demoRow}>
              {DEMO_CONVERSATIONS.map((d, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setInputText(d.text); setExtractedOrder(null); }}
                  style={styles.demoChip}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={12} color="#16a34a" />
                  <Text style={styles.demoChipText}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Paste Area */}
            <Text style={styles.sectionLabel}>Paste your WhatsApp conversation:</Text>
            <TextInput
              style={styles.conversationInput}
              multiline
              numberOfLines={8}
              placeholder={"Paste WhatsApp chat here...\n\nExample:\n[09:15 AM] Dr. Priya Rao: We need 60 boxes gloves 7.5 urgent\n[09:16 AM] Rajesh: Stock available, ₹790 per box"}
              value={inputText}
              onChangeText={(t) => { setInputText(t); setExtractedOrder(null); }}
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={() => processConversation(inputText)}
              style={[styles.processBtn, !inputText.trim() && styles.processBtnDisabled]}
              disabled={!inputText.trim() || isProcessing}
            >
              {isProcessing ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Ionicons name="sparkles" size={18} color="#fff" />
                  <Text style={styles.processBtnText}>Extract Order with AI</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Extracted Order Preview */}
            {extractedOrder && (
              <View style={styles.extractedCard}>
                <View style={styles.extractedHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                  <Text style={styles.extractedTitle}>AI Extracted — Ready to Order</Text>
                </View>
                <Text style={styles.extractedNote}>No manual entry needed. All fields filled from your conversation:</Text>

                <View style={styles.extractedGrid}>
                  {extractedOrder.sku && (
                    <View style={styles.extractedRow}>
                      <Text style={styles.extractedKey}>📦 Item</Text>
                      <Text style={styles.extractedVal}>{extractedOrder.sku.name}</Text>
                    </View>
                  )}
                  <View style={styles.extractedRow}>
                    <Text style={styles.extractedKey}>🔢 Quantity</Text>
                    <Text style={styles.extractedVal}>{extractedOrder.quantity} {extractedOrder.sku?.unit || 'units'}</Text>
                  </View>
                  {extractedOrder.sku?.stockistPrice && (
                    <View style={styles.extractedRow}>
                      <Text style={styles.extractedKey}>💰 Est. Rate</Text>
                      <Text style={styles.extractedVal}>₹{extractedOrder.sku.stockistPrice}/unit</Text>
                    </View>
                  )}
                  <View style={styles.extractedRow}>
                    <Text style={styles.extractedKey}>⚡ Urgency</Text>
                    <Text style={[styles.extractedVal, extractedOrder.urgency === 'CRITICAL_EMERGENCY' && styles.urgentText]}>
                      {extractedOrder.urgency === 'CRITICAL_EMERGENCY' ? '🔴 URGENT' : 'Standard'}
                    </Text>
                  </View>
                  <View style={styles.extractedRow}>
                    <Text style={styles.extractedKey}>👤 From</Text>
                    <Text style={styles.extractedVal}>{extractedOrder.fromContact}</Text>
                  </View>
                </View>

                <View style={styles.extractedActions}>
                  <TouchableOpacity onPress={confirmOrder} style={styles.confirmOrderBtn}>
                    <Ionicons name="radio" size={16} color="#fff" />
                    <Text style={styles.confirmOrderBtnText}>Confirm & Ping Stockists</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setExtractedOrder(null)} style={styles.cancelExtractBtn}>
                    <Text style={styles.cancelExtractBtnText}>Re-extract</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', paddingBottom: 24 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  waIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 17, fontWeight: '900', color: '#0f172a' },
  sheetSub: { fontSize: 11, color: '#64748b' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 18 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  demoRow: { marginBottom: 18 },
  demoChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  demoChipText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  conversationInput: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 16, padding: 14, fontSize: 13, color: '#0f172a', backgroundColor: '#f8fafc', minHeight: 160, marginBottom: 14, fontFamily: 'monospace' },
  processBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', paddingVertical: 14, borderRadius: 14, marginBottom: 18 },
  processBtnDisabled: { backgroundColor: '#94a3b8' },
  processBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  extractedCard: { backgroundColor: '#f0fdf4', borderRadius: 18, borderWidth: 1.5, borderColor: '#bbf7d0', padding: 16, marginBottom: 20 },
  extractedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  extractedTitle: { fontSize: 15, fontWeight: '800', color: '#166534' },
  extractedNote: { fontSize: 12, color: '#166534', marginBottom: 14, lineHeight: 18 },
  extractedGrid: { gap: 8, marginBottom: 16 },
  extractedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  extractedKey: { fontSize: 12, color: '#64748b', fontWeight: '700' },
  extractedVal: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  urgentText: { color: '#dc2626' },
  extractedActions: { flexDirection: 'row', gap: 10 },
  confirmOrderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 12 },
  confirmOrderBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  cancelExtractBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  cancelExtractBtnText: { color: '#16a34a', fontSize: 13, fontWeight: '700' },
});
