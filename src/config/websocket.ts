/**
 * WebSocket 설정
 * 환경 변수 또는 기본값으로 WebSocket URL 관리
 */

import { Platform } from 'react-native';

/**
 * 플랫폼에 맞는 기본 WebSocket URL 가져오기
 * 
 * ⚠️ 중요: 10.0.2.2는 사용할 수 없습니다!
 * - 10.0.2.2는 Android 에뮬레이터 전용 IP이며, 현재 서버 IP가 아닙니다.
 * - 올바른 IP: 192.168.0.10 (로컬 네트워크) 또는 localhost (같은 머신)
 * 
 * 우선순위:
 * 1. EXPO_PUBLIC_WS_URL 환경 변수 (최우선)
 * 2. EXPO_PUBLIC_ANDROID_WS_URL (Android 전용)
 * 3. 기본값: localhost 또는 192.168.0.10
 */
const getDefaultBaseUrl = (): string => {
  // 환경 변수가 설정되어 있으면 우선 사용
  if (process.env.EXPO_PUBLIC_WS_URL) {
    return process.env.EXPO_PUBLIC_WS_URL;
  }

  // Android 전용 환경 변수
  if (Platform.OS === 'android' && process.env.EXPO_PUBLIC_ANDROID_WS_URL) {
    return process.env.EXPO_PUBLIC_ANDROID_WS_URL;
  }

  // Android인 경우 로컬 네트워크 IP 사용 (같은 네트워크에서 접근 가능)
  // 실제 기기나 에뮬레이터 모두 같은 네트워크에 있어야 함
  if (Platform.OS === 'android') {
    // 로컬 네트워크 IP 사용 (백엔드 서버 IP)
    // 같은 Wi-Fi 네트워크에 있어야 접근 가능
    return 'ws://192.168.0.10:8080';
  }

  // iOS 시뮬레이터 또는 기본값 (같은 머신에서 실행 시)
  return 'ws://localhost:8080';
};

/**
 * WebSocket 설정
 */
export const WEBSOCKET_CONFIG = {
  /**
   * WebSocket 서버 기본 URL
   * 환경 변수 EXPO_PUBLIC_WS_URL이 설정되어 있으면 사용, 없으면 플랫폼에 맞는 기본값 사용
   */
  baseUrl: getDefaultBaseUrl(),
  
  /**
   * 재연결 시도 횟수
   */
  reconnectAttempts: 5,
  
  /**
   * 재연결 지연 시간 (밀리초)
   */
  reconnectDelay: 1000,
  
  /**
   * 연결 타임아웃 (밀리초)
   */
  connectionTimeout: 10000,
};

/**
 * 로비 WebSocket URL 생성
 * @param gameId 게임 ID
 * @param playerName 플레이어 이름
 * @param options 옵션 (AI 플레이어 수, 난이도 등)
 * @returns WebSocket URL
 */
export const buildLobbyWebSocketUrl = (
  gameId: string, 
  playerName: string,
  options?: {
    aiPlayerCount?: number;
    aiDifficulty?: 'easy' | 'medium' | 'hard';
    minPlayers?: number;
    maxPlayers?: number;
  }
): string => {
  const baseUrl = WEBSOCKET_CONFIG.baseUrl;
  const encodedPlayerName = encodeURIComponent(playerName);
  const params = new URLSearchParams();
  params.append('player', playerName);
  
  // AI 플레이어 옵션이 있으면 쿼리 파라미터에 추가
  if (options?.aiPlayerCount !== undefined && options.aiPlayerCount > 0) {
    params.append('ai_count', options.aiPlayerCount.toString());
    if (options.aiDifficulty) {
      params.append('ai_difficulty', options.aiDifficulty);
    }
  }
  
  // 최소/최대 플레이어 수 (필요시)
  if (options?.minPlayers !== undefined) {
    params.append('min_players', options.minPlayers.toString());
  }
  if (options?.maxPlayers !== undefined) {
    params.append('max_players', options.maxPlayers.toString());
  }
  
  return `${baseUrl}/lobby/${gameId}?${params.toString()}`;
};

/**
 * 게임 WebSocket URL 생성 (필요시)
 * @param gameId 게임 ID
 * @param playerId 플레이어 ID
 * @returns WebSocket URL
 */
export const buildGameWebSocketUrl = (gameId: string, playerId: string): string => {
  const baseUrl = WEBSOCKET_CONFIG.baseUrl;
  const encodedPlayerId = encodeURIComponent(playerId);
  return `${baseUrl}/game/${gameId}?player=${encodedPlayerId}`;
};

