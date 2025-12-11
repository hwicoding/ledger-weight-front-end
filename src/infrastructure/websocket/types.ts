/**
 * WebSocket 메시지 타입 정의
 * 백엔드 프로토콜에 맞게 정의
 */

/**
 * 서버에서 클라이언트로 전송하는 메시지 타입
 */
export type ServerMessageType = 'GAME_STATE_UPDATE' | 'ERROR' | 'NOTIFICATION';

/**
 * 클라이언트에서 서버로 전송하는 메시지 타입
 */
export type ClientMessageType = 'PLAYER_ACTION' | 'PING';

/**
 * 게임 상태 업데이트 메시지 (서버 → 클라이언트)
 */
export interface GameStateUpdateMessage {
  type: 'GAME_STATE_UPDATE';
  gameId: string;
  players: Array<{
    id: string;
    role: string;
    hp: number;
    influence: number;
    treasures: string[];
    hand: Array<{
      id: string;
      name: string;
      suit: string;
      rank: string;
    }>;
    tableCards?: Array<{
      id: string;
      name: string;
      suit: string;
      rank: string;
    }>;
  }>;
  currentTurn: string;
  turnState: {
    currentTurn: string;
    timeLeft: number;
    requiredResponse?: {
      type: 'RESPOND_ATTACK';
      message: string;
    };
  };
  events: Array<{
    id: string;
    timestamp: number;
    message: string;
    type: 'action' | 'notification' | 'error';
  }>;
  phase: 'lobby' | 'playing' | 'finished';
}

/**
 * 플레이어 액션 메시지 (클라이언트 → 서버)
 */
export interface PlayerActionMessage {
  type: 'PLAYER_ACTION';
  action: {
    type: 'USE_CARD' | 'END_TURN' | 'RESPOND_ATTACK';
    cardId?: string;
    targetId?: string;
    response?: 'evade' | 'give_up';
  };
}

/**
 * 에러 메시지 (서버 → 클라이언트)
 */
export interface ErrorMessage {
  type: 'ERROR';
  message: string;
  code?: string;
}

/**
 * 알림 메시지 (서버 → 클라이언트)
 */
export interface NotificationMessage {
  type: 'NOTIFICATION';
  message: string;
}

