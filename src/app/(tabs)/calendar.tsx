import React, { useMemo, useState } from 'react';
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
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { useGastos } from '../../hooks/useGastos';
import { useIngresos } from '../../hooks/useIngresos';

const DOW = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Monday-based: 0=Mon, 6=Sun
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { startDow, daysInMonth };
}

export default function CalendarScreen() {
  const { gastos, loading: gL, refresh: rG } = useGastos();
  const { ingresos, loading: iL, refresh: rI } = useIngresos();
  const [hidePending, setHidePending] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthName = now.toLocaleString('es-MX', { month: 'long', year: 'numeric' });

  const { startDow, daysInMonth } = useMemo(() => getMonthDays(year, month), [year, month]);

  // Map day → events
  const dayEvents = useMemo(() => {
    const map = new Map<number, { label: string; isPending: boolean }[]>();

    gastos.forEach((g) => {
      const d = new Date(g.fecha_cobro);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push({
          label: g.comercio,
          isPending: g.estado?.nombre === 'PENDIENTE',
        });
      }
    });

    ingresos.forEach((i) => {
      const d = new Date(i.fecha_ingreso);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push({
          label: i.descripcion ?? 'Ingreso',
          isPending: false,
        });
      }
    });

    return map;
  }, [gastos, ingresos, month, year]);

  const pendingCount = useMemo(() =>
    gastos.filter((g) => g.estado?.nombre === 'PENDIENTE').length,
    [gastos]
  );

  const todayEvents = dayEvents.get(today) ?? [];

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.settingsIcon} />
          <Text style={styles.title}>Calendario</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={gL || iL}
              onRefresh={() => { rG(); rI(); }}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Header controls */}
          <View style={styles.controls}>
            <View>
              <Text style={styles.monthTitle}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</Text>
              <Text style={styles.pendingText}>{pendingCount} pendientes hoy</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, hidePending && styles.toggleOn]}
              onPress={() => setHidePending(!hidePending)}
            >
              <View style={[styles.toggleThumb, hidePending && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          {/* Calendar grid */}
          <View style={styles.calCard}>
            {/* Day headers */}
            <View style={styles.dowRow}>
              {DOW.map((d) => (
                <View key={d} style={styles.dowCell}>
                  <Text style={styles.dowText}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Day cells */}
            <View style={styles.grid}>
              {cells.map((day, idx) => {
                if (day === null) {
                  return <View key={`empty-${idx}`} style={styles.cell} />;
                }
                const events = dayEvents.get(day) ?? [];
                const isToday = day === today;
                const visible = hidePending
                  ? events.filter((e) => !e.isPending)
                  : events;

                return (
                  <View
                    key={day}
                    style={[styles.cell, isToday && styles.cellToday]}
                  >
                    <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>
                      {day}
                    </Text>
                    {visible.slice(0, 2).map((ev, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.eventLabel,
                          { color: ev.isPending ? Colors.outline : Colors.primary },
                        ]}
                        numberOfLines={1}
                      >
                        {ev.label}
                      </Text>
                    ))}
                    {visible.length > 2 && (
                      <Text style={styles.moreLabel}>+{visible.length - 2}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Completado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.legendText}>Pendiente</Text>
            </View>
          </View>

          {/* Today's focus card */}
          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <View>
                <Text style={styles.focusTitle}>Enfoque de hoy</Text>
                {todayEvents.length === 0 ? (
                  <Text style={styles.focusSub}>Sin eventos para hoy</Text>
                ) : (
                  todayEvents.slice(0, 3).map((e, i) => (
                    <Text key={i} style={styles.focusSub}>
                      {e.isPending ? '○' : '●'} {e.label}
                    </Text>
                  ))
                )}
              </View>
              <View style={styles.focusOrb}>
                <Text style={styles.focusOrbIcon}>🚀</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addEventBtn}
              onPress={() => router.push('/(tabs)/add')}
            >
              <Text style={styles.addEventLabel}>+ AÑADIR EVENTO</Text>
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
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin, paddingVertical: Spacing.four,
  },
  title: { ...Typography.titleMd, color: Colors.primary },
  settingsIcon: { fontSize: 22, color: Colors.onSurfaceVariant, width: 24 },

  scroll: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 100 },

  controls: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  monthTitle: { ...Typography.headlineLgMobile, color: Colors.onSurface },
  pendingText: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  toggle: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center', padding: 2,
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.outline,
  },
  toggleThumbOn: {
    backgroundColor: Colors.onPrimary,
    transform: [{ translateX: 20 }],
  },

  calCard: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md, padding: Spacing.six,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  dowRow: { flexDirection: 'row', marginBottom: Spacing.four },
  dowCell: { flex: 1, alignItems: 'center' },
  dowText: { ...Typography.labelCaps, color: Colors.outline, fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    paddingVertical: Spacing.two,
    paddingHorizontal: 2,
    alignItems: 'center',
    minHeight: 52,
    gap: 2,
  },
  cellToday: {
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.full,
  },
  dayNum: { ...Typography.bodyLg, color: Colors.onSurface },
  dayNumToday: { color: Colors.primary, fontWeight: '700' },
  eventLabel: { fontSize: 7, fontWeight: '600', textAlign: 'center', width: '100%' },
  moreLabel: { fontSize: 7, color: Colors.outline },

  legend: {
    flexDirection: 'row', gap: Spacing.six, alignItems: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...Typography.bodySm, color: Colors.onSurface },

  focusCard: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md,
    padding: Spacing.six,
    gap: Spacing.four,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  focusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  focusTitle: { ...Typography.titleMd, color: Colors.onSurface },
  focusSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 4 },
  focusOrb: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  focusOrbIcon: { fontSize: 20 },
  addEventBtn: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addEventLabel: { ...Typography.labelCaps, color: Colors.onSecondaryContainer },
});
