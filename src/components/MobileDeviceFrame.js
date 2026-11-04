// Ultra-Simple Synced Mobile Companion View
// Giant WhatsApp green voice mic, easy 1-tap quick buttons, bilingual support

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import { aiEngine } from '../ai/agentEngine';

export default function MobileDeviceFrame({ isStandalone = false }) {
  const {
    currentRole,
    selectedHospital,
    orders,
    consumeWardItem,
    handleVoiceOrTextInput,
    isListening,
    setIsListening
  } = useApp();

  const [mobileInput, setMobileInput] = useState('');
  const [activeTab, setActiveTab] = useState('REQUISITION'); // 'REQUISITION' | 'CHAT' | 'TRACK'

  const activeOrder = orders[0];

  const handleMobileVoice = () => {
    if (isListening) {
      setIsListening(false);
      if (aiEngine.speechRecognition) aiEngine.speechRecognition.stop();
    } else {
      setIsListening(true);
      if (aiEngine.speechRecognition) {
        aiEngine.speechRecognition.start();
        aiEngine.speechRecognition.onresult = (event) => {
          const spoken = event.results[0][0].transcript;
          setIsListening(false);
          handleVoiceOrTextInput(spoken);
        };
      } else {
        setTimeout(() => {
          const testSpoken = 'Order 100 boxes of 7.5 surgical gloves urgently';
          setIsListening(false);
          handleVoiceOrTextInput(testSpoken);
        }, 1200);
      }
    }
  };

  const handleMobileSend = () => {
    if (!mobileInput.trim()) return;
    handleVoiceOrTextInput(mobileInput.trim());
    setMobileInput('');
  };

  const content = (
    <View style={styles.phoneScreen}>
      {/* iOS Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>18:15</Text>
        <View style={styles.dynamicIsland}>
          <View style={styles.islandDot} />
        </View>
        <View style={styles.statusIcons}>
          <Ionicons name="cellular" size={12} color="#0f172a" />
          <Ionicons name="wifi" size={12} color="#0f172a" />
          <Ionicons name="battery-full" size={14} color="#0f172a" />
        </View>
      </View>

      {/* App Top Bar */}
      <View style={styles.appTopBar}>
        <View style={styles.appTitleWrap}>
          <Ionicons name="medical" size={18} color="#0284c7" />
          <Text style={styles.appTitle}>PulseChain Mobile</Text>
        </View>
        <View style={styles.roleBadgeMobile}>
          <Text style={styles.roleBadgeTextMobile}>{currentRole}</Text>
        </View>
      </View>

      {/* Sync Status Banner */}
      <View style={styles.syncBanner}>
        <View style={styles.syncDot} />
        <Text style={styles.syncText}>SYNCED WITH DESKTOP SCREEN (0.02s)</Text>
      </View>

      {/* Mobile Tab Selector */}
      <View style={styles.mobileTabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('REQUISITION')}
          style={[styles.mTab, activeTab === 'REQUISITION' && styles.mTabActive]}
        >
          <Ionicons name="mic" size={16} color={activeTab === 'REQUISITION' ? '#0284c7' : '#64748b'} />
          <Text style={[styles.mTabText, activeTab === 'REQUISITION' && styles.mTabTextActive]}>Voice Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('TRACK')}
          style={[styles.mTab, activeTab === 'TRACK' && styles.mTabActive]}
        >
          <Ionicons name="navigate" size={16} color={activeTab === 'TRACK' ? '#0284c7' : '#64748b'} />
          <Text style={[styles.mTabText, activeTab === 'TRACK' && styles.mTabTextActive]}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('CHAT')}
          style={[styles.mTab, activeTab === 'CHAT' && styles.mTabActive]}
        >
          <Ionicons name="logo-whatsapp" size={16} color={activeTab === 'CHAT' ? '#16a34a' : '#64748b'} />
          <Text style={[styles.mTabText, activeTab === 'CHAT' && styles.mTabTextActive]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Voice Requisition (Senior Staff Friendly) */}
      {activeTab === 'REQUISITION' && (
        <ScrollView style={styles.mobileBody} showsVerticalScrollIndicator={false}>
          {/* Hospital Name Box */}
          <View style={styles.entityCardMobile}>
            <Text style={styles.entityNameMobile}>{selectedHospital.name}</Text>
            <Text style={styles.entitySubMobile}>OT Stores & ICU Supply Portal</Text>
          </View>

          {/* Big Green Mic Centerpiece */}
          <View style={styles.voiceHeroBox}>
            <TouchableOpacity
              onPress={handleMobileVoice}
              style={[styles.bigMicBtn, isListening && styles.bigMicBtnListening]}
            >
              <Ionicons name={isListening ? 'mic' : 'mic'} size={36} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.voiceHeroText}>
              {isListening ? 'Listening... बोलिए' : 'Tap & Speak to Order (बोलें)'}
            </Text>
            <Text style={styles.voiceHeroSub}>No form filling • Say item and quantity</Text>
          </View>

          {/* Quick Ward Consumption Tap */}
          <Text style={styles.quickSectionTitle}>Used in Ward? (वार्ड में इस्तेमाल किया?):</Text>
          <View style={styles.quickConsumeRow}>
            <TouchableOpacity
              onPress={() => consumeWardItem('SKU-GLV-75', 10, 'OT 1')}
              style={styles.quickConsumeChip}
            >
              <Text style={styles.quickConsumeText}>-10 Gloves</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => consumeWardItem('SKU-CAN-20G', 10, 'ICU Ward')}
              style={styles.quickConsumeChip}
            >
              <Text style={styles.quickConsumeText}>-10 Cannulas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => consumeWardItem('SKU-SYR-5ML', 5, 'Emergency')}
              style={styles.quickConsumeChip}
            >
              <Text style={styles.quickConsumeText}>-5 Syringes</Text>
            </TouchableOpacity>
          </View>

          {/* 1-Tap Presets */}
          <Text style={styles.quickSectionTitle}>1-Tap Quick Voice Orders:</Text>
          <TouchableOpacity
            onPress={() => handleVoiceOrTextInput('Order 100 boxes of 7.5 sterile surgical gloves for Lilavati ICU urgently')}
            style={styles.mobilePresetCard}
          >
            <Ionicons name="flash" size={16} color="#d97706" />
            <Text style={styles.mobilePresetText}>"Order 100 boxes 7.5 gloves urgently"</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleVoiceOrTextInput('get me the best prices for gloves across Mumbai stockists')}
            style={styles.mobilePresetCard}
          >
            <Ionicons name="radio" size={16} color="#0284c7" />
            <Text style={styles.mobilePresetText}>"Find Best Price for Gloves" (Uber Ping)</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Tab 2: Live Tracking */}
      {activeTab === 'TRACK' && (
        <ScrollView style={styles.mobileBody} showsVerticalScrollIndicator={false}>
          {activeOrder ? (
            <View style={styles.trackingCardMobile}>
              <View style={styles.trackTop}>
                <Text style={styles.trackId}>{activeOrder.orderId}</Text>
                <View style={styles.trackBadge}>
                  <Text style={styles.trackBadgeText}>{activeOrder.deliveryStatus}</Text>
                </View>
              </View>

              <Text style={styles.trackItems}>
                {activeOrder.items.map(i => `${i.qty} ${i.unit} ${i.name}`).join(', ')}
              </Text>

              {/* Goods Mini */}
              <View style={styles.pipeMiniGoods}>
                <Text style={styles.pipeMiniTitle}>🚚 GOODS STATUS:</Text>
                <Text style={styles.pipeMiniDetail}>{activeOrder.currentLocation}</Text>
                <Text style={styles.pipeMiniSub}>Delivery: {activeOrder.deliveredBy}</Text>
              </View>

              {/* Payment Mini */}
              <View style={styles.pipeMiniPayment}>
                <Text style={styles.pipeMiniTitlePayment}>💵 PAYMENT STATUS:</Text>
                <Text style={styles.pipeMiniDetail}>₹{activeOrder.totalAmount.toLocaleString('en-IN')}</Text>
                <Text style={styles.pipeMiniSub}>Due: {activeOrder.paymentDueBy}</Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 30 }}>No active order</Text>
          )}
        </ScrollView>
      )}

      {/* Tab 3: WhatsApp Simulator */}
      {activeTab === 'CHAT' && (
        <View style={styles.chatContainer}>
          <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
            <View style={styles.bubbleIncoming}>
              <Text style={styles.bubbleSender}>Entero Healthcare (Dadar Stockist)</Text>
              <Text style={styles.bubbleText}>
                Namaste Doctor. We have received your requisition for 60 boxes 7.5 gloves. Dispatched via WEH.
              </Text>
              <Text style={styles.bubbleTime}>18:12</Text>
            </View>

            <View style={styles.bubbleOutgoing}>
              <Text style={styles.bubbleText}>
                Please ensure cold-chain packing for Noradrenaline ampoules as well.
              </Text>
              <Text style={styles.bubbleTime}>18:14</Text>
            </View>

            <View style={styles.bubbleIncoming}>
              <Text style={styles.bubbleSender}>PulseChain AI Bot</Text>
              <Text style={styles.bubbleText}>
                ✓ Requisition ORD-MUM-8921 verified. Payment locked in Escrow.
              </Text>
              <Text style={styles.bubbleTime}>18:15</Text>
            </View>
          </ScrollView>

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type message or order..."
              placeholderTextColor="#94a3b8"
              value={mobileInput}
              onChangeText={setMobileInput}
              onSubmitEditing={handleMobileSend}
            />
            <TouchableOpacity onPress={handleMobileSend} style={styles.chatSendBtn}>
              <Ionicons name="send" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Bar Indicator */}
      <View style={styles.homeIndicatorBar}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );

  if (isStandalone) {
    return <View style={styles.standaloneWrapper}>{content}</View>;
  }

  return (
    <View style={styles.frameWrapper}>
      <View style={styles.phoneChassis}>
        <View style={styles.innerBezel}>{content}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  phoneChassis: {
    width: 340,
    height: 680,
    backgroundColor: '#0f172a',
    borderRadius: 44,
    padding: 10,
    borderWidth: 3,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20
  },
  innerBezel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 36,
    overflow: 'hidden'
  },
  standaloneWrapper: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  phoneScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4
  },
  statusTime: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700'
  },
  dynamicIsland: {
    width: 80,
    height: 20,
    backgroundColor: '#000000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  islandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a'
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  appTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  appTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  appTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800'
  },
  roleBadgeMobile: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  roleBadgeTextMobile: {
    color: '#0284c7',
    fontSize: 9,
    fontWeight: '800'
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7'
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a'
  },
  syncText: {
    color: '#16a34a',
    fontSize: 9,
    fontWeight: '800'
  },
  mobileTabs: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  mTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 8
  },
  mTabActive: {
    backgroundColor: '#e0f2fe'
  },
  mTabText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700'
  },
  mTabTextActive: {
    color: '#0284c7'
  },
  mobileBody: {
    flex: 1,
    padding: 12
  },
  entityCardMobile: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  entityNameMobile: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800'
  },
  entitySubMobile: {
    color: '#64748b',
    fontSize: 11
  },
  voiceHeroBox: {
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#bbf7d0'
  },
  bigMicBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#16a34a',
    shadowOpacity: 0.35,
    shadowRadius: 10
  },
  bigMicBtnListening: {
    backgroundColor: '#dc2626'
  },
  voiceHeroText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800'
  },
  voiceHeroSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2
  },
  quickSectionTitle: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6
  },
  quickConsumeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  quickConsumeChip: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0'
  },
  quickConsumeText: {
    color: '#0284c7',
    fontSize: 11,
    fontWeight: '700'
  },
  mobilePresetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  mobilePresetText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600'
  },
  trackingCardMobile: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  trackTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  trackId: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '800'
  },
  trackBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  trackBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800'
  },
  trackItems: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10
  },
  pipeMiniGoods: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  pipeMiniTitle: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2
  },
  pipeMiniPayment: {
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fde68a'
  },
  pipeMiniTitlePayment: {
    color: '#92400e',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2
  },
  pipeMiniDetail: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800'
  },
  pipeMiniSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  chatMessages: {
    flex: 1
  },
  bubbleIncoming: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderTopLeftRadius: 2,
    padding: 10,
    marginBottom: 8,
    maxWidth: '85%',
    alignSelf: 'flex-start'
  },
  bubbleSender: {
    color: '#0284c7',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2
  },
  bubbleOutgoing: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    borderTopRightRadius: 2,
    padding: 10,
    marginBottom: 8,
    maxWidth: '85%',
    alignSelf: 'flex-end'
  },
  bubbleText: {
    color: '#0f172a',
    fontSize: 12,
    lineHeight: 16
  },
  bubbleTime: {
    color: '#94a3b8',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#0f172a',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    outlineStyle: 'none'
  },
  chatSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeIndicatorBar: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeIndicator: {
    width: 90,
    height: 3,
    backgroundColor: '#cbd5e1',
    borderRadius: 2
  }
});
