import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors } from '../../styles/theme';
import { rupiah } from '../../utils/formatters';
import { getImageSource } from '../../utils/assetImages';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/Footer';

export default function CartScreen({ onNavigate }) {
  const { cart, changeQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>PESANANMU</Text>
        <Text style={styles.pageTitle}>Keranjang.</Text>

        {cart.length === 0 ? (
          <View style={styles.emptyCartCard}>
            <Text style={styles.emptyCartText}>Keranjangmu masih kosong.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onNavigate('Menu')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Jelajahi Menu →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cartList}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartRow}>
                  <Image
                    source={getImageSource(item.image)}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{rupiah(item.price)}</Text>

                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => changeQuantity(item.id, item.quantity - 1)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyValue}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => changeQuantity(item.id, item.quantity + 1)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeBtnText}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total pesanan</Text>
              <Text style={styles.totalValue}>{rupiah(cartTotal)}</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onNavigate('Checkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                Lanjut ke Checkout →
              </Text>
            </TouchableOpacity>
          </>
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
  emptyCartCard: {
    backgroundColor: colors.white,
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyCartText: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20,
  },
  cartList: {
    gap: 14,
    marginBottom: 20,
  },
  cartRow: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: colors.line,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    minWidth: 16,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
  },
  removeBtnText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  totalBox: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
  },
  totalValue: {
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
  primaryButtonText: {
    color: colors.pureWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});

