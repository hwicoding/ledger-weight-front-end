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
   * @returns Promise<void>
   */
  async startGame(): Promise<void> {
    // 게임 시작 액션 전송
    // 실제 구현은 백엔드 프로토콜에 따라 다를 수 있음
  }

  /**
   * 로비 나가기
   */
  leaveLobby(): void {
    this.websocketRepository.disconnect();
  }
}

