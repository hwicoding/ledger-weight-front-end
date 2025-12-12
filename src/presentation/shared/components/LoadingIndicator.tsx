/**
 * LoadingIndicator 컴포넌트
 * 로딩 상태를 표시하는 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingIndicator({
  message,
  size = 'small',
  color = '#007AFF',
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  message: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
});

