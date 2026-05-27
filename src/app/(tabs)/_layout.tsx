import React from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, Radius, Spacing } from '../../constants/theme';

// Simple icon using text characters (no extra package needed)
const TabIcon = ({
  icon,
  focused,
}: {
  icon: string;
  focused: boolean;
}) => (
  <View style={styles.tabIconWrap}>
    <Text style={[styles.tabIconText, focused && styles.tabIconActive]}>
      {icon}
    </Text>
    {focused && <View style={styles.activeDot} />}
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.outlineVariant,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⊞" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⬡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="≡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⊟" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface + 'CC', // 80% opacity
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIconText: {
    fontSize: 22,
    color: Colors.outlineVariant,
  },
  tabIconActive: {
    color: Colors.primary,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: '#cc00cc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  addButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 32,
    fontWeight: '300',
  },
});
