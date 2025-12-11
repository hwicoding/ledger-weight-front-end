/**
 * 게임 이벤트 엔티티
 */

export type GameEventType = 'action' | 'notification' | 'error';

export class GameEvent {
  constructor(
    public readonly id: string,
    public readonly timestamp: number,
    public readonly message: string,
    public readonly type: GameEventType
  ) {}

  /**
   * 이벤트 생성 (팩토리 메서드)
   * @param message 메시지
   * @param type 이벤트 타입
   * @returns GameEvent 인스턴스
   */
  static create(message: string, type: GameEventType = 'notification'): GameEvent {
    return new GameEvent(
      Date.now().toString(),
      Date.now(),
      message,
      type
    );
  }

  /**
   * 액션 이벤트 생성
   * @param message 메시지
   * @returns GameEvent 인스턴스
   */
  static createAction(message: string): GameEvent {
    return GameEvent.create(message, 'action');
  }

  /**
   * 알림 이벤트 생성
   * @param message 메시지
   * @returns GameEvent 인스턴스
   */
  static createNotification(message: string): GameEvent {
    return GameEvent.create(message, 'notification');
  }

  /**
   * 에러 이벤트 생성
   * @param message 메시지
   * @returns GameEvent 인스턴스
   */
  static createError(message: string): GameEvent {
    return GameEvent.create(message, 'error');
  }
}

