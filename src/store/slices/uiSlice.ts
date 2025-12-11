import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UISliceState {
  // 모달 상태
  modals: {
    cardDetail: boolean;
    playerDetail: boolean;
    gameLog: boolean;
    response: boolean; // 회피/포기 응답 모달
  };
  // 알림
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: number;
  }>;
  // 기타 UI 상태
  isLoading: boolean;
  error: string | null;
}

const initialState: UISliceState = {
  modals: {
    cardDetail: false,
    playerDetail: false,
    gameLog: false,
    response: false,
  },
  notifications: [],
  isLoading: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 모달 열기/닫기
    openModal: (state, action: PayloadAction<keyof UISliceState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UISliceState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      state.modals = {
        cardDetail: false,
        playerDetail: false,
        gameLog: false,
        response: false,
      };
    },

    // 알림 추가
    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
      // 최대 5개까지만 유지
      if (state.notifications.length > 5) {
        state.notifications = state.notifications.slice(-5);
      }
    },

    // 알림 제거
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },

    // 모든 알림 제거
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // 로딩 상태
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // 에러 설정
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
} = uiSlice.actions;

export default uiSlice.reducer;

