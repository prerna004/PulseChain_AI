// Ultra-Simple Uber-Style Stockist Ping & Order Customizer Modal
// Allows picking supplier as per price, customizing quantity, and 1-click final confirmation

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../store/stateManager';

export default function UberPingModal() {
  const { activeUberPing, setActiveUberPing, confirmOrderDispatch } = useApp();

  const [qty, setQty] = useState(100);
  const [selectedStockistId, setSelectedStockistId] = useState(null);

  // Sync state whenever activeUberPing changes
  useEffect(() => {
    if (activeUberPing) {
      const initialQty = activeUberPing.quantity || 100;
      setQty(initialQty);
      // Default to best price quote if available
      if (activeUberPing.quotes && activeUberPing.quotes.length > 0) {
        setSelectedStockistId(activeUberPing.quotes[0].stockistId);
      }
    }
  }, [activeUberPing]);

  if (!activeUberPing) return null;

  const { sku, hospital, quotes } = activeUberPing;

  // Handle quantity adjustment
  const updateQuantity = (newQty) => {
    const val = Math.max(1, Math.min(10000, Number(newQty) || 1));
    setQty(val);
  };

  // Quick preset quantity chips
  const PRESET_QTYS = [25, 50, 100, 200, 500];

  // Currently selected quote object
  const currentSelectedQuote = quotes.find(q => q.stockistId === selectedStockistId) || quotes[0];
  const finalTotal = currentSelectedQuote ? currentSelectedQuote.quotedRate * qty : 0;

  const handleFinalConfirm = () => {
    if (currentSelectedQuote) {
      confirmOrderDispatch(currentSelectedQuote, qty);
    }
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.radarIcon}>
                <Ionicons name="radio" size={24} color="#0284c7" />
              </View>
              <View>
                <Text style={styles.mainTitle}>Select Supplier & Customize Quantity</Text>
                <Text style={styles.subTitle}>
                  For {hospital.name} • {sku.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setActiveUberPing(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* STEP 1: Interactive Quantity Selector Box */}
            <View style={styles.qtyBox}>
              <View style={styles.qtyHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>STEP 1</Text>
                </View>
                <Text style={styles.qtyBoxTitle}>Select / Customize Quantity (मात्रा चुनें):</Text>
              </View>

              <View style={styles.qtyControlsRow}>
                {/* Decrement Button */}
                <TouchableOpacity
                  onPress={() => updateQuantity(qty - 25)}
                  style={styles.qtyStepBtn}
                >
                  <Ionicons name="remove" size={22} color="#0284c7" />
                </TouchableOpacity>

                {/* Direct Number Input */}
                <View style={styles.qtyInputWrap}>
                  <TextInput
                    style={styles.qtyInput}
                    value={String(qty)}
                    onChangeText={updateQuantity}
                    keyboardType="numeric"
                  />
                  <Text style={styles.qtyUnit}>{sku.unit}</Text>
                </View>

                {/* Increment Button */}
                <TouchableOpacity
                  onPress={() => updateQuantity(qty + 25)}
                  style={styles.qtyStepBtn}
                >
                  <Ionicons name="add" size={22} color="#0284c7" />
                </TouchableOpacity>
              </View>

              {/* Quick Preset Quantity Pills */}
              <View style={styles.quickChipsRow}>
                <Text style={styles.quickChipsLabel}>Quick Select:</Text>
                {PRESET_QTYS.map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setQty(num)}
                    style={[styles.quickChip, qty === num && styles.quickChipActive]}
                  >
                    <Text style={[styles.quickChipText, qty === num && styles.quickChipTextActive]}>
                      {num} {sku.unit.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* STEP 2: Stockists Ranked as per Price */}
            <View style={styles.supplierSectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 2</Text>
              </View>
              <Text style={styles.supplierSectionTitle}>
                Pick Your Supplier as per Price (दुकानदार चुनें):
              </Text>
            </View>

            {/* Stockist Options */}
            {quotes.map((quote) => {
              const isSelected = selectedStockistId === quote.stockistId;
              const calculatedTotal = quote.quotedRate * qty;

              return (
                <TouchableOpacity
                  key={quote.stockistId}
                  onPress={() => setSelectedStockistId(quote.stockistId)}
                  style={[
                    styles.quoteCard,
                    quote.isBestPrice && styles.quoteCardBest,
                    isSelected && styles.quoteCardSelected
                  ]}
                  activeOpacity={0.8}
                >
                  {/* Top Bar with Selection Radio & Ribbons */}
                  <View style={styles.cardTop}>
                    <View style={styles.stockistLeft}>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioInnerDot} />}
                      </View>
                      <View>
                        <Text style={styles.stockistName}>{quote.stockistName}</Text>
                        <Text style={styles.stockistArea}>📍 {quote.hub} ({quote.distanceKm} km away)</Text>
                      </View>
                    </View>

                    <View style={styles.ribbonsGroup}>
                      {quote.isBestPrice && (
                        <View style={styles.bestRibbon}>
                          <Text style={styles.bestRibbonText}>★ LOWEST PRICE (सबसे सस्ता)</Text>
                        </View>
                      )}
                      {quote.isFastest && !quote.isBestPrice && (
                        <View style={styles.fastRibbon}>
                          <Text style={styles.fastRibbonText}>⚡ FASTEST (25 Mins)</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Pricing & Delivery Matrix */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Rate per unit</Text>
                      <Text style={styles.rateValue}>₹{quote.quotedRate}</Text>
                    </View>

                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Delivery SLA</Text>
                      <Text style={styles.etaValue}>{quote.etaMinutes} mins</Text>
                    </View>

                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Total for {qty} units</Text>
                      <Text style={styles.totalValue}>₹{calculatedTotal.toLocaleString('en-IN')}</Text>
                    </View>
                  </View>

                  {/* Selection Indicator Banner */}
                  <View style={[styles.selectBanner, isSelected && styles.selectBannerActive]}>
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={isSelected ? "#16a34a" : "#94a3b8"}
                    />
                    <Text style={[styles.selectBannerText, isSelected && styles.selectBannerTextActive]}>
                      {isSelected ? "Selected for Delivery ✓" : "Tap to Select this Supplier"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* STEP 3: Sticky Bottom Action Bar with Final "Confirm Order" Button */}
          <View style={styles.stickyFooter}>
            <View style={styles.footerSummary}>
              <Text style={styles.summarySupplierText}>
                Supplier: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{currentSelectedQuote ? currentSelectedQuote.stockistName : ''}</Text>
              </Text>
              <Text style={styles.summaryTotalText}>
                Total: <Text style={styles.summaryTotalValue}>₹{finalTotal.toLocaleString('en-IN')}</Text> ({qty} {sku.unit})
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleFinalConfirm}
              style={styles.confirmOrderBtn}
            >
              <Text style={styles.confirmOrderBtnText}>
                Confirm Order (आर्डर पक्का करें)
              </Text>
              <Ionicons name="arrow-forward-circle" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 680,
    maxHeight: '92%',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 25,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  radarIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  subTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  contentScroll: {
    flex: 1,
    paddingRight: 4
  },
  qtyBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 16
  },
  qtyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  stepBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800'
  },
  qtyBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  qtyControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12
  },
  qtyStepBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  qtyInputWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 130
  },
  qtyInput: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    outlineStyle: 'none'
  },
  qtyUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2
  },
  quickChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10
  },
  quickChipsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  quickChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  quickChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7'
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  quickChipTextActive: {
    color: '#ffffff'
  },
  supplierSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  supplierSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  quoteCardBest: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4'
  },
  quoteCardSelected: {
    borderColor: '#0284c7',
    borderWidth: 2.5,
    backgroundColor: '#f0f9ff'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8
  },
  stockistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleActive: {
    borderColor: '#0284c7'
  },
  radioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0284c7'
  },
  stockistName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  stockistArea: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  ribbonsGroup: {
    flexDirection: 'row',
    gap: 6
  },
  bestRibbon: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  bestRibbonText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800'
  },
  fastRibbon: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  fastRibbonText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800'
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  detailBox: {
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700'
  },
  rateValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2
  },
  etaValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0284c7',
    marginTop: 2
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#16a34a',
    marginTop: 2
  },
  selectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4
  },
  selectBannerActive: {},
  selectBannerText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  selectBannerTextActive: {
    color: '#0284c7',
    fontWeight: '800'
  },
  stickyFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  summarySupplierText: {
    fontSize: 12,
    color: '#475569'
  },
  summaryTotalText: {
    fontSize: 13,
    color: '#475569'
  },
  summaryTotalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#16a34a'
  },
  confirmOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a', // Giant green confirm button
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#16a34a',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  confirmOrderBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  }
});
