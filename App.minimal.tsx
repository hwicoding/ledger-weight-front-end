/**
 * 최소한의 테스트 앱
 * 아무것도 하지 않고 단순히 텍스트만 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 가장 먼저 실행되는 로그
console.log('🚀 App.minimal.tsx: File loaded');

export default function App() {
  console.log('🚀 App.minimal.tsx: Component rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Minimal Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    color: '#000000',
  },
});

