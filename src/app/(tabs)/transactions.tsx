import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { useGastos } from '../../hooks/useGastos';
import { TransactionRow } from '../../components/aura/TransactionRow';
import type { GastoConDetalles } from '../../types/database';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default function TransactionsScreen() {
  const { gastos, loading, refresh } = useGastos();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());

  const filtered = useMemo(() =>
    gastos.filter((g) => {
      const d = new Date(g.fecha_cobro);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    }),
    [gastos, selectedMonth, selectedYear]
  );

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, GastoConDetalles[]>();
    for (const g of filtered) {
      const key = g.fecha_cobro.split('T')[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({ date, items }));
  }, [filtered]);

  const totalMonth = filtered.reduce((s, g) => s + g.monto, 0);

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Month scroll */}
      <FlatList
        data={MONTHS}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthRow}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.monthChip, selectedMonth === index && styles.monthChipActive]}
            onPress={() => setSelectedMonth(index)}
          >
            <Text style={[styles.monthLabel, selectedMonth === index && styles.monthLabelActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>TOTAL DEL MES</Text>
        <Text style={styles.summaryAmount}>
          ${totalMonth.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.summaryCount}>{filtered.length} transacciones</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Transacciones</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={grouped}
          keyExtractor={(item) => item.date}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Sin transacciones este mes</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.group}>
              <Text style={styles.groupDate}>
                {new Date(item.date + 'T12:00:00').toLocaleDateString('es-MX', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </Text>
              <View style={styles.groupRows}>
                {item.items.map((g) => (
                  <TransactionRow
                    key={g.id_gasto}
                    gasto={g}
                    onPress={() => router.push(`/transaction/${g.id_gasto}`)}
                  />
                ))}
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin, paddingVertical: Spacing.four,
  },
  title: { ...Typography.headlineLgMobile, color: Colors.primary },
  settingsIcon: { fontSize: 22, color: Colors.onSurfaceVariant },

  list: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 100 },
  listHeader: { gap: Spacing.sectionGap, marginBottom: Spacing.stackGap },

  monthRow: { gap: Spacing.two, paddingRight: Spacing.containerMargin },
  monthChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainer,
  },
  monthChipActive: { backgroundColor: Colors.primaryContainer },
  monthLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  monthLabelActive: { color: Colors.onPrimaryContainer },

  summary: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md,
    padding: Spacing.six,
    gap: Spacing.two,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  summaryLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  summaryAmount: { ...Typography.displayLg, color: Colors.error },
  summaryCount: { ...Typography.bodySm, color: Colors.outline },

  group: { gap: Spacing.two },
  groupDate: {
    ...Typography.labelCaps, color: Colors.outline,
    textTransform: 'capitalize',
  },
  groupRows: { gap: Spacing.two },

  empty: { alignItems: 'center', paddingTop: Spacing.sectionGap },
  emptyText: { ...Typography.bodyLg, color: Colors.onSurfaceVariant },
});
