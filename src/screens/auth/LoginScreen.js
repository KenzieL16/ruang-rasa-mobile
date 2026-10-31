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

export default function LoginScreen({ onNavigate, onOpenSettings }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password, false);
      // Navigation is automatically updated by AuthContext state
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password.');
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
        {/* <View style={styles.topBar}>
          <TouchableOpacity onPress={onOpenSettings} style={styles.settingsBtn}>
            <Text style={styles.settingsText}>⚙️ Server API</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.card}>
          <Text style={styles.brand}>
            RUANG RASA<Text style={styles.brandMark}>®</Text>
          </Text>
          <Text style={styles.eyebrow}>SELAMAT DATANG</Text>
          <Text style={styles.title}>Masuk ke Akun.</Text>
          <Text style={styles.subtitle}>
            Nikmati hidangan khas Indonesia dengan mudah dari genggamanmu.
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password kamu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.pureWhite} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Masuk</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onNavigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Belum punya akun? Daftar sekarang
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.adminLink}
            onPress={() => onNavigate('AdminLogin')}
            activeOpacity={0.7}
          >
            <Text style={styles.adminLinkText}>
              Masuk sebagai Admin Panel →
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
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.dark,
    marginBottom: 16,
  },
  brandMark: {
    fontSize: 10,
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
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.muted,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cream,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: '600',
  },
  adminLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 8,
  },
  adminLinkText: {
    color: colors.oliveDark,
    fontSize: 13,
    fontWeight: '600',
  },
});

