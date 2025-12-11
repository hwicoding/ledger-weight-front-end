/**
 * 핸드 카드 컴포넌트
 * 현재 플레이어의 핸드 카드 표시
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/domain/entities/Card';
import { CardComponent } from '@/presentation/shared/components';

interface HandCardsProps {
  cards: Card[];
  selectedCardId: string | null;
  onCardSelect: (card: Card) => void;
}

export default function HandCards({
  cards,
  selectedCardId,
  onCardSelect,
}: HandCardsProps) {
  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>핸드에 카드가 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 핸드 카드 ({cards.length}장)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {cards.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            isSelected={selectedCardId === card.id}
            onPress={onCardSelect}
            size="medium"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

