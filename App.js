import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initLogRocket } from './src/utils/logrocket';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { colors } from './src/styles/theme';

// Inisialisasi LogRocket untuk analisis
const LOGROCKET_APP_ID = process.env.EXPO_PUBLIC_LOGROCKET_APP_ID || 'pehavh/ruang-rasa-mobile';
initLogRocket(LOGROCKET_APP_ID);

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import AdminLoginScreen from './src/screens/auth/AdminLoginScreen';

// Customer Screens
import HomeScreen from './src/screens/customer/HomeScreen';
import MenuScreen from './src/screens/customer/MenuScreen';
import ProductDetailScreen from './src/screens/customer/ProductDetailScreen';
import CartScreen from './src/screens/customer/CartScreen';
import CheckoutScreen from './src/screens/customer/CheckoutScreen';
import ProfileScreen from './src/screens/customer/ProfileScreen';

// Admin Screens
import AdminHeader from './src/components/AdminHeader';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import AdminProductsScreen from './src/screens/admin/AdminProductsScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminOrdersScreen from './src/screens/admin/AdminOrdersScreen';

// Components
import Navbar from './src/components/Navbar';
import BottomNav from './src/components/BottomNav';
import ApiSettingsModal from './src/components/ApiSettingsModal';

function MainApp() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Auth screen state (for unauthenticated users)
  const [authScreen, setAuthScreen] = useState('Login'); // 'Login' | 'Register' | 'AdminLogin'

  // Customer navigation state
  const [customerScreen, setCustomerScreen] = useState('Home'); // 'Home' | 'Menu' | 'ProductDetail' | 'Cart' | 'Checkout' | 'Profile'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Admin navigation state
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'users' | 'orders'
  const [adminViewMode, setAdminViewMode] = useState('admin'); // 'admin' | 'website'

  // Settings modal
  const [settingsVisible, setSettingsVisible] = useState(false);

  // 1. Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.brandTitle}>
          RUANG RASA<Text style={styles.brandMark}>®</Text>
        </Text>
        <ActivityIndicator size="large" color={colors.olive} style={styles.spinner} />
        <Text style={styles.loadingText}>Memeriksa status login...</Text>
      </View>
    );
  }

  // 2. Unauthenticated state — STRICT SECURITY GUARD
  // Under NO circumstances can any customer or admin page be accessed if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />

        {authScreen === 'Login' && (
          <LoginScreen
            onNavigate={(screen) => setAuthScreen(screen)}
            onOpenSettings={() => setSettingsVisible(true)}
          />
        )}

        {authScreen === 'Register' && (
          <RegisterScreen
            onNavigate={(screen) => setAuthScreen(screen)}
            onOpenSettings={() => setSettingsVisible(true)}
          />
        )}

        {authScreen === 'AdminLogin' && (
          <AdminLoginScreen
            onNavigate={(screen) => setAuthScreen(screen)}
            onOpenSettings={() => setSettingsVisible(true)}
          />
        )}

        <ApiSettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // 3. Authenticated Admin View (when admin chooses admin panel)
  if (isAdmin && adminViewMode === 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <AdminHeader
          activeTab={adminTab}
          onSelectTab={(tab) => setAdminTab(tab)}
          onBackToWebsite={() => setAdminViewMode('website')}
        />

        <View style={styles.body}>
          {adminTab === 'dashboard' && (
            <AdminDashboardScreen onSelectTab={(tab) => setAdminTab(tab)} />
          )}
          {adminTab === 'products' && <AdminProductsScreen />}
          {adminTab === 'users' && <AdminUsersScreen />}
          {adminTab === 'orders' && <AdminOrdersScreen />}
        </View>

        <ApiSettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // 4. Authenticated Customer / Website View
  // Handles navigation for Customer (or Admin in website view mode)
  function handleNavigate(screenName, params = {}) {
    if (screenName === 'Admin') {
      if (isAdmin) {
        setAdminViewMode('admin');
      }
      return;
    }

    if (screenName === 'Menu') {
      if (params.category) {
        setSelectedCategory(params.category);
      }
    }

    if (screenName === 'ProductDetail') {
      setSelectedProduct(params.product || null);
    }

    setCustomerScreen(screenName);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />

      {/* Top Navbar */}
      <Navbar
        currentScreen={customerScreen}
        onNavigate={handleNavigate}
        onOpenSettings={() => setSettingsVisible(true)}
      />

      {/* Screen Body */}
      <View style={styles.body}>
        {customerScreen === 'Home' && (
          <HomeScreen onNavigate={handleNavigate} />
        )}

        {customerScreen === 'Menu' && (
          <MenuScreen
            initialCategory={selectedCategory}
            onNavigate={handleNavigate}
          />
        )}

        {customerScreen === 'ProductDetail' && (
          <ProductDetailScreen
            product={selectedProduct}
            onNavigate={handleNavigate}
            onBack={() => setCustomerScreen('Menu')}
          />
        )}

        {customerScreen === 'Cart' && (
          <CartScreen onNavigate={handleNavigate} />
        )}

        {customerScreen === 'Checkout' && (
          <CheckoutScreen onNavigate={handleNavigate} />
        )}

        {customerScreen === 'Profile' && (
          <ProfileScreen
            onNavigate={handleNavigate}
            onOpenSettings={() => setSettingsVisible(true)}
          />
        )}
      </View>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentScreen={customerScreen}
        onNavigate={(screen) => handleNavigate(screen)}
      />

      <ApiSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  body: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
    color: colors.dark,
    marginBottom: 24,
  },
  brandMark: {
    fontSize: 12,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 13,
    color: colors.muted,
  },
});
