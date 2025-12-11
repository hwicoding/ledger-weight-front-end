import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

type LobbyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Lobby'
>;

export default function LobbyScreen() {
  const navigation = useNavigation<LobbyScreenNavigationProp>();

  const handleStartGame = () => {
    // 임시 게임 ID로 이동
    navigation.navigate('Game', { gameId: 'temp-game-001' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>장부의 무게</Text>
      <Text style={styles.subtitle}>로비 화면</Text>
      <View style={styles.content}>
        <Text style={styles.description}>
          플레이어 목록이 여기에 표시됩니다.
        </Text>
        <Button title="게임 시작 (임시)" onPress={handleStartGame} />
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
    marginBottom: 20,
    textAlign: 'center',
  },
});

