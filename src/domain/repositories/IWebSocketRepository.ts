/**
 * WebSocket Repository 인터페이스
 * Domain Layer에서 정의 (Infrastructure Layer에서 구현)
 */

import { GameState } from '@/domain/entities/GameState';

/**
 * WebSocket에서 수신하는 게임 상태 업데이트
 */
export interface GameStateUpdate {
  type: 'GAME_STATE_UPDATE';
  data: unknown; // 실제 구조는 백엔드 프로토콜에 따라 정의
}

/**
 * 플레이어가 전송하는 액션
 */
export interface PlayerAction {
  type: 'USE_CARD' | 'END_TURN' | 'RESPOND_ATTACK';
  cardId?: string;
  targetId?: string;
  response?: 'evade' | 'give_up';
}

/**
 * WebSocket Repository 인터페이스
 */
export interface IWebSocketRepository {
  /**
   * WebSocket 연결
   * @param url WebSocket 서버 URL
   * @returns Promise<void>
   */
  connect(url: string): Promise<void>;

  /**
   * WebSocket 연결 종료
   */
  disconnect(): void;

  /**
   * 연결 상태 확인
   * @returns 연결 여부
   */
  isConnected(): boolean;

  /**
   * 플레이어 액션 전송
   * @param action 전송할 액션
   * @returns Promise<void>
   */
  sendAction(action: PlayerAction): Promise<void>;

  /**
   * 게임 상태 업데이트 수신 콜백 등록
   * @param callback 콜백 함수
   */
  onGameStateUpdate(callback: (update: GameStateUpdate) => void): void;

  /**
   * 에러 발생 콜백 등록
   * @param callback 콜백 함수
   */
  onError(callback: (error: Error) => void): void;

  /**
   * 연결 해제 콜백 등록
   * @param callback 콜백 함수
   */
  onDisconnect(callback: () => void): void;
}

