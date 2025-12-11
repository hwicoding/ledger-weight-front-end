# 🎨 React Native 디자인 패턴 추천

## 📋 프로젝트 특성 분석

- **프레임워크**: React Native (TypeScript)
- **통신 방식**: WebSocket (실시간 양방향)
- **게임 타입**: 실시간 카드 게임
- **상태 관리**: 복잡한 게임 상태 (플레이어, 카드, 턴 등)
- **UI 복잡도**: 중-고 (게임 보드, 카드, 타겟팅 등)

---

## 🏗️ 클린 아키텍처 + MVVM 패턴 (최종 추천)

### 아키텍처 개요

React Native에서 **클린 아키텍처**와 **MVVM 패턴**을 결합한 구조:

```
src/
├── domain/                    # 🎯 Domain Layer (클린 아키텍처)
│   ├── entities/             # 엔티티 (게임 도메인 모델)
│   │   ├── Player.ts
│   │   ├── Card.ts
│   │   └── GameState.ts
│   ├── usecases/             # 유스케이스 (비즈니스 로직)
│   │   ├── game/
│   │   │   ├── UseCardUseCase.ts
│   │   │   ├── EndTurnUseCase.ts
│   │   │   └── RespondAttackUseCase.ts
│   │   └── lobby/
│   │       └── JoinLobbyUseCase.ts
│   └── repositories/         # Repository 인터페이스 (추상화)
│       ├── IGameRepository.ts
│       └── IWebSocketRepository.ts
│
├── application/               # 🔄 Application Layer
│   ├── services/             # 애플리케이션 서비스
│   │   ├── GameService.ts
│   │   └── LobbyService.ts
│   └── mappers/              # DTO ↔ Entity 변환
│       ├── GameStateMapper.ts
│       └── PlayerMapper.ts
│
├── infrastructure/           # 🔌 Infrastructure Layer
│   ├── websocket/            # WebSocket 구현
│   │   ├── WebSocketRepository.ts  # IWebSocketRepository 구현
│   │   └── WebSocketClient.ts
│   ├── api/                  # API 구현 (필요시)
│   └── storage/              # 로컬 저장소 (필요시)
│
├── presentation/             # 🎨 Presentation Layer (MVVM)
│   ├── features/             # Feature-Based 구조
│   │   ├── lobby/
│   │   │   ├── view/         # View (MVVM)
│   │   │   │   └── LobbyScreen.tsx
│   │   │   ├── viewmodel/    # ViewModel (MVVM)
│   │   │   │   └── LobbyViewModel.ts (Custom Hook)
│   │   │   └── components/   # UI 컴포넌트
│   │   │       └── PlayerList.tsx
│   │   └── game/
│   │       ├── view/
│   │       │   └── GameScreen.tsx
│   │       ├── viewmodel/
│   │       │   ├── GameViewModel.ts
│   │       │   └── PlayerActionViewModel.ts
│   │       └── components/
│   │           ├── GameBoard.tsx
│   │           ├── HandCards.tsx
│   │           └── PlayerCard.tsx
│   └── shared/               # 공통 Presentation
│       ├── components/
│       ├── hooks/
│       └── utils/
│
└── store/                     # 상태 관리 (Redux/Zustand)
    ├── slices/
    └── store.ts
```

### 레이어별 역할

#### 1. Domain Layer (도메인 계층)
- **엔티티**: 순수한 비즈니스 객체 (의존성 없음)
- **유스케이스**: 비즈니스 로직 실행
- **Repository 인터페이스**: 데이터 소스 추상화

```typescript
// domain/entities/Player.ts
export class Player {
  constructor(
    public readonly id: string,
    public readonly role: PlayerRole,
    public readonly hp: number,
    public readonly influence: number,
  ) {}
  
  canTarget(target: Player): boolean {
    // 비즈니스 로직: 영향력 범위 내인지 확인
    return this.influence >= this.calculateDistance(target);
  }
}

// domain/usecases/game/UseCardUseCase.ts
export class UseCardUseCase {
  constructor(
    private gameRepository: IGameRepository,
    private websocketRepository: IWebSocketRepository,
  ) {}
  
  async execute(cardId: string, targetId?: string): Promise<void> {
    const gameState = await this.gameRepository.getCurrentGameState();
    const player = gameState.getCurrentPlayer();
    const card = player.hand.find(c => c.id === cardId);
    
    // 비즈니스 로직 검증
    if (!card) throw new Error('Card not found');
    if (!player.canUseCard(card)) throw new Error('Cannot use card');
    
    // 액션 전송
    await this.websocketRepository.send({
      type: 'USE_CARD',
      cardId,
      targetId,
    });
  }
}
```

