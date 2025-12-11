/**
 * WebSocket 서비스
 * 싱글톤 패턴으로 WebSocket 연결 관리
 */

import { WebSocketRepository } from '@/infrastructure/websocket/WebSocketRepository';
import { IWebSocketRepository } from '@/domain/repositories';

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private repository: IWebSocketRepository | null = null;

  private constructor() {}

  /**
   * 싱글톤 인스턴스 가져오기
   * @returns WebSocketService 인스턴스
   */
  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * WebSocket Repository 가져오기
   * @returns WebSocketRepository 인스턴스
   */
  getRepository(): IWebSocketRepository {
    if (!this.repository) {
      this.repository = new WebSocketRepository();
    }
    return this.repository;
  }

  /**
   * WebSocket 연결
   * @param url WebSocket 서버 URL
   * @returns Promise<void>
   */
  async connect(url: string): Promise<void> {
    const repo = this.getRepository();
    await repo.connect(url);
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect(): void {
    if (this.repository) {
      this.repository.disconnect();
    }
  }

  /**
   * 연결 상태 확인
   * @returns 연결 여부
   */
  isConnected(): boolean {
    if (!this.repository) {
      return false;
    }
    return this.repository.isConnected();
  }
}

export default WebSocketService;

