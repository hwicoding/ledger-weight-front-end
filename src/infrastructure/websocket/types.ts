/**
 * WebSocket 메시지 타입 정의
 * 백엔드 프로토콜에 맞게 정의
 */

/**
 * 서버에서 클라이언트로 전송하는 메시지 타입
 */
export type ServerMessageType = 'CONNECTION_ESTABLISHED' | 'GAME_STATE_UPDATE' | 'ERROR' | 'NOTIFICATION' | 'ACTION_RESPONSE';

/**
 * 클라이언트에서 서버로 전송하는 메시지 타입
 */
export type ClientMessageType = 'PLAYER_ACTION' | 'PING' | 'ADD_AI_PLAYER' | 'REMOVE_AI_PLAYER';

/**
 * 게임 상태 업데이트 메시지 (서버 → 클라이언트)
 */
export interface GameStateUpdateMessage {
  type: 'GAME_STATE_UPDATE';
  gameId: string;
  players: Array<{
    id: string;
    name: string;  // 플레이어 이름
    role: string | null;  // 자신의 역할만 표시, 다른 플레이어는 null
    hp: number;
    influence: number;
    treasures: string[];
    hand: Array<{
      id: string;
      name: string;
      suit: string;
      rank: string;
    }> | null;  // 자신의 핸드는 전체 카드, 다른 플레이어는 null
    handCount: number;  // 다른 플레이어의 핸드 개수
    tableCards?: Array<{
      id: string;
      name: string;
      suit: string;
      rank: string;
    }>;
    isAlive: boolean;  // 플레이어 생존 여부
    position: number;  // 플레이어 위치
    isBot: boolean;  // AI 플레이어 구분 필드
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

/**
 * 연결 성공 메시지 (서버 → 클라이언트)
 */
export interface ConnectionEstablishedMessage {
  type: 'CONNECTION_ESTABLISHED';
  message: string;
  player_id: string; // 서버에서 생성한 UUID
  player_name: string;
  game_id: string;
}

/**
 * 액션 응답 메시지 (서버 → 클라이언트)
 */
export interface ActionResponseMessage {
  type: 'ACTION_RESPONSE';
  data: {
    success: boolean;
    message: string;
    game_id?: string;
    added_count?: number;  // AI 플레이어 추가 시 추가된 플레이어 수
  };
}

/**
 * AI 플레이어 추가 메시지 (클라이언트 → 서버)
 */
export interface AddAiPlayerMessage {
  type: 'ADD_AI_PLAYER';
  game_id?: string;  // optional, 현재 연결된 게임이면 생략 가능
  count: number;     // 추가할 AI 플레이어 수 (1-7)
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * AI 플레이어 제거 메시지 (클라이언트 → 서버, 선택사항)
 */
export interface RemoveAiPlayerMessage {
  type: 'REMOVE_AI_PLAYER';
  game_id?: string;  // optional
  count: number;     // 제거할 AI 플레이어 수
}

