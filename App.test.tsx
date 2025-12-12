/**
 * 최소 테스트용 App 컴포넌트
 * Redux, Navigation 없이 직접 렌더링 테스트
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  // 컴포넌트 렌더링 시 로그 출력
  console.log('🚀 ========================================');
  console.log('🚀 App.test.tsx: Component rendering...');
  console.log('🚀 ========================================');
  
  useEffect(() => {
    console.log('✅ App.test.tsx: Component mounted');
    console.log('✅ App.test.tsx: useEffect executed');
    
    // 주기적으로 로그 출력 (테스트용)
    const interval = setInterval(() => {
      console.log('⏰ App.test.tsx: Heartbeat - App is running');
    }, 5000);
    
    return () => {
      console.log('🛑 App.test.tsx: Component unmounting');
      clearInterval(interval);
    };
  }, []);
  
  console.log('🔄 App.test.tsx: About to render JSX');
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>장부의 무게</Text>
      <Text style={styles.subtitle}>테스트 화면</Text>
      <Text style={styles.text}>앱이 정상적으로 렌더링되었습니다!</Text>
      <Text style={styles.logText}>터미널에 로그가 출력되어야 합니다</Text>
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
    marginBottom: 10,
  },
  logText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

