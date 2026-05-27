import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/colors';
import { Typography, Radius, Spacing, Shadows } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    }
    // Navigation handled by root _layout auth guard
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Neon glow orb */}
          <View style={styles.orb} />
          <Text style={styles.appName}>Aura Finance</Text>
          <Text style={styles.tagline}>Tu cockpit financiero personal</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={Colors.surfaceContainerHighest}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.surfaceContainerHighest}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Entrar →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerLinkText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerLinkAccent}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    padding: Spacing.containerMargin,
    justifyContent: 'center',
    gap: Spacing.sectionGap,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    position: 'relative',
    paddingVertical: Spacing.six,
  },
  orb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff00ff',
    opacity: 0.06,
    top: -40,
    alignSelf: 'center',
  },
  appName: {
    ...Typography.displayLg,
    color: Colors.primary,
    ...Shadows.neon,
  },
  tagline: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md,
    padding: Spacing.six,
    gap: Spacing.stackGap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  cardTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.onSurface,
    marginBottom: Spacing.two,
  },
  errorBox: {
    backgroundColor: Colors.errorContainer + '33',
    borderRadius: Radius.DEFAULT,
    padding: Spacing.three,
  },
  errorText: {
    ...Typography.bodySm,
    color: Colors.error,
  },
  fieldGroup: { gap: 6 },
  label: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  inputWrap: {
    backgroundColor: Colors.background,
    borderRadius: Radius.DEFAULT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  input: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    padding: Spacing.four,
    borderRadius: Radius.DEFAULT,
  },
  loginBtn: {
    backgroundColor: '#cc00cc',
    borderRadius: Radius.full,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: Spacing.two,
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  loginBtnText: {
    ...Typography.titleMd,
    color: '#fff',
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  registerLinkText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  registerLinkAccent: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
