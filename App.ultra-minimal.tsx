/**
 * 초초초 최소한의 테스트 앱
 * import도 최소화
 */

import React from 'react';
import { View, Text } from 'react-native';

console.log('🚀🚀🚀 App.ultra-minimal.tsx: FILE LOADED 🚀🚀🚀');

export default function App() {
  console.log('🚀🚀🚀 App.ultra-minimal.tsx: COMPONENT RENDERING 🚀🚀🚀');
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff0000' }}>
      <Text style={{ fontSize: 30, color: '#ffffff', fontWeight: 'bold' }}>
        ULTRA MINIMAL TEST
      </Text>
    </View>
  );
}