#### 2. Application Layer (애플리케이션 계층)
- **서비스**: 여러 유스케이스를 조합
- **Mapper**: 외부 데이터 ↔ 도메인 엔티티 변환

```typescript
// application/services/GameService.ts
export class GameService {
  constructor(
    private useCardUseCase: UseCardUseCase,
    private endTurnUseCase: EndTurnUseCase,
  ) {}
  
  async useCard(cardId: string, targetId?: string): Promise<void> {
    await this.useCardUseCase.execute(cardId, targetId);
  }
  
  async endTurn(): Promise<void> {
    await this.endTurnUseCase.execute();
  }
}
```

#### 3. Infrastructure Layer (인프라 계층)
- **Repository 구현**: 실제 데이터 소스와 통신
- **WebSocket, API, Storage**: 외부 시스템과의 통신

```typescript
// infrastructure/websocket/WebSocketRepository.ts
export class WebSocketRepository implements IWebSocketRepository {
  private ws: WebSocket | null = null;
  
  async connect(url: string): Promise<void> {
    this.ws = new WebSocket(url);
    // 연결 로직
  }
  
  async send(action: PlayerAction): Promise<void> {
    if (!this.ws) throw new Error('Not connected');
    this.ws.send(JSON.stringify(action));
  }
  
  onMessage(callback: (data: GameStateUpdate) => void): void {
    this.ws?.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    });
  }
}
```

#### 4. Presentation Layer (프레젠테이션 계층) - MVVM
- **View**: React 컴포넌트 (UI만 담당)
- **ViewModel**: Custom Hook (로직, 상태 관리)
- **Model**: Store/State (데이터)

```typescript
// presentation/features/game/viewmodel/GameViewModel.ts
export const useGameViewModel = () => {
  const gameService = useGameService(); // Dependency Injection
  const gameState = useSelector(selectGameState);
  
  const useCard = useCallback(async (cardId: string, targetId?: string) => {
    try {
      await gameService.useCard(cardId, targetId);
    } catch (error) {
      // 에러 처리
    }
  }, [gameService]);
  
  return {
    gameState,
    useCard,
    endTurn: () => gameService.endTurn(),
  };
};

// presentation/features/game/view/GameScreen.tsx
export const GameScreen: React.FC = () => {
  const { gameState, useCard, endTurn } = useGameViewModel();
  
  return (
    <View>
      <GameBoard gameState={gameState} />
      <HandCards 
        cards={gameState.currentPlayer.hand}
        onUseCard={useCard}
      />
      <Button onPress={endTurn}>턴 종료</Button>
    </View>
  );
};
```

### 의존성 방향

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓
   ViewModel    UseCase
```

- **외부 → 내부**: 의존성은 항상 안쪽으로만 향함
- **Domain은 독립적**: 외부 의존성 없음
- **Infrastructure는 Domain 인터페이스 구현**

---

## 🏆 추천 디자인 패턴 조합

### 1️⃣ Feature-Based 폴더 구조 (핵심 추천)

**이유**: 게임 기능별로 명확하게 분리되어 확장성과 유지보수성이 뛰어남

```
src/
├── features/              # 기능별 모듈
│   ├── lobby/            # 로비 기능
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── game/             # 인게임 기능
│   │   ├── components/
│   │   │   ├── GameBoard/
│   │   │   ├── PlayerCard/
│   │   │   └── HandCards/
│   │   ├── hooks/
│   │   │   ├── useGameState.ts
│   │   │   └── usePlayerAction.ts
│   │   ├── services/
│   │   └── types.ts
│   └── card/             # 카드 관련 기능
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── shared/               # 공통 모듈
│   ├── components/       # 공통 컴포넌트
│   ├── hooks/           # 공통 훅
│   ├── utils/           # 유틸리티
│   └── types/           # 공통 타입
├── services/            # 서비스 레이어
│   ├── websocket/       # WebSocket 서비스
│   └── api/             # API 서비스 (필요시)
└── store/               # 상태 관리
    ├── slices/          # Redux Toolkit slices
    └── store.ts
