import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // 슬라이스들이 여기에 추가됩니다
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/connect'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

