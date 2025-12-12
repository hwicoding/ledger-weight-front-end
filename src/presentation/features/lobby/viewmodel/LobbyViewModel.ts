/**
 * Lobby ViewModel
 * 로비 화면의 비즈니스 로직 관리 (MVVM 패턴)
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  // useMemo를 사용하여 매 렌더링마다 재생성되지 않도록 함
  // 에러가 발생해도 throw하지 않고 로그만 남김 (앱 크래시 방지)
  const websocketRepository = React.useMemo(() => {
    console.log('🔧 LobbyViewModel: Getting WebSocket repository...');
    try {
      const repo = WebSocketService.getInstance().getRepository();
      console.log('✅ LobbyViewModel: WebSocket repository obtained');
      return repo;
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to get WebSocket repository', error);
      // 에러를 throw하지 않고 null을 반환 (나중에 체크)
      return null as any;
    }
  }, []);

  const lobbyService = React.useMemo(() => {
    if (!websocketRepository) {
      console.error('❌ LobbyViewModel: Cannot create LobbyService - repository is null');
      return null as any;
    }
    console.log('🔧 LobbyViewModel: Creating LobbyService...');
    try {
      const service = new LobbyService(websocketRepository);
      console.log('✅ LobbyViewModel: LobbyService created');
      return service;
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to create LobbyService', error);
      return null as any;
    }
  }, [websocketRepository]);

  const joinLobbyUseCase = React.useMemo(() => {
    if (!websocketRepository) {
      console.error('❌ LobbyViewModel: Cannot create JoinLobbyUseCase - repository is null');
      return null as any;
    }
    console.log('🔧 LobbyViewModel: Creating JoinLobbyUseCase...');
    try {
      const useCase = new JoinLobbyUseCase(websocketRepository);
      console.log('✅ LobbyViewModel: JoinLobbyUseCase created');
      return useCase;
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to create JoinLobbyUseCase', error);
      return null as any;
    }
  }, [websocketRepository]);

  // 연결 상태 확인
  useEffect(() => {
    if (!websocketRepository) {
      console.warn('⚠️ LobbyViewModel: websocketRepository is null, skipping connection check');
      return;
    }
    
    const checkConnection = () => {
      try {
        setIsConnected(websocketRepository.isConnected());
      } catch (error) {
        console.error('❌ LobbyViewModel: Error checking connection', error);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, [websocketRepository]);

  // WebSocket 이벤트 리스너 설정
  useEffect(() => {
    if (!websocketRepository) {
      console.warn('⚠️ LobbyViewModel: websocketRepository is null, skipping event listeners');
      return;
    }
    
    try {
      websocketRepository.onDisconnect(() => {
        setIsConnected(false);
        setIsConnecting(false);
      });

      websocketRepository.onError((error) => {
        dispatch(setError(error.message));
        setIsConnecting(false);
        setIsConnected(false);
      });
    } catch (error) {
      console.error('❌ LobbyViewModel: Error setting up event listeners', error);
    }
  }, [websocketRepository, dispatch]);

  // 로비 참가
  const handleJoinLobby = useCallback(async (gameId: string, playerName: string) => {
    if (!joinLobbyUseCase) {
      console.error('❌ LobbyViewModel: Cannot join lobby - useCase is null');
      dispatch(setError('서비스 초기화 실패'));
      return;
    }
    
    try {
      console.log(`🎮 LobbyViewModel: Joining lobby - gameId: ${gameId}, player: ${playerName}`);
      setIsConnecting(true);
      
      // WebSocket URL 구성 (실제 백엔드 URL로 변경 필요)
      const wsUrl = `ws://localhost:8080/lobby/${gameId}?player=${encodeURIComponent(playerName)}`;
      console.log(`🔌 LobbyViewModel: Connecting to ${wsUrl}`);
      
      await joinLobbyUseCase.execute(wsUrl);
      console.log('✅ LobbyViewModel: Successfully joined lobby');
      setIsConnected(true);
      setIsConnecting(false);
      
      // 플레이어 ID 저장 (실제로는 서버에서 받아와야 함)
      // 임시로 playerName을 ID로 사용
      dispatch(setCurrentPlayerId(playerName));
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to join lobby', error);
      const errorMessage = error instanceof Error ? error.message : '로비 참가 실패';
      dispatch(setError(errorMessage));
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [joinLobbyUseCase, dispatch]);

  // 로비 나가기
  const handleLeaveLobby = useCallback(() => {
    if (lobbyService) {
      lobbyService.leaveLobby();
    }
    setIsConnected(false);
    dispatch(setCurrentPlayerId(null));
  }, [lobbyService, dispatch]);

  // 게임 시작 요청
  const handleStartGame = useCallback(async () => {
    if (!lobbyService) {
      console.error('❌ LobbyViewModel: Cannot start game - service is null');
      dispatch(setError('서비스 초기화 실패'));
      return;
    }
    
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

