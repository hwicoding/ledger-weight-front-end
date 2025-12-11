# 📦 상태 관리 라이브러리 추천

## 📋 프로젝트 요구사항

- **프레임워크**: React Native (TypeScript)
- **아키텍처**: 클린 아키텍처 + MVVM
- **게임 특성**: 실시간 WebSocket 기반 카드 게임
- **상태 복잡도**: 높음 (플레이어, 카드, 턴, 게임 보드 등)
- **업데이트 빈도**: 실시간 (WebSocket 메시지 수신 시)

---

## 🎯 후보 라이브러리 비교

### 1️⃣ Redux Toolkit (RTK) ⭐⭐⭐⭐⭐ (최종 추천)

#### 특징
- **공식 Redux 권장 방식**
- **TypeScript 지원**: 완벽한 타입 안정성
- **보일러플레이트 최소화**: createSlice로 간단한 작성
- **DevTools**: 강력한 디버깅 도구
- **미들웨어**: Redux Thunk 내장, 커스텀 미들웨어 지원

#### 장점
- ✅ **성숙한 생태계**: 많은 자료와 커뮤니티
- ✅ **클린 아키텍처와 잘 맞음**: Infrastructure Layer에서 상태 업데이트
- ✅ **예측 가능한 상태 업데이트**: 액션 기반
- ✅ **시간 여행 디버깅**: Redux DevTools
- ✅ **테스트 용이**: 순수 함수 기반
- ✅ **대규모 프로젝트에 적합**: 복잡한 상태 관리

#### 단점
- ❌ 상대적으로 많은 보일러플레이트 (RTK로 개선됨)
- ❌ 학습 곡선 존재

#### 사용 예시

```typescript
// store/slices/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Player } from '@/domain/entities';

interface GameStateSlice {
  gameState: GameState | null;
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameStateSlice = {
  gameState: null,
  currentPlayer: null,
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
      state.currentPlayer = action.payload.players.find(
        p => p.id === action.payload.currentTurn
      ) || null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setGameState, setLoading, setError } = gameSlice.actions;
export default gameSlice.reducer;
```

#### 클린 아키텍처 통합

```typescript
// infrastructure/websocket/WebSocketRepository.ts
export class WebSocketRepository implements IWebSocketRepository {
  constructor(private store: Store) {}
  
  onMessage(callback: (data: GameStateUpdate) => void): void {
    this.ws?.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const gameState = GameStateMapper.toDomain(data);
      this.store.dispatch(setGameState(gameState)); // Infrastructure → Store
      callback(data);
    });
  }
}
```

---

### 2️⃣ Zustand ⭐⭐⭐⭐

#### 특징
- **가볍고 간단**: 최소한의 보일러플레이트
- **TypeScript 지원**: 우수
- **Hooks 기반**: useStore 훅 사용
- **번들 크기**: 작음 (~1KB)

#### 장점
- ✅ **간단한 API**: 학습 곡선 낮음
- ✅ **가벼움**: 번들 크기 작음
- ✅ **유연성**: 다양한 패턴 적용 가능
- ✅ **React Native 호환**: 문제없음

#### 단점
- ❌ **대규모 프로젝트**: 복잡한 상태 관리 시 제한적
- ❌ **DevTools**: Redux보다 약함
- ❌ **미들웨어**: 제한적
- ❌ **클린 아키텍처 통합**: Redux보다 어려움

#### 사용 예시

```typescript
// store/gameStore.ts
import { create } from 'zustand';
import { GameState, Player } from '@/domain/entities';

interface GameStore {
  gameState: GameState | null;
  currentPlayer: Player | null;
  setGameState: (gameState: GameState) => void;
  useCard: (cardId: string, targetId?: string) => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  currentPlayer: null,
  setGameState: (gameState) => set({
    gameState,
    currentPlayer: gameState.players.find(
      p => p.id === gameState.currentTurn
    ) || null,
  }),
  useCard: async (cardId, targetId) => {
    // 비즈니스 로직
  },
}));
```

---

### 3️⃣ Jotai ⭐⭐⭐

#### 특징
- **원자적 상태 관리**: 작은 단위로 상태 분리
- **렌더링 최적화**: 필요한 부분만 리렌더링
- **TypeScript 지원**: 우수

#### 장점
- ✅ **세밀한 제어**: 원자 단위 상태 관리
- ✅ **성능**: 불필요한 리렌더링 최소화
- ✅ **유연성**: 다양한 패턴 적용

#### 단점
- ❌ **학습 곡선**: 원자 개념 이해 필요
- ❌ **복잡한 상태**: 게임 상태처럼 복잡하면 관리 어려움
- ❌ **생태계**: 상대적으로 작음

---

### 4️⃣ Recoil ⭐⭐⭐

#### 특징
- **Facebook 개발**: Meta의 상태 관리 라이브러리
- **원자 기반**: Jotai와 유사
- **비동기 지원**: 내장

