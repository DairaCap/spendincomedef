import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useGastos } from '../../hooks/useGastos';
import { useIngresos } from '../../hooks/useIngresos';
import { useCategorias } from '../../hooks/useCategorias';
import { TransactionRow } from '../../components/aura/TransactionRow';
import { GlassCard } from '../../components/aura/GlassCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { gastos, loading: gLoading, refresh: refreshGastos } = useGastos();
  const { ingresos, loading: iLoading, refresh: refreshIngresos } = useIngresos();
  const { categorias } = useCategorias();

  const refreshing = gLoading || iLoading;
  const onRefresh = () => { refreshGastos(); refreshIngresos(); };

  // Current month totals
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalIncome = useMemo(() =>
    ingresos
      .filter((i) => {
        const d = new Date(i.fecha_ingreso);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((s, i) => s + i.monto, 0),
    [ingresos, currentMonth, currentYear]
  );

  const totalExpenses = useMemo(() =>
    gastos
      .filter((g) => {
        const d = new Date(g.fecha_cobro);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((s, g) => s + g.monto, 0),
    [gastos, currentMonth, currentYear]
  );

  const balance = totalIncome - totalExpenses;
  const recentGastos = gastos.slice(0, 5);

  const userName = user?.user_metadata?.nombre ?? user?.email?.split('@')[0] ?? 'Usuario';
  const initials = userName.slice(0, 2).toUpperCase();
  const monthName = now.toLocaleString('es-MX', { month: 'long', year: 'numeric' });

  const fmt = (n: number) =>
    n.toLocaleString('es-MX', { minimumFractionDigits: 2 });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bienvenido</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Balance hero card */}
          <GlassCard style={styles.heroCard}>
            {/* Decorative glow */}
            <View style={styles.glowOrb} />
            <Text style={styles.balanceLabel}>BALANCE DEL MES</Text>
            <Text style={styles.balanceMonth}>{monthName}</Text>
            <Text style={[styles.balanceAmount, { color: balance >= 0 ? Colors.primary : Colors.error }]}>
              ${fmt(Math.abs(balance))}
            </Text>

            <View style={styles.balanceRow}>
              <View style={styles.balancePill}>
                <Text style={styles.pillLabel}>INGRESOS</Text>
                <Text style={[styles.pillAmount, { color: Colors.primary }]}>
                  +${fmt(totalIncome)}
                </Text>
              </View>
              <View style={[styles.balancePill, { borderColor: Colors.error + '40' }]}>
                <Text style={styles.pillLabel}>GASTOS</Text>
                <Text style={[styles.pillAmount, { color: Colors.error }]}>
                  -${fmt(totalExpenses)}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Category budget rings - top 3 */}
          {categorias.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>CATEGORÍAS</Text>
                <Text style={styles.sectionCount}>{categorias.length} activas</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.miniCards}
              >
                {categorias.slice(0, 6).map((cat) => {
                  const spent = gastos
                    .filter((g) => g.id_categoria === cat.id_categoria)
                    .reduce((s, g) => s + g.monto, 0);
                  const pct = cat.valor_limite > 0
                    ? Math.min(spent / cat.valor_limite, 1)
                    : 0;
                  const color = cat.color?.codigo_hex ?? Colors.primary;
                  const over = spent > cat.valor_limite && cat.valor_limite > 0;

                  return (
                    <View key={cat.id_categoria} style={styles.miniCard}>
                      <View style={styles.miniRingWrap}>
                        <View
                          style={[
                            styles.miniRing,
                            {
                              borderColor: over ? Colors.error : color,
                              shadowColor: over ? Colors.error : color,
                            },
                          ]}
                        />
                        <Text style={[styles.miniPct, { color: over ? Colors.error : color }]}>
                          {Math.round(pct * 100)}%
                        </Text>
                      </View>
                      <Text style={styles.miniCatName} numberOfLines={1}>{cat.nombre}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Recent transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>ÚLTIMAS TRANSACCIONES</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>

            {recentGastos.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>Sin transacciones aún.</Text>
                <Text style={styles.emptySubText}>
                  Toca el botón + para registrar tu primer gasto.
                </Text>
              </GlassCard>
            ) : (
              <View style={styles.transactionList}>
                {recentGastos.map((g) => (
                  <TransactionRow
                    key={g.id_gasto}
                    gasto={g}
                    onPress={() => router.push(`/transaction/${g.id_gasto}`)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingVertical: Spacing.four,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: Colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...Typography.labelCaps, color: Colors.primary },
  greeting: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  userName: { ...Typography.titleMd, color: Colors.primary },
  settingsIcon: { fontSize: 22, color: Colors.onSurfaceVariant },

  scroll: {
    padding: Spacing.containerMargin,
    gap: Spacing.sectionGap,
    paddingBottom: 100,
  },

  heroCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    opacity: 0.08,
  },
  balanceLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  balanceMonth: {
    ...Typography.bodySm,
    color: Colors.outline,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  balanceAmount: {
    ...Typography.displayLg,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: Spacing.stackGap,
  },
  balancePill: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.full,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    gap: 2,
  },
  pillLabel: { ...Typography.labelCaps, color: Colors.outline, fontSize: 10 },
  pillAmount: { ...Typography.bodySm, fontWeight: '600' },

  section: { gap: Spacing.stackGap },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  sectionCount: { ...Typography.bodySm, color: Colors.primary },
  seeAll: { ...Typography.bodySm, color: Colors.primary },

  miniCards: { gap: Spacing.stackGap, paddingRight: Spacing.containerMargin },
  miniCard: {
    width: 80,
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#1A1D23',
    borderRadius: Radius.DEFAULT,
    padding: Spacing.three,
  },
  miniRingWrap: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  miniPct: { ...Typography.labelCaps, fontSize: 11 },
  miniCatName: {
    ...Typography.labelCaps,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  transactionList: { gap: Spacing.two },
  emptyCard: { alignItems: 'center', gap: Spacing.two },
  emptyText: { ...Typography.bodyLg, color: Colors.onSurface },
  emptySubText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
