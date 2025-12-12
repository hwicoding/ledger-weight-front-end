/**
 * 단순한 버전의 App
 * Redux와 Navigation 없이 테스트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

console.log('🚀 App.simple.tsx: FILE LOADED');

export default function App() {
  console.log('🚀 App.simple.tsx: COMPONENT RENDERING');
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>장부의 무게</Text>
      <Text style={styles.subtitle}>단순 버전</Text>
      <Text style={styles.text}>앱이 정상적으로 작동합니다!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#999',
  },
});

