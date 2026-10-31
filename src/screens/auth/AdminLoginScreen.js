import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginScreen({ onNavigate, onOpenSettings }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAdminLogin() {
    if (!email.trim() || !password) {
      setError('Email dan password admin wajib diisi.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password, true);
      // AuthContext will set admin user and isAuthenticated = true
    } catch (err) {
      setError(err.message || 'Login admin gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>RUANG RASA · ADMIN</Text>
          <Text style={styles.title}>Admin Login.</Text>
          <Text style={styles.subtitle}>
            Masuk untuk mengelola restoran Ruang Rasa.
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Admin</Text>
            <TextInput
              style={styles.input}
              placeholder="Email admin"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password Admin</Text>
            <TextInput
              style={styles.input}
              placeholder="Password admin"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleAdminLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.pureWhite} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Login Admin</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => onNavigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>
              ← Kembali ke Login Pengguna
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  settingsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  settingsText: {
    fontSize: 12,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.white,
    padding: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.eyebrow,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
  formGroup: {
    marginBottom: 16,
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
    paddingVertical: 12,
    fontSize: 14,
    color: colors.dark,
  },
  primaryButton: {
    backgroundColor: colors.olive,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.pureWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLinkText: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: '600',
  },
});

