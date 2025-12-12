import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/presentation/navigation/types';
import { useLobbyViewModel } from '@/presentation/features/lobby/viewmodel/LobbyViewModel';
import { PlayerCard, Toast, LoadingIndicator } from '@/presentation/shared/components';
import { Player as DomainPlayer, Card as DomainCard } from '@/domain/entities';
import { Player as StorePlayer } from '@/store/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentPlayerId, selectUIError } from '@/store/selectors';
import { setError } from '@/store/slices/uiSlice';

type LobbyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Lobby'
>;

export default function LobbyScreen() {
  console.log('🖥️ LobbyScreen: Component rendering...');
  
  const navigation = useNavigation<LobbyScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [gameId, setGameId] = useState('temp-game-001');
  const [playerName, setPlayerName] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  
  // 방 생성 관련 상태
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [aiPlayerCount, setAiPlayerCount] = useState(0);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  console.log('🖥️ LobbyScreen: State initialized');

  // ViewModel 사용
  // React Hooks는 조건부로 호출할 수 없으므로 try-catch로 감쌀 수 없음
  // 대신 ViewModel 내부에서 에러 처리를 해야 함
  console.log('🖥️ LobbyScreen: Calling useLobbyViewModel...');
  const viewModel = useLobbyViewModel();
  console.log('✅ LobbyScreen: ViewModel initialized successfully');

  const { isConnecting, isConnected, players, joinLobby, leaveLobby, startGame } = viewModel;
  const currentPlayerId = useAppSelector(selectCurrentPlayerId);
  const error = useAppSelector(selectUIError);
  console.log('🖥️ LobbyScreen: ViewModel destructured, isConnected:', isConnected);

  // 에러 메시지 표시
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType('error');
      setToastVisible(true);
      // 에러 표시 후 Redux에서 제거
      setTimeout(() => {
        dispatch(setError(null));
      }, 100);
    }
  }, [error, dispatch]);

  const handleJoinLobby = () => {
    if (!gameId || !playerName) {
      setToastMessage('게임 ID와 플레이어 이름을 입력해주세요.');
      setToastType('warning');
      setToastVisible(true);
      return;
    }
    joinLobby(gameId, playerName);
  };

  const handleStartGame = () => {
    if (!isConnected) {
      setToastMessage('먼저 로비에 참가해주세요.');
      setToastType('warning');
      setToastVisible(true);
      return;
    }
    // 게임 시작 요청 (gameId 전달)
    startGame(gameId);
    // 게임 시작 성공 시 GameScreen으로 이동 (GAME_STATE_UPDATE에서 phase가 'playing'이 되면 이동)
    // 일단은 임시로 이동
    navigation.navigate('Game', { gameId });
  };

  const handleLeaveLobby = () => {
    leaveLobby();
    setToastMessage('로비를 나갔습니다.');
    setToastType('info');
    setToastVisible(true);
  };

  const handleCreateRoom = () => {
    if (!playerName) {
      setToastMessage('플레이어 이름을 입력해주세요.');
      setToastType('warning');
      setToastVisible(true);
      return;
    }
    
    // 방 생성 로직 (백엔드 연동 전까지는 임시로 게임 ID 생성)
    const newGameId = roomName || `game-${Date.now()}`;
    setGameId(newGameId);
    setShowCreateRoomModal(false);
    
    // 방 생성 후 자동으로 참가
    setTimeout(() => {
      joinLobby(newGameId, playerName);
      setToastMessage('방이 생성되었습니다.');
      setToastType('success');
      setToastVisible(true);
    }, 100);
  };

  const handleOpenCreateRoom = () => {
    setShowCreateRoomModal(true);
  };

  const handleCloseCreateRoom = () => {
    setShowCreateRoomModal(false);
  };

  console.log('🖥️ LobbyScreen: About to render JSX');
  
  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
      <View style={styles.header}>
        <Text style={styles.title}>장부의 무게</Text>
        <Text style={styles.subtitle}>로비 화면</Text>
      </View>

      {/* 방 생성 섹션 */}
      {!isConnected && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>방 생성</Text>
          <Text style={styles.description}>
            새로운 게임 방을 생성하고 AI 플레이어와 함께 플레이할 수 있습니다.
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="방 생성" onPress={handleOpenCreateRoom} />
          </View>
        </View>
      )}

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
            <View>
              {isConnecting && (
                <LoadingIndicator message="연결 중..." size="small" />
              )}
              <Button
                title={isConnecting ? '연결 중...' : '로비 참가'}
                onPress={handleJoinLobby}
                disabled={isConnecting}
              />
            </View>
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
        {players.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {isConnected 
                ? '아직 참가한 플레이어가 없습니다.'
                : '로비에 참가하면 플레이어 목록이 표시됩니다.'}
            </Text>
          </View>
        ) : (
          <View style={styles.playersList}>
            {players.map((player: StorePlayer) => {
              // Store 타입을 Domain Entity로 변환
              const domainPlayer = new DomainPlayer(
                player.id,
                player.role,
                player.hp,
                player.influence,
                player.treasures,
                player.hand.map(c => new DomainCard(c.id, c.name, c.suit, c.rank, c.description)),
                player.tableCards?.map(c => new DomainCard(c.id, c.name, c.suit, c.rank, c.description)) || []
              );

              const isCurrentPlayer = player.id === currentPlayerId;

              return (
                <View key={player.id} style={styles.playerItem}>
                  <PlayerCard
                    player={domainPlayer}
                    isCurrentPlayer={isCurrentPlayer}
                    size="small"
                    isBot={player.isBot || false}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>
      </ScrollView>
      
      {/* Toast 알림 */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      {/* 방 생성 모달 */}
      <Modal
        visible={showCreateRoomModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseCreateRoom}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>방 생성</Text>
            
            <Text style={styles.label}>방 이름 (선택사항)</Text>
            <TextInput
              style={styles.input}
              value={roomName}
              onChangeText={setRoomName}
              placeholder="방 이름을 입력하세요"
            />

            <Text style={styles.label}>플레이어 이름</Text>
            <TextInput
              style={styles.input}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="플레이어 이름을 입력하세요"
            />

            <Text style={styles.label}>최소 플레이어 수: {minPlayers}</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => setMinPlayers(Math.max(2, minPlayers - 1))}
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{minPlayers}</Text>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => setMinPlayers(Math.min(maxPlayers - 1, minPlayers + 1))}
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>최대 플레이어 수: {maxPlayers}</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => setMaxPlayers(Math.max(minPlayers + 1, maxPlayers - 1))}
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{maxPlayers}</Text>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => setMaxPlayers(Math.min(8, maxPlayers + 1))}
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>AI 플레이어 수: {aiPlayerCount}</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => setAiPlayerCount(Math.max(0, aiPlayerCount - 1))}
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{aiPlayerCount}</Text>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => setAiPlayerCount(Math.min(maxPlayers - 1, aiPlayerCount + 1))}
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>AI 난이도</Text>
            <View style={styles.difficultyContainer}>
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  aiDifficulty === 'easy' && styles.difficultyButtonActive,
                ]}
                onPress={() => setAiDifficulty('easy')}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    aiDifficulty === 'easy' && styles.difficultyButtonTextActive,
                  ]}
                >
                  쉬움
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  aiDifficulty === 'medium' && styles.difficultyButtonActive,
                ]}
                onPress={() => setAiDifficulty('medium')}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    aiDifficulty === 'medium' && styles.difficultyButtonTextActive,
                  ]}
                >
                  보통
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  aiDifficulty === 'hard' && styles.difficultyButtonActive,
                ]}
                onPress={() => setAiDifficulty('hard')}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    aiDifficulty === 'hard' && styles.difficultyButtonTextActive,
                  ]}
                >
                  어려움
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseCreateRoom}
              >
                <Text style={[styles.modalButtonText, { color: '#333' }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateRoom}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>생성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    padding: 20,
    textAlign: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  playersList: {
    marginTop: 10,
  },
  playerItem: {
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#007AFF',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  difficultyButtonTextActive: {
    color: '#fff',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

