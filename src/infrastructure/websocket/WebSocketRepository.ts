/**
 * WebSocket Repository 구현
 * Domain Layer의 IWebSocketRepository 인터페이스를 구현
 */

import { IWebSocketRepository, GameStateUpdate, PlayerAction } from '@/domain/repositories';
import { WebSocketClient } from '@/infrastructure/websocket/WebSocketClient';
import { ConnectionEstablishedMessage } from '@/infrastructure/websocket/types';

export class WebSocketRepository implements IWebSocketRepository {
  private client: WebSocketClient;
  private gameStateUpdateHandlers: Array<(update: GameStateUpdate) => void> = [];
  private connectionEstablishedHandlers: Array<(message: ConnectionEstablishedMessage) => void> = [];
  private errorHandlers: Array<(error: Error) => void> = [];
  private disconnectHandlers: Array<() => void> = [];

  constructor() {
    this.client = new WebSocketClient();

    // WebSocketClient 이벤트를 IWebSocketRepository 인터페이스에 맞게 변환
    this.client.onMessage('GAME_STATE_UPDATE', (data) => {
      const update: GameStateUpdate = {
        type: 'GAME_STATE_UPDATE',
        data,
      };
      this.gameStateUpdateHandlers.forEach(handler => handler(update));
    });

    // CONNECTION_ESTABLISHED 메시지 처리
    this.client.onMessage('CONNECTION_ESTABLISHED', (data) => {
      const message = data as ConnectionEstablishedMessage;
      this.connectionEstablishedHandlers.forEach(handler => handler(message));
    });

    this.client.onError((error) => {
      this.errorHandlers.forEach(handler => handler(error));
    });

    this.client.onDisconnect(() => {
      this.disconnectHandlers.forEach(handler => handler());
    });
  }

  /**
   * WebSocket 연결
   * @param url WebSocket 서버 URL
   * @returns Promise<void>
   */
  async connect(url: string): Promise<void> {
    await this.client.connect(url);
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect(): void {
    this.client.disconnect();
  }

  /**
   * 연결 상태 확인
   * @returns 연결 여부
   */
  isConnected(): boolean {
    return this.client.isConnected();
  }

  /**
   * 플레이어 액션 전송
   * @param action 전송할 액션
   * @returns Promise<void>
   */
  async sendAction(action: PlayerAction): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('WebSocket is not connected');
    }

    this.client.send({
      type: 'PLAYER_ACTION',
      data: action,
    });
  }

  /**
   * 게임 상태 업데이트 수신 콜백 등록
   * @param callback 콜백 함수
   */
  onGameStateUpdate(callback: (update: GameStateUpdate) => void): void {
    this.gameStateUpdateHandlers.push(callback);
  }

  /**
   * 에러 발생 콜백 등록
   * @param callback 콜백 함수
   */
  onError(callback: (error: Error) => void): void {
    this.errorHandlers.push(callback);
  }

  /**
   * 연결 해제 콜백 등록
   * @param callback 콜백 함수
   */
  onDisconnect(callback: () => void): void {
    this.disconnectHandlers.push(callback);
  }

  /**
   * 연결 성공 콜백 등록
   * @param callback 콜백 함수
   */
  onConnectionEstablished(callback: (message: ConnectionEstablishedMessage) => void): void {
    this.connectionEstablishedHandlers.push(callback);
  }

  /**
   * 메시지 전송 (일반 메시지)
   * 백엔드 형식에 맞게 직접 전송
   * @param message 전송할 메시지
   */
  sendMessage(message: { type: string; [key: string]: unknown }): void {
    if (!this.isConnected()) {
      throw new Error('WebSocket is not connected');
    }

    // 백엔드 형식에 맞게 직접 전송 (type과 다른 필드들을 함께 전송)
    // 예: { type: "START_GAME", game_id: "..." }
    (this.client as any).sendRaw(message);
  }
}

