/**
 * 플레이어 엔티티
 * 순수한 비즈니스 객체 (외부 의존성 없음)
 */

import { Card } from './Card';
import { PlayerRole, Treasure } from './types';

export class Player {
  constructor(
    public readonly id: string,
    public readonly role: PlayerRole,
    public hp: number, // 재력
    public influence: number, // 영향력 (사거리)
    public treasures: Treasure[] = [], // 장착 보물
    public hand: Card[] = [], // 핸드 카드
    public tableCards: Card[] = [] // 테이블 카드
  ) {}

  /**
   * 타겟 플레이어를 공격할 수 있는지 확인
   * @param target 타겟 플레이어
   * @returns 영향력 범위 내인지 여부
   */
  canTarget(target: Player): boolean {
    // 간단한 거리 계산 (실제 게임 로직에 따라 수정 필요)
    return this.influence >= this.calculateDistance(target);
  }

  /**
   * 플레이어 간 거리 계산
   * @param target 타겟 플레이어
   * @returns 거리
   */
  private calculateDistance(target: Player): number {
    // 임시 구현 (실제 게임 로직에 따라 수정 필요)
    // 예: 원형 테이블에서의 거리 계산
    return 1;
  }

  /**
   * 카드를 사용할 수 있는지 확인
   * @param card 사용할 카드
   * @returns 사용 가능 여부
   */
  canUseCard(card: Card): boolean {
    // 핸드에 카드가 있는지 확인
    return this.hand.some(c => c.id === card.id);
  }

  /**
   * 재력 감소
   * @param amount 감소할 양
   */
  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
  }

  /**
   * 재력 회복
   * @param amount 회복할 양
   */
  heal(amount: number): void {
    this.hp += amount;
  }

  /**
   * 카드 추가
   * @param card 추가할 카드
   */
  addCardToHand(card: Card): void {
    this.hand.push(card);
  }

  /**
   * 카드 제거
   * @param cardId 제거할 카드 ID
   * @returns 제거된 카드
   */
  removeCardFromHand(cardId: string): Card | null {
    const index = this.hand.findIndex(c => c.id === cardId);
    if (index === -1) return null;
    return this.hand.splice(index, 1)[0];
  }
}

