// PulseChain AI : Precision Healthcare & Logistics Vector Symbol System
// Guaranteed 100% SVG rendering on web without relying on external .ttf icon font files.
// Eliminates tofu missing glyph boxes [ ▯ ] completely.

import React from 'react';
import { View, Platform } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function SymbolIcon({
  name,
  size = 20,
  color = '#0284c7',
  secondaryColor,
  style
}) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        {renderSvgIcon(name, size, color, secondaryColor)}
      </View>
    );
  }

  // Native fallback
  return renderNativeFallback(name, size, color);
}

function renderSvgIcon(name, size, color) {

  switch (name) {
    // ️ HERO MICROPHONE
    case 'mic':
    case 'microphone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke={color} strokeWidth="2.4" />
          <line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2.4" />
          <line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="2.4" />
        </svg>
      );

    case 'mic-listening':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke={color} strokeWidth="2.4" />
          <line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2.4" />
          <line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="2.4" />
          {/* Animated soundwaves */}
          <path d="M21 9a9 9 0 0 1 0 6" stroke={color} strokeWidth="2.4" />
          <path d="M3 9a9 9 0 0 0 0 6" stroke={color} strokeWidth="2.4" />
        </svg>
      );

    //  SPEAKER / AUDIO / VOICE ANNOUNCER
    case 'speaker':
    case 'volume':
    case 'audio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="2.2" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} strokeWidth="2.2" />
        </svg>
      );

    //  HOSPITAL & MEDICAL CARE
    case 'hospital':
    case 'hospital-building':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" fill={color} fillOpacity="0.08" />
          <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
          {/* Red/Primary Cross */}
          <path d="M12 7v4" stroke={color} strokeWidth="2.5" />
          <path d="M10 9h4" stroke={color} strokeWidth="2.5" />
        </svg>
      );

    //  STOCKIST / DISTRIBUTOR DELIVERY TRUCK
    case 'truck':
    case 'delivery':
    case 'distributor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" fill={color} fillOpacity="0.1" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" fill={color} fillOpacity="0.15" />
          <circle cx="17" cy="18.5" r="2.5" fill={color} />
          <circle cx="7" cy="18.5" r="2.5" fill={color} />
        </svg>
      );

    //  OEM MANUFACTURER PLANT
    case 'factory':
    case 'industry':
    case 'manufacturer':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" fill={color} fillOpacity="0.12" />
          <path d="M17 18h1" />
          <path d="M12 18h1" />
          <path d="M7 18h1" />
        </svg>
      );

    //  SURGICAL GLOVES / HAND HYGIENE
    case 'gloves':
    case 'hands-wash':
    case 'surgical-gloves':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" fill={color} fillOpacity="0.1" />
          <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-3a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
        </svg>
      );

    //  SYRINGE / INJECTION
    case 'syringe':
    case 'dispovan':
    case 'injection':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 2 4 4" />
          <path d="m17 7 3-3" />
          <path d="M19 9 8.7 19.3c-.4.4-1 .6-1.6.6H3v-4.1c0-.6.2-1.2.6-1.6L14 3.9" fill={color} fillOpacity="0.1" />
          <path d="m9 11 4 4" />
          <path d="m5 19-3 3" />
          <path d="m14 4 6 6" />
        </svg>
      );

    //  IV CANNULA / INFUSION / DRIP
    case 'cannula':
    case 'iv-drip':
    case 'infusion':
    case 'tint':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill={color} fillOpacity="0.15" />
          <path d="M12 9v5" strokeWidth="2.2" />
          <path d="M9.5 11.5h5" strokeWidth="2.2" />
        </svg>
      );

    //  N95 RESPIRATOR MASK
    case 'mask':
    case 'n95':
    case 'respirator':
    case 'head-side-mask':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11a8 8 0 0 1 16 0v2a8 8 0 0 1-16 0v-2Z" fill={color} fillOpacity="0.1" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M8 15h8" strokeWidth="1.5" />
          <path d="M10 12h4" strokeWidth="1.5" />
        </svg>
      );

    //  FAST TRACK ORDER / OT URGENCY
    case 'bolt':
    case 'flash':
    case 'lightning':
    case 'urgent':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );

    //  RADAR / UBER STOCKIST PING
    case 'radar':
    case 'uber-ping':
    case 'search-dollar':
    case 'spot-quote':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill={color} />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 6a6 6 0 0 1 6 6" />
          <path d="M12 18a6 6 0 0 1-6-6" />
          <path d="M12 22a10 10 0 0 1-10-10" />
        </svg>
      );

    //  INVENTORY / STOCK CRATE
    case 'box':
    case 'cube':
    case 'inventory':
    case 'stock':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" fill={color} fillOpacity="0.1" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      );

    //  WARD USAGE / ECG PULSE
    case 'pulse':
    case 'ecg':
    case 'ward-usage':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );

    //  ORDERS & RECEIPTS
    case 'receipt':
    case 'orders':
    case 'invoice':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" fill={color} fillOpacity="0.08" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </svg>
      );

    //  PRIVACY MESH & SECURITY
    case 'lock':
    case 'shield':
    case 'privacy':
    case 'security':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" fill={color} fillOpacity="0.12" />
          <path d="m9 12 2 2 4-4" strokeWidth="2.5" />
        </svg>
      );

    // ️ PAPER PLANE / SEND QUOTE
    case 'paper-plane':
    case 'send':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z" fill={color} fillOpacity="0.15" />
          <path d="M22 2 11 13" />
        </svg>
      );

    //  CHECKMARK
    case 'check':
    case 'checkmark':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    // ️ ALERT / WARNING
    case 'alert':
    case 'warning':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill={color} fillOpacity="0.12" />
          <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.2" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.6" />
        </svg>
      );

    //  WHATSAPP
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" fill={color} fillOpacity="0.1" />
        </svg>
      );

    // ️ DATA LAKE / SERVER
    case 'server':
    case 'data-lake':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="8" x="2" y="2" rx="2" ry="2" fill={color} fillOpacity="0.1" />
          <rect width="20" height="8" x="2" y="14" rx="2" ry="2" fill={color} fillOpacity="0.1" />
          <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2.5" />
          <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2.5" />
        </svg>
      );

    // ️ THEME LIGHT & DARK MODE
    case 'sun':
    case 'light-mode':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" fill={color} fillOpacity="0.25" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );

    case 'moon':
    case 'dark-mode':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={color} fillOpacity="0.25" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.1" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

