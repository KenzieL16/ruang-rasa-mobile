import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { colors } from '../../styles/theme';
import { rupiah } from '../../utils/formatters';
import { getImageSource } from '../../utils/assetImages';
import { apiRequest } from '../../config/api';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/Footer';

const CATEGORIES = [
  'Semua',
  'Makanan Utama',
  'Camilan',
  'Dessert',
  'Minuman',
];

export default function MenuScreen({ initialCategory = 'Semua', onNavigate }) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Semua');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function fetchProducts() {
    try {
      const res = await apiRequest('/products');
      const data = Array.isArray(res.data) ? res.data : res.data?.products || [];
      setProducts(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal mengambil data produk dari server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredProducts = products.filter((item) => {
    const matchCat =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchKey = item.name.toLowerCase().includes(keyword.toLowerCase());
    return matchCat && matchKey;
  });

  function renderProductCard({ item }) {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => onNavigate('ProductDetail', { product: item })}
          activeOpacity={0.85}
        >
          <Image
            source={getImageSource(item.image)}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.cardBody}>
          <Text style={styles.productCategory}>{item.category}</Text>

          <TouchableOpacity
            onPress={() => onNavigate('ProductDetail', { product: item })}
          >
            <Text style={styles.productName}>{item.name}</Text>
          </TouchableOpacity>

          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardBottom}>
            <Text style={styles.price}>{rupiah(item.price)}</Text>

            <TouchableOpacity
              style={styles.addCartButton}
              onPress={() => addToCart(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.addCartText}>+ Keranjang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={filteredProducts}
      keyExtractor={(item) => String(item.id || item.productId || item._id)}
      renderItem={renderProductCard}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchProducts();
          }}
          colors={[colors.olive]}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DARI DAPUR KAMI</Text>
          <Text style={styles.pageTitle}>
            Menu <Text style={styles.pageTitleItalic}>Ruang Rasa.</Text>
          </Text>
          <Text style={styles.pageIntro}>
            Temukan hidangan favorit untuk menemani harimu.
          </Text>

          {/* Search Box */}
          <TextInput
            style={styles.searchInput}
            placeholder="Cari menu, misalnya nasi goreng..."
            placeholderTextColor={colors.muted}
            value={keyword}
            onChangeText={setKeyword}
          />

          {/* Horizontal Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isActive && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {loading && (
            <View style={styles.centerBox}>
              <ActivityIndicator color={colors.olive} size="large" />
              <Text style={styles.centerText}>Memuat menu Ruang Rasa...</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchProducts}
              >
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!loading && !error && filteredProducts.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Menu belum ditemukan.</Text>
            </View>
          )}
        </View>
      }
      ListFooterComponent={<Footer />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
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
    marginBottom: 6,
  },
  pageTitleItalic: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: colors.oliveDark,
  },
  pageIntro: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.dark,
    marginBottom: 16,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  categoryChipActive: {
    backgroundColor: colors.olive,
    borderColor: colors.olive,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.pureWhite,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 190,
    backgroundColor: colors.line,
  },
  cardBody: {
    padding: 16,
  },
  productCategory: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.eyebrow,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 16,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  addCartButton: {
    backgroundColor: colors.olive,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  addCartText: {
    color: colors.pureWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  centerText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.danger,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: colors.pureWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyBox: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
  },
});

