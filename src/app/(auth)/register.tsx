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
import { Typography, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password || !confirm) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password, nombre);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.orb} />
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successTitle}>¡Cuenta creada!</Text>
        <Text style={styles.successSub}>
          Revisa tu email para confirmar tu cuenta y luego inicia sesión.
        </Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.loginBtnText}>Ir al login →</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <View style={styles.header}>
          <View style={styles.orb} />
          <Text style={styles.appName}>Aura Finance</Text>
          <Text style={styles.tagline}>Crea tu cuenta</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registro</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {[
            { label: 'NOMBRE', value: nombre, setter: setNombre, placeholder: 'Tu nombre completo', secure: false, keyboard: 'default' as const },
            { label: 'EMAIL', value: email, setter: setEmail, placeholder: 'tu@email.com', secure: false, keyboard: 'email-address' as const },
            { label: 'CONTRASEÑA', value: password, setter: setPassword, placeholder: '••••••••', secure: true, keyboard: 'default' as const },
            { label: 'CONFIRMAR', value: confirm, setter: setConfirm, placeholder: '••••••••', secure: true, keyboard: 'default' as const },
          ].map((field) => (
            <View key={field.label} style={styles.fieldGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.surfaceContainerHighest}
                  value={field.value}
                  onChangeText={field.setter}
                  secureTextEntry={field.secure}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Crear cuenta →</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.registerLinkText}>
            ¿Ya tienes cuenta?{' '}
            <Text style={styles.registerLinkAccent}>Inicia sesión</Text>
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
    paddingVertical: Spacing.four,
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
  },
  tagline: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
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
  errorText: { ...Typography.bodySm, color: Colors.error },
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
  registerLinkAccent: { color: Colors.primary, fontWeight: '600' },
  // Success state
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.containerMargin,
    gap: Spacing.stackGap,
  },
  successIcon: {
    fontSize: 64,
    color: Colors.primary,
  },
  successTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  successSub: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
