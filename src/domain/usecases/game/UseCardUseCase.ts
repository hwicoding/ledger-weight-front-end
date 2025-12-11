/**
 * UseCard UseCase
 * 카드 사용 비즈니스 로직
 */

import { IWebSocketRepository, PlayerAction } from '../../repositories';
import { GameState } from '../../entities/GameState';
import { Player } from '../../entities/Player';
import { Card } from '../../entities/Card';

export class UseCardUseCase {
  constructor(
    private websocketRepository: IWebSocketRepository,
    private getGameState: () => GameState | null
  ) {}

  /**
   * 카드 사용 실행
   * @param cardId 사용할 카드 ID
   * @param targetId 타겟 플레이어 ID (선택)
   * @returns Promise<void>
   * @throws Error 카드를 사용할 수 없는 경우
   */
  async execute(cardId: string, targetId?: string): Promise<void> {
    const gameState = this.getGameState();
    if (!gameState) {
      throw new Error('Game state is not available');
    }

    // 현재 플레이어 가져오기
    const currentPlayerId = gameState.currentTurn;
    const currentPlayer = gameState.getPlayer(currentPlayerId);
    if (!currentPlayer) {
      throw new Error('Current player not found');
    }

    // 카드 찾기
    const card = currentPlayer.hand.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Card not found in hand');
    }

    // 카드 사용 가능 여부 확인
    if (!currentPlayer.canUseCard(card)) {
      throw new Error('Cannot use this card');
    }

    // 타겟이 필요한 경우 검증
    if (targetId) {
      const targetPlayer = gameState.getPlayer(targetId);
      if (!targetPlayer) {
        throw new Error('Target player not found');
      }

      // 타겟팅 가능 여부 확인
      if (!currentPlayer.canTarget(targetPlayer)) {
        throw new Error('Target is out of range');
      }
    }

    // 액션 전송
    const action: PlayerAction = {
      type: 'USE_CARD',
      cardId,
      targetId,
    };

    await this.websocketRepository.sendAction(action);
  }
}

