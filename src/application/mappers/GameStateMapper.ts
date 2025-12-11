/**
 * GameState Mapper
 * WebSocket 메시지 → Domain Entity 변환
 */

import { GameState, GameEvent, TurnState } from '@/domain/entities';
import { PlayerMapper, PlayerDTO } from '@/application/mappers/PlayerMapper';
import { GameStateUpdateMessage } from '@/infrastructure/websocket/types';

/**
 * GameState Mapper 클래스
 */
export class GameStateMapper {
  /**
   * WebSocket 메시지를 Domain Entity로 변환
   * @param message WebSocket 게임 상태 업데이트 메시지
   * @returns GameState 엔티티
   */
  static toDomain(message: GameStateUpdateMessage): GameState {
    // 플레이어 변환
    const players = PlayerMapper.toDomainArray(message.players);

    // 턴 상태 변환
    const turnState = new TurnState(
      message.turnState.currentTurn,
      message.turnState.timeLeft,
      message.turnState.requiredResponse
    );

    // 이벤트 변환
    const events = message.events.map(eventDto => {
      return GameEvent.create(
        eventDto.message,
        eventDto.type as 'action' | 'notification' | 'error'
      );
    });

    // GameState 생성
    const gameState = new GameState(
      message.gameId,
      players,
      message.currentTurn,
      turnState,
      events,
      message.phase
    );

    return gameState;
  }

  /**
   * Domain Entity를 WebSocket 메시지 형식으로 변환
   * @param gameState GameState 엔티티
   * @returns WebSocket 메시지
   */
  static toMessage(gameState: GameState): GameStateUpdateMessage {
    return {
      type: 'GAME_STATE_UPDATE',
      gameId: gameState.gameId,
      players: gameState.players.map(player => PlayerMapper.toDTO(player)),
      currentTurn: gameState.currentTurn,
      turnState: {
        currentTurn: gameState.turnState.currentTurn,
        timeLeft: gameState.turnState.timeLeft,
        requiredResponse: gameState.turnState.requiredResponse,
      },
      events: gameState.events.map(event => ({
        id: event.id,
        timestamp: event.timestamp,
        message: event.message,
        type: event.type,
      })),
      phase: gameState.phase,
    };
  }
}

