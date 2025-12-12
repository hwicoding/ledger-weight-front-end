# 백엔드 연동 작업 계획

**작성일**: 2025-12-12  
**기준 문서**: 백엔드 연동 준비 완료 보고서

---

## 📋 백엔드 보고서 핵심 내용

### ✅ 구현 완료된 기능
1. 로비 WebSocket 엔드포인트: `/lobby/{game_id}?player={playerName}`
2. 연결 성공 시 `CONNECTION_ESTABLISHED` 메시지 전송 (플레이어 ID 포함)
3. 게임 시작 프로토콜: `START_GAME` 메시지
4. 메시지 프로토콜 표준화 완료

### 🔌 서버 접속 정보
- **개발 환경**: `ws://localhost:8080`
- **프로덕션 환경**: `wss://ledger-weight-api.livbee.co.kr`

---

## 🔍 프론트엔드 현재 상태 분석

### ✅ 이미 구현된 사항
1. **WebSocket URL 형식**: ✅ 일치
   - 현재: `ws://localhost:8080/lobby/{gameId}?player={playerName}`
   - 백엔드: `ws://localhost:8080/lobby/{game_id}?player={playerName}`

2. **WebSocket 연결 로직**: ✅ 기본 구조 완료
   - `WebSocketClient`, `WebSocketRepository` 구현 완료
   - 재연결 로직 구현 완료

3. **게임 상태 업데이트 수신**: ✅ 기본 구조 완료
   - `GAME_STATE_UPDATE` 메시지 수신 구조 구현
   - Redux Store 업데이트 로직 구현

4. **플레이어 액션 전송**: ✅ 기본 구조 완료
   - `PLAYER_ACTION` 메시지 전송 구조 구현
   - UseCase 구현 완료

### ❌ 수정/추가 필요한 사항

#### 1. CONNECTION_ESTABLISHED 메시지 처리 (높은 우선순위)
**문제**: 백엔드에서 연결 시 `CONNECTION_ESTABLISHED` 메시지를 전송하지만, 프론트엔드에서 처리하지 않음

**필요 작업**:
- [ ] `WebSocketClient`에 `CONNECTION_ESTABLISHED` 메시지 타입 추가
- [ ] `CONNECTION_ESTABLISHED` 메시지 핸들러 추가
- [ ] 플레이어 ID 저장 로직 추가 (서버에서 받은 UUID 사용)
- [ ] `LobbyViewModel`에서 플레이어 ID 저장

**예상 메시지 형식**:
```json
{
  "type": "CONNECTION_ESTABLISHED",
  "message": "로비에 연결되었습니다.",
  "player_id": "550e8400-e29b-41d4-a716-446655440000",
  "player_name": "홍길동",
  "game_id": "game_12345"
}
```

#### 2. 플레이어 ID 관리 수정 (높은 우선순위)
**문제**: 현재 프론트엔드는 `playerName`을 플레이어 ID로 사용 중

**필요 작업**:
- [ ] 서버에서 받은 `player_id` (UUID)를 Redux Store에 저장
- [ ] `setCurrentPlayerId`에 UUID 저장하도록 수정
- [ ] 기존 `playerName` 기반 로직을 `playerId` 기반으로 변경

#### 3. 게임 시작 프로토콜 확인 및 수정 (높은 우선순위)
**문제**: 백엔드는 `START_GAME` 메시지를 사용하지만, 프론트엔드의 `LobbyService.startGame()` 구현 확인 필요

**필요 작업**:
- [ ] `LobbyService.startGame()` 메서드 확인
- [ ] `START_GAME` 메시지 형식 확인 및 수정
- [ ] 게임 시작 성공/실패 응답 처리

**백엔드 요구 형식**:
```json
{
  "type": "START_GAME",
  "game_id": "game_12345"  // optional
}
```

#### 4. 메시지 프로토콜 형식 확인 (중간 우선순위)
**필요 작업**:
- [ ] `PLAYER_ACTION` 메시지 형식이 백엔드 요구사항과 일치하는지 확인
- [ ] `GAME_STATE_UPDATE` 메시지 파싱 로직 확인
- [ ] 메시지 타입 정의 확인 (`types.ts`)

**백엔드 요구 형식**:
```json
{
  "type": "PLAYER_ACTION",
  "action": {
    "type": "USE_CARD",
    "cardId": "card_001",
    "targetId": "player_002"  // optional
  }
}
```

#### 5. 환경 변수 설정 (중간 우선순위)
**필요 작업**:
- [ ] 개발 환경 URL 설정 확인
- [ ] 프로덕션 환경 URL 설정 방법 문서화
- [ ] `.env` 파일 또는 `app.config.js` 설정 가이드 작성

#### 6. 에러 메시지 처리 개선 (중간 우선순위)
**필요 작업**:
- [ ] `ERROR` 메시지 타입 처리 확인
- [ ] 에러 메시지 표시 로직 확인
- [ ] 사용자 친화적인 에러 메시지 변환

#### 7. 게임 상태 Phase 처리 (낮은 우선순위)
**필요 작업**:
- [ ] `phase: "lobby" | "playing" | "finished"` 처리 확인
- [ ] Phase별 UI 상태 관리 확인

---

## 🎯 작업 우선순위 및 계획

### Phase 1: 핵심 연동 (즉시 필요) 🔴

