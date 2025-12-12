/**
 * WebSocket 클라이언트
 * React Native의 WebSocket을 래핑한 클라이언트
 */

import { logger } from '@/utils/logger';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage {
  type: string;
  data: unknown;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string | null = null;
  private status: WebSocketStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초

  private messageHandlers: Map<string, Array<(data: unknown) => void>> = new Map();
  private errorHandlers: Array<(error: Error) => void> = [];
  private disconnectHandlers: Array<() => void> = [];
  private connectHandlers: Array<() => void> = [];

  /**
   * WebSocket 연결
   * @param url WebSocket 서버 URL
   * @returns Promise<void>
   */
  async connect(url: string): Promise<void> {
    if (this.ws && this.status === 'connected') {
      console.warn('WebSocket is already connected');
      return;
    }

    this.url = url;
    this.status = 'connecting';
    logger.info('WebSocketClient', `연결 시도: ${url}`);

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.status = 'connected';
          this.reconnectAttempts = 0;
          logger.info('WebSocketClient', 'WebSocket 연결 성공', { url });
          this.connectHandlers.forEach(handler => handler());
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const rawMessage = JSON.parse(event.data);
            logger.debug('WebSocketClient', '메시지 수신', { rawMessage });
            
            // 백엔드 메시지 형식에 맞게 처리
            // 백엔드는 { type: "...", ... } 형식으로 직접 전송
            if (rawMessage.type) {
              // 메시지 타입이 있으면 해당 타입으로 핸들러 호출
              // data는 메시지 전체를 전달 (player_id, player_name 등 포함)
              this.handleMessage({
                type: rawMessage.type,
                data: rawMessage,
              });
            } else {
              // 기존 형식 지원 (하위 호환성)
              const message: WebSocketMessage = rawMessage;
              logger.debug('WebSocketClient', '메시지 수신', { type: message.type, data: message.data });
              this.handleMessage(message);
            }
          } catch (error) {
            logger.error('WebSocketClient', '메시지 파싱 실패', error);
          }
        };

        this.ws.onerror = (error) => {
          this.status = 'error';
          const errorObj = new Error('WebSocket error');
          logger.error('WebSocketClient', 'WebSocket 에러 발생', { error, url });
          this.errorHandlers.forEach(handler => handler(errorObj));
          reject(errorObj);
        };

        this.ws.onclose = () => {
          this.status = 'disconnected';
          logger.info('WebSocketClient', 'WebSocket 연결 종료', { url });
          this.disconnectHandlers.forEach(handler => handler());
          this.attemptReconnect();
        };
      } catch (error) {
        this.status = 'error';
        reject(error);
      }
    });
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.status = 'disconnected';
    this.reconnectAttempts = 0;
  }

  /**
   * 메시지 전송
   * @param message 전송할 메시지
   */
  send(message: WebSocketMessage): void {
    if (!this.ws || this.status !== 'connected') {
      const error = new Error('WebSocket is not connected');
      logger.error('WebSocketClient', '메시지 전송 실패: 연결되지 않음', error);
      throw error;
    }

    try {
      logger.debug('WebSocketClient', '메시지 전송', { type: message.type, data: message.data });
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      logger.error('WebSocketClient', '메시지 전송 실패', error);
      throw error;
    }
  }

  /**
   * 직접 메시지 전송 (백엔드 형식에 맞게)
   * @param message 전송할 메시지 객체
   */
  sendRaw(message: Record<string, unknown>): void {
    if (!this.ws || this.status !== 'connected') {
      const error = new Error('WebSocket is not connected');
      logger.error('WebSocketClient', '메시지 전송 실패: 연결되지 않음', error);
      throw error;
    }

    try {
      logger.debug('WebSocketClient', '메시지 전송 (Raw)', message);
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      logger.error('WebSocketClient', '메시지 전송 실패', error);
      throw error;
    }
  }

  /**
   * 메시지 핸들러 등록
   * @param type 메시지 타입
   * @param handler 핸들러 함수
   */
  onMessage(type: string, handler: (data: unknown) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  /**
   * 메시지 핸들러 제거
   * @param type 메시지 타입
   * @param handler 핸들러 함수
   */
  offMessage(type: string, handler: (data: unknown) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 에러 핸들러 등록
   * @param handler 핸들러 함수
   */
  onError(handler: (error: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  /**
   * 연결 해제 핸들러 등록
   * @param handler 핸들러 함수
   */
  onDisconnect(handler: () => void): void {
    this.disconnectHandlers.push(handler);
  }

  /**
   * 연결 핸들러 등록
   * @param handler 핸들러 함수
   */
  onConnect(handler: () => void): void {
    this.connectHandlers.push(handler);
  }

  /**
   * 연결 상태 확인
   * @returns 연결 여부
   */
  isConnected(): boolean {
    return this.status === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 현재 상태 반환
   * @returns WebSocket 상태
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * 메시지 처리
   * @param message 수신한 메시지
   */
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message.data));
    }
  }

  /**
   * 재연결 시도
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    if (!this.url) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.url) {
        this.connect(this.url).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }
}

