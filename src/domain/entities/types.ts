/**
 * Domain 엔티티 타입 정의
 */

// 플레이어 역할
export type PlayerRole = '상단주' | '원로원' | '적도 세력' | '야망가';

// 카드 무늬
export type CardSuit = '검' | '책' | '치유' | '돈';

// 카드 숫자
export type CardRank = '상' | '대' | '중' | '소';

// 장착 보물 (16종 중 일부 예시)
export type Treasure =
  | '협상 증표'
  | '비밀 장부'
  | '연속 상환 요구'
  | '기타 보물';

