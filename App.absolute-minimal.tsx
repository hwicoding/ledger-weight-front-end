/**
 * 절대 최소한의 앱
 * 모든 것을 제거하고 단순히 텍스트만 표시
 */

import React from 'react';
import { View, Text } from 'react-native';

console.log('🚀🚀🚀 App.absolute-minimal.tsx: FILE LOADED');

export default function App() {
  console.log('🚀🚀🚀 App.absolute-minimal.tsx: COMPONENT RENDERING');
  
  try {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff0000' }}>
        <Text style={{ fontSize: 30, color: '#ffffff', fontWeight: 'bold' }}>
          ABSOLUTE MINIMAL
        </Text>
      </View>
    );
  } catch (error) {
    console.error('❌ App.absolute-minimal.tsx: Render error', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <Text style={{ fontSize: 20, color: '#ff0000' }}>
          ERROR: {String(error)}
        </Text>
      </View>
    );
  }
}

