/**
 * 플레이어 상태 표시 컴포넌트
 * 플레이어 정보 및 상태 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '@/domain/entities/Player';
import { PlayerRole } from '@/domain/entities/types';

interface PlayerCardProps {
  player: Player;
  isCurrentTurn?: boolean;
  isCurrentPlayer?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 역할 색상 반환
 */
const getRoleColor = (role: PlayerRole): string => {
  switch (role) {
    case '상단주':
      return '#d32f2f'; // 빨간색
    case '원로원':
      return '#1976d2'; // 파란색
    case '적도 세력':
      return '#388e3c'; // 초록색
    case '야망가':
      return '#f57c00'; // 주황색
    default:
      return '#757575'; // 회색
  }
};

/**
 * 역할 아이콘 반환
 */
const getRoleIcon = (role: PlayerRole): string => {
  switch (role) {
    case '상단주':
      return '👑';
    case '원로원':
      return '🏛️';
    case '적도 세력':
      return '🌍';
    case '야망가':
      return '💼';
    default:
      return '👤';
  }
};

export default function PlayerCard({
  player,
  isCurrentTurn = false,
  isCurrentPlayer = false,
  size = 'medium',
}: PlayerCardProps) {
  const roleColor = getRoleColor(player.role);
  const roleIcon = getRoleIcon(player.role);

  const cardSize = {
    small: { padding: 8, fontSize: 12 },
    medium: { padding: 12, fontSize: 14 },
    large: { padding: 16, fontSize: 16 },
  }[size];

  return (
    <View
      style={[
        styles.container,
        {
          padding: cardSize.padding,
          borderColor: isCurrentTurn ? '#007AFF' : roleColor,
          borderWidth: isCurrentTurn ? 3 : 2,
          backgroundColor: isCurrentPlayer ? '#e3f2fd' : '#fff',
        },
      ]}
    >
      {/* 현재 턴 표시 */}
      {isCurrentTurn && (
        <View style={styles.turnIndicator}>
          <Text style={styles.turnText}>현재 턴</Text>
        </View>
      )}

      {/* 역할 및 아이콘 */}
      <View style={styles.header}>
        <Text style={styles.roleIcon}>{roleIcon}</Text>
        <Text style={[styles.role, { color: roleColor }]}>{player.role}</Text>
      </View>

      {/* 재력 (HP) */}
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>재력:</Text>
        <View style={styles.hpBar}>
          <View
            style={[
              styles.hpFill,
              {
                width: `${Math.min(100, (player.hp / 10) * 100)}%`,
                backgroundColor: player.hp > 5 ? '#4caf50' : player.hp > 2 ? '#ff9800' : '#f44336',
              },
            ]}
          />
          <Text style={styles.hpText}>{player.hp}</Text>
        </View>
      </View>

      {/* 영향력 (사거리) */}
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>영향력:</Text>
        <Text style={styles.statValue}>{player.influence}</Text>
      </View>

      {/* 장착 보물 */}
      {player.treasures.length > 0 && (
        <View style={styles.treasuresContainer}>
          <Text style={styles.treasuresLabel}>장착 보물:</Text>
          {player.treasures.map((treasure, index) => (
            <Text key={index} style={styles.treasureItem}>
              • {treasure}
            </Text>
          ))}
        </View>
      )}

      {/* 테이블 카드 */}
      {player.tableCards.length > 0 && (
        <View style={styles.tableCardsContainer}>
          <Text style={styles.tableCardsLabel}>테이블 카드: {player.tableCards.length}장</Text>
        </View>
      )}

      {/* 핸드 카드 수 (현재 플레이어만 표시) */}
      {isCurrentPlayer && (
        <View style={styles.handContainer}>
          <Text style={styles.handLabel}>핸드: {player.hand.length}장</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  turnIndicator: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  turnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  role: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    minWidth: 60,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  hpBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  hpFill: {
    height: '100%',
    borderRadius: 10,
  },
  hpText: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  treasuresContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  treasuresLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  treasureItem: {
    fontSize: 11,
    color: '#333',
    marginLeft: 8,
  },
  tableCardsContainer: {
    marginTop: 6,
  },
  tableCardsLabel: {
    fontSize: 11,
    color: '#666',
  },
  handContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  handLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
});

