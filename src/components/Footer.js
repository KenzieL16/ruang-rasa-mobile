import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.brand}>
        RUANG RASA<Text style={styles.brandMark}>®</Text>
      </Text>
      <Text style={styles.tagline}>Hidangan hangat, momen yang berarti.</Text>
      <Text style={styles.copyright}>© 2026 Ruang Rasa. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
  },
  brand: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.dark,
  },
  brandMark: {
    fontSize: 8,
  },
  tagline: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  copyright: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
});

