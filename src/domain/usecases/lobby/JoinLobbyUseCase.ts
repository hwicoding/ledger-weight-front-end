/**
 * JoinLobby UseCase
 * 로비 참가 비즈니스 로직
 */

import { IWebSocketRepository } from '../../repositories';

export class JoinLobbyUseCase {
  constructor(private websocketRepository: IWebSocketRepository) {}

  /**
   * 로비 참가 실행
   * @param url WebSocket 서버 URL
   * @returns Promise<void>
   * @throws Error 연결 실패 시
   */
  async execute(url: string): Promise<void> {
    // 이미 연결되어 있는지 확인
    if (this.websocketRepository.isConnected()) {
      throw new Error('Already connected to a lobby');
    }

    // WebSocket 연결
    await this.websocketRepository.connect(url);
  }
}

