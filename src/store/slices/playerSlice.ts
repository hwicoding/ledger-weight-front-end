import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, Card } from '@/store/types';

interface PlayerSliceState {
  currentPlayerId: string | null; // 현재 로그인한 플레이어 ID
  selectedCard: Card | null; // 선택된 카드
  selectedTarget: string | null; // 선택된 타겟 플레이어 ID
  isTargeting: boolean; // 타겟팅 모드 여부
}

const initialState: PlayerSliceState = {
  currentPlayerId: null,
  selectedCard: null,
  selectedTarget: null,
  isTargeting: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // 현재 플레이어 설정
    setCurrentPlayerId: (state, action: PayloadAction<string | null>) => {
      state.currentPlayerId = action.payload;
    },

    // 카드 선택
    selectCard: (state, action: PayloadAction<Card | null>) => {
      state.selectedCard = action.payload;
      // 카드 선택 시 타겟팅 모드 활성화 (필요한 경우)
      if (action.payload) {
        // 카드 타입에 따라 타겟팅 필요 여부 결정
        // 일단은 선택만 하고, 실제 사용 시 타겟팅 모드 활성화
      } else {
        state.isTargeting = false;
        state.selectedTarget = null;
      }
    },

    // 타겟 선택
    selectTarget: (state, action: PayloadAction<string | null>) => {
      state.selectedTarget = action.payload;
    },

    // 타겟팅 모드 토글
    setTargetingMode: (state, action: PayloadAction<boolean>) => {
      state.isTargeting = action.payload;
      if (!action.payload) {
        state.selectedTarget = null;
      }
    },

    // 선택 초기화
    clearSelection: (state) => {
      state.selectedCard = null;
      state.selectedTarget = null;
      state.isTargeting = false;
    },
  },
});

export const {
  setCurrentPlayerId,
  selectCard,
  selectTarget,
  setTargetingMode,
  clearSelection,
} = playerSlice.actions;

export default playerSlice.reducer;

