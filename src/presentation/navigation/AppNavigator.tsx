import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/presentation/navigation/types';
// 원래 LobbyScreen으로 복원
import LobbyScreen from '@/presentation/features/lobby/view/LobbyScreen';
// 테스트 버전:
// import LobbyScreen from '@/presentation/features/lobby/view/LobbyScreen.simple';
import GameScreen from '@/presentation/features/game/view/GameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  console.log('🔄 AppNavigator rendering...');
  console.log('📍 Initial route: Lobby');
  
  try {
    return (
      <NavigationContainer
        onReady={() => {
          console.log('✅ NavigationContainer ready');
        }}
        onStateChange={(state) => {
          console.log('📍 Navigation state changed:', state?.routes[state?.index || 0]?.name);
        }}
      >
        <Stack.Navigator
          initialRouteName="Lobby"
          screenOptions={{
            headerShown: false, // 기본 헤더 숨김 (각 화면에서 커스텀)
          }}
        >
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('❌ AppNavigator error:', error);
    // 에러 발생 시 ErrorBoundary가 처리하므로, 간단한 에러 화면만 표시
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#d32f2f', textAlign: 'center' }}>
          Navigation Error: {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }
}

