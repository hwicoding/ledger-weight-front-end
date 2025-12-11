/**
 * 카드 UI 컴포넌트
 * 카드 디자인 및 선택 인터페이스 제공
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/domain/entities/Card';
import { CardSuit, CardRank } from '@/domain/entities/types';

interface CardComponentProps {
  card: Card;
  isSelected?: boolean;
  onPress?: (card: Card) => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 무늬 아이콘 반환
 */
const getSuitIcon = (suit: CardSuit): string => {
  switch (suit) {
    case '검':
      return '⚔️';
    case '책':
      return '📖';
    case '치유':
      return '💚';
    case '돈':
      return '💰';
    default:
      return '❓';
  }
};

/**
 * 숫자 표시 반환
 */
const getRankDisplay = (rank: CardRank): string => {
  switch (rank) {
    case '상':
      return 'A';
    case '대':
      return 'K';
    case '중':
      return 'Q';
    case '소':
      return 'J';
    default:
      return '?';
  }
};

/**
 * 무늬 색상 반환
 */
const getSuitColor = (suit: CardSuit): string => {
  switch (suit) {
    case '검':
      return '#d32f2f'; // 빨간색
    case '책':
      return '#1976d2'; // 파란색
    case '치유':
      return '#388e3c'; // 초록색
    case '돈':
      return '#f57c00'; // 주황색
    default:
      return '#757575'; // 회색
  }
};

export default function CardComponent({
  card,
  isSelected = false,
  onPress,
  size = 'medium',
}: CardComponentProps) {
  const suitColor = getSuitColor(card.suit);
  const suitIcon = getSuitIcon(card.suit);
  const rankDisplay = getRankDisplay(card.rank);

  const cardSize = {
    small: { width: 60, height: 90 },
    medium: { width: 80, height: 120 },
    large: { width: 100, height: 150 },
  }[size];

  const handlePress = () => {
    if (onPress) {
      onPress(card);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width: cardSize.width,
          height: cardSize.height,
          borderColor: isSelected ? '#007AFF' : suitColor,
          borderWidth: isSelected ? 3 : 2,
          backgroundColor: isSelected ? '#e3f2fd' : '#fff',
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* 상단: 숫자와 무늬 */}
      <View style={styles.topSection}>
        <Text style={[styles.rank, { color: suitColor }]}>{rankDisplay}</Text>
        <Text style={styles.suitIcon}>{suitIcon}</Text>
      </View>

      {/* 중앙: 카드 이름 */}
      <View style={styles.centerSection}>
        <Text style={styles.cardName} numberOfLines={2}>
          {card.name}
        </Text>
      </View>

      {/* 하단: 무늬 아이콘 */}
      <View style={styles.bottomSection}>
        <Text style={styles.suitIcon}>{suitIcon}</Text>
      </View>

      {/* 설명 (있는 경우) */}
      {card.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={1}>
            {card.description}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 8,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suitIcon: {
    fontSize: 16,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  bottomSection: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  descriptionContainer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  description: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
});

