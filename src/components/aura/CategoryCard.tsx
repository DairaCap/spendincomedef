import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, Radius, Spacing } from '../../constants/theme';
import type { Categoria, GastoConDetalles } from '../../types/database';

interface CategoryCardProps {
  categoria: Categoria;
  gastos: GastoConDetalles[];
  onPress?: () => void;
}

export function CategoryCard({ categoria, gastos, onPress }: CategoryCardProps) {
  const categoryColor = categoria.color?.codigo_hex ?? Colors.primary;

  // Calculate total spent for this category
  const totalSpent = gastos
    .filter((g) => g.id_categoria === categoria.id_categoria)
    .reduce((sum, g) => sum + g.monto, 0);

  const pct = categoria.valor_limite > 0
    ? Math.min(totalSpent / categoria.valor_limite, 1)
    : 0;

  const isOverBudget = totalSpent > categoria.valor_limite && categoria.valor_limite > 0;

  const barColor = isOverBudget ? Colors.error : categoryColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      {/* Icon + Edit */}
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: categoryColor + '20' }]}>
          <Text style={[styles.iconText, { color: categoryColor }]}>
            {categoria.nombre.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.edit}>✎</Text>
      </View>

      {/* Name & amounts */}
      <View>
        <Text style={styles.name} numberOfLines={1}>{categoria.nombre}</Text>
        <Text style={styles.amounts}>
          ${totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 0 })} /{' '}
          ${categoria.valor_limite.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${pct * 100}%`,
              backgroundColor: barColor,
              shadowColor: barColor,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md,
    padding: Spacing.five,
    gap: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...Typography.titleMd,
    fontWeight: '700',
  },
  edit: {
    color: Colors.outlineVariant,
    fontSize: 16,
  },
  name: {
    ...Typography.titleMd,
    color: Colors.onSurface,
  },
  amounts: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});