#### 장점
- ✅ **비동기 처리**: 내장 지원
- ✅ **DevTools**: 제공

#### 단점
- ❌ **React Native 지원**: 제한적 (주로 React 웹용)
- ❌ **실험적**: 아직 안정화 단계
- ❌ **복잡도**: 학습 곡선 높음

---

### 5️⃣ MobX ⭐⭐⭐

#### 특징
- **반응형 상태 관리**: Observable 기반
- **자동 최적화**: 필요한 부분만 업데이트

#### 장점
- ✅ **간단한 API**: 객체 수정만으로 상태 변경
- ✅ **성능**: 자동 최적화

#### 단점
- ❌ **마법 같은 동작**: 디버깅 어려움
- ❌ **클린 아키텍처**: 순수 함수 원칙과 충돌
- ❌ **TypeScript**: 설정 복잡

---

## 📊 비교표

| 라이브러리 | 복잡도 | TypeScript | 클린 아키텍처 | 성능 | 생태계 | 추천도 |
|-----------|--------|-----------|--------------|------|--------|--------|
| **Redux Toolkit** | 중 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Zustand** | 낮 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Jotai** | 중 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Recoil** | 높 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **MobX** | 중 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 최종 추천: Redux Toolkit

### 선택 이유

1. **클린 아키텍처와의 완벽한 통합**
   - Infrastructure Layer에서 액션 디스패치
   - Domain Layer와 분리 유지
   - 예측 가능한 상태 업데이트

2. **복잡한 게임 상태 관리**
   - 여러 슬라이스로 상태 분리 가능
   - 미들웨어로 WebSocket 통신 처리
   - 시간 여행 디버깅으로 게임 상태 추적

3. **실시간 업데이트 처리**
   - Redux Thunk로 비동기 처리
   - 미들웨어로 WebSocket 메시지 처리
   - 상태 업데이트 추적 용이

4. **TypeScript 지원**
   - 완벽한 타입 안정성
   - 타입 추론 우수

5. **테스트 용이성**
   - 순수 함수 기반
   - Mock 및 테스트 작성 용이

### 클린 아키텍처 통합 구조

```
domain/
  └── entities/          # 순수 도메인 모델 (Store 독립적)

infrastructure/
  └── websocket/
      └── WebSocketRepository.ts
          └── store.dispatch(setGameState(...))  # Infrastructure → Store

store/
  ├── slices/
  │   ├── gameSlice.ts   # 게임 상태
  │   ├── playerSlice.ts # 플레이어 상태
  │   └── uiSlice.ts     # UI 상태
  └── store.ts

presentation/
  └── features/
      └── game/
          └── viewmodel/
              └── GameViewModel.ts
                  └── useSelector(...)  # ViewModel → Store
```

### 구현 예시

```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import playerReducer from './slices/playerSlice';
import uiReducer from './slices/uiSlice';

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
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// presentation/features/game/viewmodel/GameViewModel.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setGameState } from '@/store/slices/gameSlice';

export const useGameViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gameState = useSelector((state: RootState) => state.game.gameState);
  const currentPlayer = useSelector((state: RootState) => state.game.currentPlayer);
  
  return {
    gameState,
    currentPlayer,
    // ... 기타 상태 및 액션
  };
};
```

---

## 📝 의사결정 기록

### 선택한 라이브러리
- **Redux Toolkit**

### 선택 이유
1. **클린 아키텍처 통합**: Infrastructure Layer에서 상태 업데이트가 자연스러움
2. **복잡한 상태 관리**: 게임 상태의 복잡도를 효과적으로 관리
3. **실시간 업데이트**: WebSocket 메시지를 미들웨어로 처리 가능
4. **TypeScript 지원**: 완벽한 타입 안정성
5. **디버깅**: Redux DevTools로 게임 상태 추적 용이
6. **테스트**: 순수 함수 기반으로 테스트 작성 용이

### 고려했던 대안
- **Zustand**: 간단하지만 복잡한 게임 상태 관리에는 부족
- **Jotai**: 원자적 접근이 게임 상태에는 과함
- **Recoil**: React Native 지원 제한적
- **MobX**: 클린 아키텍처 원칙과 충돌

### 향후 고려사항
- 게임 규모가 커지면 **Redux Toolkit Query** 추가 고려 (캐싱, 동기화)
- 성능 최적화가 필요하면 **Reselect** 추가 고려

---

## 🚀 구현 단계

### Phase 1: 기본 설정
- [ ] Redux Toolkit 설치
- [ ] Store 설정
- [ ] 기본 Slice 생성

### Phase 2: 게임 상태 통합
- [ ] GameSlice 구현
- [ ] WebSocket Repository와 연동
- [ ] ViewModel에서 Store 사용

### Phase 3: 최적화
- [ ] Selector 최적화 (Reselect)
- [ ] 미들웨어 설정 (WebSocket 처리)
- [ ] DevTools 설정

---

**문서 상태**: ✅ 완료  
**최종 업데이트**: 2025-12-11

