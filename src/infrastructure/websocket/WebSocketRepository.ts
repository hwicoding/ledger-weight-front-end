/**
 * WebSocket Repository 구현
 * Domain Layer의 IWebSocketRepository 인터페이스를 구현
 */

import { IWebSocketRepository, GameStateUpdate, PlayerAction } from '@/domain/repositories';
import { WebSocketClient } from '@/infrastructure/websocket/WebSocketClient';
import { ConnectionEstablishedMessage, ActionResponseMessage, ErrorMessage } from '@/infrastructure/websocket/types';

export class WebSocketRepository implements IWebSocketRepository {
  private client: WebSocketClient;
  private gameStateUpdateHandlers: Array<(update: GameStateUpdate) => void> = [];
  private connectionEstablishedHandlers: Array<(message: ConnectionEstablishedMessage) => void> = [];
  private actionResponseHandlers: Array<(message: ActionResponseMessage) => void> = [];
  private errorMessageHandlers: Array<(message: ErrorMessage) => void> = [];
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

    // ACTION_RESPONSE 메시지 처리
    this.client.onMessage('ACTION_RESPONSE', (data) => {
      const message = data as ActionResponseMessage;
      this.actionResponseHandlers.forEach(handler => handler(message));
    });

    // ERROR 메시지 처리 (서버에서 전송하는 에러 메시지)
    this.client.onMessage('ERROR', (data) => {
      const message = data as ErrorMessage;
      this.errorMessageHandlers.forEach(handler => handler(message));
      // ERROR 메시지를 일반 에러 핸들러로도 전달
      const error = new Error(message.message);
      this.errorHandlers.forEach(handler => handler(error));
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
   * 연결 성공 콜백 제거
   * @param callback 콜백 함수
   */
  offConnectionEstablished(callback: (message: ConnectionEstablishedMessage) => void): void {
    const index = this.connectionEstablishedHandlers.indexOf(callback);
    if (index !== -1) {
      this.connectionEstablishedHandlers.splice(index, 1);
    }
  }

  /**
   * 액션 응답 메시지 수신 콜백 등록
   * @param callback 콜백 함수
   */
  onActionResponse(callback: (message: ActionResponseMessage) => void): void {
    this.actionResponseHandlers.push(callback);
  }

  /**
   * 액션 응답 메시지 수신 콜백 제거
   * @param callback 콜백 함수
   */
  offActionResponse(callback: (message: ActionResponseMessage) => void): void {
    const index = this.actionResponseHandlers.indexOf(callback);
    if (index !== -1) {
      this.actionResponseHandlers.splice(index, 1);
    }
  }

  /**
   * 에러 메시지 수신 콜백 등록 (서버에서 전송하는 ERROR 타입 메시지)
   * @param callback 콜백 함수
   */
  onErrorMessage(callback: (message: ErrorMessage) => void): void {
    this.errorMessageHandlers.push(callback);
  }

  /**
   * 에러 메시지 수신 콜백 제거
   * @param callback 콜백 함수
   */
  offErrorMessage(callback: (message: ErrorMessage) => void): void {
    const index = this.errorMessageHandlers.indexOf(callback);
    if (index !== -1) {
      this.errorMessageHandlers.splice(index, 1);
    }
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
    this.client.sendRaw(message);
  }
}

