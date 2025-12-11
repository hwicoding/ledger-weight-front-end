/**
 * RespondAttack UseCase
 * 공격에 응답하는 비즈니스 로직
 */

import { IWebSocketRepository, PlayerAction } from '@/domain/repositories';
import { GameState } from '@/domain/entities/GameState';

export class RespondAttackUseCase {
  constructor(
    private websocketRepository: IWebSocketRepository,
    private getGameState: () => GameState | null
  ) {}

  /**
   * 공격에 응답 실행
   * @param response 응답 타입 ('evade' 또는 'give_up')
   * @returns Promise<void>
   * @throws Error 응답할 수 없는 경우
   */
  async execute(response: 'evade' | 'give_up'): Promise<void> {
    const gameState = this.getGameState();
    if (!gameState) {
      throw new Error('Game state is not available');
    }

    // 응답이 필요한지 확인
    const turnState = gameState.turnState;
    if (!turnState.requiresResponse()) {
      throw new Error('No response required');
    }

    // 응답 타입 확인
    if (turnState.requiredResponse?.type !== 'RESPOND_ATTACK') {
      throw new Error('Invalid response type');
    }

    // 액션 전송
    const action: PlayerAction = {
      type: 'RESPOND_ATTACK',
      response,
    };

    await this.websocketRepository.sendAction(action);
  }
}

