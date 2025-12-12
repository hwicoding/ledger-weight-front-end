import { configureStore, Middleware } from '@reduxjs/toolkit';
import gameReducer from '@/store/slices/gameSlice';
import playerReducer from '@/store/slices/playerSlice';
import uiReducer from '@/store/slices/uiSlice';
import { logger } from '@/utils/logger';

// Redux 디버깅 미들웨어
const loggerMiddleware: Middleware = () => (next) => (action: unknown) => {
  if (__DEV__) {
    const typedAction = action as { type: string; [key: string]: unknown };
    logger.debug('Redux', `액션 디스패치: ${typedAction.type}`, typedAction);
  }
  const result = next(action);
  return result;
};

export const store = configureStore({
  reducer: {
    game: gameReducer,
    player: playerReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/connect'],
      },
    }).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

