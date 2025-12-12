/**
 * Navigation 추가된 버전
 * 원래 앱과 거의 동일한 구조
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { store } from '@/store/store';
import AppNavigator from '@/presentation/navigation/AppNavigator';

console.log('🚀 App.with-navigation.tsx: FILE LOADED');

export default function App() {
  console.log('🚀 App.with-navigation.tsx: COMPONENT RENDERING');
  
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppNavigator />
        <StatusBar style="auto" />
      </Provider>
    </ErrorBoundary>
  );
}

