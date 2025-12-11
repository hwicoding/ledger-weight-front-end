import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useLobbyViewModel } from '../viewmodel/LobbyViewModel';

type LobbyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Lobby'
>;

export default function LobbyScreen() {
  const navigation = useNavigation<LobbyScreenNavigationProp>();
  const [gameId, setGameId] = useState('temp-game-001');
  const [playerName, setPlayerName] = useState('');

  // ViewModel 사용
  const { isConnecting, isConnected, joinLobby, leaveLobby, startGame } =
    useLobbyViewModel();

  const handleJoinLobby = () => {
    if (!gameId || !playerName) {
      alert('게임 ID와 플레이어 이름을 입력해주세요.');
      return;
    }
    joinLobby(gameId, playerName);
  };

  const handleStartGame = () => {
    if (!isConnected) {
      alert('먼저 로비에 참가해주세요.');
      return;
    }
    startGame();
    // 임시 게임 ID로 이동
    navigation.navigate('Game', { gameId });
  };

  const handleLeaveLobby = () => {
    leaveLobby();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>장부의 무게</Text>
        <Text style={styles.subtitle}>로비 화면</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>로비 참가</Text>
        
        <Text style={styles.label}>게임 ID</Text>
        <TextInput
          style={styles.input}
          value={gameId}
          onChangeText={setGameId}
          placeholder="게임 ID를 입력하세요"
          editable={!isConnected}
        />

        <Text style={styles.label}>플레이어 이름</Text>
        <TextInput
          style={styles.input}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="플레이어 이름을 입력하세요"
          editable={!isConnected}
        />

        <View style={styles.buttonContainer}>
          {!isConnected ? (
            <Button
              title={isConnecting ? '연결 중...' : '로비 참가'}
              onPress={handleJoinLobby}
              disabled={isConnecting}
            />
          ) : (
            <Button title="로비 나가기" onPress={handleLeaveLobby} />
          )}
        </View>

        {isConnected && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>✅ 연결됨</Text>
          </View>
        )}
      </View>

      {isConnected && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>게임 시작</Text>
          <Text style={styles.description}>
            모든 플레이어가 준비되면 게임을 시작할 수 있습니다.
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="게임 시작" onPress={handleStartGame} />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>플레이어 목록</Text>
        <Text style={styles.description}>
          플레이어 목록이 여기에 표시됩니다.
        </Text>
        <Text style={styles.description}>
          (WebSocket 연결 후 서버에서 받아온 데이터로 업데이트됩니다)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
  },
  statusContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 24,
  },
});

