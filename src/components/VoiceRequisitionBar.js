// Ultra-Simple, Senior & Non-Technical Staff Friendly Voice Bar
// Giant WhatsApp-style voice mic, 1-tap quick order buttons, bilingual hints

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useApp } from '../store/stateManager';
import { aiEngine } from '../ai/agentEngine';
import SymbolIcon from './SymbolIcon';

export default function VoiceRequisitionBar() {
  const {
    currentRole,
    handleVoiceOrTextInput,
    lastAiMessage,
    isListening,
    setIsListening,
    isDarkMode,
    theme
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  const darkCfg = {
    HOSPITAL: { cardBorder: '#1e3a5f', cardBg: '#0c1a2e' },
    STOCKIST: { cardBorder: '#45260a', cardBg: '#1f1606' },
    MANUFACTURER: { cardBorder: '#144222', cardBg: '#071c10' },
  };

  // Role-specific config tailored to each persona
  const roleConfig = {
    HOSPITAL: {
      color: '#0284c7',
      cardBorder: '#bae6fd',
      cardBg: '#f0f9ff',
      micBg: '#0284c7',
      mainTitle: 'Hospital Requisition Mic / बोलकर मांग करें (OT/ICU)',
      subTitle: 'Say items, quantities & ward (e.g. "Order 200 boxes 7.5 gloves for OT Complex", "Get best prices for syringes")',
      placeholder: 'Or type here: e.g. 50 boxes gloves or 20 cartons syringes...',
      fallbackSpoken: 'Order 100 boxes of 7.5 surgical gloves urgently for Lilavati ICU',
      sectionLabel: '1-Tap Hospital Requisitions (अस्पताल के लिए तुरंत आर्डर):',
      quickItems: [
        {
          icon: 'bolt',
          name: 'Privileged Mic: 50 Dispovan (Entero)',
          hindi: 'फास्ट ट्रैक आर्डर',
          prompt: 'Order 50 boxes of Dispovan syringes from Entero'
        },
        {
          icon: 'radar',
          name: 'Find Best Price (Uber Ping)',
          hindi: 'सस्ता रेट ढूंढो',
          prompt: 'get me the best prices for gloves across Mumbai stockists'
        },
        {
          icon: 'cube',
          name: 'Inventory to Order Tomorrow',
          hindi: 'कल का आर्डर स्टॉक',
          prompt: 'show me the inventory that we need to order tomorrow'
        },
        {
          icon: 'gloves',
          name: 'Surgical Gloves 7.5',
          hindi: 'दस्ताने (OT)',
          prompt: 'Order 100 boxes of 7.5 sterile surgical gloves for OT urgently'
        },
        {
          icon: 'syringe',
          name: 'Dispovan 5ml Syringes',
          hindi: 'सिरिंज (ICU)',
          prompt: 'Send 20 cartons of HMD Dispovan 5ml syringes for ICU'
        },
        {
          icon: 'cannula',
          name: 'Polymed Cannula 20G',
          hindi: 'कैनुला (वार्ड)',
          prompt: 'Order 50 boxes of Polymed IV cannula 20G Pink'
        }
      ]
    },
    STOCKIST: {
      color: '#d97706',
      cardBorder: '#fde68a',
      cardBg: '#fffbeb',
      micBg: '#d97706',
      mainTitle: 'Distributor Command Mic / डिस्ट्रीब्यूटर वॉइस कंट्रोल',
      subTitle: 'Scan hospital demand, broadcast spot quotes, or restock in bulk from factory CFA depot',
      placeholder: 'Or type here: e.g. Show me which hospitals need our products, or Quote ₹790 for gloves...',
      fallbackSpoken: 'show me which hospitals need our products',
      sectionLabel: '1-Tap Distributor Actions (डिस्ट्रीब्यूटर त्वरित कार्य):',
      quickItems: [
        {
          icon: 'radar',
          name: 'Hospitals Needing Products',
          hindi: 'अस्पतालों की मांग स्कैन करें',
          prompt: 'show me which hospitals need our products'
        },
        {
          icon: 'paper-plane',
          name: 'Quote ₹790 Gloves to Lilavati',
          hindi: 'लीलावती को रेट भेजें',
          prompt: 'Quote ₹790 for gloves and ₹2450 for Dispovan to Lilavati'
        },
        {
          icon: 'paper-plane',
          name: 'Quote ₹1650 Cannula to Hinduja',
          hindi: 'हिंदुजा को कोटेशन भेजें',
          prompt: 'Quote ₹1650 for Polymed Cannula to Hinduja'
        },
        {
          icon: 'factory',
          name: 'Bulk Restock from Bhiwandi CFA',
          hindi: 'फैक्ट्री से माल मंगाएं',
          prompt: 'Reorder 10,000 units from Bhiwandi CFA factory depot'
        },
        {
          icon: 'truck',
          name: 'Track Dispatch Van #8921',
          hindi: 'डिलीवरी वैन ट्रैक करें',
          prompt: 'Track delivery van MH-02-EE-8921 to Lilavati dock'
        },
        {
          icon: 'cube',
          name: 'Check Dadar Warehouse Stock',
          hindi: 'गोदाम स्टॉक चेक करें',
          prompt: 'Show Dadar warehouse stock levels'
        }
      ]
    },
    MANUFACTURER: {
      color: '#16a34a',
      cardBorder: '#bbf7d0',
      cardBg: '#f0fdf4',
      micBg: '#16a34a',
      mainTitle: 'OEM Production & Oversight Mic / फैक्ट्री व डिस्ट्रीब्यूटर निगरानी',
      subTitle: 'Monitor distributor stock levels across Mumbai, allocate Bhiwandi C&F batches, and authorize dispatches',
      placeholder: 'Or type here: e.g. Show inventory of stockists/distributors, or Dispatch 50,000 Dispovan...',
      fallbackSpoken: 'Show inventory of stockists/distributors',
      sectionLabel: '1-Tap Manufacturer Actions (फैक्ट्री हेड त्वरित कार्य):',
      quickItems: [
        {
          icon: 'eye',
          name: 'Stockist Inventory Oversight',
          hindi: 'डिस्ट्रीब्यूटर का स्टॉक देखें',
          prompt: 'Show inventory of stockists/distributors'
        },
        {
          icon: 'alert-triangle',
          name: 'Check Low Stocks in Mumbai',
          hindi: 'कम स्टॉक वाले स्टॉकिस्ट',
          prompt: 'Which stockists are low on stock in Mumbai?'
        },
        {
          icon: 'truck',
          name: 'Dispatch 50k to Entero Dadar',
          hindi: 'दादर सीएंडएफ डिस्पैच',
          prompt: 'Dispatch 50,000 units of Dispovan via Bhiwandi C&F depot to Entero Healthcare'
        },
        {
          icon: 'truck',
          name: 'Dispatch 30k to Sagar Andheri',
          hindi: 'अंधेरी सीएंडएफ डिस्पैच',
          prompt: 'Dispatch 30,000 units of Polymed via Bhiwandi C&F depot to Sagar Medical'
        },
        {
          icon: 'factory',
          name: 'Bhiwandi C&F Buffer Status',
          hindi: 'सेंट्रल बफर स्टॉक जांचें',
          prompt: 'Show Bhiwandi central C&F stock levels and factory buffer'
        },
        {
          icon: 'shield',
          name: 'Check Escrow Settlements',
          hindi: 'पेमेंट व एस्क्रो स्थिति',
          prompt: 'Show bank escrow clearance and payment status'
        }
      ]
    }
  };

  const currentCfg = roleConfig[currentRole] || roleConfig.HOSPITAL;

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      try {
        if (aiEngine.speechRecognition) aiEngine.speechRecognition.stop();
      } catch (e) {
        console.warn('Speech stop error:', e);
      }
    } else {
      setIsListening(true);
      setInputVal('');
      if (aiEngine.speechRecognition) {
        try {
          aiEngine.speechRecognition.onresult = (event) => {
            const spoken = event.results[0][0].transcript;
            setInputVal(spoken);
            setIsListening(false);
            handleVoiceOrTextInput(spoken);
          };
          aiEngine.speechRecognition.onerror = () => setIsListening(false);
          aiEngine.speechRecognition.start();
        } catch (e) {
          console.warn('Speech start error, using simulation fallback:', e);
          setTimeout(() => {
            const testSpoken = currentCfg.fallbackSpoken;
            setInputVal(testSpoken);
            setIsListening(false);
            handleVoiceOrTextInput(testSpoken);
          }, 1200);
        }
      } else {
        // Fallback simulation for browsers blocking mic
        setTimeout(() => {
          const testSpoken = currentCfg.fallbackSpoken;
          setInputVal(testSpoken);
          setIsListening(false);
          handleVoiceOrTextInput(testSpoken);
        }, 1500);
      }
    }
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    handleVoiceOrTextInput(inputVal.trim());
    setInputVal('');
  };

  return (
    <View style={[styles.card, isDarkMode && { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {/* Big Friendly Hero Voice Section */}
      <View style={[
        styles.micSection,
        {
          backgroundColor: isDarkMode ? (darkCfg[currentRole]?.cardBg || '#0c1a2e') : currentCfg.cardBg,
          borderColor: isDarkMode ? (darkCfg[currentRole]?.cardBorder || '#1e3a5f') : currentCfg.cardBorder
        }
      ]}>
        <TouchableOpacity
          onPress={toggleMic}
          style={[styles.bigMicButton, { backgroundColor: currentCfg.micBg }, isListening && styles.bigMicButtonListening]}
          accessibilityLabel="Mic Button"
        >
          <SymbolIcon
            name={isListening ? 'mic-listening' : 'mic'}
            size={36}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View style={styles.micTextWrap}>
          <Text style={[styles.micMainTitle, isDarkMode && { color: theme.text }]}>
            {isListening ? 'Listening... Bolna shuru karein' : currentCfg.mainTitle}
          </Text>
          <Text style={[styles.micSubTitle, isDarkMode && { color: theme.textSecondary }]}>
            {isListening
              ? 'Bolna shuru karein... AI is transcribing your command'
              : currentCfg.subTitle}
          </Text>
        </View>
      </View>

      {/* Or Type / Seek Item Box */}
      <View style={[styles.inputBar, isDarkMode && { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
        <TextInput
          style={[styles.textInput, isDarkMode && { color: theme.text }]}
          placeholder={currentCfg.placeholder}
          placeholderTextColor="#94a3b8"
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        {/* Quick Mic for Seeker Input Bar */}
        <TouchableOpacity
          onPress={toggleMic}
          style={[styles.seekerMicBtn, isListening && styles.seekerMicBtnListening]}
          accessibilityLabel="Voice Input Mic"
        >
          <SymbolIcon
            name={isListening ? 'mic-listening' : 'mic'}
            size={18}
            color={isListening ? '#dc2626' : currentCfg.color}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendBtn, { backgroundColor: currentCfg.color }, !inputVal.trim() && styles.sendBtnDisabled]}
          disabled={!inputVal.trim()}
        >
          <SymbolIcon name="send" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 1-Tap Quick Actions (Role-Tailored) */}
      <Text style={[styles.quickLabel, isDarkMode && { color: theme.textSecondary }]}>{currentCfg.sectionLabel}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
        {currentCfg.quickItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleVoiceOrTextInput(item.prompt)}
            style={[styles.quickCard, isDarkMode && { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          >
            <View style={[styles.quickIconBg, { backgroundColor: currentCfg.color + '15' }]}>
              <SymbolIcon name={item.icon} size={18} color={currentCfg.color} />
            </View>
            <View>
              <Text style={[styles.quickName, isDarkMode && { color: theme.text }]}>{item.name}</Text>
              <Text style={styles.quickHindi}>{item.hindi}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Live AI Spoken Feedback Card (Big, Clear, Reassuring) */}
      {lastAiMessage && (
        <View style={[
          styles.feedbackCard,
          isDarkMode && { backgroundColor: '#0b1322', borderColor: theme.border },
          lastAiMessage.type === 'CRITICAL' && styles.feedbackCritical,
          lastAiMessage.type === 'SUCCESS' && styles.feedbackSuccess
        ]}>
          <View style={styles.feedbackIconWrap}>
            <SymbolIcon
              name={lastAiMessage.type === 'SUCCESS' ? 'check' : 'speaker'}
              size={22}
              color={lastAiMessage.type === 'SUCCESS' ? '#166534' : currentCfg.color}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={[styles.feedbackTitle, isDarkMode && { color: theme.text }]}>{lastAiMessage.title}</Text>
              <TouchableOpacity
                onPress={() => aiEngine.speak(lastAiMessage.text)}
                style={[styles.listenSpeechBtn, { borderColor: currentCfg.color + '40', backgroundColor: currentCfg.color + '12' }]}
              >
                <SymbolIcon name="speaker" size={13} color={currentCfg.color} />
                <Text style={[styles.listenSpeechBtnText, { color: currentCfg.color }]}>Speaker / बोलकर सुनें</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.feedbackText, isDarkMode && { color: theme.textSecondary }]}>{lastAiMessage.text}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 }
  },
  micSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: 'rgba(240, 253, 244, 0.82)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(187, 247, 208, 0.85)',
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOpacity: 0.08,
    shadowRadius: 10
  },
  bigMicButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }
  },
  bigMicButtonListening: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444'
  },
  micTextWrap: {
    flex: 1
  },
  micMainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: -0.2
  },
  micSubTitle: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.80)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0f172a',
    paddingVertical: 6,
    outlineStyle: 'none'
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOpacity: 0.35,
    shadowRadius: 8
  },
  sendBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0
  },
  seekerMicBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  },
  seekerMicBtnListening: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5'
  },
  listenSpeechBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  listenSpeechBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284c7'
  },
  quickLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
    letterSpacing: 0.2
  },
  quickScroll: {
    flexDirection: 'row',
    marginBottom: 10
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  quickIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a'
  },
  quickHindi: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 1
  },
  feedbackCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    padding: 14,
    marginTop: 8,
    shadowColor: '#0284c7',
    shadowOpacity: 0.06,
    shadowRadius: 10
  },
  feedbackSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0'
  },
  feedbackCritical: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca'
  },
  feedbackIconWrap: {
    marginTop: 2
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0369a1',
    marginBottom: 3
  },
  feedbackText: {
    fontSize: 12.5,
    color: '#1e293b',
    lineHeight: 18
  }
});
