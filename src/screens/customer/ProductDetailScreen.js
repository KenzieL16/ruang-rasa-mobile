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

export default function ProductDetailScreen({ product, onNavigate, onBack }) {
  const { addToCart } = useCart();

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Menu tidak ditemukan.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onNavigate('Menu')}
        >
          <Text style={styles.primaryButtonText}>Kembali ke Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleAddToCart() {
    addToCart(product);
    onNavigate('Cart');
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || (() => onNavigate('Menu'))}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Image
            source={getImageSource(product.image)}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.body}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{rupiah(product.price)}</Text>
            <Text style={styles.description}>{product.description}</Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                Tambah ke Keranjang
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: colors.line,
  },
  body: {
    padding: 20,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.eyebrow,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.oliveDark,
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 24,
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
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
  },
});

