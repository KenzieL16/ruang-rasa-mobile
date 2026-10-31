import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../styles/theme';
import { rupiah, formatDate } from '../../utils/formatters';
import { apiRequest } from '../../config/api';
import Footer from '../../components/Footer';

const STATUS_OPTIONS = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];

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

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchOrders() {
    try {
      const res = await apiRequest('/orders');
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (_e) {
      // Backend may be offline or empty
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((current) =>
        current.map((ord) =>
          ord.id === orderId ? { ...ord, status: newStatus } : ord
        )
      );
      Alert.alert('Status Diperbarui', `Status pesanan diubah menjadi: ${newStatus}`);
    } catch (err) {
      Alert.alert('Gagal', err.message || 'Tidak dapat memperbarui status');
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          colors={[colors.olive]}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>ORDER MANAGEMENT</Text>
        <Text style={styles.pageTitle}>Manage Orders</Text>
        <Text style={styles.pageIntro}>
          Pantau dan kelola pesanan pelanggan Ruang Rasa.
        </Text>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Pesanan</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{orders.length} Pesanan</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.olive} style={{ marginVertical: 24 }} />
          ) : orders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Belum ada data pesanan.</Text>
              <Text style={styles.emptySubtitle}>
                Data pesanan akan ditampilkan setelah pelanggan membuat pesanan
                atau frontend terhubung dengan backend.
              </Text>
            </View>
          ) : (
            <View style={styles.orderList}>
              {orders.map((ord) => {
                const badgeStyle = getStatusStyle(ord.status);
                return (
                  <View key={ord.id} style={styles.orderCard}>
                    <View style={styles.orderTop}>
                      <View style={styles.orderTopLeft}>
                        <Text
                          style={styles.orderCode}
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
                          styles.currentStatusBadge,
                          { backgroundColor: badgeStyle.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currentStatusText,
                            { color: badgeStyle.text },
                          ]}
                        >
                          {ord.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.customerBox}>
                      <Text style={styles.custName}>
                        Pemesan: <Text style={styles.bold}>{ord.customerName}</Text>
                      </Text>
                      <Text style={styles.custPhone}>Telp: {ord.phone}</Text>
                      <Text style={styles.custDetail}>
                        Tipe: {ord.orderType === 'dine-in' ? 'Dine In' : 'Take Away'} · Pembayaran:{' '}
                        {ord.paymentMethod?.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.itemsWrap}>
                      <Text style={styles.itemsTitle}>Menu Dipesan:</Text>
                      {ord.items?.map((it, idx) => (
                        <Text key={idx} style={styles.itemText}>
                          • {it.name} ({it.quantity}x) — {rupiah(it.price * it.quantity)}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total Pembayaran:</Text>
                      <Text style={styles.totalAmount}>{rupiah(ord.total)}</Text>
                    </View>

                    <View style={styles.statusUpdateRow}>
                      <Text style={styles.updateLabel}>Ubah Status:</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statusChips}
                      >
                        {STATUS_OPTIONS.map((st) => {
                          const isCurrent = ord.status === st;
                          return (
                            <TouchableOpacity
                              key={st}
                              style={[
                                styles.statusChip,
                                isCurrent && styles.statusChipActive,
                              ]}
                              onPress={() => updateOrderStatus(ord.id, st)}
                              disabled={isCurrent}
                            >
                              <Text
                                style={[
                                  styles.statusChipText,
                                  isCurrent && styles.statusChipTextActive,
                                ]}
                              >
                                {st}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
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
    paddingTop: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: colors.eyebrow,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  pageIntro: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  countBadge: {
    backgroundColor: colors.oliveLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.oliveDark,
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  orderList: {
    gap: 16,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.cream,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  orderTopLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  orderDate: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  currentStatusBadge: {
    flexShrink: 0,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentStatusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  customerBox: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  custName: {
    fontSize: 13,
    color: colors.dark,
    marginBottom: 2,
  },
  bold: {
    fontWeight: '700',
  },
  custPhone: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
  },
  custDetail: {
    fontSize: 12,
    color: colors.muted,
  },
  itemsWrap: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    color: colors.dark,
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.oliveDark,
  },
  statusUpdateRow: {
    marginTop: 6,
  },
  updateLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: 6,
  },
  statusChips: {
    flexDirection: 'row',
    gap: 6,
  },
  statusChip: {
    backgroundColor: colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statusChipActive: {
    backgroundColor: colors.olive,
    borderColor: colors.olive,
  },
  statusChipText: {
    fontSize: 11,
    color: colors.dark,
    fontWeight: '600',
  },
  statusChipTextActive: {
    color: colors.pureWhite,
  },
});
