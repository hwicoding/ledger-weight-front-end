/**
 * 카드 엔티티
 * 순수한 비즈니스 객체 (외부 의존성 없음)
 */

import { CardSuit, CardRank } from '@/domain/entities/types';

export class Card {
  constructor(
    public readonly id: string,
    public readonly name: string, // 정산, 회피, 비상금 등
    public readonly suit: CardSuit, // 검, 책, 치유, 돈
    public readonly rank: CardRank, // 상, 대, 중, 소
    public readonly description?: string
  ) {}

  /**
   * 카드의 전체 이름 반환
   * @returns 카드 이름
   */
  getFullName(): string {
    return `${this.name} (${this.suit} ${this.rank})`;
  }

  /**
   * 카드가 특정 무늬인지 확인
   * @param suit 확인할 무늬
   * @returns 일치 여부
   */
  isSuit(suit: CardSuit): boolean {
    return this.suit === suit;
  }

  /**
   * 카드가 특정 숫자인지 확인
   * @param rank 확인할 숫자
   * @returns 일치 여부
   */
  isRank(rank: CardRank): boolean {
    return this.rank === rank;
  }
}

