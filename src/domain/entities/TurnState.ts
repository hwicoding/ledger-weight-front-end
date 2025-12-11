/**
 * 턴 상태 엔티티
 */

export interface RequiredResponse {
  type: 'RESPOND_ATTACK';
  message: string;
}

export class TurnState {
  constructor(
    public currentTurn: string, // 현재 턴 플레이어 ID
    public timeLeft: number, // 제한 시간 (초)
    public requiredResponse?: RequiredResponse // 필요한 응답
  ) {}

  /**
   * 시간이 남았는지 확인
   * @returns 시간 남음 여부
   */
  hasTimeLeft(): boolean {
    return this.timeLeft > 0;
  }

  /**
   * 응답이 필요한지 확인
   * @returns 응답 필요 여부
   */
  requiresResponse(): boolean {
    return this.requiredResponse !== undefined;
  }

  /**
   * 시간 감소
   * @param seconds 감소할 초
   */
  decreaseTime(seconds: number): void {
    this.timeLeft = Math.max(0, this.timeLeft - seconds);
  }
}

