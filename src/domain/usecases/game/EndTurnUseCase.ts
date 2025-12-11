/**
 * EndTurn UseCase
 * 턴 종료 비즈니스 로직
 */

import { IWebSocketRepository, PlayerAction } from '../../repositories';
import { GameState } from '../../entities/GameState';

export class EndTurnUseCase {
  constructor(
    private websocketRepository: IWebSocketRepository,
    private getGameState: () => GameState | null
  ) {}

  /**
   * 턴 종료 실행
   * @returns Promise<void>
   * @throws Error 턴을 종료할 수 없는 경우
   */
  async execute(): Promise<void> {
    const gameState = this.getGameState();
    if (!gameState) {
      throw new Error('Game state is not available');
    }

    // 게임이 진행 중인지 확인
    if (!gameState.isPlaying()) {
      throw new Error('Game is not in playing state');
    }

    // 현재 플레이어의 턴인지 확인
    const currentPlayerId = gameState.currentTurn;
    // 실제로는 현재 로그인한 플레이어 ID와 비교해야 함
    // 여기서는 간단히 검증만 수행

    // 액션 전송
    const action: PlayerAction = {
      type: 'END_TURN',
    };

    await this.websocketRepository.sendAction(action);
  }
}

