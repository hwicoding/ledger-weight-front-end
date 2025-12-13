# 백엔드 연동 테스트 계획

**작성일**: 2025-12-12  
**상태**: 진행 중

---

## 📋 테스트 전 준비사항

### 1. 백엔드 서버 실행 확인
- [ ] 백엔드 서버가 `ws://localhost:8080` 또는 `ws://192.168.0.10:8080`에서 실행 중인지 확인
- [ ] 헬스 체크: `http://localhost:8080/health` 또는 `http://192.168.0.10:8080/health`
- [ ] API 문서: `http://localhost:8080/docs` 또는 `http://192.168.0.10:8080/docs`

### 2. 프론트엔드 앱 실행
- [ ] Expo 개발 서버 실행 (`npm start`)
- [ ] 앱이 정상적으로 로드되는지 확인
- [ ] 로비 화면이 표시되는지 확인

### 3. 네트워크 확인
- [ ] 프론트엔드와 백엔드가 같은 네트워크에 있는지 확인
- [ ] 올바른 IP 주소 사용 확인 (`192.168.0.10` 또는 `localhost`)

---

## 🧪 테스트 단계

### 1단계: 기본 연결 테스트 ⭐ **먼저 진행**

#### 테스트 목표
- WebSocket 연결 성공 확인
- `CONNECTION_ESTABLISHED` 메시지 수신
- 플레이어 ID 저장 확인

#### 테스트 방법
1. 앱 실행 후 로비 화면으로 이동
2. 게임 ID 입력 (예: `test_game_001`)
3. 플레이어 이름 입력 (예: `테스트플레이어1`)
4. "로비 참가" 버튼 클릭

#### 예상 결과
- ✅ Toast 메시지: "로비에 연결되었습니다" 또는 연결 성공 메시지
- ✅ 연결 상태가 "✅ 연결됨"으로 변경
- ✅ 로딩 인디케이터 사라짐
- ✅ Chrome DevTools Console에 다음 로그 표시:
  - `🔌 LobbyViewModel: Connecting to ws://...`
  - `✅ LobbyViewModel: WebSocket 연결 완료`
  - `🔄 LobbyViewModel: CONNECTION_ESTABLISHED 수신`
  - `✅ LobbyViewModel: 플레이어 ID 저장 완료`

#### 확인 사항
- [ ] WebSocket 연결 성공
- [ ] `CONNECTION_ESTABLISHED` 메시지 수신
- [ ] 플레이어 ID (UUID) 저장 확인
- [ ] UI 상태 업데이트 확인

#### 문제 발생 시
- 연결 실패: 백엔드 서버 실행 상태 확인
- 메시지 수신 안 됨: WebSocket URL 및 프로토콜 확인
- 에러 발생: Chrome DevTools Console 확인

---

### 2단계: 플레이어 목록 표시 테스트

#### 테스트 목표
- `GAME_STATE_UPDATE` 메시지 수신
- 플레이어 목록 UI 업데이트 확인

#### 테스트 방법
1. 1단계 완료 후 (연결된 상태)
2. 플레이어 목록 섹션 확인

#### 예상 결과
- ✅ 플레이어 목록에 본인 플레이어 표시
- ✅ 플레이어 정보 표시 (이름, HP, 영향력 등)
- ✅ Chrome DevTools Console에 다음 로그 표시:
  - `🔄 LobbyViewModel: GAME_STATE_UPDATE 수신`
  - `✅ LobbyViewModel: 게임 상태 Redux store에 저장 완료`

#### 확인 사항
- [ ] 플레이어 목록이 표시됨
- [ ] 플레이어 정보가 올바르게 표시됨
- [ ] Redux Store에 게임 상태가 저장됨

---

### 3단계: AI 플레이어 추가 테스트 ⭐ **신규 기능**

#### 테스트 목표
- `ADD_AI_PLAYER` 메시지 전송
- AI 플레이어 추가 성공 확인
- AI 플레이어 목록에 표시 확인

#### 테스트 방법 A: 방 생성 시 자동 추가
1. "방 생성" 버튼 클릭
2. 방 생성 모달에서:
   - 플레이어 이름 입력
   - AI 플레이어 수: 3명
   - AI 난이도: 보통
3. "생성" 버튼 클릭

#### 테스트 방법 B: 로비 연결 후 수동 추가
1. 로비에 연결된 상태에서
2. 방 생성 모달에서 AI 플레이어 수 설정 후 연결
3. 또는 별도로 `ADD_AI_PLAYER` 메시지 전송 (현재 UI 없음, 추후 추가 가능)

#### 예상 결과
- ✅ `ADD_AI_PLAYER` 메시지 전송 확인 (Chrome DevTools)
- ✅ `ACTION_RESPONSE` 메시지 수신 (성공)
- ✅ `GAME_STATE_UPDATE` 메시지 수신 (AI 플레이어 포함)
- ✅ 플레이어 목록에 AI 플레이어 표시 (🤖 배지 포함)
- ✅ Chrome DevTools Console에 다음 로그 표시:
  - `🤖 LobbyViewModel: AI 플레이어 추가 요청`
  - `✅ LobbyViewModel: AI 플레이어 추가 요청 전송 완료`
  - `🔄 LobbyViewModel: ACTION_RESPONSE 수신`
  - `✅ LobbyViewModel: AI 플레이어 3명 추가 성공`