#### 1-1. CONNECTION_ESTABLISHED 메시지 처리
**예상 시간**: 1-2시간
**작업 내용**:
1. `src/infrastructure/websocket/types.ts`에 `CONNECTION_ESTABLISHED` 타입 추가
2. `WebSocketClient`에 메시지 핸들러 추가
3. `LobbyViewModel`에서 플레이어 ID 저장 로직 추가

**파일**:
- `src/infrastructure/websocket/types.ts`
- `src/infrastructure/websocket/WebSocketClient.ts`
- `src/presentation/features/lobby/viewmodel/LobbyViewModel.ts`

#### 1-2. 플레이어 ID 관리 수정
**예상 시간**: 1시간
**작업 내용**:
1. `playerSlice`에 `playerId` 필드 추가 (또는 `currentPlayerId`를 UUID로 변경)
2. `CONNECTION_ESTABLISHED`에서 받은 `player_id` 저장
3. 기존 `playerName` 기반 로직 확인 및 수정

**파일**:
- `src/store/slices/playerSlice.ts`
- `src/presentation/features/lobby/viewmodel/LobbyViewModel.ts`

#### 1-3. 게임 시작 프로토콜 확인 및 수정
**예상 시간**: 1시간
**작업 내용**:
1. `LobbyService.startGame()` 메서드 확인
2. `START_GAME` 메시지 형식 확인 및 수정
3. 응답 처리 로직 확인

**파일**:
- `src/application/services/LobbyService.ts`
- `src/infrastructure/websocket/types.ts`

### Phase 2: 메시지 프로토콜 검증 (중간 우선순위) 🟡

#### 2-1. PLAYER_ACTION 메시지 형식 확인
**예상 시간**: 30분
**작업 내용**:
1. 현재 `PLAYER_ACTION` 메시지 형식 확인
2. 백엔드 요구사항과 비교
3. 불일치 시 수정

**파일**:
- `src/infrastructure/websocket/types.ts`
- `src/domain/usecases/UseCardUseCase.ts`
- `src/domain/usecases/EndTurnUseCase.ts`
- `src/domain/usecases/RespondAttackUseCase.ts`

#### 2-2. GAME_STATE_UPDATE 메시지 파싱 확인
**예상 시간**: 1시간
**작업 내용**:
1. 백엔드에서 전송하는 `GAME_STATE_UPDATE` 형식 확인
2. 현재 파싱 로직과 비교
3. 불일치 시 수정

**파일**:
- `src/infrastructure/websocket/types.ts`
- `src/application/mappers/GameStateMapper.ts`
- `src/presentation/features/game/viewmodel/GameViewModel.ts`

### Phase 3: 환경 설정 및 에러 처리 (낮은 우선순위) 🟢

#### 3-1. 환경 변수 설정
**예상 시간**: 30분
**작업 내용**:
1. 개발/프로덕션 URL 설정 확인
2. 설정 가이드 문서 작성

**파일**:
- `src/config/websocket.ts`
- `docs/ENVIRONMENT_SETUP.md` (신규)

#### 3-2. 에러 메시지 처리 개선
**예상 시간**: 1시간
**작업 내용**:
1. `ERROR` 메시지 처리 확인
2. 사용자 친화적인 메시지 변환

**파일**:
- `src/infrastructure/websocket/WebSocketClient.ts`
- `src/presentation/features/lobby/viewmodel/LobbyViewModel.ts`

---

## 🧪 테스트 계획

### 1단계: 기본 연결 테스트
- [ ] WebSocket 연결 성공 확인
- [ ] `CONNECTION_ESTABLISHED` 메시지 수신 확인
- [ ] 플레이어 ID 저장 확인

### 2단계: 로비 기능 테스트
- [ ] 로비 참가 후 플레이어 목록 수신 확인
- [ ] 여러 플레이어 동시 참가 테스트
- [ ] 게임 시작 기능 테스트

### 3단계: 게임 진행 테스트
- [ ] `GAME_STATE_UPDATE` 수신 및 UI 업데이트 확인
- [ ] `USE_CARD` 액션 전송 및 응답 확인
- [ ] 타겟팅 시스템 테스트
- [ ] `END_TURN` 액션 테스트
- [ ] `RESPOND_ATTACK` 액션 테스트

### 4단계: 에러 처리 테스트
- [ ] 잘못된 액션 전송 시 에러 응답 확인
- [ ] 네트워크 끊김 시 재연결 테스트
- [ ] 서버 에러 응답 처리 확인

---

## 📝 다음 단계

1. **Phase 1 작업 시작** (CONNECTION_ESTABLISHED 처리, 플레이어 ID 관리, 게임 시작 프로토콜)
2. **백엔드와 연동 테스트** (기본 연결, 로비 참가, 게임 시작)
3. **Phase 2 작업** (메시지 프로토콜 검증)
4. **Phase 3 작업** (환경 설정, 에러 처리)

---

## ⚠️ 주의사항

1. **플레이어 ID**: 서버에서 받은 UUID를 사용해야 함 (playerName 사용 금지)
2. **게임 시작 조건**: 최소 4명의 플레이어 필요
3. **메시지 형식**: 백엔드 요구사항과 정확히 일치해야 함
4. **에러 처리**: 모든 에러 메시지를 사용자에게 표시해야 함

---

**마지막 업데이트**: 2025-12-12

