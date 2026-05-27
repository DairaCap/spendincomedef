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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { useGastos } from '../../hooks/useGastos';
import { useIngresos } from '../../hooks/useIngresos';
import { useCategorias } from '../../hooks/useCategorias';
import { useTarjetas } from '../../hooks/useTarjetas';
import { useSuscripciones } from '../../hooks/useSuscripciones';
import { useFrecuencias } from '../../hooks/useFrecuencias';
import { supabase } from '../../../utils/supabase';

type EntryType = 'gasto' | 'ingreso' | 'suscripcion';

export default function AddScreen() {
  const { addGasto } = useGastos();
  const { addIngreso } = useIngresos();
  const { addSuscripcion } = useSuscripciones();
  const { categorias } = useCategorias();
  const { tarjetas } = useTarjetas();
  const { frecuencias } = useFrecuencias();

  const [type, setType] = useState<EntryType>('gasto');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [selectedTarjeta, setSelectedTarjeta] = useState<string>('');
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [selectedFrecuencia, setSelectedFrecuencia] = useState<string>('');
  const [diaCobro, setDiaCobro] = useState(new Date().getDate().toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Ingresa un monto válido.');
      return;
    }
    setLoading(true);
    setError(null);

    const montoNum = parseFloat(amount);

    try {
      if (type === 'ingreso') {
        const { error: err } = await addIngreso({
          monto: montoNum,
          fecha_ingreso: fecha,
          es_recurrente: esRecurrente,
          descripcion: description || null,
        });
        if (err) { setError(err); setLoading(false); return; }
      } else if (type === 'gasto') {
        const { data: estados, error: estError } = await supabase
          .from('cat_estado_gasto')
          .select('*')
          .eq('nombre', 'COMPLETADO')
          .single();

        if (estError || !estados) {
          setError('Error al obtener el estado del gasto.');
          setLoading(false);
          return;
        }

        const { error: err } = await addGasto({
          comercio: description || 'Sin descripción',
          monto: montoNum,
          fecha_cobro: fecha,
          id_categoria: selectedCat || null,
          id_tarjeta: selectedTarjeta || null,
          id_plan_msi: null,
          id_suscripcion: null,
          id_estado: estados.id_estado,
        });
        if (err) { setError(err); setLoading(false); return; }
      } else if (type === 'suscripcion') {
        if (!selectedCat) {
          setError('Selecciona una categoría para la suscripción.');
          setLoading(false);
          return;
        }
        if (!selectedFrecuencia) {
          setError('Selecciona una frecuencia de cobro.');
          setLoading(false);
          return;
        }
        const diaCobroNum = parseInt(diaCobro);
        if (isNaN(diaCobroNum) || diaCobroNum < 1 || diaCobroNum > 31) {
          setError('Ingresa un día de cobro válido (1 al 31).');
          setLoading(false);
          return;
        }

        const { error: err } = await addSuscripcion({
          comercio: description || 'Suscripción sin nombre',
          monto_estimado: montoNum,
          id_categoria: selectedCat,
          id_tarjeta: selectedTarjeta || null,
          id_frecuencia: selectedFrecuencia,
          dia_cobro: diaCobroNum,
          fecha_cancelacion: null,
        });
        if (err) { setError(err); setLoading(false); return; }
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setDescription('');
        setSelectedCat('');
        setSelectedTarjeta('');
        setSelectedFrecuencia('');
        setDiaCobro(new Date().getDate().toString());
        setEsRecurrente(false);
        router.push('/(tabs)');
      }, 1200);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error inesperado.');
      setLoading(false);
    }
  };

  const TABS: { key: EntryType; label: string }[] = [
    { key: 'gasto', label: 'GASTO' },
    { key: 'ingreso', label: 'INGRESO' },
    { key: 'suscripcion', label: 'SUSCRIPCIÓN' },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <View style={styles.avatar} />
              <Text style={styles.title}>Nueva entrada</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Text style={styles.settingsIcon}>⚙</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Type toggle */}
            <View style={styles.toggle}>
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.toggleBtn, type === tab.key && styles.toggleBtnActive]}
                  onPress={() => setType(tab.key)}
                >
                  <Text style={[styles.toggleLabel, type === tab.key && styles.toggleLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>
                {type === 'suscripcion' ? 'MONTO ESTIMADO' : 'MONTO'}
              </Text>
              <View style={styles.amountRow}>
                <Text style={styles.currency}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={Colors.surfaceContainerHighest}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Description */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  {type === 'ingreso' ? 'DESCRIPCIÓN' : 'COMERCIO / DESCRIPCIÓN'}
                </Text>
                <View style={styles.inputCard}>
                  <TextInput
                    style={styles.input}
                    placeholder={
                      type === 'ingreso' 
                        ? 'Ej. Salario mensual' 
                        : type === 'suscripcion'
                          ? 'Ej. Netflix, Spotify'
                          : 'Ej. Supermercado'
                    }
                    placeholderTextColor={Colors.surfaceContainerHighest}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </View>

              {/* Date (for Gasto and Ingreso) */}
              {type !== 'suscripcion' && (
                <View style={styles.field}>
                  <Text style={styles.label}>FECHA</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      style={styles.input}
                      value={fecha}
                      onChangeText={setFecha}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={Colors.surfaceContainerHighest}
                    />
                  </View>
                </View>
              )}

              {/* Es Recurrente toggle (only for ingreso) */}
              {type === 'ingreso' && (
                <View style={styles.field}>
                  <Text style={styles.label}>¿ES RECURRENTE?</Text>
                  <View style={styles.toggleRow}>
                    <TouchableOpacity
                      style={[styles.switchBtn, !esRecurrente && styles.switchBtnActive]}
                      onPress={() => setEsRecurrente(false)}
                    >
                      <Text style={[styles.switchLabel, !esRecurrente && styles.switchLabelActive]}>
                        PAGO ÚNICO
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.switchBtn, esRecurrente && styles.switchBtnActive]}
                      onPress={() => setEsRecurrente(true)}
                    >
                      <Text style={[styles.switchLabel, esRecurrente && styles.switchLabelActive]}>
                        RECURRENTE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Categoría picker (only for gasto/suscripcion) */}
              {type !== 'ingreso' && categorias.length > 0 && (
                <View style={styles.field}>
                  <Text style={styles.label}>CATEGORÍA</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                  >
                    {categorias.map((c) => (
                      <TouchableOpacity
                        key={c.id_categoria}
                        style={[
                          styles.chip,
                          selectedCat === c.id_categoria && styles.chipActive,
                        ]}
                        onPress={() => setSelectedCat(
                          selectedCat === c.id_categoria ? '' : c.id_categoria
                        )}
                      >
                        <Text style={[
                          styles.chipText,
                          selectedCat === c.id_categoria && styles.chipTextActive,
                        ]}>
                          {c.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Frecuencia selector (only for suscripcion) */}
              {type === 'suscripcion' && frecuencias.length > 0 && (
                <View style={styles.field}>
                  <Text style={styles.label}>FRECUENCIA DE COBRO</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                  >
                    {frecuencias.map((f) => (
                      <TouchableOpacity
                        key={f.id_frecuencia}
                        style={[
                          styles.chip,
                          selectedFrecuencia === f.id_frecuencia && styles.chipActive,
                        ]}
                        onPress={() => setSelectedFrecuencia(f.id_frecuencia)}
                      >
                        <Text style={[
                          styles.chipText,
                          selectedFrecuencia === f.id_frecuencia && styles.chipTextActive,
                        ]}>
                          {f.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Dia de cobro (only for suscripcion) */}
              {type === 'suscripcion' && (
                <View style={styles.field}>
                  <Text style={styles.label}>DÍA DE COBRO MENSUAL (1 AL 31)</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      style={styles.input}
                      value={diaCobro}
                      onChangeText={setDiaCobro}
                      placeholder="Ej. 5"
                      placeholderTextColor={Colors.surfaceContainerHighest}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              )}

              {/* Tarjeta picker (only for gasto/suscripcion) */}
              {type !== 'ingreso' && tarjetas.length > 0 && (
                <View style={styles.field}>
                  <Text style={styles.label}>MÉTODO DE PAGO</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                  >
                    <TouchableOpacity
                      style={[styles.chip, !selectedTarjeta && styles.chipActive]}
                      onPress={() => setSelectedTarjeta('')}
                    >
                      <Text style={[styles.chipText, !selectedTarjeta && styles.chipTextActive]}>
                        Efectivo
                      </Text>
                    </TouchableOpacity>
                    {tarjetas.map((t) => (
                      <TouchableOpacity
                        key={t.id_tarjeta}
                        style={[
                          styles.chip,
                          selectedTarjeta === t.id_tarjeta && styles.chipActive,
                        ]}
                        onPress={() =>
                          setSelectedTarjeta(
                            selectedTarjeta === t.id_tarjeta ? '' : t.id_tarjeta
                          )
                        }
                      >
                        <Text style={[
                          styles.chipText,
                          selectedTarjeta === t.id_tarjeta && styles.chipTextActive,
                        ]}>
                          {t.nombre} {t.ultimos_4_digitos ? `••${t.ultimos_4_digitos}` : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Attach receipt */}
              {type === 'gasto' && (
                <View style={styles.receiptArea}>
                  <Text style={styles.receiptIcon}>📷</Text>
                  <Text style={styles.receiptText}>Adjuntar ticket o factura</Text>
                </View>
              )}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, success && styles.submitBtnSuccess]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitLabel}>
                  {success ? '✓ Guardado' : 'Confirmar →'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin, paddingVertical: Spacing.four,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 2, borderColor: Colors.primary + '33',
  },
  title: { ...Typography.headlineLgMobile, color: Colors.primary },
  settingsIcon: { fontSize: 22, color: Colors.onSurfaceVariant },

  scroll: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 100 },

  toggle: {
    flexDirection: 'row',
    backgroundColor: '#1A1D23',
    borderRadius: Radius.md,
    padding: 6,
    gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: Radius.DEFAULT,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.primaryContainer },
  toggleLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  toggleLabelActive: { color: Colors.onPrimaryContainer },

  amountSection: { alignItems: 'center', gap: Spacing.two },
  amountLabel: { ...Typography.labelCaps, color: Colors.outline },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  currency: { ...Typography.displayLg, color: Colors.primary },
  amountInput: {
    ...Typography.displayLg, color: Colors.onSurface,
    textAlign: 'center', minWidth: 160,
    backgroundColor: 'transparent',
  },

  form: { gap: Spacing.stackGap },
  errorBox: {
    backgroundColor: Colors.errorContainer + '33',
    borderRadius: Radius.DEFAULT, padding: Spacing.three,
  },
  errorText: { ...Typography.bodySm, color: Colors.error },
  field: { gap: 6 },
  label: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, marginLeft: 4 },
  inputCard: {
    backgroundColor: '#1A1D23', borderRadius: Radius.md, padding: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.DEFAULT,
    ...Typography.bodyLg, color: Colors.onSurface,
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.three,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, shadowRadius: 4,
  },
  row2col: { flexDirection: 'row', gap: Spacing.stackGap },
  chipRow: { gap: Spacing.two, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainer,
  },
  chipActive: { backgroundColor: Colors.primaryContainer },
  chipText: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  chipTextActive: { color: Colors.onPrimaryContainer },

  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1D23',
    borderRadius: Radius.full,
    padding: 4,
    gap: 4,
    width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  switchBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.full,
    alignItems: 'center',
  },
  switchBtnActive: { backgroundColor: Colors.primaryContainer },
  switchLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 11 },
  switchLabelActive: { color: Colors.onPrimaryContainer },

  receiptArea: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.outlineVariant + '50',
    borderRadius: Radius.md,
    padding: Spacing.six,
    alignItems: 'center', gap: Spacing.two,
    backgroundColor: '#1A1D23',
  },
  receiptIcon: { fontSize: 32 },
  receiptText: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },

  submitBtn: {
    backgroundColor: '#cc00cc', borderRadius: Radius.full,
    paddingVertical: 20, alignItems: 'center',
    shadowColor: '#ff00ff', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  submitBtnSuccess: { backgroundColor: '#00aa66', shadowColor: '#00ff88' },
  submitLabel: { ...Typography.titleMd, color: '#fff', fontWeight: '700' },
});

