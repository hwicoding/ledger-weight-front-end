import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GameEvent, TurnState, Player } from '@/store/types';

interface GameSliceState {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  events: GameEvent[]; // 최근 이벤트 로그
}

const initialState: GameSliceState = {
  gameState: null,
  isLoading: false,
  error: null,
  events: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // 게임 상태 설정
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
      state.error = null;
    },

    // 게임 상태 업데이트 (부분 업데이트)
    updateGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      if (state.gameState) {
        state.gameState = {
          ...state.gameState,
          ...action.payload,
        };
      }
    },

    // 턴 상태 업데이트
    updateTurnState: (state, action: PayloadAction<TurnState>) => {
      if (state.gameState) {
        state.gameState.turnState = action.payload;
        state.gameState.currentTurn = action.payload.currentTurn;
      }
    },

    // 플레이어 상태 업데이트
    updatePlayer: (
      state,
      action: PayloadAction<{ playerId: string; player: Partial<Player> }>
    ) => {
      if (state.gameState) {
        const playerIndex = state.gameState.players.findIndex(
          p => p.id === action.payload.playerId
        );
        if (playerIndex !== -1) {
          state.gameState.players[playerIndex] = {
            ...state.gameState.players[playerIndex],
            ...action.payload.player,
          };
        }
      }
    },

    // 이벤트 추가
    addEvent: (state, action: PayloadAction<GameEvent>) => {
      state.events.unshift(action.payload);
      // 최대 50개까지만 유지
      if (state.events.length > 50) {
        state.events = state.events.slice(0, 50);
      }
      // 게임 상태에도 추가
      if (state.gameState) {
        state.gameState.events.unshift(action.payload);
        if (state.gameState.events.length > 50) {
          state.gameState.events = state.gameState.events.slice(0, 50);
        }
      }
    },

    // 로딩 상태 설정
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // 에러 설정
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // 게임 초기화
    resetGame: (state) => {
      state.gameState = null;
      state.events = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setGameState,
  updateGameState,
  updateTurnState,
  updatePlayer,
  addEvent,
  setLoading,
  setError,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;

