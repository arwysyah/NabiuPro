import Icon from '@react-native-vector-icons/ionicons';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {AppColors} from '../constants/colors';

export interface FeatureNotAvailableModalRef {
  show: () => void;
  hide: () => void;
}

const FeatureNotAvailableModal = forwardRef<
  FeatureNotAvailableModalRef,
  {label?: string; desc?: string}
>(
  (
    {
      label = 'Feature Not Available',
      desc = 'This feature is not yet implemented. Please wait for future updates.',
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setIsVisible(true),
      hide: () => setIsVisible(false),
    }));

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Icon
              name="warning"
              size={40}
              color="#dc2626"
              style={styles.icon}
            />
            <Text style={styles.title}>{label}</Text>
            <Text style={styles.message}>{desc}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsVisible(false)}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 6,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: '#374151',
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: AppColors.action,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FeatureNotAvailableModal;