```

**장점**:
- 기능별로 독립적인 모듈화
- 코드 탐색이 쉬움
- 팀 협업 시 충돌 최소화
- 기능 추가/제거가 용이

---

### 2️⃣ Custom Hooks 패턴 (비즈니스 로직 분리)

**이유**: 컴포넌트와 비즈니스 로직을 분리하여 재사용성과 테스트 용이성 향상

```typescript
// features/game/hooks/useGameState.ts
export const useGameState = () => {
  const gameState = useSelector(selectGameState);
  const dispatch = useDispatch();
  
  // 게임 상태 관련 로직
  const currentPlayer = useMemo(() => {
    return gameState.players.find(p => p.id === gameState.currentTurn);
  }, [gameState]);
  
  return {
    gameState,
    currentPlayer,
    // ... 기타 게임 상태 관련 값들
  };
};

// features/game/hooks/usePlayerAction.ts
export const usePlayerAction = () => {
  const { sendAction } = useWebSocket();
  
  const useCard = useCallback((cardId: string, targetId?: string) => {
    sendAction({
      type: 'USE_CARD',
      cardId,
      targetId,
    });
  }, [sendAction]);
  
  return { useCard, endTurn, respondAttack };
};
```

**장점**:
- 컴포넌트가 깔끔해짐
- 로직 재사용 가능
- 테스트 작성 용이
- 관심사 분리

---

### 3️⃣ Repository 패턴 (WebSocket 통신 관리)

**이유**: WebSocket 통신을 추상화하여 테스트 가능하고 유지보수하기 쉬운 구조

```typescript
// services/websocket/WebSocketRepository.ts
class WebSocketRepository {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  connect(url: string): Promise<void> {
    // 연결 로직
  }
  
  send(message: PlayerAction): void {
    // 메시지 전송
  }
  
  on(event: string, callback: Function): void {
    // 이벤트 리스너 등록
  }
  
  disconnect(): void {
    // 연결 종료
  }
}

// services/websocket/useWebSocket.ts
export const useWebSocket = () => {
  const repository = useWebSocketRepository();
  const dispatch = useDispatch();
  
  useEffect(() => {
    repository.on('GAME_STATE_UPDATE', (data) => {
      dispatch(updateGameState(data));
    });
  }, []);
  
  return {
    sendAction: repository.send.bind(repository),
    isConnected: repository.isConnected,
  };
};
```

**장점**:
- 통신 로직 캡슐화
- 테스트 시 Mock 가능
- 다른 통신 방식으로 교체 용이
- 에러 핸들링 중앙화

---

### 4️⃣ Container/Presenter 패턴 (UI와 로직 분리)

**이유**: 컴포넌트를 순수한 UI 컴포넌트와 로직을 가진 컨테이너로 분리

```typescript
// Container: 로직 담당
// features/game/components/GameBoard/GameBoardContainer.tsx
export const GameBoardContainer = () => {
  const { gameState, currentPlayer } = useGameState();
  const { useCard, endTurn } = usePlayerAction();
  
  return (
    <GameBoardPresenter
      gameState={gameState}
      currentPlayer={currentPlayer}
      onUseCard={useCard}
      onEndTurn={endTurn}
    />
  );
};

// Presenter: UI만 담당
// features/game/components/GameBoard/GameBoardPresenter.tsx
interface GameBoardPresenterProps {
  gameState: GameState;
  currentPlayer: Player;
  onUseCard: (cardId: string, targetId?: string) => void;
  onEndTurn: () => void;
}

export const GameBoardPresenter: React.FC<GameBoardPresenterProps> = ({
  gameState,
  currentPlayer,
  onUseCard,
  onEndTurn,
}) => {
  // 순수 UI 렌더링만
  return (
    <View>
      {/* UI 코드 */}
    </View>
  );
};
```

**장점**:
- UI 컴포넌트 재사용 가능
- 로직 테스트 용이
- 컴포넌트 책임 명확화

---

### 5️⃣ State Machine 패턴 (게임 상태 관리)

**이유**: 게임의 복잡한 상태 전환을 명확하게 관리

```typescript
// store/gameStateMachine.ts
import { createMachine } from 'xstate'; // 또는 직접 구현

