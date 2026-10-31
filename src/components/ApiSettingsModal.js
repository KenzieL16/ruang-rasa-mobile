import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../styles/theme';
import {
  getApiBaseUrl,
  setApiBaseUrl,
  DEFAULT_API_URL,
  PHYSICAL_DEVICE_URL,
} from '../config/api';

export default function ApiSettingsModal({ visible, onClose }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (visible) {
      setUrl(getApiBaseUrl());
    }
  }, [visible]);

  async function handleSave() {
    if (!url.trim()) {
      Alert.alert('Error', 'URL Backend tidak boleh kosong');
      return;
    }
    await setApiBaseUrl(url.trim());
    Alert.alert('Berhasil', 'URL Backend diperbarui: ' + getApiBaseUrl());
    onClose();
  }

  function handleResetDefault() {
    setUrl(DEFAULT_API_URL);
  }

  function handleSetPhysical() {
    setUrl(PHYSICAL_DEVICE_URL);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Konfigurasi URL Backend</Text>
          <Text style={styles.desc}>
            Atur alamat server backend API Ruang Rasa.
          </Text>

          <Text style={styles.label}>Base URL API:</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="http://192.168.1.xxx:5000/api"
          />

          <View style={styles.quickButtons}>
            <TouchableOpacity style={styles.quickBtn} onPress={handleResetDefault}>
              <Text style={styles.quickBtnText}>Default ({DEFAULT_API_URL.replace('/api', '')})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickBtn} onPress={handleSetPhysical}>
              <Text style={styles.quickBtnText}>Wi-Fi IP ({PHYSICAL_DEVICE_URL.replace('/api', '')})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 400,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.dark,
    marginBottom: 12,
  },
  quickButtons: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
  },
  quickBtn: {
    backgroundColor: colors.cream,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  quickBtnText: {
    fontSize: 11,
    color: colors.oliveDark,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cancelBtnText: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: colors.olive,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
  },
  saveBtnText: {
    color: colors.pureWhite,
    fontSize: 13,
    fontWeight: '600',
  },
});

