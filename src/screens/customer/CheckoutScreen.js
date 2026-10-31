import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../styles/theme';
import { rupiah } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../config/api';
import Footer from '../../components/Footer';

export default function CheckoutScreen({ onNavigate }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  async function handleSubmitOrder() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Perhatian', 'Nama lengkap dan nomor telepon wajib diisi.');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('Keranjang Kosong', 'Tambahkan menu terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      // Create order via backend API
      const itemsPayload = cart.map((item) => ({
        id: item.id || item.productId,
        quantity: item.quantity,
      }));

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          orderType,
          paymentMethod,
          items: itemsPayload,
          total: cartTotal,
        }),
      }).catch((err) => {
        // Fallback: If backend order API encounters network issue, still allow client confirmation
        console.warn('Backend order call failed, continuing with client confirmation:', err);
        return { data: { customerName: name, total: cartTotal } };
      });

      setOrderData(res?.data || null);
      clearCart();
      setSuccess(true);
    } catch (err) {
      Alert.alert('Gagal Membuat Pesanan', err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.successCard}>
            <Text style={styles.eyebrow}>RUANG RASA</Text>
            <Text style={styles.successTitle}>Terima kasih, {name}!</Text>
            <Text style={styles.successSub}>Pesanan kamu berhasil dibuat.</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Metode pemesanan:</Text>
              <Text style={styles.infoValue}>
                {orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Metode pembayaran:</Text>
              <Text style={styles.infoValue}>
                {paymentMethod === 'qris'
                  ? 'QRIS (simulasi pembayaran)'
                  : 'Cash di kasir'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total pesanan:</Text>
              <Text style={styles.infoValueHighlight}>
                {rupiah(orderData?.total || cartTotal)}
              </Text>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {orderType === 'dine-in'
                  ? 'Silakan datang ke restoran. Staf kami akan membantu menentukan meja. Jika memilih cash, lakukan pembayaran di kasir.'
                  : `Silakan ambil sendiri pesananmu di restoran. Estimasi pesanan siap adalah 20–30 menit setelah pembayaran. ${
                      paymentMethod === 'cash'
                        ? 'Untuk pembayaran cash, silakan bayar terlebih dahulu di kasir.'
                        : 'Pembayaran QRIS pada prototipe ini hanya simulasi.'
                    }`}
              </Text>
            </View>

            <Text style={styles.disclaimerText}>
              Simpan informasi pesanan ini sebagai referensi. Sistem saat ini
              belum mengirim pesanan ke restoran secara langsung.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onNavigate('Menu')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Kembali ke Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Footer />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>SELANGKAH LAGI</Text>
        <Text style={styles.pageTitle}>Checkout.</Text>

        {cart.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Keranjangmu masih kosong.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onNavigate('Menu')}
            >
              <Text style={styles.primaryButtonText}>Pilih Menu →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama pemesan"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nomor telepon</Text>
              <TextInput
                style={styles.input}
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Metode Pemesanan */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionHeader}>Metode pemesanan</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    orderType === 'dine-in' && styles.typeBtnActive,
                  ]}
                  onPress={() => setOrderType('dine-in')}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      orderType === 'dine-in' && styles.typeBtnTextActive,
                    ]}
                  >
                    Dine In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    orderType === 'take-away' && styles.typeBtnActive,
                  ]}
                  onPress={() => setOrderType('take-away')}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      orderType === 'take-away' && styles.typeBtnTextActive,
                    ]}
                  >
                    Take Away
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.helperText}>
                {orderType === 'dine-in'
                  ? 'Makan di tempat. Meja akan ditentukan oleh staf restoran saat kamu datang.'
                  : 'Pesan sekarang dan ambil sendiri di restoran. Estimasi siap 20–30 menit setelah pembayaran.'}
              </Text>
            </View>

            {/* Metode Pembayaran */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionHeader}>Metode pembayaran</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    paymentMethod === 'qris' && styles.typeBtnActive,
                  ]}
                  onPress={() => setPaymentMethod('qris')}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      paymentMethod === 'qris' && styles.typeBtnTextActive,
                    ]}
                  >
                    QRIS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    paymentMethod === 'cash' && styles.typeBtnActive,
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      paymentMethod === 'cash' && styles.typeBtnTextActive,
                    ]}
                  >
                    Cash di Kasir
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.helperText}>
                {paymentMethod === 'qris'
                  ? 'Pembayaran QRIS dipresentasikan sebagai simulasi untuk prototipe ini. Belum ada transaksi sungguhan.'
                  : 'Pembayaran dilakukan langsung di kasir restoran. Untuk Take Away, estimasi waktu siap dihitung setelah pembayaran.'}
              </Text>
            </View>

            {paymentMethod === 'qris' && (
              <View style={styles.qrisSummaryBox}>
                <Text style={styles.qrisSummaryTitle}>
                  Ringkasan pembayaran QRIS
                </Text>
                <Text style={styles.qrisSummaryAmount}>
                  Total pembayaran: {rupiah(cartTotal)}
                </Text>
              </View>
            )}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total pesanan</Text>
              <Text style={styles.totalAmount}>{rupiah(cartTotal)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSubmitOrder}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.pureWhite} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Buat Pesanan</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  emptyCard: {
    backgroundColor: colors.white,
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: colors.white,
    padding: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.dark,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  typeBtnActive: {
    backgroundColor: colors.olive,
    borderColor: colors.olive,
  },
  typeBtnText: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: colors.pureWhite,
  },
  helperText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
  qrisSummaryBox: {
    backgroundColor: colors.oliveLight,
    padding: 14,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  qrisSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.oliveDark,
    marginBottom: 4,
  },
  qrisSummaryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  totalBox: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.oliveDark,
  },
  primaryButton: {
    backgroundColor: colors.olive,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.pureWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  successCard: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  successSub: {
    fontSize: 15,
    color: colors.oliveDark,
    fontWeight: '600',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
  },
  infoValueHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.oliveDark,
  },
  noteBox: {
    backgroundColor: colors.cream,
    padding: 14,
    borderRadius: 6,
    marginTop: 16,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: colors.dark,
    lineHeight: 18,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
    marginBottom: 20,
  },
});

