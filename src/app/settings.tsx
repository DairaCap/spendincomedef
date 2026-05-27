import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radius } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../utils/supabase';
import type { Usuario } from '../types/database';

interface SettingItem {
  icon: string;
  title: string;
  sub: string;
  color: string;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', user.id)
      .single()
      .then(({ data }) => {
        if (data) setUsuario(data as Usuario);
        setLoading(false);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = usuario?.nombre ?? user?.user_metadata?.nombre ?? user?.email?.split('@')[0] ?? 'Usuario';
  const initials = displayName.slice(0, 2).toUpperCase();

  const SETTINGS: SettingItem[] = [
    {
      icon: '👤',
      title: 'Perfil',
      sub: 'Información personal',
      color: Colors.primary,
    },
    {
      icon: '🎛',
      title: 'Preferencias',
      sub: 'Moneda, idioma y pantalla',
      color: Colors.secondary,
    },
    {
      icon: '🔔',
      title: 'Notificaciones',
      sub: 'Alertas y recordatorios',
      color: Colors.tertiary,
    },
    {
      icon: '🛡',
      title: 'Seguridad',
      sub: 'Biometría, 2FA y privacidad',
      color: Colors.primary,
    },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ajustes</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Profile hero */}
          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.sectionGap }} />
          ) : (
            <View style={styles.profileSection}>
              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              </View>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>
                {usuario?.email ?? user?.email ?? ''}
              </Text>
            </View>
          )}

          {/* Settings list */}
          <View style={styles.settingsList}>
            {SETTINGS.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.settingRow}
                activeOpacity={0.8}
                onPress={item.onPress}
              >
                <View style={[styles.settingIconWrap, { backgroundColor: Colors.surfaceContainerHigh }]}>
                  <Text style={styles.settingIconText}>{item.icon}</Text>
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSub}>{item.sub}</Text>
                </View>
                <Text style={[styles.chevron, { color: item.color }]}>›</Text>
              </TouchableOpacity>
            ))}

            {/* Sign out — destructive */}
            <TouchableOpacity
              style={[styles.settingRow, { marginTop: Spacing.stackGap }]}
              activeOpacity={0.8}
              onPress={handleSignOut}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: Colors.errorContainer + '22' }]}>
                <Text style={styles.settingIconText}>🚪</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: Colors.error }]}>Cerrar sesión</Text>
                <Text style={styles.settingSub}>Terminar sesión de forma segura</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoVersion}>VERSIÓN 1.0.0</Text>
            <Text style={styles.appInfoCopy}>© 2024 Aura Finance</Text>
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
  backIcon: { fontSize: 28, color: Colors.primary, fontWeight: '300', width: 28 },
  title: { ...Typography.titleMd, color: Colors.primary },

  scroll: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 60 },

  profileSection: { alignItems: 'center', gap: Spacing.three },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    padding: 3,
    backgroundColor: Colors.primaryContainer,
  },
  avatarInner: {
    flex: 1, borderRadius: 45,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.displayLg, color: Colors.primary, fontSize: 32 },
  profileName: { ...Typography.headlineLgMobile, color: Colors.onSurface },
  profileEmail: { ...Typography.bodySm, color: Colors.onSurfaceVariant },

  settingsList: { gap: Spacing.stackGap },
  settingRow: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md,
    padding: Spacing.six,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.four,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  settingIconWrap: {
    width: 48, height: 48, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  settingIconText: { fontSize: 22 },
  settingInfo: { flex: 1, gap: 2 },
  settingTitle: { ...Typography.titleMd, color: Colors.onSurface },
  settingSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  chevron: { fontSize: 22 },

  appInfo: { alignItems: 'center', gap: Spacing.two, marginTop: Spacing.four },
  appInfoVersion: { ...Typography.labelCaps, color: Colors.outlineVariant },
  appInfoCopy: { ...Typography.bodySm, color: Colors.outlineVariant },
});