const gameStateMachine = createMachine({
  id: 'game',
  initial: 'lobby',
  states: {
    lobby: {
      on: {
        START_GAME: 'playing',
      },
    },
    playing: {
      on: {
        END_TURN: 'waiting',
        USE_CARD: 'targeting',
      },
    },
    targeting: {
      on: {
        SELECT_TARGET: 'playing',
        CANCEL: 'playing',
      },
    },
    waiting: {
      on: {
        TURN_START: 'playing',
      },
    },
  },
});
```

**장점**:
- 상태 전환 명확화
- 불가능한 상태 전환 방지
- 디버깅 용이

---

## 🎯 최종 추천 조합

### 핵심 패턴 (클린 아키텍처 + MVVM)
1. **클린 아키텍처** ⭐⭐⭐⭐⭐ (필수)
   - Domain, Application, Infrastructure, Presentation 레이어 분리
   - 의존성 역전 원칙 적용
   
2. **MVVM 패턴** ⭐⭐⭐⭐⭐ (필수)
   - View: React Component
   - ViewModel: Custom Hook
   - Model: Store/State

3. **Feature-Based 구조** ⭐⭐⭐⭐⭐ (필수)
   - Presentation Layer 내에서 기능별 모듈화

4. **Repository 패턴** ⭐⭐⭐⭐⭐ (필수)
   - Infrastructure Layer에서 구현
   - Domain Layer에서 인터페이스 정의

### 보조 패턴
5. **State Machine 패턴** (선택 - 게임 상태가 매우 복잡할 경우)

---

## 📊 패턴 비교

| 패턴 | 복잡도 | 유지보수성 | 테스트 용이성 | 추천도 |
|------|--------|-----------|--------------|--------|
| Feature-Based | 중 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Custom Hooks | 낮 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Repository | 중 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Container/Presenter | 중 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| State Machine | 높 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 구현 우선순위

1. **1단계**: Feature-Based 구조 + Custom Hooks
2. **2단계**: Repository 패턴 (WebSocket)
3. **3단계**: Container/Presenter (필요한 컴포넌트만)
4. **4단계**: State Machine (게임 로직 복잡해질 때)

---

## 📝 의사결정 기록

### 선택한 패턴
- **클린 아키텍처**: Domain, Application, Infrastructure, Presentation 레이어 분리
- **MVVM 패턴**: View-ViewModel-Model 구조
- **Feature-Based 구조**: Presentation Layer 내 기능별 모듈화
- **Repository 패턴**: 데이터 소스 추상화

### 선택 이유
1. **테스트 용이성**: 각 레이어가 독립적으로 테스트 가능 (Domain은 외부 의존성 없음)
2. **유지보수성**: 레이어별 책임이 명확하여 수정 영향 범위 최소화
3. **확장성**: 새로운 기능 추가 시 기존 코드 영향 없이 확장 가능
4. **의존성 관리**: 의존성 역전 원칙으로 느슨한 결합
5. **비즈니스 로직 보호**: Domain Layer가 프레임워크/라이브러리 독립적

### 클린 아키텍처의 장점
- **도메인 중심**: 비즈니스 로직이 프레임워크와 분리
- **테스트 가능**: 각 레이어를 독립적으로 테스트
- **프레임워크 독립**: React Native를 다른 프레임워크로 교체해도 Domain은 그대로
- **UI 독립**: UI 변경이 비즈니스 로직에 영향 없음

### MVVM의 장점
- **관심사 분리**: View는 UI만, ViewModel은 로직만
- **재사용성**: ViewModel을 여러 View에서 재사용 가능
- **테스트 용이**: ViewModel을 View 없이 테스트 가능

### 고려했던 대안
- **MVC 패턴**: Controller가 View와 강하게 결합되어 React Native에 부적합
- **단순 Custom Hooks**: 레이어 분리가 없어 비즈니스 로직과 UI가 혼재
- **Layer-Based만**: 기능별 분리가 없어 확장성 낮음

---

**문서 상태**: ✅ 완료  
**최종 업데이트**: 2025-12-11

