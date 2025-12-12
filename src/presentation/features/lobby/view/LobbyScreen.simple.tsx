/**
 * 간단한 테스트용 LobbyScreen
 * 최소한의 컴포넌트로 앱이 렌더링되는지 확인
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LobbyScreen() {
  console.log('🖥️ LobbyScreen (Simple): Component rendering...');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>장부의 무게</Text>
      <Text style={styles.subtitle}>로비 화면 (테스트)</Text>
      <Text style={styles.text}>앱이 정상적으로 렌더링되었습니다!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  text: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

