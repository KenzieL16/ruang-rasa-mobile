import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../styles/theme';
import { rupiah } from '../../utils/formatters';
import { apiRequest } from '../../config/api';
import Footer from '../../components/Footer';

const fallbackProducts = [
  { id: 1, name: 'Nasi Goreng Kampung', category: 'Makanan Utama', price: 22000 },
  { id: 2, name: 'Nasi Ayam Sambal Matah', category: 'Makanan Utama', price: 25000 },
  { id: 3, name: 'Nasi Ayam Mentega', category: 'Makanan Utama', price: 25000 },
  { id: 4, name: 'Tahu Gejrot', category: 'Camilan', price: 15000 },
  { id: 5, name: 'Pisang Goreng', category: 'Camilan', price: 15000 },
  { id: 6, name: 'Bakwan Jagung', category: 'Camilan', price: 12000 },
  { id: 7, name: 'Cendol Dawet', category: 'Dessert', price: 15000 },
  { id: 8, name: 'Klepon', category: 'Dessert', price: 12000 },
  { id: 9, name: 'Es Teh Manis', category: 'Minuman', price: 7000 },
  { id: 10, name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 18000 },
  { id: 11, name: 'Air Mineral', category: 'Minuman', price: 5000 },
];

export default function AdminProductsScreen() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadProducts() {
    try {
      const res = await apiRequest('/products');
      const data = Array.isArray(res.data) ? res.data : res.data?.products;
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (_e) {
      // Keep fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadProducts();
          }}
          colors={[colors.olive]}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>PRODUCT MANAGEMENT</Text>
        <Text style={styles.pageTitle}>Manage Products</Text>
        <Text style={styles.pageIntro}>
          Kelola daftar menu dan produk Ruang Rasa.
        </Text>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Produk</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{products.length} Produk</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.olive} style={{ marginVertical: 24 }} />
          ) : (
            <View style={styles.productList}>
              {products.map((item, index) => {
                const itemId = item.id || item.productId || index + 1;
                return (
                  <View key={itemId} style={styles.productRow}>
                    <View style={styles.idBadge}>
                      <Text style={styles.idText}>#{itemId}</Text>
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productCategory}>{item.category}</Text>
                    </View>

                    <Text style={styles.productPrice}>{rupiah(item.price)}</Text>
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
  productList: {
    gap: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  idBadge: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 11,
    color: colors.muted,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.oliveDark,
  },
});

