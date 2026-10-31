import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { rupiah, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../config/api';
import Footer from '../../components/Footer';

function getStatusStyle(status) {
  switch (status) {
    case 'confirmed':
      return { bg: colors.olive, text: colors.pureWhite };
    case 'ready':
      return { bg: colors.oliveDark, text: colors.pureWhite };
    case 'completed':
      return { bg: colors.dark, text: colors.pureWhite };
    case 'cancelled':
      return { bg: colors.dangerLight, text: colors.danger };
    case 'pending':
    default:
      return { bg: colors.oliveLight, text: colors.oliveDark };
  }
}

export default function ProfileScreen({ onNavigate }) {
  const { user, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    async function fetchMyOrders() {
      setLoadingOrders(true);
      try {
        const res = await apiRequest('/orders/me');
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (_e) {
        // user might not have order history or backend is offline
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchMyOrders();
  }, []);

  function handleLogout() {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah kamu yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>AKUN PENGGUNA</Text>
        <Text style={styles.pageTitle}>Profil Saya.</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
            <Text style={styles.userEmail}>{user?.email || '-'}</Text>
            {user?.phone ? (
              <Text style={styles.userPhone}>{user.phone}</Text>
            ) : null}

            <View style={styles.roleBadge}>
              <Ionicons
                name={user?.role === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
                size={12}
                color={colors.oliveDark}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.roleBadgeText}>
                {user?.role === 'admin' ? 'Administrator' : 'Pelanggan Ruang Rasa'}
              </Text>
            </View>
          </View>
        </View>

        {/* Admin Switcher */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.adminPanelBtn}
            onPress={() => onNavigate('Admin')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="shield-outline"
              size={15}
              color={colors.pureWhite}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.adminPanelBtnText}>
              Masuk ke Admin Panel Restoran
            </Text>
          </TouchableOpacity>
        )}

        {/* Order History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Riwayat Pesanan Saya</Text>

          {loadingOrders ? (
            <ActivityIndicator color={colors.olive} style={{ marginVertical: 16 }} />
          ) : orders.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                Belum ada riwayat pesanan.
              </Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {orders.map((ord) => {
                const badgeStyle = getStatusStyle(ord.status);
                return (
                  <View key={ord.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <View style={styles.orderHeaderLeft}>
                        <Text
                          style={styles.orderId}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          Pesanan #{ord.id}
                        </Text>
                        <Text style={styles.orderDate}>
                          {formatDate(ord.createdAt)}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: badgeStyle.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: badgeStyle.text },
                          ]}
                        >
                          {ord.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.orderItems}>
                      {ord.items?.map((it, idx) => (
                        <Text key={idx} style={styles.orderItemLine}>
                          • {it.name} x{it.quantity}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.orderFooter}>
                      <Text style={styles.orderTotal}>
                        Total: {rupiah(ord.total)}
                      </Text>
                      <Text style={styles.orderType}>
                        {ord.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: 20,
    paddingTop: 28,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: colors.eyebrow,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: colors.pureWhite,
    fontSize: 24,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: colors.oliveLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.oliveDark,
  },
  adminPanelBtn: {
    backgroundColor: colors.oliveDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 16,
  },
  adminPanelBtnText: {
    color: colors.pureWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  emptyHistory: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 13,
    color: colors.muted,
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  orderHeaderLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  orderDate: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  statusBadge: {
    flexShrink: 0,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orderItems: {
    marginBottom: 10,
  },
  orderItemLine: {
    fontSize: 12,
    color: colors.dark,
    lineHeight: 18,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
  },
  orderType: {
    fontSize: 12,
    color: colors.muted,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
