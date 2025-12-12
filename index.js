/**
 * 최소한의 JavaScript 진입점
 * ES6 import 사용
 */

console.log('🚀🚀🚀 ========================================');
console.log('🚀🚀🚀 Index.js: FILE LOADED - JavaScript entry point');
console.log('🚀🚀🚀 ========================================');

import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text } from 'react-native';

console.log('✅ Index.js: All imports loaded');

// 최소한의 앱 컴포넌트
function App() {
  console.log('🚀🚀🚀 App component rendering');
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff0000' }}>
      <Text style={{ fontSize: 30, color: '#ffffff', fontWeight: 'bold' }}>
        ULTRA MINIMAL JS TEST
      </Text>
    </View>
  );
}

console.log('🔄 Index.js: About to register root component...');

try {
  registerRootComponent(App);
  console.log('✅ Index.js: App registered successfully');
} catch (error) {
  console.error('❌ Index.js: Failed to register root component', error);
  throw error;
}

console.log('✅ Index.js: Registration complete');

