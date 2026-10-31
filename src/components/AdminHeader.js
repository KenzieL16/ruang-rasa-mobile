import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

export default function AdminHeader({ activeTab, onSelectTab, onBackToWebsite }) {
  const { logout } = useAuth();

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'products', label: 'Products' },
    { key: 'users', label: 'Users' },
    { key: 'orders', label: 'Orders' },
  ];

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.brand}>RUANG RASA</Text>
          <Text style={styles.adminLabel}>ADMIN PANEL</Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBackToWebsite}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>← Website</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutBtnText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  topRow: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.dark,
  },
  adminLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.eyebrow,
    marginTop: 2,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.cream,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.dangerLight,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  tabsRow: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 4,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  activeTab: {
    backgroundColor: colors.olive,
    borderColor: colors.olive,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  activeTabText: {
    color: colors.pureWhite,
  },
});

