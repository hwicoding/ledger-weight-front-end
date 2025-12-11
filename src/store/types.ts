/**
 * Redux Store 타입 정의
 * Domain entities가 정의되기 전까지 임시 타입 사용
 */

// 플레이어 역할
export type PlayerRole = '상단주' | '원로원' | '적도 세력' | '야망가';

// 카드 무늬
export type CardSuit = '검' | '책' | '치유' | '돈';

// 카드 숫자
export type CardRank = '상' | '대' | '중' | '소';

// 장착 보물 (16종 중 일부 예시)
export type Treasure =
  | '협상 증표'
  | '비밀 장부'
  | '연속 상환 요구'
  | '기타 보물';

// 카드 타입
export interface Card {
  id: string;
  name: string; // 정산, 회피, 비상금 등
  suit: CardSuit;
  rank: CardRank;
  description?: string;
}

// 플레이어 타입
export interface Player {
  id: string;
  role: PlayerRole;
  hp: number; // 재력
  influence: number; // 영향력 (사거리)
  treasures: Treasure[]; // 장착 보물
  hand: Card[]; // 핸드 카드
  tableCards?: Card[]; // 테이블 카드
}

// 턴 상태
export interface TurnState {
  currentTurn: string; // 현재 턴 플레이어 ID
  timeLeft: number; // 제한 시간 (초)
  requiredResponse?: {
    type: 'RESPOND_ATTACK';
    message: string;
  };
}

// 게임 이벤트/로그
export interface GameEvent {
  id: string;
  timestamp: number;
  message: string;
  type: 'action' | 'notification' | 'error';
}

// 게임 상태
export interface GameState {
  gameId: string;
  players: Player[];
  currentTurn: string;
  turnState: TurnState;
  events: GameEvent[];
  phase: 'lobby' | 'playing' | 'finished';
}