function renderNativeFallback(name, size, color) {
  switch (name) {
    case 'mic':
    case 'microphone':
    case 'mic-listening':
      return <Ionicons name="mic" size={size} color={color} />;
    case 'hospital':
    case 'hospital-building':
      return <FontAwesome5 name="hospital" size={size} color={color} />;
    case 'truck':
    case 'delivery':
    case 'distributor':
      return <FontAwesome5 name="truck" size={size} color={color} />;
    case 'factory':
    case 'industry':
    case 'manufacturer':
      return <FontAwesome5 name="industry" size={size} color={color} />;
    case 'gloves':
    case 'hands-wash':
    case 'surgical-gloves':
      return <FontAwesome5 name="hands-wash" size={size} color={color} />;
    case 'syringe':
    case 'dispovan':
    case 'injection':
      return <FontAwesome5 name="syringe" size={size} color={color} />;
    case 'cannula':
    case 'iv-drip':
    case 'infusion':
    case 'tint':
      return <FontAwesome5 name="tint" size={size} color={color} />;
    case 'mask':
    case 'n95':
    case 'respirator':
    case 'head-side-mask':
      return <FontAwesome5 name="head-side-mask" size={size} color={color} />;
    case 'bolt':
    case 'flash':
    case 'lightning':
    case 'urgent':
      return <Ionicons name="flash" size={size} color={color} />;
    case 'radar':
    case 'uber-ping':
    case 'search-dollar':
    case 'spot-quote':
      return <Ionicons name="radar" size={size} color={color} />;
    case 'box':
    case 'cube':
    case 'inventory':
    case 'stock':
      return <Ionicons name="cube" size={size} color={color} />;
    case 'pulse':
    case 'ecg':
    case 'ward-usage':
      return <Ionicons name="pulse" size={size} color={color} />;
    case 'receipt':
    case 'orders':
    case 'invoice':
      return <Ionicons name="receipt" size={size} color={color} />;
    case 'lock':
    case 'shield':
    case 'privacy':
    case 'security':
      return <Ionicons name="shield-checkmark" size={size} color={color} />;
    case 'paper-plane':
    case 'send':
      return <Ionicons name="paper-plane" size={size} color={color} />;
    case 'speaker':
    case 'volume':
    case 'audio':
      return <Ionicons name="volume-high" size={size} color={color} />;
    // ️ THEME LIGHT & DARK MODE
    case 'sun':
    case 'light-mode':
      return <Ionicons name="sunny" size={size} color={color} />;

    case 'moon':
    case 'dark-mode':
      return <Ionicons name="moon" size={size} color={color} />;

    default:
      return <Ionicons name="help-circle" size={size} color={color} />;
  }
}

