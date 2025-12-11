/**
 * 게임 상태 엔티티
 * 순수한 비즈니스 객체 (외부 의존성 없음)
 */

import { Player } from './Player';
import { GameEvent } from './GameEvent';
import { TurnState } from './TurnState';

export type GamePhase = 'lobby' | 'playing' | 'finished';

export class GameState {
  constructor(
    public readonly gameId: string,
    public players: Player[],
    public currentTurn: string,
    public turnState: TurnState,
    public events: GameEvent[] = [],
    public phase: GamePhase = 'lobby'
  ) {}

  /**
   * 현재 턴 플레이어 가져오기
   * @returns 현재 턴 플레이어
   */
  getCurrentPlayer(): Player | null {
    return this.players.find(p => p.id === this.currentTurn) || null;
  }

  /**
   * 플레이어 ID로 플레이어 찾기
   * @param playerId 플레이어 ID
   * @returns 플레이어 또는 null
   */
  getPlayer(playerId: string): Player | null {
    return this.players.find(p => p.id === playerId) || null;
  }

  /**
   * 게임이 진행 중인지 확인
   * @returns 진행 중 여부
   */
  isPlaying(): boolean {
    return this.phase === 'playing';
  }

  /**
   * 게임이 종료되었는지 확인
   * @returns 종료 여부
   */
  isFinished(): boolean {
    return this.phase === 'finished';
  }

  /**
   * 이벤트 추가
   * @param event 추가할 이벤트
   */
  addEvent(event: GameEvent): void {
    this.events.unshift(event);
    // 최대 50개까지만 유지
    if (this.events.length > 50) {
      this.events = this.events.slice(0, 50);
    }
  }
}

