// Ambient 3D Architectural & Supply Chain Mesh Background
// Inspired by high-end MedTech & Fintech UI presentation mockups
// Features sweeping 3D architectural ribbons and stepped 3D isometric supply-chain platforms

import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

export default function AmbientBackground() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  if (Platform.OS !== 'web') {
    return <View style={styles.nativeFallback} pointerEvents="none" />;
  }

  return (
    <View style={styles.bgContainer} pointerEvents="none">
      <svg
        style={styles.svgFull}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ambient Lighting Gradients */}
          <radialGradient id="ambWarmHero" cx="55%" cy="18%" r="48%">
            <stop offset="0%" stopColor="#ffe4d6" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#fee2e2" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f4f6fa" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="ambCoolLeft" cx="15%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#f0fdf4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f4f6fa" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="ambBottomWarm" cx="75%" cy="85%" r="45%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#f4f6fa" stopOpacity="0" />
          </radialGradient>

          {/* Hero Coral Cube Glow */}
          <radialGradient id="coralAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5722" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#ff7043" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff8a65" stopOpacity="0" />
          </radialGradient>

          {/* Sweeping 3D Ribbon Gradients with Defined Shading */}
          <linearGradient id="ribbonUpper3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#edf2f9" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#dce5f2" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#cbd8ea" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="ribbonLower3D" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#e8eff8" stopOpacity="0.7" />
            <stop offset="90%" stopColor="#d2deef" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.1" />
          </linearGradient>

          {/* Isometric Material Gradients */}
          {/* Coral Hero Cube */}
          <linearGradient id="coralTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff784e" />
            <stop offset="100%" stopColor="#ff5722" />
          </linearGradient>
          <linearGradient id="coralLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea4e18" />
            <stop offset="100%" stopColor="#bf360c" />
          </linearGradient>
          <linearGradient id="coralRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4511e" />
            <stop offset="100%" stopColor="#d84315" />
          </linearGradient>

          {/* White / Cool Slate Stepped Blocks */}
          <linearGradient id="blockTopLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="blockLeftDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="blockRightMed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
          </linearGradient>

          {/* Emerald / Cyan Medical Delivery Node */}
          <linearGradient id="nodeCyanTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="nodeCyanLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>
          <linearGradient id="nodeCyanRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>

          {/* Architectural 3D Ribbon Drop Shadow */}
          <filter id="ribbonShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="24" stdDeviation="28" floodColor="#0f172a" floodOpacity="0.07" />
          </filter>

          <filter id="blockShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#0f172a" floodOpacity="0.09" />
          </filter>
        </defs>

        {/* 1. Base Canvas & Ambient Illumination */}
        <rect width="1920" height="1080" fill="#f4f6fa" />
        <rect width="1920" height="1080" fill="url(#ambWarmHero)" />
        <rect width="1920" height="1080" fill="url(#ambCoolLeft)" />
        <rect width="1920" height="1080" fill="url(#ambBottomWarm)" />

        {/* 2. Sweeping Architectural 3D Ribbon Waves */}
        {/* Upper flowing architectural ribbon */}
        <path
          d="M-150,180 C260,80 620,320 1080,180 C1460,60 1740,240 2100,120 L2100,-150 L-150,-150 Z"
          fill="url(#ribbonUpper3D)"
          filter="url(#ribbonShadow)"
        />

        {/* Secondary undulating flowing ribbon curve */}
        <path
          d="M-100,520 C380,380 840,640 1320,460 C1680,340 1880,480 2080,420 L2080,720 C1820,680 1540,560 1180,680 C740,820 320,620 -100,760 Z"
          fill="url(#ribbonLower3D)"
          filter="url(#ribbonShadow)"
          opacity="0.8"
        />

        {/* Bottom sweep ribbon curve */}
        <path
          d="M-120,860 C340,760 860,1020 1380,880 C1720,780 1920,940 2120,880 L2120,1200 L-120,1200 Z"
          fill="url(#ribbonUpper3D)"
          filter="url(#ribbonShadow)"
          opacity="0.75"
        />

        {/* Fluid highlight contour strokes */}
        <path
          d="M120,150 C580,280 1040,60 1520,200 C1760,260 1960,210 2060,160"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M-60,540 C420,400 880,660 1360,480 C1680,360 1900,490 2060,440"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* 3. HERO STEPPED 3D ISOMETRIC SUPPLY CHAIN PLATFORM (Upper Dashboard Area) */}
        {/* Positioned at x=750, y=75 on desktop, and gently watermarked on mobile screens */}
        <g transform={isMobile ? "translate(700, 260) scale(0.65)" : "translate(750, 75) scale(1.18)"} opacity={isMobile ? "0.32" : "1"} filter="url(#blockShadow)">
          {/* Stepped Terraced Blocks Base */}

          {/* Platform Level 1: Bottom Right Foundation */}
          <g transform="translate(380, 160)">
            <polygon points="60,35 120,0 60,-35 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 60,35 60,70 0,35" fill="url(#blockLeftDark)" />
            <polygon points="60,35 120,0 120,35 60,70" fill="url(#blockRightMed)" />
          </g>

          {/* Platform Level 2: Middle Tier */}
          <g transform="translate(280, 120)">
            <polygon points="60,35 120,0 60,-35 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 60,35 60,85 0,50" fill="url(#blockLeftDark)" />
            <polygon points="60,35 120,0 120,50 60,85" fill="url(#blockRightMed)" />
          </g>

          {/* Platform Level 3: Center Bridge */}
          <g transform="translate(180, 150)">
            <polygon points="60,35 120,0 60,-35 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 60,35 60,65 0,30" fill="url(#blockLeftDark)" />
            <polygon points="60,35 120,0 120,30 60,65" fill="url(#blockRightMed)" />
          </g>

          {/* Platform Level 4: Upper Pedestal (Hero Cube Base) */}
          <g transform="translate(80, 100)">
            <polygon points="70,40 140,0 70,-40 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 70,40 70,95 0,55" fill="url(#blockLeftDark)" />
            <polygon points="70,40 140,0 140,55 70,95" fill="url(#blockRightMed)" />
          </g>

          {/* Stepped Mini Platform: Left Wing */}
          <g transform="translate(0, 145)">
            <polygon points="50,28 100,0 50,-28 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 50,28 50,55 0,27" fill="url(#blockLeftDark)" />
            <polygon points="50,28 100,0 100,27 50,55" fill="url(#blockRightMed)" />
          </g>

          {/* Stepped Mini Platform: Rear Depot */}
          <g transform="translate(210, 60)">
            <polygon points="45,26 90,0 45,-26 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 45,26 45,55 0,29" fill="url(#blockLeftDark)" />
            <polygon points="45,26 90,0 90,29 45,55" fill="url(#blockRightMed)" />
          </g>

          {/* Coral Transit Route Pathways connecting the platforms */}
          {/* Main Transit Artery */}
          <path
            d="M150,95 L250,140 L340,115 L440,155 L500,190"
            fill="none"
            stroke="#ff5722"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dashed Secondary Route */}
          <path
            d="M50,145 L150,95 L255,55 L300,75"
            fill="none"
            stroke="#ff8a65"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
          <path
            d="M340,115 L400,85 L470,120"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* HERO CORAL GLOWING CUBE (Main Supply Chain Origin Node) */}
          <circle cx="150" cy="80" r="75" fill="url(#coralAura)" />
          <g transform="translate(120, 50)">
            {/* Top Face */}
            <polygon points="30,17 60,0 30,-17 0,0" fill="url(#coralTop)" />
            {/* Left Face */}
            <polygon points="0,0 30,17 30,52 0,35" fill="url(#coralLeft)" />
            {/* Right Face */}
            <polygon points="30,17 60,0 60,35 30,52" fill="url(#coralRight)" />
          </g>

          {/* Secondary Blue Cyan Tech Cube (Distribution Node) */}
          <g transform="translate(325, 95)">
            <polygon points="20,11 40,0 20,-11 0,0" fill="url(#nodeCyanTop)" />
            <polygon points="0,0 20,11 20,32 0,21" fill="url(#nodeCyanLeft)" />
            <polygon points="20,11 40,0 40,21 20,32" fill="url(#nodeCyanRight)" />
          </g>

          {/* Third Mini White Cube (Hospital Receiving Node) */}
          <g transform="translate(425, 135)">
            <polygon points="18,10 36,0 18,-10 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 18,10 18,28 0,18" fill="url(#blockLeftDark)" />
            <polygon points="18,10 36,0 36,18 18,28" fill="url(#blockRightMed)" />
          </g>

          {/* Waypoint Red Location Pins (matching reference image) */}
          {/* Pin 1 on Platform 2 */}
          <g transform="translate(250, 125)">
            <ellipse cx="0" cy="12" rx="4" ry="2" fill="#0f172a" opacity="0.2" />
            <circle cx="0" cy="0" r="5" fill="#ef4444" />
            <circle cx="0" cy="0" r="2" fill="#ffffff" />
            <path d="M-3,2 L0,12 L3,2 Z" fill="#ef4444" />
          </g>

          {/* Pin 2 on Platform 1 */}
          <g transform="translate(440, 140)">
            <ellipse cx="0" cy="12" rx="4" ry="2" fill="#0f172a" opacity="0.2" />
            <circle cx="0" cy="0" r="5" fill="#ef4444" />
            <circle cx="0" cy="0" r="2" fill="#ffffff" />
            <path d="M-3,2 L0,12 L3,2 Z" fill="#ef4444" />
          </g>

          {/* Pin 3 on Rear Depot */}
          <g transform="translate(255, 45)">
            <circle cx="0" cy="0" r="4" fill="#0284c7" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Miniature Delivery Transit Van Marker on route */}
          <g transform="translate(290, 122) scale(0.85)">
            <rect x="-8" y="-6" width="16" height="10" rx="2" fill="#ffffff" stroke="#ff5722" strokeWidth="1.5" />
            <circle cx="-4" cy="4" r="2" fill="#0f172a" />
            <circle cx="4" cy="4" r="2" fill="#0f172a" />
            <rect x="2" y="-4" width="4" height="4" rx="1" fill="#38bdf8" />
          </g>
        </g>

        {/* 4. LEFT MARGIN ACCENT ISOMETRIC CLUSTER */}
        {/* Ensures the supply-chain 3D theme is immediately visible on the left side too */}
        <g transform={isMobile ? "translate(30, 280) scale(0.45)" : "translate(70, 130) scale(0.85)"} opacity={isMobile ? "0.2" : "0.85"} filter="url(#blockShadow)">
          {/* Stepped platform */}
          <polygon points="50,28 100,0 50,-28 0,0" fill="url(#blockTopLight)" />
          <polygon points="0,0 50,28 50,60 0,32" fill="url(#blockLeftDark)" />
          <polygon points="50,28 100,0 100,32 50,60" fill="url(#blockRightMed)" />

          {/* Secondary block */}
          <g transform="translate(80, 20)">
            <polygon points="40,22 80,0 40,-22 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 40,22 40,48 0,26" fill="url(#blockLeftDark)" />
            <polygon points="40,22 80,0 80,26 40,48" fill="url(#blockRightMed)" />
          </g>

          {/* Small blue node cube */}
          <g transform="translate(35, -5)">
            <polygon points="15,8 30,0 15,-8 0,0" fill="url(#nodeCyanTop)" />
            <polygon points="0,0 15,8 15,24 0,16" fill="url(#nodeCyanLeft)" />
            <polygon points="15,8 30,0 30,16 15,24" fill="url(#nodeCyanRight)" />
          </g>

          {/* Route path */}
          <path
            d="M50,28 L120,42 L180,20"
            fill="none"
            stroke="#ff5722"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <circle cx="120" cy="42" r="3" fill="#ff5722" />
        </g>

        {/* 4.5 UPPER RIGHT HERO MESH ACCENT (Visible in Header / Split Transition) */}
        <g transform={isMobile ? "translate(1100, 220) scale(0.45)" : "translate(1420, 85) scale(0.95)"} opacity={isMobile ? "0.2" : "0.85"} filter="url(#blockShadow)">
          {/* Stepped platform */}
          <polygon points="55,32 110,0 55,-32 0,0" fill="url(#blockTopLight)" />
          <polygon points="0,0 55,32 55,65 0,33" fill="url(#blockLeftDark)" />
          <polygon points="55,32 110,0 110,33 55,65" fill="url(#blockRightMed)" />

          <g transform="translate(70, 25)">
            <polygon points="40,24 80,0 40,-24 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 40,24 40,50 0,26" fill="url(#blockLeftDark)" />
            <polygon points="40,24 80,0 80,26 40,50" fill="url(#blockRightMed)" />
          </g>

          {/* Mini Coral Node Cube */}
          <g transform="translate(40, -10)">
            <polygon points="18,10 36,0 18,-10 0,0" fill="url(#coralTop)" />
            <polygon points="0,0 18,10 18,28 0,18" fill="url(#coralLeft)" />
            <polygon points="18,10 36,0 36,18 18,28" fill="url(#coralRight)" />
          </g>

          {/* Route path */}
          <path
            d="M-40,45 L55,32 L110,50 L160,25"
            fill="none"
            stroke="#ff5722"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <circle cx="55" cy="32" r="3.5" fill="#ef4444" />
        </g>

        {/* 5. RIGHT MARGIN ISOMETRIC ACCENT (Continuous Mesh behind companion) */}
        <g transform="translate(1560, 480) scale(0.9)" opacity={isMobile ? "0.2" : "0.75"} filter="url(#blockShadow)">
          <polygon points="55,30 110,0 55,-30 0,0" fill="url(#blockTopLight)" />
          <polygon points="0,0 55,30 55,65 0,35" fill="url(#blockLeftDark)" />
          <polygon points="55,30 110,0 110,35 55,65" fill="url(#blockRightMed)" />

          <g transform="translate(90, 25)">
            <polygon points="35,20 70,0 35,-20 0,0" fill="url(#blockTopLight)" />
            <polygon points="0,0 35,20 35,42 0,22" fill="url(#blockLeftDark)" />
            <polygon points="35,20 70,0 70,22 35,42" fill="url(#blockRightMed)" />
          </g>

          <path
            d="M-40,60 L55,30 L125,45 L190,15"
            fill="none"
            stroke="#ff5722"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="55" cy="30" r="3.5" fill="#ef4444" />
        </g>
      </svg>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
    backgroundColor: '#f4f6fa'
  },
  svgFull: {
    width: '100vw',
    height: '100vh',
    display: 'block'
  },
  nativeFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f4f6fa'
  }
});
