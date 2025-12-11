import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/presentation/navigation/types';
import { useGameViewModel } from '@/presentation/features/game/viewmodel/GameViewModel';

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
    useCard,
    endTurn,
    respondAttack,
    selectCard,
    clearSelection,
  } = useGameViewModel();

  const handleBackToLobby = () => {
    navigation.navigate('Lobby');
  };

  const handleUseCard = () => {
    if (selectedCard) {
      useCard(selectedCard.id);
    }
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

      {/* 게임 상태 표시 */}
      {gameState && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>게임 상태</Text>
          <Text style={styles.info}>Phase: {gameState.phase}</Text>
          <Text style={styles.info}>현재 턴: {turnPlayer?.role || 'N/A'}</Text>
          {turnState && (
            <Text style={styles.info}>남은 시간: {turnState.timeLeft}초</Text>
          )}
        </View>
      )}

      {/* 플레이어 목록 */}
      {players.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>플레이어 목록</Text>
          {players.map(player => (
            <View key={player.id} style={styles.playerItem}>
              <Text style={styles.playerName}>
                {player.role} (HP: {player.hp}, 영향력: {player.influence})
              </Text>
              {player.id === gameState?.currentTurn && (
                <Text style={styles.turnIndicator}>← 현재 턴</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 현재 플레이어 핸드 카드 */}
      {currentPlayer && currentPlayer.hand.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 핸드 카드</Text>
          {currentPlayer.hand.map(card => (
            <View
              key={card.id}
              style={[
                styles.cardItem,
                selectedCard?.id === card.id && styles.selectedCard,
              ]}
            >
              <Button
                title={`${card.name} (${card.suit} ${card.rank})`}
                onPress={() => selectCard(card.id)}
              />
            </View>
          ))}
        </View>
      )}

      {/* 선택된 카드 및 액션 */}
      {selectedCard && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>선택된 카드</Text>
          <Text style={styles.info}>
            {selectedCard.name} ({selectedCard.suit} {selectedCard.rank})
          </Text>
          <View style={styles.buttonRow}>
            <Button title="카드 사용" onPress={handleUseCard} />
            <Button title="선택 해제" onPress={clearSelection} />
          </View>
        </View>
      )}

      {/* 응답 필요 시 */}
      {turnState?.requiredResponse && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>응답 필요</Text>
          <Text style={styles.info}>{turnState.requiredResponse.message}</Text>
          <View style={styles.buttonRow}>
            <Button title="회피" onPress={handleRespondEvade} />
            <Button title="포기" onPress={handleRespondGiveUp} />
          </View>
        </View>
      )}

      {/* 액션 버튼 */}
      <View style={styles.section}>
        <Button title="턴 종료" onPress={endTurn} />
        <View style={styles.spacing} />
        <Button title="로비로 돌아가기" onPress={handleBackToLobby} />
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
    marginBottom: 10,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  playerItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 5,
  },
  playerName: {
    fontSize: 16,
    color: '#333',
  },
  turnIndicator: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardItem: {
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
    padding: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  spacing: {
    height: 10,
  },
});

