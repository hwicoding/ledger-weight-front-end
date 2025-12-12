/**
 * 게임 이벤트 로그 컴포넌트
 * 게임 중 발생한 이벤트를 표시
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameEvent } from '@/store/types';

interface EventLogProps {
  events: GameEvent[];
  maxHeight?: number;
}

/**
 * 이벤트 타입별 색상 반환
 */
const getEventTypeColor = (type: 'action' | 'notification' | 'error'): string => {
  switch (type) {
    case 'action':
      return '#1976d2'; // 파란색
    case 'notification':
      return '#388e3c'; // 초록색
    case 'error':
      return '#d32f2f'; // 빨간색
    default:
      return '#757575'; // 회색
  }
};

/**
 * 이벤트 타입별 배경색 반환
 */
const getEventTypeBackgroundColor = (type: 'action' | 'notification' | 'error'): string => {
  switch (type) {
    case 'action':
      return '#e3f2fd'; // 연한 파란색
    case 'notification':
      return '#e8f5e9'; // 연한 초록색
    case 'error':
      return '#ffebee'; // 연한 빨간색
    default:
      return '#f5f5f5'; // 연한 회색
  }
};

/**
 * 이벤트 타입별 아이콘 반환
 */
const getEventTypeIcon = (type: 'action' | 'notification' | 'error'): string => {
  switch (type) {
    case 'action':
      return '⚡';
    case 'notification':
      return 'ℹ️';
    case 'error':
      return '❌';
    default:
      return '•';
  }
};

/**
 * 타임스탬프를 읽기 쉬운 형식으로 변환
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export default function EventLog({ events, maxHeight = 200 }: EventLogProps) {
  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>이벤트 로그가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { maxHeight }]}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}
    >
      {events.map((event) => {
        const typeColor = getEventTypeColor(event.type);
        const backgroundColor = getEventTypeBackgroundColor(event.type);
        const icon = getEventTypeIcon(event.type);

        return (
          <View
            key={event.id}
            style={[
              styles.eventItem,
              { backgroundColor, borderLeftColor: typeColor },
            ]}
          >
            <View style={styles.eventHeader}>
              <View style={styles.eventTypeContainer}>
                <Text style={styles.eventIcon}>{icon}</Text>
                <Text style={[styles.eventType, { color: typeColor }]}>
                  {event.type === 'action' ? '액션' : event.type === 'notification' ? '알림' : '에러'}
                </Text>
              </View>
              <Text style={styles.eventTimestamp}>
                {formatTimestamp(event.timestamp)}
              </Text>
            </View>
            <Text style={styles.eventMessage}>{event.message}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  eventItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  eventType: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eventTimestamp: {
    fontSize: 11,
    color: '#666',
  },
  eventMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

