import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';

type GameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Game'
>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const route = useRoute<GameScreenRouteProp>();
  const { gameId } = route.params;

  const handleBackToLobby = () => {
    navigation.navigate('Lobby');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>게임 화면</Text>
      <Text style={styles.subtitle}>Game ID: {gameId}</Text>
      <View style={styles.content}>
        <Text style={styles.description}>
          게임 보드가 여기에 표시됩니다.
        </Text>
        <Text style={styles.description}>
          - 플레이어 상태{'\n'}
          - 핸드 카드{'\n'}
          - 게임 보드
        </Text>
        <Button title="로비로 돌아가기" onPress={handleBackToLobby} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#666',
    marginBottom: 30,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
});

