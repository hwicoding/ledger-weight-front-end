/**
 * Lobby Service
 * 로비 관련 애플리케이션 서비스
 */

import { IWebSocketRepository } from '@/domain/repositories';

export class LobbyService {
  constructor(private websocketRepository: IWebSocketRepository) {}

  /**
   * 로비에 참가
   * @param gameId 게임 ID
   * @param playerName 플레이어 이름
   * @returns Promise<void>
   */
  async joinLobby(gameId: string, playerName: string): Promise<void> {
    // WebSocket 연결 (로비 참가)
    // 실제 구현은 백엔드 프로토콜에 따라 다를 수 있음
    // 예: await this.websocketRepository.connect(`ws://server/lobby/${gameId}?player=${playerName}`);
  }

  /**
   * 게임 시작 요청
   * @param gameId 게임 ID (optional, 없으면 현재 연결된 게임 사용)
   * @returns Promise<void>
   */
  async startGame(gameId?: string): Promise<void> {
    if (!this.websocketRepository.isConnected()) {
      throw new Error('WebSocket is not connected');
    }

    // START_GAME 메시지 전송
    const message = {
      type: 'START_GAME',
      ...(gameId && { game_id: gameId }),
    };

    // WebSocketRepository의 sendMessage 메서드 사용
    (this.websocketRepository as any).sendMessage(message);
  }

  /**
   * 로비 나가기
   */
  leaveLobby(): void {
    this.websocketRepository.disconnect();
  }
}

