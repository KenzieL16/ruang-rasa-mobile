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
import { formatDate } from '../../utils/formatters';
import { apiRequest } from '../../config/api';
import Footer from '../../components/Footer';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchUsers() {
    try {
      const res = await apiRequest('/users');
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (_e) {
      // Backend may be offline or empty
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchUsers();
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
            fetchUsers();
          }}
          colors={[colors.olive]}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>USER MANAGEMENT</Text>
        <Text style={styles.pageTitle}>Manage Users</Text>
        <Text style={styles.pageIntro}>
          Kelola informasi dan data pengguna Ruang Rasa.
        </Text>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Pengguna</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{users.length} Pengguna</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.olive} style={{ marginVertical: 24 }} />
          ) : users.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Belum ada data pengguna.</Text>
              <Text style={styles.emptySubtitle}>
                Data pengguna akan ditampilkan setelah pengguna mendaftar atau
                frontend terhubung dengan backend.
              </Text>
            </View>
          ) : (
            <View style={styles.userList}>
              {users.map((usr) => (
                <View key={usr.id} style={styles.userRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(usr.name || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{usr.name}</Text>
                    <Text style={styles.userEmail}>{usr.email}</Text>
                    {usr.phone ? (
                      <Text style={styles.userPhone}>{usr.phone}</Text>
                    ) : null}
                    <Text style={styles.userDate}>
                      Bergabung: {formatDate(usr.createdAt)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.roleTag,
                      usr.role === 'admin'
                        ? styles.adminRoleTag
                        : styles.customerRoleTag,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        usr.role === 'admin'
                          ? styles.adminRoleTagText
                          : styles.customerRoleTagText,
                      ]}
                    >
                      {usr.role}
                    </Text>
                  </View>
                </View>
              ))}
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
  userList: {
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.oliveDark,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 2,
  },
  userDate: {
    fontSize: 10,
    color: colors.muted,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminRoleTag: {
    backgroundColor: colors.oliveDark,
  },
  adminRoleTagText: {
    color: colors.pureWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  customerRoleTag: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  customerRoleTagText: {
    color: colors.dark,
    fontSize: 11,
    fontWeight: '600',
  },
});

