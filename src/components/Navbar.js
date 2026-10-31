import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentScreen, onNavigate }) {
  const { cartCount } = useCart();
  const { isAdmin } = useAuth();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => onNavigate('Home')}
        activeOpacity={0.7}
        style={styles.brandWrapper}
      >
        <Text style={styles.brand}>
          RUANG RASA<Text style={styles.brandMark}>®</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        {isAdmin && (
          <TouchableOpacity
            style={styles.adminBadgeBtn}
            onPress={() => onNavigate('Admin')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={13}
              color={colors.oliveDark}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.adminBadgeText}>Panel Admin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.cartButton,
            currentScreen === 'Cart' && styles.cartButtonActive,
          ]}
          onPress={() => onNavigate('Cart')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="bag-handle-outline"
            size={14}
            color={colors.pureWhite}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.cartButtonText}>
            Keranjang ({cartCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brandWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.dark,
  },
  brandMark: {
    fontSize: 9,
    fontWeight: 'normal',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminBadgeBtn: {
    backgroundColor: colors.badge,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.oliveDark,
  },
  cartButton: {
    backgroundColor: colors.olive,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cartButtonActive: {
    backgroundColor: colors.oliveDark,
  },
  cartButtonText: {
    color: colors.pureWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});
