/**
 * Game ViewModel
 * 게임 화면의 비즈니스 로직 관리 (MVVM 패턴)
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectGameState,
  selectCurrentPlayer,
  selectTurnPlayer,
  selectTurnState,
  selectPlayers,
} from '@/store/selectors';
import {
  setGameState,
  updateTurnState,
  addEvent,
  setError,
} from '@/store/slices/gameSlice';
import { selectCard, selectTarget, setTargetingMode, clearSelection } from '@/store/slices/playerSlice';
import { GameService } from '@/application/services';
import { UseCardUseCase, EndTurnUseCase, RespondAttackUseCase } from '@/domain/usecases';
import { IWebSocketRepository } from '@/domain/repositories';
import { GameState, Player as DomainPlayer, Card as DomainCard } from '@/domain/entities';
import WebSocketService from '@/infrastructure/websocket/WebSocketService';

export const useGameViewModel = () => {
  const dispatch = useAppDispatch();
  
  // Redux Store에서 상태 가져오기
  const gameState = useAppSelector(selectGameState);
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const turnPlayer = useAppSelector(selectTurnPlayer);
  const turnState = useAppSelector(selectTurnState);
  const players = useAppSelector(selectPlayers);
  const selectedCard = useAppSelector(state => state.player.selectedCard);
  const selectedTarget = useAppSelector(state => state.player.selectedTarget);
  const isTargeting = useAppSelector(state => state.player.isTargeting);

  // WebSocket 및 서비스 초기화
  const websocketRepository = WebSocketService.getInstance().getRepository();
  const gameService = new GameService(websocketRepository);
  
  // UseCase 초기화 (게임 상태 getter 함수 필요)
  const getGameStateForUseCase = useCallback((): GameState | null => {
    if (!gameState) return null;
    // Redux Store의 게임 상태를 Domain Entity로 변환 필요
    // 여기서는 간단히 null 반환 (실제로는 Mapper 사용)
    return null;
  }, [gameState]);

  const useCardUseCase = new UseCardUseCase(
    websocketRepository,
    getGameStateForUseCase
  );
  const endTurnUseCase = new EndTurnUseCase(
    websocketRepository,
    getGameStateForUseCase
  );
  const respondAttackUseCase = new RespondAttackUseCase(
    websocketRepository,
    getGameStateForUseCase
  );

  // 게임 상태 업데이트 수신 설정
  useEffect(() => {
    gameService.onGameStateUpdate((domainGameState: GameState) => {
      // Domain Entity를 Redux Store 형태로 변환하여 저장
      // 실제로는 Mapper를 사용해야 하지만, 여기서는 간단히 처리
      dispatch(setGameState({
        gameId: domainGameState.gameId,
        players: domainGameState.players.map(p => ({
          id: p.id,
          role: p.role,
          hp: p.hp,
          influence: p.influence,
          treasures: p.treasures,
          hand: p.hand.map(c => ({
            id: c.id,
            name: c.name,
            suit: c.suit,
            rank: c.rank,
            description: c.description,
          })),
          tableCards: p.tableCards.map(c => ({
            id: c.id,
            name: c.name,
            suit: c.suit,
            rank: c.rank,
            description: c.description,
          })),
        })),
        currentTurn: domainGameState.currentTurn,
        turnState: {
          currentTurn: domainGameState.turnState.currentTurn,
          timeLeft: domainGameState.turnState.timeLeft,
          requiredResponse: domainGameState.turnState.requiredResponse,
        },
        events: domainGameState.events.map(e => ({
          id: e.id,
          timestamp: e.timestamp,
          message: e.message,
          type: e.type,
        })),
        phase: domainGameState.phase,
      }));
    });

    gameService.onError((error) => {
      dispatch(setError(error.message));
      dispatch(addEvent({
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: `에러: ${error.message}`,
        type: 'error',
      }));
    });
  }, [dispatch, gameService]);

  // 카드 사용
  const handleUseCard = useCallback(async (cardId: string, targetId?: string) => {
    try {
      // selectedTarget이 있으면 사용, 없으면 전달받은 targetId 사용
      const finalTargetId = selectedTarget || targetId;
      await useCardUseCase.execute(cardId, finalTargetId);
      dispatch(clearSelection());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카드 사용 실패';
      dispatch(setError(errorMessage));
    }
  }, [useCardUseCase, selectedTarget, dispatch]);

  // 턴 종료
  const handleEndTurn = useCallback(async () => {
    try {
      await endTurnUseCase.execute();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '턴 종료 실패';
      dispatch(setError(errorMessage));
    }
  }, [endTurnUseCase, dispatch]);

  // 공격 응답
  const handleRespondAttack = useCallback(async (response: 'evade' | 'give_up') => {
    try {
      await respondAttackUseCase.execute(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '응답 실패';
      dispatch(setError(errorMessage));
    }
  }, [respondAttackUseCase, dispatch]);

  // 카드 선택
  const handleSelectCard = useCallback((cardId: string) => {
    if (!gameState) return;
    
    const player = currentPlayer || gameState.players.find(p => p.id === gameState.currentTurn);
    if (!player) return;

    const card = player.hand.find(c => c.id === cardId);
    if (card) {
      dispatch(selectCard(card));
      
      // 카드가 타겟이 필요한지 확인 (임시: 모든 카드가 타겟 필요로 가정)
      // 실제로는 카드 타입이나 설명을 보고 판단해야 함
      const needsTarget = true; // TODO: 카드 타입에 따라 결정
      if (needsTarget) {
        dispatch(setTargetingMode(true));
      }
    }
  }, [gameState, currentPlayer, dispatch]);

  // 타겟 선택
  const handleSelectTarget = useCallback((targetId: string) => {
    if (!gameState || !currentPlayer) return;
    
    // 타겟 플레이어 찾기
    const targetPlayerStore = gameState.players.find(p => p.id === targetId);
    if (!targetPlayerStore) return;

    // Store 타입을 Domain Entity로 변환
    const currentPlayerEntity = new DomainPlayer(
      currentPlayer.id,
      currentPlayer.role,
      currentPlayer.hp,
      currentPlayer.influence,
      currentPlayer.treasures,
      currentPlayer.hand.map(c => new DomainCard(c.id, c.name, c.suit, c.rank, c.description)),
      currentPlayer.tableCards?.map(c => new DomainCard(c.id, c.name, c.suit, c.rank, c.description)) || []
    );

    const targetPlayerEntity = new DomainPlayer(
      targetPlayerStore.id,
      targetPlayerStore.role,
      targetPlayerStore.hp,
      targetPlayerStore.influence,
      targetPlayerStore.treasures,
      targetPlayerStore.hand.map(c => new DomainCard(c.id, c.name, c.suit, c.rank, c.description)),
      targetPlayerStore.tableCards?.map(c => new DomainCard(c.id, c.name, c.suit, c.rank, c.description)) || []
    );

    // 타겟팅 가능 여부 확인
    if (currentPlayerEntity.canTarget(targetPlayerEntity)) {
      dispatch(selectTarget(targetId));
    } else {
      dispatch(setError('영향력 범위를 벗어난 플레이어입니다.'));
    }
  }, [gameState, currentPlayer, dispatch]);

  return {
    // 상태
    gameState,
    currentPlayer,
    turnPlayer,
    turnState,
    players,
    selectedCard,
    selectedTarget,
    isTargeting,
    
    // 액션
    useCard: handleUseCard,
    endTurn: handleEndTurn,
    respondAttack: handleRespondAttack,
    selectCard: handleSelectCard,
    selectTarget: handleSelectTarget,
    clearSelection: () => dispatch(clearSelection()),
  };
};

