import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/presentation/navigation/types';
import { useGameViewModel } from '@/presentation/features/game/viewmodel/GameViewModel';
import { GameBoard, HandCards } from '@/presentation/features/game/components';
import { TimerDisplay, CardComponent, EventLog } from '@/presentation/shared/components';
import { Card as DomainCard, GameState as DomainGameState, Player as DomainPlayer, TurnState as DomainTurnState } from '@/domain/entities';
import { Card as StoreCard, GameState as StoreGameState } from '@/store/types';

type GameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Game'
>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const route = useRoute<GameScreenRouteProp>();
  const { gameId } = route.params;

  // ViewModel 사용
  const {
    gameState,
    currentPlayer,
    turnPlayer,
    turnState,
    players,
    selectedCard,
    selectedTarget,
    isTargeting,
    events,
    useCard,
    endTurn,
    respondAttack,
    selectCard,
    selectTarget,
    clearSelection,
  } = useGameViewModel();

  const handleBackToLobby = () => {
    navigation.navigate('Lobby');
  };

  // Store 타입을 Domain Entity로 변환하는 헬퍼 함수
  const convertStoreCardToDomain = (storeCard: StoreCard): DomainCard => {
    return new DomainCard(
      storeCard.id,
      storeCard.name,
      storeCard.suit,
      storeCard.rank,
      storeCard.description
    );
  };

  const convertStoreGameStateToDomain = (storeGameState: StoreGameState): DomainGameState => {
    const domainPlayers = storeGameState.players.map(p => {
      const player = new DomainPlayer(
        p.id,
        p.role,
        p.hp,
        p.influence,
        p.treasures,
        p.hand.map(c => convertStoreCardToDomain(c)),
        p.tableCards?.map(c => convertStoreCardToDomain(c)) || []
      );
      return player;
    });

    // TurnState 생성
    const domainTurnState = new DomainTurnState(
      storeGameState.turnState.currentTurn,
      storeGameState.turnState.timeLeft,
      storeGameState.turnState.requiredResponse
    );

    const gameState = new DomainGameState(
      storeGameState.gameId,
      domainPlayers,
      storeGameState.currentTurn,
      domainTurnState,
      storeGameState.events.map(e => ({
        id: e.id,
        timestamp: e.timestamp,
        message: e.message,
        type: e.type,
      })),
      storeGameState.phase
    );

    return gameState;
  };

  const handleCardSelect = (card: DomainCard) => {
    selectCard(card.id);
  };

  const handleUseCard = () => {
    if (selectedCard) {
      // selectedTarget이 있으면 함께 전달
      useCard(selectedCard.id, selectedTarget || undefined);
    }
  };

  // 타겟팅 가능 여부 확인 함수
  const canTargetPlayer = (playerId: string): boolean => {
    if (!gameState || !currentPlayer) return false;
    
    const targetPlayer = gameState.players.find(p => p.id === playerId);
    if (!targetPlayer) return false;

    // Domain Entity로 변환하여 canTarget 확인
    const currentPlayerEntity = new DomainPlayer(
      currentPlayer.id,
      currentPlayer.role,
      currentPlayer.hp,
      currentPlayer.influence,
      currentPlayer.treasures,
      currentPlayer.hand.map(c => convertStoreCardToDomain(c)),
      currentPlayer.tableCards?.map(c => convertStoreCardToDomain(c)) || []
    );

    const targetPlayerEntity = new DomainPlayer(
      targetPlayer.id,
      targetPlayer.role,
      targetPlayer.hp,
      targetPlayer.influence,
      targetPlayer.treasures,
      targetPlayer.hand.map(c => convertStoreCardToDomain(c)),
      targetPlayer.tableCards?.map(c => convertStoreCardToDomain(c)) || []
    );

    return currentPlayerEntity.canTarget(targetPlayerEntity);
  };

  const handleRespondEvade = () => {
    respondAttack('evade');
  };

  const handleRespondGiveUp = () => {
    respondAttack('give_up');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>게임 화면</Text>
        <Text style={styles.subtitle}>Game ID: {gameId}</Text>
      </View>

      {/* 게임 상태 및 타이머 */}
      {gameState && (
        <View style={styles.gameStatusSection}>
          <View style={styles.statusInfo}>
            <Text style={styles.phaseText}>
              Phase: {gameState.phase === 'lobby' ? '로비' : gameState.phase === 'playing' ? '게임 중' : '종료'}
            </Text>
            <Text style={styles.turnText}>
              현재 턴: {turnPlayer?.role || 'N/A'}
            </Text>
          </View>
          {turnState && (
            <TimerDisplay timeLeft={turnState.timeLeft} />
          )}
        </View>
      )}

      {/* 게임 보드 (플레이어 목록) */}
      {gameState && players.length > 0 && (
        <View style={styles.gameBoardSection}>
          <Text style={styles.sectionTitle}>플레이어</Text>
          <GameBoard
            gameState={convertStoreGameStateToDomain(gameState)}
            currentPlayerId={currentPlayer?.id || null}
            layout="table"
            isTargeting={isTargeting}
            selectedTarget={selectedTarget}
            onTargetSelect={selectTarget}
            canTargetPlayer={canTargetPlayer}
          />
        </View>
      )}

      {/* 현재 플레이어 핸드 카드 */}
      {currentPlayer && (
        <HandCards
          cards={currentPlayer.hand.map(c => convertStoreCardToDomain(c))}
          selectedCardId={selectedCard?.id || null}
          onCardSelect={handleCardSelect}
        />
      )}

      {/* 선택된 카드 및 액션 */}
      {selectedCard && (
        <View style={styles.selectedCardSection}>
          <Text style={styles.sectionTitle}>선택된 카드</Text>
          <View style={styles.selectedCardContainer}>
            <CardComponent
              card={convertStoreCardToDomain(selectedCard)}
              isSelected={true}
              size="large"
            />
            {selectedCard.description && (
              <Text style={styles.cardDescription}>{selectedCard.description}</Text>
            )}
          </View>
          
          {/* 타겟팅 모드 안내 */}
          {isTargeting && (
            <View style={styles.targetingInfo}>
              <Text style={styles.targetingInfoText}>
                {selectedTarget 
                  ? `타겟 선택됨: ${gameState?.players.find(p => p.id === selectedTarget)?.role || selectedTarget}`
                  : '플레이어를 선택하세요 (영향력 범위 내)'}
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionButton, 
                styles.useButton,
                isTargeting && !selectedTarget && styles.disabledButton
              ]}
              onPress={handleUseCard}
              disabled={isTargeting && !selectedTarget}
            >
              <Text style={styles.buttonText}>
                {isTargeting && !selectedTarget ? '타겟 선택 필요' : '카드 사용'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={clearSelection}
            >
              <Text style={styles.buttonText}>선택 해제</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 응답 필요 시 모달 */}
      <Modal
        visible={!!turnState?.requiredResponse}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>응답 필요</Text>
            <Text style={styles.modalMessage}>
              {turnState?.requiredResponse?.message || '응답이 필요합니다'}
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.evadeButton]}
                onPress={handleRespondEvade}
              >
                <Text style={styles.modalButtonText}>회피</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.giveUpButton]}
                onPress={handleRespondGiveUp}
              >
                <Text style={styles.modalButtonText}>포기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 게임 이벤트 로그 */}
      {events.length > 0 && (
        <View style={styles.eventLogSection}>
          <Text style={styles.sectionTitle}>이벤트 로그</Text>
          <EventLog events={events} maxHeight={200} />
        </View>
      )}

      {/* 액션 버튼 */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.endTurnButton]}
          onPress={endTurn}
        >
          <Text style={styles.buttonText}>턴 종료</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.backButton]}
          onPress={handleBackToLobby}
        >
          <Text style={styles.buttonText}>로비로 돌아가기</Text>
        </TouchableOpacity>
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
  gameStatusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  statusInfo: {
    flex: 1,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  turnText: {
    fontSize: 14,
    color: '#666',
  },
  gameBoardSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginHorizontal: 16,
    color: '#333',
  },
  selectedCardSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  selectedCardContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  cardDescription: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  endTurnButton: {
    backgroundColor: '#ff9800',
  },
  backButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#bdbdbd',
    opacity: 0.6,
  },
  targetingInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  targetingInfoText: {
    fontSize: 14,
    color: '#e65100',
    textAlign: 'center',
    fontWeight: '600',
  },
  eventLogSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 16,
  },
  actionSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  evadeButton: {
    backgroundColor: '#4caf50',
  },
  giveUpButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

