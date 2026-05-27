import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { supabase } from '../../../utils/supabase';
import type { GastoConDetalles } from '../../types/database';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gasto, setGasto] = useState<GastoConDetalles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('gasto')
      .select(`
        *,
        categoria:categoria(*, color:cat_color(*), tipo_limite:cat_tipo_limite(*)),
        tarjeta:tarjeta(*),
        estado:cat_estado_gasto(*)
      `)
      .eq('id_gasto', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setGasto(data as GastoConDetalles);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!gasto) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Transacción no encontrada</Text>
      </View>
    );
  }

  const categoryColor = gasto.categoria?.color?.codigo_hex ?? Colors.primary;
  const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2 });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Transacción</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero amount */}
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>MONTO DE COMPRA</Text>
            <Text style={styles.heroAmount}>${fmt(gasto.monto)}</Text>

            <View style={styles.balanceRow}>
              <View style={styles.balancePill}>
                <Text style={styles.pillLabel}>COMERCIO</Text>
                <Text style={styles.pillValue}>{gasto.comercio}</Text>
              </View>
              <View style={[styles.balancePill, { borderColor: categoryColor + '40' }]}>
                <Text style={[styles.pillLabel, { color: categoryColor }]}>FECHA</Text>
                <Text style={[styles.pillValue, { color: categoryColor }]}>
                  {new Date(gasto.fecha_cobro).toLocaleDateString('es-MX', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Credit card visualization */}
          {gasto.tarjeta && (
            <View style={styles.card}>
              <View style={styles.cardGlow} />
              <View style={styles.cardTop}>
                <Text style={styles.cardBrand}>{gasto.tarjeta.nombre}</Text>
                <View style={styles.cardChip} />
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.cardNumber}>
                  •••• •••• •••• {gasto.tarjeta.ultimos_4_digitos ?? '????'}
                </Text>
              </View>
            </View>
          )}

          {/* Bento grid details */}
          <View style={styles.bento}>
            {/* Merchant - full width */}
            <View style={[styles.bentoItem, styles.bentoFull]}>
              <View style={styles.bentoIconWrap}>
                <Text style={styles.bentoIconText}>🏪</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bentoTitle}>{gasto.comercio}</Text>
                <Text style={styles.bentoSub}>Comercio</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>

            {/* Category */}
            <View style={[styles.bentoItem, styles.bentoHalf]}>
              <Text style={styles.bentoLabel}>CATEGORÍA</Text>
              {gasto.categoria ? (
                <View style={[styles.chip, { borderColor: categoryColor + '40', backgroundColor: categoryColor + '15' }]}>
                  <Text style={[styles.chipText, { color: categoryColor }]}>
                    {gasto.categoria.nombre}
                  </Text>
                </View>
              ) : (
                <Text style={styles.bentoSub}>Sin categoría</Text>
              )}
            </View>

            {/* Status */}
            <View style={[styles.bentoItem, styles.bentoHalf]}>
              <Text style={styles.bentoLabel}>ESTADO</Text>
              <View style={[
                styles.chip,
                {
                  borderColor: gasto.estado?.nombre === 'COMPLETADO'
                    ? Colors.primary + '40'
                    : Colors.outline + '40',
                  backgroundColor: gasto.estado?.nombre === 'COMPLETADO'
                    ? Colors.primary + '15'
                    : Colors.outline + '10',
                },
              ]}>
                <Text style={[
                  styles.chipText,
                  { color: gasto.estado?.nombre === 'COMPLETADO' ? Colors.primary : Colors.outline },
                ]}>
                  {gasto.estado?.nombre ?? 'DESCONOCIDO'}
                </Text>
              </View>
            </View>

            {/* Tarjeta */}
            {gasto.tarjeta && (
              <View style={[styles.bentoItem, styles.bentoFull]}>
                <Text style={styles.bentoLabel}>MÉTODO DE PAGO</Text>
                <Text style={styles.bentoValue}>
                  {gasto.tarjeta.nombre} •••• {gasto.tarjeta.ultimos_4_digitos}
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Descargar Comprobante</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Reportar Problema</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  notFound: { ...Typography.bodyLg, color: Colors.onSurfaceVariant },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin, paddingVertical: Spacing.four,
  },
  backBtn: { width: 32 },
  backIcon: { fontSize: 28, color: Colors.primary, fontWeight: '300' },
  title: { ...Typography.headlineLgMobile, color: Colors.primary },
  settingsIcon: { fontSize: 22, color: Colors.onSurfaceVariant },

  scroll: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 100 },

  hero: { alignItems: 'center', gap: Spacing.stackGap },
  heroLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  heroAmount: { ...Typography.displayLg, color: Colors.onSurface, letterSpacing: -1 },
  balanceRow: { flexDirection: 'row', gap: Spacing.stackGap, width: '100%' },
  balancePill: {
    flex: 1, backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.full, paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three, borderWidth: 1,
    borderColor: Colors.primary + '20', gap: 2,
  },
  pillLabel: { ...Typography.labelCaps, color: Colors.outline, fontSize: 9 },
  pillValue: { ...Typography.bodySm, color: Colors.onSurface, fontWeight: '600' },

  card: {
    width: '100%', aspectRatio: 1.586,
    borderRadius: Radius.md, padding: Spacing.six,
    backgroundColor: '#cc00cc',
    justifyContent: 'space-between', overflow: 'hidden',
    shadowColor: '#ff00ff', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  cardGlow: {
    position: 'absolute', top: 0, right: 0, width: 200, height: 200,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 100,
    transform: [{ translateX: 60 }, { translateY: -60 }],
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBrand: { ...Typography.labelCaps, color: 'rgba(255,255,255,0.9)' },
  cardChip: { width: 36, height: 24, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardBottom: {},
  cardNumber: { ...Typography.titleMd, color: '#fff', letterSpacing: 2 },

  bento: { gap: Spacing.stackGap },
  bentoItem: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.DEFAULT, padding: Spacing.five,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.four,
  },
  bentoFull: { width: '100%' },
  bentoHalf: { flex: 1, flexDirection: 'column', alignItems: 'flex-start', gap: Spacing.two },
  bentoIconWrap: {
    width: 48, height: 48, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  bentoIconText: { fontSize: 22 },
  bentoLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 10 },
  bentoTitle: { ...Typography.titleMd, color: Colors.onSurface },
  bentoSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  bentoValue: { ...Typography.bodySm, color: Colors.onSurface },
  chevron: { fontSize: 20, color: Colors.outline },
  chip: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.full, borderWidth: 1,
  },
  chipText: { ...Typography.labelCaps, fontSize: 10 },

  actions: { gap: Spacing.stackGap },
  primaryBtn: {
    backgroundColor: '#cc00cc', borderRadius: Radius.full,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: '#ff00ff', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  primaryBtnText: { ...Typography.titleMd, color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center',
  },
  secondaryBtnText: { ...Typography.titleMd, color: Colors.onSurface },
});
