/**
 * WebSocket 설정
 * 환경 변수 또는 기본값으로 WebSocket URL 관리
 */

/**
 * WebSocket 설정
 */
export const WEBSOCKET_CONFIG = {
  /**
   * WebSocket 서버 기본 URL
   * 환경 변수 EXPO_PUBLIC_WS_URL이 설정되어 있으면 사용, 없으면 기본값 사용
   */
  baseUrl: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8080',
  
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
 * @returns WebSocket URL
 */
export const buildLobbyWebSocketUrl = (gameId: string, playerName: string): string => {
  const baseUrl = WEBSOCKET_CONFIG.baseUrl;
  const encodedPlayerName = encodeURIComponent(playerName);
  return `${baseUrl}/lobby/${gameId}?player=${encodedPlayerName}`;
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

