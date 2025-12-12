/**
 * 게임 보드 컴포넌트
 * 원형 또는 테이블 형태로 플레이어 배치
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Player } from '@/domain/entities/Player';
import { GameState } from '@/domain/entities/GameState';
import { PlayerCard } from '@/presentation/shared/components';

interface GameBoardProps {
  gameState: GameState;
  currentPlayerId: string | null;
  layout?: 'circular' | 'table';
  isTargeting?: boolean;
  selectedTarget?: string | null;
  onTargetSelect?: (playerId: string) => void;
  canTargetPlayer?: (playerId: string) => boolean;
  playerIsBotMap?: Map<string, boolean>; // 플레이어 ID별 AI 여부
}

export default function GameBoard({
  gameState,
  currentPlayerId,
  layout = 'table',
  isTargeting = false,
  selectedTarget = null,
  onTargetSelect,
  canTargetPlayer,
  playerIsBotMap,
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
          const isSelected = selectedTarget === player.id;
          const canTarget = canTargetPlayer ? canTargetPlayer(player.id) : true;
          const isTargetable = isTargeting && canTarget && !isCurrentPlayer;

          return (
            <View 
              key={player.id} 
              style={[
                styles.playerWrapper,
                isTargeting && styles.targetingContainer,
                isSelected && styles.selectedTarget,
                isTargetable && styles.targetablePlayer,
              ]}
            >
              {isTargeting && (
                <View style={styles.targetingOverlay}>
                  {isTargetable ? (
                    <TouchableOpacity
                      style={styles.targetButton}
                      onPress={() => onTargetSelect?.(player.id)}
                      disabled={!canTarget}
                    >
                      <Text style={styles.targetButtonText}>
                        {isSelected ? '선택됨' : '선택'}
                      </Text>
                    </TouchableOpacity>
                  ) : !canTarget ? (
                    <View style={styles.outOfRangeIndicator}>
                      <Text style={styles.outOfRangeText}>범위 밖</Text>
                    </View>
                  ) : null}
                </View>
              )}
              <PlayerCard
                player={player}
                isCurrentTurn={isCurrentTurn}
                isCurrentPlayer={isCurrentPlayer}
                size="medium"
                isSelected={isSelected}
                isTargetable={isTargetable}
                isBot={playerIsBotMap?.get(player.id) || false}
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
    position: 'relative',
  },
  targetingContainer: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 4,
  },
  selectedTarget: {
    borderColor: '#4caf50',
    backgroundColor: '#e8f5e9',
  },
  targetablePlayer: {
    borderColor: '#ff9800',
    borderWidth: 3,
  },
  targetingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  targetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  outOfRangeIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  outOfRangeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

