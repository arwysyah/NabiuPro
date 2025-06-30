import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Modal} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AppColors} from '../constants/colors';
import FontFamily from '../assets/typography';
import Ionicons from '@react-native-vector-icons/ionicons';
type Props = {
  visible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  message: string;
  acceptLabel?: string;
  cancelLabel?: string;
};

export const ConfirmationModal = ({
  visible,
  title,
  onConfirm,
  onCancel,
  message,
  onClose,
  acceptLabel,
  cancelLabel,
}: Props) => {
  const {t} = useTranslation();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.messages}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{t('debts.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>{t('debts.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    position: 'relative', // Required for absolute-positioned close button
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 5,
    zIndex: 10,
    padding: 4,
    backgroundColor: AppColors.action,
    borderRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  message: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  messages: {
    fontSize: 22,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: FontFamily.ROKKIT_BOLD,
    top: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cancelText: {
    color: '#636e72',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
