import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';
import { useCart } from '../context/CartContext';

export default function BottomNav({ currentScreen, onNavigate }) {
  const { cartCount } = useCart();

  const tabs = [
    {
      key: 'Home',
      label: 'Beranda',
      iconActive: 'home',
      iconInactive: 'home-outline',
    },
    {
      key: 'Menu',
      label: 'Menu',
      iconActive: 'restaurant',
      iconInactive: 'restaurant-outline',
    },
    {
      key: 'Cart',
      label: 'Keranjang',
      iconActive: 'bag-handle',
      iconInactive: 'bag-handle-outline',
      badge: cartCount,
    },
    {
      key: 'Profile',
      label: 'Akun',
      iconActive: 'person',
      iconInactive: 'person-outline',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.key;
        const iconColor = isActive ? colors.olive : colors.muted;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.iconInactive}
                size={22}
                color={iconColor}
              />
              {Boolean(tab.badge && tab.badge > 0) && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 76 : 64,
    paddingBottom: Platform.OS === 'ios' ? 18 : 8,
    paddingTop: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    position: 'relative',
    marginBottom: 3,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.olive,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.pureWhite,
    fontSize: 10,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.olive,
    fontWeight: '700',
  },
});
