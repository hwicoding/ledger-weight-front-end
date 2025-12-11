/**
 * 게임 보드 컴포넌트
 * 원형 또는 테이블 형태로 플레이어 배치
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Player } from '@/domain/entities/Player';
import { GameState } from '@/domain/entities/GameState';
import { PlayerCard } from '@/presentation/shared/components';

interface GameBoardProps {
  gameState: GameState;
  currentPlayerId: string | null;
  layout?: 'circular' | 'table';
}

export default function GameBoard({
  gameState,
  currentPlayerId,
  layout = 'table',
}: GameBoardProps) {
  const { players, currentTurn } = gameState;

  if (layout === 'circular') {
    // 원형 레이아웃 (추후 구현)
    return (
      <View style={styles.circularContainer}>
        <Text style={styles.placeholder}>원형 레이아웃 (추후 구현)</Text>
      </View>
    );
  }

  // 테이블 레이아웃
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tableContainer}>
        {players.map((player, index) => {
          const isCurrentTurn = player.id === currentTurn;
          const isCurrentPlayer = player.id === currentPlayerId;

          return (
            <View key={player.id} style={styles.playerWrapper}>
              <PlayerCard
                player={player}
                isCurrentTurn={isCurrentTurn}
                isCurrentPlayer={isCurrentPlayer}
                size="medium"
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circularContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  tableContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  playerWrapper: {
    minWidth: 200,
  },
});

