/**
 * Game Service
 * 게임 관련 애플리케이션 서비스
 */

import { IWebSocketRepository, PlayerAction } from '@/domain/repositories';
import { GameState } from '@/domain/entities';
import { GameStateMapper } from '@/application/mappers/GameStateMapper';
import { GameStateUpdateMessage } from '@/infrastructure/websocket/types';

export class GameService {
  constructor(private websocketRepository: IWebSocketRepository) {}

  /**
   * 카드 사용
   * @param cardId 카드 ID
   * @param targetId 타겟 플레이어 ID (선택)
   * @returns Promise<void>
   */
  async useCard(cardId: string, targetId?: string): Promise<void> {
    const action: PlayerAction = {
      type: 'USE_CARD',
      cardId,
      targetId,
    };

    await this.websocketRepository.sendAction(action);
  }

  /**
   * 턴 종료
   * @returns Promise<void>
   */
  async endTurn(): Promise<void> {
    const action: PlayerAction = {
      type: 'END_TURN',
    };

    await this.websocketRepository.sendAction(action);
  }

  /**
   * 공격에 응답
   * @param response 응답 타입 ('evade' 또는 'give_up')
   * @returns Promise<void>
   */
  async respondAttack(response: 'evade' | 'give_up'): Promise<void> {
    const action: PlayerAction = {
      type: 'RESPOND_ATTACK',
      response,
    };

    await this.websocketRepository.sendAction(action);
  }

  /**
   * 게임 상태 업데이트 수신 콜백 등록
   * @param callback 콜백 함수 (GameState 엔티티 반환)
   */
  onGameStateUpdate(callback: (gameState: GameState) => void): void {
    this.websocketRepository.onGameStateUpdate((update) => {
      // WebSocket 메시지를 Domain Entity로 변환
      const message = update.data as GameStateUpdateMessage;
      const gameState = GameStateMapper.toDomain(message);
      callback(gameState);
    });
  }

  /**
   * 에러 발생 콜백 등록
   * @param callback 콜백 함수
   */
  onError(callback: (error: Error) => void): void {
    this.websocketRepository.onError(callback);
  }

  /**
   * 연결 해제 콜백 등록
   * @param callback 콜백 함수
   */
  onDisconnect(callback: () => void): void {
    this.websocketRepository.onDisconnect(callback);
  }
}

