import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Radius } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTarjetas } from '../../hooks/useTarjetas';

const CARD_GRADIENTS = [
  { bg: '#cc00cc', shadow: '#ff00ff' },
  { bg: '#5500aa', shadow: '#7701d0' },
  { bg: '#272a30', shadow: '#000' },
];

export default function CardsScreen() {
  const { user } = useAuth();
  const { tarjetas, loading, refresh } = useTarjetas();
  const [search, setSearch] = useState('');
  const userName = user?.user_metadata?.nombre ?? 'Usuario';
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.title}>Tarjetas</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primary} />
          }
        >
          {/* Cards section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tus Tarjetas</Text>
              <TouchableOpacity>
                <Text style={styles.addLink}>+ Agregar</Text>
              </TouchableOpacity>
            </View>

            {tarjetas.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Sin tarjetas registradas</Text>
                <Text style={styles.emptySubText}>Agrega una tarjeta para empezar</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
                snapToInterval={296}
                decelerationRate="fast"
              >
                {tarjetas.map((tarjeta, idx) => {
                  const grad = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                  return (
                    <View
                      key={tarjeta.id_tarjeta}
                      style={[
                        styles.creditCard,
                        { backgroundColor: grad.bg, shadowColor: grad.shadow },
                      ]}
                    >
                      <View style={styles.cardTop}>
                        <Text style={styles.cardLabel}>{tarjeta.nombre}</Text>
                        <View style={styles.cardChip} />
                      </View>
                      <View style={styles.cardBottom}>
                        <Text style={styles.cardNumber}>
                          •••• •••• •••• {tarjeta.ultimos_4_digitos ?? '????'}
                        </Text>
                        <Text style={styles.cardHolder}>
                          {userName.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Quick actions bento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.bentoGrid}>
              <TouchableOpacity style={[styles.bentoCard, styles.bentoCardDark]}>
                <Text style={styles.bentoIcon}>⊞</Text>
                <Text style={styles.bentoLabel}>Escanear QR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bentoCard, styles.bentoCardDarker]}>
                <Text style={[styles.bentoIcon, { color: Colors.tertiary }]}>→</Text>
                <Text style={styles.bentoLabel}>Transferir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contacts section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contactos Guardados</Text>
              <View style={styles.searchWrap}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar..."
                  placeholderTextColor={Colors.outline}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            <View style={styles.contactsCard}>
              {['Jordan Duarte', 'Mariana Silva', 'Erik Kincaid', 'Lucia Castro'].map((name, i) => {
                const initials2 = name.split(' ').map((n) => n[0]).join('').toUpperCase();
                const colors = [
                  Colors.secondaryContainer,
                  Colors.tertiaryContainer,
                  Colors.primaryContainer,
                  Colors.surfaceContainerHighest,
                ];
                return (
                  <TouchableOpacity key={name} style={styles.contactRow} activeOpacity={0.7}>
                    <View style={[styles.contactAvatar, { backgroundColor: colors[i % colors.length] }]}>
                      <Text style={styles.contactInitials}>{initials2}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{name}</Text>
                      <Text style={styles.contactSub}>CLABE guardada</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 2, borderColor: Colors.primary + '33',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.labelCaps, color: Colors.primary },
  title: { ...Typography.titleMd, color: Colors.primary },
  settingsIcon: { fontSize: 22, color: Colors.onSurfaceVariant },

  scroll: { padding: Spacing.containerMargin, gap: Spacing.sectionGap, paddingBottom: 100 },

  section: { gap: Spacing.stackGap },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.headlineLgMobile, color: Colors.onBackground },
  addLink: { ...Typography.labelCaps, color: Colors.primary },

  cardsRow: { gap: Spacing.stackGap, paddingRight: Spacing.containerMargin },
  creditCard: {
    width: 280, height: 176,
    borderRadius: Radius.md,
    padding: Spacing.six,
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { ...Typography.labelCaps, color: 'rgba(255,255,255,0.9)' },
  cardChip: { width: 36, height: 24, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardBottom: { gap: 4 },
  cardNumber: { ...Typography.titleMd, color: '#fff', letterSpacing: 2 },
  cardHolder: { ...Typography.bodySm, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },

  bentoGrid: { flexDirection: 'row', gap: Spacing.stackGap },
  bentoCard: {
    flex: 1, height: 140,
    borderRadius: Radius.DEFAULT,
    padding: Spacing.six,
    justifyContent: 'space-between',
  },
  bentoCardDark: { backgroundColor: Colors.surfaceContainer },
  bentoCardDarker: { backgroundColor: Colors.surfaceContainerHigh },
  bentoIcon: { fontSize: 28, color: Colors.primary },
  bentoLabel: { ...Typography.titleMd, color: Colors.onSurface },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  searchIcon: { fontSize: 16, color: Colors.outline },
  searchInput: {
    ...Typography.bodySm, color: Colors.onSurface,
    width: 100,
  },

  contactsCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.DEFAULT,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.two, borderRadius: Radius.DEFAULT,
    gap: Spacing.four,
  },
  contactAvatar: {
    width: 48, height: 48, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  contactInitials: { ...Typography.titleMd, fontWeight: '700', color: '#fff', fontSize: 16 },
  contactInfo: { flex: 1, gap: 2 },
  contactName: { ...Typography.bodyLg, color: Colors.onBackground },
  contactSub: { ...Typography.bodySm, color: Colors.outline },
  chevron: { fontSize: 20, color: Colors.outline },

  emptyCard: {
    backgroundColor: '#1A1D23', borderRadius: Radius.DEFAULT,
    padding: Spacing.six, alignItems: 'center', gap: Spacing.two,
  },
  emptyText: { ...Typography.bodyLg, color: Colors.onSurface },
  emptySubText: { ...Typography.bodySm, color: Colors.onSurfaceVariant, textAlign: 'center' },
});
