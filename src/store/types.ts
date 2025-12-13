/**
 * Redux Store 타입 정의
 * Domain entities를 사용
 */

// Domain entities를 import하여 사용
// Redux Store에서는 일반 객체 형태로 사용하므로 인터페이스로 재정의
import type {
  Player as DomainPlayer,
  Card as DomainCard,
  GameState as DomainGameState,
  TurnState as DomainTurnState,
  GameEvent as DomainGameEvent,
  PlayerRole,
  CardSuit,
  CardRank,
  Treasure,
} from '@/domain/entities';

// Redux Store에서 사용할 타입 (일반 객체 형태)
export type { PlayerRole, CardSuit, CardRank, Treasure };

export interface Card {
  id: string;
  name: string;
  suit: CardSuit;
  rank: CardRank;
  description?: string;
}

export interface Player {
  id: string;
  name: string;  // 플레이어 이름
  role: PlayerRole | null;  // 자신의 역할만 표시, 다른 플레이어는 null
  hp: number;
  influence: number;
  treasures: Treasure[];
  hand: Card[];  // 자신의 핸드는 전체 카드, 다른 플레이어는 빈 배열
  handCount: number;  // 다른 플레이어의 핸드 개수
  tableCards?: Card[];
  isAlive: boolean;  // 플레이어 생존 여부
  position: number;  // 플레이어 위치
  isBot?: boolean;  // AI 플레이어 여부
}

export interface TurnState {
  currentTurn: string;
  timeLeft: number;
  requiredResponse?: {
    type: 'RESPOND_ATTACK';
    message: string;
  };
}

export interface GameEvent {
  id: string;
  timestamp: number;
  message: string;
  type: 'action' | 'notification' | 'error';
}

export interface GameState {
  gameId: string;
  players: Player[];
  currentTurn: string;
  turnState: TurnState;
  events: GameEvent[];
  phase: 'lobby' | 'playing' | 'finished';
}

