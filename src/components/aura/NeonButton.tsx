import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, Radius, Shadows } from '../../constants/theme';

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export function NeonButton({
  label,
  onPress,
  loading = false,
  style,
  variant = 'primary',
  icon,
}: NeonButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : Colors.onSurface} />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={variant === 'primary' ? styles.labelPrimary : styles.labelSecondary}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    // Simulated gradient with magenta (LinearGradient would need expo-linear-gradient)
    backgroundColor: '#cc00cc',
    ...Shadows.neon,
  },
  secondary: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  labelPrimary: {
    ...Typography.titleMd,
    color: '#ffffff',
    fontWeight: '700',
  },
  labelSecondary: {
    ...Typography.titleMd,
    color: Colors.onSurface,
  },
});
