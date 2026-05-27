import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, Radius, Spacing } from '../../constants/theme';
import type { GastoConDetalles } from '../../types/database';

interface TransactionRowProps {
  gasto: GastoConDetalles;
  onPress?: () => void;
}

export function TransactionRow({ gasto, onPress }: TransactionRowProps) {
  const isPending = gasto.estado?.nombre === 'PENDIENTE';
  const categoryColor = gasto.categoria?.color?.codigo_hex ?? Colors.primary;
  const initials = gasto.comercio.slice(0, 2).toUpperCase();

  const formattedDate = new Date(gasto.fecha_cobro).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.row}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: categoryColor + '20' }]}>
        <Text style={[styles.avatarText, { color: categoryColor }]}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.merchant} numberOfLines={1}>{gasto.comercio}</Text>
        <View style={styles.meta}>
          {gasto.categoria && (
            <View style={[styles.chip, { borderColor: categoryColor + '40', backgroundColor: categoryColor + '15' }]}>
              <Text style={[styles.chipText, { color: categoryColor }]}>
                {gasto.categoria.nombre}
              </Text>
            </View>
          )}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

      {/* Amount + status */}
      <View style={styles.right}>
        <Text style={styles.amount}>-${gasto.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
        <View style={[styles.statusDot, { backgroundColor: isPending ? Colors.outline : Colors.primary }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.DEFAULT,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.titleMd,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  merchant: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...Typography.labelCaps,
    fontSize: 10,
  },
  date: {
    ...Typography.bodySm,
    color: Colors.outline,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    ...Typography.titleMd,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
