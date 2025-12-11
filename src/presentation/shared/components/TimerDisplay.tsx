/**
 * 제한 시간 카운트다운 컴포넌트
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimerDisplayProps {
  timeLeft: number; // 초 단위
  onTimeUp?: () => void;
}

export default function TimerDisplay({ timeLeft, onTimeUp }: TimerDisplayProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);

  useEffect(() => {
    setDisplayTime(timeLeft);

    if (timeLeft <= 0 && onTimeUp) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setDisplayTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = (): string => {
    if (displayTime <= 10) return '#f44336'; // 빨간색
    if (displayTime <= 30) return '#ff9800'; // 주황색
    return '#4caf50'; // 초록색
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>남은 시간</Text>
      <View style={[styles.timerCircle, { borderColor: getColor() }]}>
        <Text style={[styles.timerText, { color: getColor() }]}>
          {formatTime(displayTime)}
        </Text>
      </View>
      {displayTime <= 10 && (
        <Text style={styles.warning}>시간이 부족합니다!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  warning: {
    marginTop: 8,
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
  },
});

