/**
 * 원래 App.tsx의 깨끗한 버전
 * console 오버라이드 제거, logger/errorHandler 단순화
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AppNavigator from '@/presentation/navigation/AppNavigator';
import { ErrorBoundary } from '@/components/ErrorBoundary';

console.log('🚀 App.clean.tsx: FILE LOADED');

export default function App() {
  console.log('🚀 App.clean.tsx: COMPONENT RENDERING');
  
  React.useEffect(() => {
    console.log('✅ App.clean.tsx: Component mounted');
    
    return () => {
      console.log('🛑 App.clean.tsx: Component unmounting');
    };
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppNavigator />
        <StatusBar style="auto" />
      </Provider>
    </ErrorBoundary>
  );
}

