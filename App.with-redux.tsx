/**
 * Redux 추가된 버전
 * Navigation 없이 테스트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { store } from '@/store/store';

console.log('🚀 App.with-redux.tsx: FILE LOADED');

function AppContent() {
  console.log('🚀 App.with-redux.tsx: COMPONENT RENDERING');
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>장부의 무게</Text>
      <Text style={styles.subtitle}>Redux 추가 버전</Text>
      <Text style={styles.text}>앱이 정상적으로 작동합니다!</Text>
    </View>
  );
}

export default function App() {
  console.log('🚀 App.with-redux.tsx: Wrapping with Provider');
  
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
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

