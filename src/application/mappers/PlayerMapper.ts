/**
 * Player Mapper
 * DTO ↔ Domain Entity 변환
 */

import { Player } from '@/domain/entities';
import { Card } from '@/domain/entities';
import { PlayerRole, Treasure } from '@/domain/entities/types';
import { CardSuit, CardRank } from '@/domain/entities/types';

/**
 * WebSocket에서 받은 플레이어 DTO
 */
export interface PlayerDTO {
  id: string;
  role: string;
  hp: number;
  influence: number;
  treasures: string[];
  hand: Array<{
    id: string;
    name: string;
    suit: string;
    rank: string;
  }>;
  tableCards?: Array<{
    id: string;
    name: string;
    suit: string;
    rank: string;
  }>;
}

/**
 * Player Mapper 클래스
 */
export class PlayerMapper {
  /**
   * DTO를 Domain Entity로 변환
   * @param dto 플레이어 DTO
   * @returns Player 엔티티
   */
  static toDomain(dto: PlayerDTO): Player {
    return new Player(
      dto.id,
      dto.role as PlayerRole,
      dto.hp,
      dto.influence,
      dto.treasures as Treasure[],
      dto.hand.map(cardDto => this.cardDtoToEntity(cardDto)),
      dto.tableCards?.map(cardDto => this.cardDtoToEntity(cardDto)) || []
    );
  }

  /**
   * 여러 DTO를 Domain Entity 배열로 변환
   * @param dtos 플레이어 DTO 배열
   * @returns Player 엔티티 배열
   */
  static toDomainArray(dtos: PlayerDTO[]): Player[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Domain Entity를 DTO로 변환
   * @param player Player 엔티티
   * @returns 플레이어 DTO
   */
  static toDTO(player: Player): PlayerDTO {
    return {
      id: player.id,
      role: player.role,
      hp: player.hp,
      influence: player.influence,
      treasures: player.treasures,
      hand: player.hand.map(card => this.cardEntityToDto(card)),
      tableCards: player.tableCards.map(card => this.cardEntityToDto(card)),
    };
  }

  /**
   * 카드 DTO를 Domain Entity로 변환
   * @param cardDto 카드 DTO
   * @returns Card 엔티티
   */
  private static cardDtoToEntity(cardDto: {
    id: string;
    name: string;
    suit: string;
    rank: string;
  }): Card {
    return new Card(
      cardDto.id,
      cardDto.name,
      cardDto.suit as CardSuit,
      cardDto.rank as CardRank
    );
  }

  /**
   * Card 엔티티를 DTO로 변환
   * @param card Card 엔티티
   * @returns 카드 DTO
   */
  private static cardEntityToDto(card: Card): {
    id: string;
    name: string;
    suit: string;
    rank: string;
  } {
    return {
      id: card.id,
      name: card.name,
      suit: card.suit,
      rank: card.rank,
    };
  }
}

