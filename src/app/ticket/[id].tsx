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
import type { Ticket, ProductoTicket } from '../../types/database';

interface TicketWithProducts extends Ticket {
  productos: ProductoTicket[];
}

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('ticket')
      .select(`*, gasto:gasto(*), productos:producto_ticket(*, categoria:categoria(*))`)
      .eq('id_ticket', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setTicket({
            ...data,
            productos: (data as any).productos ?? [],
          });
        }
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

  if (!ticket) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Ticket no encontrado</Text>
      </View>
    );
  }

  const total = ticket.productos.reduce(
    (s, p) => s + p.precio_unitario * p.cantidad, 0
  );
  const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2 });

  // Category breakdown for donut
  const catTotals = new Map<string, { name: string; total: number; color: string }>();
  ticket.productos.forEach((p) => {
    const catName = (p as any).categoria?.nombre ?? 'Otro';
    const catColor = (p as any).categoria?.color?.codigo_hex ?? Colors.primary;
    if (!catTotals.has(catName)) {
      catTotals.set(catName, { name: catName, total: 0, color: catColor });
    }
    catTotals.get(catName)!.total += p.precio_unitario * p.cantidad;
  });
  const cats = Array.from(catTotals.values());

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Detalles del Ticket</Text>
          <TouchableOpacity>
            <Text style={styles.shareIcon}>↑</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero card */}
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>TOTAL GASTADO</Text>
              <Text style={styles.heroAmount}>${fmt(total)}</Text>
              <Text style={styles.heroSub}>
                {ticket.gasto
                  ? `${new Date((ticket.gasto as any).fecha_cobro).toLocaleDateString('es-MX')} • ${(ticket.gasto as any).comercio}`
                  : ''}
              </Text>
            </View>
            {/* Simple donut visualization */}
            <View style={styles.donutWrap}>
              {cats.map((c, i) => (
                <View
                  key={c.name}
                  style={[
                    styles.donutSegment,
                    {
                      borderColor: c.color,
                      width: 48 + i * 8,
                      height: 48 + i * 8,
                      borderRadius: (48 + i * 8) / 2,
                      opacity: 0.7 - i * 0.15,
                    },
                  ]}
                />
              ))}
              <Text style={styles.donutLabel}>DETALLE</Text>
            </View>
          </View>

          {/* Category legend */}
          {cats.length > 0 && (
            <View style={styles.legend}>
              {cats.map((c) => (
                <View key={c.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                  <Text style={styles.legendText}>
                    {c.name} {total > 0 ? `${Math.round((c.total / total) * 100)}%` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Products list */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos comprados</Text>
            {ticket.productos.length === 0 ? (
              <Text style={styles.emptyText}>Sin productos registrados</Text>
            ) : (
              ticket.productos.map((p) => {
                const catColor = (p as any).categoria?.color?.codigo_hex ?? Colors.primary;
                return (
                  <View key={p.id_producto} style={styles.productRow}>
                    <View style={[styles.productIcon, { backgroundColor: catColor + '20' }]}>
                      <Text style={{ fontSize: 18 }}>🛍</Text>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{p.nombre_producto}</Text>
                      <Text style={styles.productSub}>
                        {(p as any).categoria?.nombre ?? 'Sin categoría'} • {p.cantidad} u.
                      </Text>
                    </View>
                    <View style={styles.productRight}>
                      <Text style={[styles.productPrice, { color: catColor }]}>
                        ${fmt(p.precio_unitario * p.cantidad)}
                      </Text>
                      <Text style={styles.productCat}>
                        {((p as any).categoria?.nombre ?? '').toUpperCase()}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Total footer */}
          <View style={styles.totalFooter}>
            <Text style={styles.totalLabel}>Monto Total</Text>
            <Text style={styles.totalAmount}>${fmt(total)}</Text>
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
  backIcon: { fontSize: 28, color: Colors.primary, fontWeight: '300', width: 28 },
  title: { ...Typography.titleMd, color: Colors.primary },
  shareIcon: { fontSize: 22, color: Colors.primary, width: 28, textAlign: 'right' },

  scroll: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 100 },

  heroCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md, padding: Spacing.six,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    overflow: 'hidden', position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  heroGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.primary, opacity: 0.08,
  },
  heroLeft: { gap: 4 },
  heroLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  heroAmount: { ...Typography.displayLg, color: Colors.primary },
  heroSub: { ...Typography.bodySm, color: Colors.outline, marginTop: 4 },

  donutWrap: {
    width: 100, height: 100,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  donutSegment: {
    position: 'absolute', borderWidth: 3,
  },
  donutLabel: {
    ...Typography.labelCaps, color: Colors.onSurfaceVariant,
    fontSize: 9,
  },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.four },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...Typography.bodySm, color: Colors.onSurface },

  section: { gap: Spacing.three },
  sectionTitle: { ...Typography.titleMd, color: Colors.onSurface, marginLeft: 4 },
  emptyText: { ...Typography.bodySm, color: Colors.onSurfaceVariant },

  productRow: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.DEFAULT, padding: Spacing.four,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.four,
  },
  productIcon: {
    width: 48, height: 48, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  productInfo: { flex: 1, gap: 2 },
  productName: { ...Typography.bodyLg, color: Colors.onSurface },
  productSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  productRight: { alignItems: 'flex-end', gap: 2 },
  productPrice: { ...Typography.titleMd, fontWeight: '600' },
  productCat: { ...Typography.labelCaps, fontSize: 9, color: Colors.outline },

  totalFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Spacing.four,
    borderTopWidth: 1, borderTopColor: Colors.outlineVariant + '30',
  },
  totalLabel: { ...Typography.bodyLg, color: Colors.onSurface, fontWeight: '700' },
  totalAmount: { ...Typography.titleMd, color: Colors.primary, fontWeight: '700' },
});
