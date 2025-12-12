/**
 * Lobby ViewModel
 * 로비 화면의 비즈니스 로직 관리 (MVVM 패턴)
 */

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPlayers, selectGameState } from '@/store/selectors';
import { setCurrentPlayerId } from '@/store/slices/playerSlice';
import { setError } from '@/store/slices/uiSlice';
import { setGameState } from '@/store/slices/gameSlice';
import { LobbyService } from '@/application/services';
import { JoinLobbyUseCase } from '@/domain/usecases';
import WebSocketService from '@/infrastructure/websocket/WebSocketService';
import { buildLobbyWebSocketUrl } from '@/config/websocket';
import { GameStateUpdateMessage, ActionResponseMessage, ErrorMessage } from '@/infrastructure/websocket/types';

export const useLobbyViewModel = (onError?: (errorMessage: string) => void, onGameStart?: () => void) => {
  const dispatch = useAppDispatch();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // onError 콜백을 useRef로 감싸서 안정적인 참조 유지
  const onErrorRef = useRef(onError);
  // useEffect 대신 직접 업데이트 (렌더링 중에 안전하게 업데이트 가능)
  onErrorRef.current = onError;
  
  // onGameStart 콜백을 useRef로 감싸서 안정적인 참조 유지
  const onGameStartRef = useRef(onGameStart);
  onGameStartRef.current = onGameStart;
  
  // Redux Store에서 플레이어 목록 및 게임 상태 가져오기
  const players = useAppSelector(selectPlayers);
  const gameState = useAppSelector(selectGameState);

  // WebSocket 및 서비스 초기화
  // useMemo를 사용하여 매 렌더링마다 재생성되지 않도록 함
  // 에러가 발생해도 throw하지 않고 로그만 남김 (앱 크래시 방지)
  const websocketRepository = React.useMemo(() => {
    console.log('🔄 LobbyViewModel: websocketRepository useMemo 실행');
    try {
      const repo = WebSocketService.getInstance().getRepository();
      console.log('✅ LobbyViewModel: websocketRepository 생성 완료');
      return repo;
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to get WebSocket repository', error);
      return null as any;
    }
  }, []);

  const lobbyService = React.useMemo(() => {
    console.log('🔄 LobbyViewModel: lobbyService useMemo 실행');
    if (!websocketRepository) {
      return null as any;
    }
    try {
      const service = new LobbyService(websocketRepository);
      console.log('✅ LobbyViewModel: lobbyService 생성 완료');
      return service;
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to create LobbyService', error);
      return null as any;
    }
  }, [websocketRepository]);

  const joinLobbyUseCase = React.useMemo(() => {
    console.log('🔄 LobbyViewModel: joinLobbyUseCase useMemo 실행');
    if (!websocketRepository) {
      return null as any;
    }
    try {
      const useCase = new JoinLobbyUseCase(websocketRepository);
      console.log('✅ LobbyViewModel: joinLobbyUseCase 생성 완료');
      return useCase;
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to create JoinLobbyUseCase', error);
      return null as any;
    }
  }, [websocketRepository]);

  // WebSocket 이벤트 리스너 설정
  // 초기 연결 상태 확인은 제거 - WebSocket 이벤트로만 상태 관리
  useEffect(() => {
    console.log('🔄 LobbyViewModel: WebSocket 이벤트 리스너 설정 useEffect 실행');
    if (!websocketRepository) {
      console.warn('⚠️ LobbyViewModel: websocketRepository is null, skipping event listeners');
      return;
    }
    
    // 이벤트 핸들러 정의 (dispatch는 클로저로 캡처)
    const handleConnectionEstablished = (message: any) => {
      console.log('✅ LobbyViewModel: CONNECTION_ESTABLISHED 수신', message);
      
      // 플레이어 ID 저장 (서버에서 받은 UUID)
      if (message.player_id) {
        dispatch(setCurrentPlayerId(message.player_id));
        console.log('✅ LobbyViewModel: 플레이어 ID 저장됨', message.player_id);
      }
      
      // 상태 변경 전 현재 상태 확인하여 불필요한 리렌더링 방지
      setIsConnected(prev => {
        if (!prev) {
          console.log('🔄 LobbyViewModel: isConnected 변경: false -> true');
          return true;
        }
        return prev;
      });
      setIsConnecting(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnecting 변경: true -> false');
          return false;
        }
        return prev;
      });
    };

    const handleDisconnect = () => {
      setIsConnected(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnected 변경: true -> false');
          return false;
        }
        return prev;
      });
      setIsConnecting(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnecting 변경: true -> false');
          return false;
        }
        return prev;
      });
    };

    const handleError = (error: Error) => {
      // 에러 콜백이 있으면 콜백 호출, 없으면 Redux에 저장
      if (onErrorRef.current) {
        onErrorRef.current(error.message);
      } else {
        dispatch(setError(error.message));
      }
      setIsConnecting(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnecting 변경: true -> false (에러)');
          return false;
        }
        return prev;
      });
      setIsConnected(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnected 변경: true -> false (에러)');
          return false;
        }
        return prev;
      });
    };

    const handleGameStateUpdate = (update: { type: 'GAME_STATE_UPDATE'; data: GameStateUpdateMessage }) => {
      const message = update.data;
      console.log('🔄 LobbyViewModel: GAME_STATE_UPDATE 수신', { 
        gameId: message.gameId, 
        playersCount: message.players?.length || 0,
        phase: message.phase 
      });
      
      // Redux store에 게임 상태 저장
      // 백엔드 메시지 형식에 맞춰 변환
      dispatch(setGameState({
        gameId: message.gameId,
        players: message.players.map((p: any) => ({
          id: p.id,
          role: (p.role || null) as any, // PlayerRole 타입
          hp: p.hp || 0,
          influence: p.influence || 0,
          treasures: (p.treasures || []) as any[], // Treasure 타입
          hand: (p.hand || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            suit: (c.suit || c.type || '') as any, // CardSuit 타입
            rank: (c.rank || '') as any, // CardRank 타입
            description: c.description || '',
          })),
          tableCards: (p.tableCards || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            suit: (c.suit || c.type || '') as any, // CardSuit 타입
            rank: (c.rank || '') as any, // CardRank 타입
            description: c.description || '',
          })),
          isBot: p.isBot || false,
        })),
        currentTurn: message.currentTurn || '',
        turnState: {
          currentTurn: message.turnState?.currentTurn || '',
          timeLeft: message.turnState?.timeLeft || 60,
          requiredResponse: message.turnState?.requiredResponse,
        },
        events: (message.events || []).map((e: any) => ({
          id: e.id,
          timestamp: e.timestamp,
          message: e.message,
          type: e.type,
        })),
        phase: message.phase || 'lobby',
      }));
      
      console.log('✅ LobbyViewModel: 게임 상태 Redux store에 저장 완료', {
        playersCount: message.players?.length || 0,
        phase: message.phase
      });
      
      // phase가 'playing'이 되면 게임 시작 콜백 호출
      if (message.phase === 'playing' && onGameStartRef.current) {
        console.log('🎮 LobbyViewModel: 게임 시작됨 (phase: playing), 게임 화면으로 이동');
        onGameStartRef.current();
      }
    };

    const handleActionResponse = (message: ActionResponseMessage) => {
      console.log('🔄 LobbyViewModel: ACTION_RESPONSE 수신', message);
      
      if (message.data.success) {
        console.log('✅ LobbyViewModel: 게임 시작 성공', message.data.message);
        // 성공 메시지는 GAME_STATE_UPDATE에서 phase가 'playing'이 되면 처리됨
      } else {
        console.error('❌ LobbyViewModel: 게임 시작 실패', message.data.message);
        const errorMessage = message.data.message || '게임 시작 실패';
        if (onErrorRef.current) {
          onErrorRef.current(errorMessage);
        } else {
          dispatch(setError(errorMessage));
        }
      }
    };

    const handleErrorMessage = (message: ErrorMessage) => {
      console.error('❌ LobbyViewModel: ERROR 메시지 수신', message);
      const errorMessage = message.message || '알 수 없는 오류가 발생했습니다';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
    };

    try {
      // CONNECTION_ESTABLISHED 메시지 처리
      if ('onConnectionEstablished' in websocketRepository) {
        (websocketRepository as any).onConnectionEstablished(handleConnectionEstablished);
      }

      // GAME_STATE_UPDATE 메시지 처리
      websocketRepository.onGameStateUpdate(handleGameStateUpdate);

      // ACTION_RESPONSE 메시지 처리
      if ('onActionResponse' in websocketRepository) {
        (websocketRepository as any).onActionResponse(handleActionResponse);
      }

      // ERROR 메시지 처리 (서버에서 전송하는 ERROR 타입)
      if ('onErrorMessage' in websocketRepository) {
        (websocketRepository as any).onErrorMessage(handleErrorMessage);
      }

      websocketRepository.onDisconnect(handleDisconnect);
      websocketRepository.onError(handleError);

      // Cleanup 함수: 이벤트 리스너 제거
      return () => {
        try {
          if ('offConnectionEstablished' in websocketRepository) {
            (websocketRepository as any).offConnectionEstablished?.(handleConnectionEstablished);
          }
          if ('offActionResponse' in websocketRepository) {
            (websocketRepository as any).offActionResponse?.(handleActionResponse);
          }
          if ('offErrorMessage' in websocketRepository) {
            (websocketRepository as any).offErrorMessage?.(handleErrorMessage);
          }
          // onGameStateUpdate는 배열에 push하므로 필터링으로 제거할 수 없음
          // 하지만 WebSocketRepository가 싱글톤이므로 cleanup은 선택사항
          console.log('🔄 LobbyViewModel: WebSocket 이벤트 리스너 cleanup');
        } catch (error) {
          console.error('❌ LobbyViewModel: Error cleaning up event listeners', error);
        }
      };
    } catch (error) {
      console.error('❌ LobbyViewModel: Error setting up event listeners', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websocketRepository]); // onError는 useRef로 관리하므로 의존성에서 제외

  // 로비 참가
  const handleJoinLobby = useCallback(async (
    gameId: string, 
    playerName: string,
    options?: {
      aiPlayerCount?: number;
      aiDifficulty?: 'easy' | 'medium' | 'hard';
      minPlayers?: number;
      maxPlayers?: number;
    }
  ) => {
    if (!joinLobbyUseCase) {
      console.error('❌ LobbyViewModel: Cannot join lobby - useCase is null');
      const errorMessage = '서비스 초기화 실패';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
      return;
    }
    
    try {
      console.log(`🎮 LobbyViewModel: Joining lobby - gameId: ${gameId}, player: ${playerName}`, options);
      setIsConnecting(prev => {
        if (!prev) {
          console.log('🔄 LobbyViewModel: isConnecting 변경: false -> true');
          return true;
        }
        return prev;
      });
      
      // WebSocket URL 구성 (설정 파일에서 가져옴, AI 플레이어 옵션 포함)
      const wsUrl = buildLobbyWebSocketUrl(gameId, playerName, options);
      console.log(`🔌 LobbyViewModel: Connecting to ${wsUrl}`);
      
      await joinLobbyUseCase.execute(wsUrl);
      console.log('✅ LobbyViewModel: WebSocket 연결 완료');
      // CONNECTION_ESTABLISHED 메시지에서 플레이어 ID를 받을 때까지 대기
      // 플레이어 ID는 onConnectionEstablished 핸들러에서 저장됨
      
      // AI 플레이어가 있으면 연결 후 별도 메시지로 추가 요청
      // 백엔드가 ADD_AI_PLAYER 메시지를 지원하면 사용, 아니면 URL 파라미터로만 전송됨
      if (options?.aiPlayerCount && options.aiPlayerCount > 0 && lobbyService) {
        console.log(`🤖 LobbyViewModel: AI 플레이어 ${options.aiPlayerCount}명 추가 요청 (난이도: ${options.aiDifficulty})`);
        try {
          // 연결이 완료될 때까지 약간 대기 (WebSocket 연결이 완전히 설정된 후)
          setTimeout(async () => {
            if (websocketRepository.isConnected()) {
              await lobbyService.addAiPlayer(
                options.aiPlayerCount!,
                options.aiDifficulty || 'medium',
                gameId
              );
              console.log(`✅ LobbyViewModel: AI 플레이어 추가 요청 전송 완료`);
            }
          }, 500); // 500ms 대기 (CONNECTION_ESTABLISHED 메시지 수신 후)
        } catch (error) {
          console.error('❌ LobbyViewModel: AI 플레이어 추가 요청 실패', error);
          // 에러는 조용히 처리 (URL 파라미터로 대체 가능)
        }
      }
    } catch (error) {
      console.error('❌ LobbyViewModel: Failed to join lobby', error);
      const errorMessage = error instanceof Error ? error.message : '로비 참가 실패';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
      setIsConnecting(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnecting 변경: true -> false (에러)');
          return false;
        }
        return prev;
      });
      setIsConnected(prev => {
        if (prev) {
          console.log('🔄 LobbyViewModel: isConnected 변경: true -> false (에러)');
          return false;
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinLobbyUseCase]); // onError는 useRef로 관리하므로 의존성에서 제외

  // 로비 나가기
  const handleLeaveLobby = useCallback(() => {
    if (lobbyService) {
      lobbyService.leaveLobby();
    }
    setIsConnected(prev => {
      if (prev) {
        console.log('🔄 LobbyViewModel: isConnected 변경: true -> false (나가기)');
        return false;
      }
      return prev;
    });
    dispatch(setCurrentPlayerId(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyService]); // dispatch는 안정적인 참조이므로 의존성에서 제외

  // 게임 시작 요청
  const handleStartGame = useCallback(async (gameId?: string) => {
    if (!lobbyService) {
      console.error('❌ LobbyViewModel: Cannot start game - service is null');
      const errorMessage = '서비스 초기화 실패';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
      return;
    }
    
    try {
      console.log('🎮 LobbyViewModel: 게임 시작 요청', gameId ? `gameId: ${gameId}` : '');
      await lobbyService.startGame(gameId);
      console.log('✅ LobbyViewModel: 게임 시작 요청 전송 완료');
    } catch (error) {
      console.error('❌ LobbyViewModel: 게임 시작 실패', error);
      const errorMessage = error instanceof Error ? error.message : '게임 시작 실패';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyService]); // onError는 useRef로 관리하므로 의존성에서 제외

  // AI 플레이어 추가 (로비 연결 후 별도로 호출 가능)
  const handleAddAiPlayer = useCallback(async (
    count: number,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    gameId?: string
  ) => {
    if (!lobbyService) {
      console.error('❌ LobbyViewModel: Cannot add AI player - service is null');
      const errorMessage = '서비스 초기화 실패';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
      return;
    }
    
    try {
      console.log(`🤖 LobbyViewModel: AI 플레이어 추가 요청 - count: ${count}, difficulty: ${difficulty}`);
      await lobbyService.addAiPlayer(count, difficulty, gameId);
      console.log('✅ LobbyViewModel: AI 플레이어 추가 요청 전송 완료');
    } catch (error) {
      console.error('❌ LobbyViewModel: AI 플레이어 추가 실패', error);
      const errorMessage = error instanceof Error ? error.message : 'AI 플레이어 추가 실패';
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      } else {
        dispatch(setError(errorMessage));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyService]); // onError는 useRef로 관리하므로 의존성에서 제외

  // 반환 객체를 useMemo로 메모이제이션하여 무한 렌더링 방지
  // 함수들은 useCallback으로 이미 메모이제이션되어 있으므로 의존성 배열에 포함하지 않음
  // players 배열의 참조 안정성을 확인
  const playersRef = useRef(players);
  const playersChanged = playersRef.current !== players;
  if (playersChanged) {
    console.log('🔄 LobbyViewModel: players 배열 참조 변경됨', { 
      oldLength: playersRef.current.length, 
      newLength: players.length 
    });
    playersRef.current = players;
  }
  
  const viewModelObject = useMemo(() => {
    console.log('🔄 LobbyViewModel: useMemo 내부 실행', { isConnecting, isConnected, playersLength: players.length, playersChanged });
    return {
      // 상태
      isConnecting,
      isConnected,
      players,
      
      // 액션 (함수 참조는 안정적이므로 의존성 배열에 포함하지 않음)
      joinLobby: handleJoinLobby,
      leaveLobby: handleLeaveLobby,
      startGame: handleStartGame,
      addAiPlayer: handleAddAiPlayer,
    };
  }, [isConnecting, isConnected, players, handleJoinLobby, handleLeaveLobby, handleStartGame, handleAddAiPlayer]);
  
  return viewModelObject;
};

