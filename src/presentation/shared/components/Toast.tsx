/**
 * Toast 컴포넌트
 * 사용자에게 알림 메시지를 표시하는 컴포넌트
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  duration?: number;
  onDismiss: () => void;
}

const getToastStyle = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: '#4caf50',
        icon: '✓',
      };
    case 'error':
      return {
        backgroundColor: '#f44336',
        icon: '✕',
      };
    case 'warning':
      return {
        backgroundColor: '#ff9800',
        icon: '⚠',
      };
    case 'info':
    default:
      return {
        backgroundColor: '#2196f3',
        icon: 'ℹ',
      };
  }
};

export default function Toast({
  message,
  type = 'info',
  visible,
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // 나타나기 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 자동으로 사라지기
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) {
    return null;
  }

  const toastStyle = getToastStyle(type);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: toastStyle.backgroundColor }]}>
        <Text style={styles.icon}>{toastStyle.icon}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

