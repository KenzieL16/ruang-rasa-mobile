import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles/theme';
import { apiRequest } from '../../config/api';
import Footer from '../../components/Footer';

export default function AdminDashboardScreen({ onSelectTab }) {
  const [productCount, setProductCount] = useState(11);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchCounts() {
    try {
      const [prodRes, userRes, orderRes] = await Promise.allSettled([
        apiRequest('/products'),
        apiRequest('/users'),
        apiRequest('/orders'),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data) {
        const pList = Array.isArray(prodRes.value.data)
          ? prodRes.value.data
          : prodRes.value.data.products || [];
        setProductCount(pList.length);
      }

      if (userRes.status === 'fulfilled' && userRes.value.data) {
        const uList = Array.isArray(userRes.value.data) ? userRes.value.data : [];
        setUserCount(uList.length);
      }

      if (orderRes.status === 'fulfilled' && orderRes.value.data) {
        const oList = Array.isArray(orderRes.value.data) ? orderRes.value.data : [];
        setOrderCount(oList.length);
      }
    } catch (_e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>OVERVIEW</Text>
        <Text style={styles.pageTitle}>Dashboard</Text>
        <Text style={styles.pageIntro}>
          Selamat datang di Admin Panel Ruang Rasa.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.olive} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => onSelectTab('products')}
              activeOpacity={0.8}
            >
              <Text style={styles.statLabel}>Total Produk</Text>
              <Text style={styles.statValue}>{productCount}</Text>
              <Text style={styles.statLink}>Kelola Menu →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => onSelectTab('users')}
              activeOpacity={0.8}
            >
              <Text style={styles.statLabel}>Total Pengguna</Text>
              <Text style={styles.statValue}>{userCount}</Text>
              <Text style={styles.statLink}>Lihat Pengguna →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => onSelectTab('orders')}
              activeOpacity={0.8}
            >
              <Text style={styles.statLabel}>Total Pesanan</Text>
              <Text style={styles.statValue}>{orderCount}</Text>
              <Text style={styles.statLink}>Lihat Pesanan →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Selamat Bekerja!</Text>
          <Text style={styles.welcomeDesc}>
            Kelola produk, pengguna, dan pesanan Ruang Rasa melalui halaman
            administrasi ini.
          </Text>
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
    marginBottom: 24,
  },
  statsGrid: {
    gap: 14,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 8,
  },
  statLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.olive,
  },
  welcomeBanner: {
    backgroundColor: colors.oliveLight,
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.oliveDark,
    marginBottom: 8,
  },
  welcomeDesc: {
    fontSize: 13,
    color: colors.dark,
    lineHeight: 20,
  },
});

