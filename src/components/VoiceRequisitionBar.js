// Ultra-Simple, Senior & Non-Technical Staff Friendly Voice Bar
// Giant WhatsApp-style voice mic, 1-tap quick order buttons, bilingual hints

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';
import { aiEngine } from '../ai/agentEngine';

export default function VoiceRequisitionBar() {
  const {
    handleVoiceOrTextInput,
    lastAiMessage,
    isListening,
    setIsListening
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  // 1-Tap everyday hospital supplies (Senior staff / OT nurse friendly)
  const QUICK_ITEMS = [
    {
      icon: 'bolt',
      name: '⚡ Privileged Mic: 50 Dispovan (Entero)',
      hindi: 'फास्ट ट्रैक आर्डर',
      prompt: 'Order 50 boxes of Dispovan syringes from Entero'
    },
    {
      icon: 'hands-wash',
      name: 'Surgical Gloves 7.5',
      hindi: 'दस्ताने',
      prompt: 'Order 100 boxes of 7.5 sterile surgical gloves for Lilavati ICU urgently'
    },
    {
      icon: 'syringe',
      name: 'Dispovan 5ml Syringes',
      hindi: 'सिरिंज',
      prompt: 'Send 20 cartons of HMD Dispovan 5ml syringes urgently'
    },
    {
      icon: 'tint',
      name: 'IV Cannula 20G',
      hindi: 'कैनुला',
      prompt: 'Order 50 boxes of Polymed IV cannula 20G Pink'
    },
    {
      icon: 'head-side-mask',
      name: '3M N95 Masks',
      hindi: 'मास्क',
      prompt: 'Order 50 boxes 3M N95 masks for emergency ward'
    },
    {
      icon: 'search-dollar',
      name: 'Find Best Price (Uber Ping)',
      hindi: 'सस्ता रेट ढूंढो',
      prompt: 'get me the best prices for gloves across Mumbai stockists'
    }
  ];

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      if (aiEngine.speechRecognition) aiEngine.speechRecognition.stop();
    } else {
      setIsListening(true);
      setInputVal('');
      if (aiEngine.speechRecognition) {
        aiEngine.speechRecognition.start();
        aiEngine.speechRecognition.onresult = (event) => {
          const spoken = event.results[0][0].transcript;
          setInputVal(spoken);
          setIsListening(false);
          handleVoiceOrTextInput(spoken);
        };
        aiEngine.speechRecognition.onerror = () => setIsListening(false);
      } else {
        // Fallback simulation for browsers blocking mic
        setTimeout(() => {
          const testSpoken = 'Order 100 boxes of 7.5 surgical gloves urgently';
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
    <View style={styles.card}>
      {/* Big Friendly Hero Voice Section */}
      <View style={styles.micSection}>
        <TouchableOpacity
          onPress={toggleMic}
          style={[styles.bigMicButton, isListening && styles.bigMicButtonListening]}
          accessibilityLabel="Mic Button"
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic'}
            size={38}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View style={styles.micTextWrap}>
          <Text style={styles.micMainTitle}>
            {isListening ? 'Listening... Bolna shuru karein 🎙️' : 'Tap to Speak / बोलकर आर्डर करें'}
          </Text>
          <Text style={styles.micSubTitle}>
            {isListening
              ? 'Say what items and quantity you need (जैसे: "200 box surgical gloves chahiye")'
              : 'No typing or forms needed. Just tap the green button and speak.'}
          </Text>
        </View>
      </View>

      {/* Or Type Simple Box */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Or type here: e.g. 50 boxes gloves or 20 cartons syringes..."
          placeholderTextColor="#94a3b8"
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendBtn, !inputVal.trim() && styles.sendBtnDisabled]}
          disabled={!inputVal.trim()}
        >
          <Ionicons name="arrow-up" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 1-Tap Quick Order Buttons (For fast selection without typing) */}
      <Text style={styles.quickLabel}>1-Tap Quick Orders (एक क्लिक में आर्डर करें):</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
        {QUICK_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleVoiceOrTextInput(item.prompt)}
            style={styles.quickCard}
          >
            <View style={styles.quickIconBg}>
              <FontAwesome5 name={item.icon} size={16} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.quickName}>{item.name}</Text>
              <Text style={styles.quickHindi}>{item.hindi}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Live AI Spoken Feedback Card (Big, Clear, Reassuring) */}
      {lastAiMessage && (
        <View style={[
          styles.feedbackCard,
          lastAiMessage.type === 'CRITICAL' && styles.feedbackCritical,
          lastAiMessage.type === 'SUCCESS' && styles.feedbackSuccess
        ]}>
          <View style={styles.feedbackIconWrap}>
            <Ionicons
              name={lastAiMessage.type === 'SUCCESS' ? 'checkmark-circle' : 'chatbubble-ellipses'}
              size={22}
              color={lastAiMessage.type === 'SUCCESS' ? '#16a34a' : '#0284c7'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackTitle}>{lastAiMessage.title}</Text>
            <Text style={styles.feedbackText}>{lastAiMessage.text}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 }
  },
  micSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f0fdf4',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    marginBottom: 14
  },
  bigMicButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#16a34a', // Friendly WhatsApp Green
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  bigMicButtonListening: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626'
  },
  micTextWrap: {
    flex: 1
  },
  micMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2
  },
  micSubTitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 6,
    outlineStyle: 'none'
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: '#94a3b8'
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8
  },
  quickScroll: {
    flexDirection: 'row',
    marginBottom: 8
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10
  },
  quickIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a'
  },
  quickHindi: {
    fontSize: 10,
    color: '#64748b'
  },
  feedbackCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
    padding: 12,
    marginTop: 6
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
    fontSize: 13,
    fontWeight: '800',
    color: '#0369a1',
    marginBottom: 2
  },
  feedbackText: {
    fontSize: 12,
    color: '#1e293b',
    lineHeight: 17
  }
});
