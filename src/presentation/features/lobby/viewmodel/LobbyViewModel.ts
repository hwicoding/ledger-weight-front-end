/**
 * Lobby ViewModel
 * 로비 화면의 비즈니스 로직 관리 (MVVM 패턴)
 */

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentPlayerId } from '@/store/slices/playerSlice';
import { setError } from '@/store/slices/uiSlice';
import { LobbyService } from '@/application/services';
import { JoinLobbyUseCase } from '@/domain/usecases';
import WebSocketService from '@/infrastructure/websocket/WebSocketService';

export const useLobbyViewModel = () => {
  const dispatch = useAppDispatch();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket 및 서비스 초기화
  const websocketRepository = WebSocketService.getInstance().getRepository();
  const lobbyService = new LobbyService(websocketRepository);
  const joinLobbyUseCase = new JoinLobbyUseCase(websocketRepository);

  // 연결 상태 확인
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(websocketRepository.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, [websocketRepository]);

  // WebSocket 이벤트 리스너 설정
  useEffect(() => {
    websocketRepository.onDisconnect(() => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    websocketRepository.onError((error) => {
      dispatch(setError(error.message));
      setIsConnecting(false);
      setIsConnected(false);
    });
  }, [websocketRepository, dispatch]);

  // 로비 참가
  const handleJoinLobby = useCallback(async (gameId: string, playerName: string) => {
    try {
      setIsConnecting(true);
      
      // WebSocket URL 구성 (실제 백엔드 URL로 변경 필요)
      const wsUrl = `ws://localhost:8080/lobby/${gameId}?player=${encodeURIComponent(playerName)}`;
      
      await joinLobbyUseCase.execute(wsUrl);
      setIsConnected(true);
      setIsConnecting(false);
      
      // 플레이어 ID 저장 (실제로는 서버에서 받아와야 함)
      // 임시로 playerName을 ID로 사용
      dispatch(setCurrentPlayerId(playerName));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로비 참가 실패';
      dispatch(setError(errorMessage));
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [joinLobbyUseCase, dispatch]);

  // 로비 나가기
  const handleLeaveLobby = useCallback(() => {
    lobbyService.leaveLobby();
    setIsConnected(false);
    dispatch(setCurrentPlayerId(null));
  }, [lobbyService, dispatch]);

  // 게임 시작 요청
  const handleStartGame = useCallback(async () => {
    try {
      await lobbyService.startGame();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '게임 시작 실패';
      dispatch(setError(errorMessage));
    }
  }, [lobbyService, dispatch]);

  return {
    // 상태
    isConnecting,
    isConnected,
    
    // 액션
    joinLobby: handleJoinLobby,
    leaveLobby: handleLeaveLobby,
    startGame: handleStartGame,
  };
};

