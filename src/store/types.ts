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
  role: PlayerRole;
  hp: number;
  influence: number;
  treasures: Treasure[];
  hand: Card[];
  tableCards?: Card[];
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