#### 확인 사항
- [ ] `ADD_AI_PLAYER` 메시지 전송 확인
- [ ] `ACTION_RESPONSE` 메시지 수신 확인
- [ ] AI 플레이어가 플레이어 목록에 표시됨
- [ ] AI 플레이어에 🤖 배지 표시됨
- [ ] `isBot: true` 필드 확인

---

### 4단계: 게임 시작 테스트

#### 테스트 목표
- 최소 플레이어 수 검증 확인
- `START_GAME` 메시지 전송
- 게임 화면으로 자동 전환 확인

#### 테스트 방법
1. 최소 4명의 플레이어가 로비에 참가 (본인 1명 + AI 3명)
2. "게임 시작" 버튼 클릭

#### 예상 결과
- ✅ `START_GAME` 메시지 전송 확인 (Chrome DevTools)
- ✅ `ACTION_RESPONSE` 메시지 수신 (성공)
- ✅ `GAME_STATE_UPDATE` 메시지 수신 (`phase: "playing"`)
- ✅ 게임 화면으로 자동 전환
- ✅ Chrome DevTools Console에 다음 로그 표시:
  - `🎮 LobbyViewModel: 게임 시작 요청`
  - `✅ LobbyViewModel: 게임 시작 요청 전송 완료`
  - `🔄 LobbyViewModel: ACTION_RESPONSE 수신`
  - `✅ LobbyViewModel: 게임 시작 성공`
  - `🔄 LobbyViewModel: GAME_STATE_UPDATE 수신 (phase: playing)`
  - `🎮 LobbyViewModel: 게임 시작됨 (phase: playing), 게임 화면으로 이동`
  - `🎮 LobbyScreen: 게임 시작됨, 게임 화면으로 이동`

#### 확인 사항
- [ ] 최소 플레이어 수 검증 동작 (4명 미만 시 경고)
- [ ] `START_GAME` 메시지 전송 확인
- [ ] 게임 화면으로 자동 전환됨
- [ ] 게임 상태가 올바르게 표시됨

---

### 5단계: 게임 진행 테스트 (선택사항)

#### 테스트 목표
- 게임 상태 업데이트 수신
- 플레이어 액션 전송

#### 테스트 방법
1. 게임 화면에서 카드 선택
2. 타겟 선택 (필요한 경우)
3. 카드 사용 버튼 클릭

#### 예상 결과
- ✅ `PLAYER_ACTION` 메시지 전송
- ✅ `GAME_STATE_UPDATE` 메시지 수신
- ✅ UI 상태 업데이트

---

## 🔍 디버깅 도구

### Chrome DevTools
1. **Network 탭** → WS 필터 → WebSocket 연결 확인
2. **Console 탭** → 로그 메시지 확인
3. **Redux DevTools** (설치된 경우) → Redux 상태 확인

### 확인할 로그 패턴
```
🔌 LobbyViewModel: Connecting to ws://...
✅ LobbyViewModel: WebSocket 연결 완료
🔄 LobbyViewModel: CONNECTION_ESTABLISHED 수신
🔄 LobbyViewModel: GAME_STATE_UPDATE 수신
🤖 LobbyViewModel: AI 플레이어 추가 요청
🎮 LobbyViewModel: 게임 시작 요청
```

---

## ⚠️ 문제 해결

### 연결 실패
1. 백엔드 서버 실행 상태 확인
2. IP 주소 확인 (`192.168.0.10` 또는 `localhost`)
3. 방화벽 설정 확인
4. 네트워크 연결 확인

### 메시지 수신 안 됨
1. WebSocket URL 확인
2. 프로토콜 형식 확인
3. Chrome DevTools Network 탭에서 메시지 확인

### UI 업데이트 안 됨
1. Redux DevTools에서 상태 확인
2. 이벤트 핸들러 확인
3. 컴포넌트 리렌더링 확인

---

## 📝 테스트 체크리스트

### 기본 연결
- [ ] WebSocket 연결 성공
- [ ] CONNECTION_ESTABLISHED 수신
- [ ] 플레이어 ID 저장
- [ ] 연결 상태 UI 업데이트

### 로비 기능
- [ ] 플레이어 목록 표시
- [ ] GAME_STATE_UPDATE 수신
- [ ] 플레이어 정보 표시

### AI 플레이어 추가
- [ ] ADD_AI_PLAYER 메시지 전송
- [ ] ACTION_RESPONSE 수신
- [ ] AI 플레이어 목록에 표시
- [ ] AI 플레이어 배지 표시

### 게임 시작
- [ ] 최소 플레이어 수 검증
- [ ] START_GAME 메시지 전송
- [ ] 게임 화면 전환
- [ ] 게임 상태 표시

---

**마지막 업데이트**: 2025-12-12

