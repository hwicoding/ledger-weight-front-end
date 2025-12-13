# 백엔드 담당자 회신 메일

**제목**: [Re: 프론트엔드 연동 준비] 백엔드 구현 완료 및 연동 테스트 안내

**작성일**: 2025-12-12  
**작성자**: 백엔드 개발자  
**대상**: 프론트엔드 담당자

---

## ✅ 구현 완료된 기능

### 1. 로비 WebSocket 엔드포인트
- **엔드포인트**: `/lobby/{game_id}?player={playerName}`
- **기능**:
  - 플레이어 이름을 쿼리 파라미터로 받음
  - 서버에서 UUID 기반 플레이어 ID 자동 생성
  - 연결 성공 시 자동으로 게임 참가 처리
  - `CONNECTION_ESTABLISHED` 메시지 전송 (플레이어 ID 포함)
  - `GAME_STATE_UPDATE` 메시지 자동 전송

### 2. 게임 시작 프로토콜
- **메시지 타입**: `START_GAME`
- **기능**:
  - 최소 플레이어 수 확인 (4명 이상)
  - 게임 상태 검증 (WAITING 상태만 시작 가능)
  - 역할 배정 및 초기화
  - 게임 시작 이벤트 로그 추가
  - 모든 플레이어에게 게임 상태 브로드캐스트

### 3. AI 플레이어 추가 기능 ⭐ **신규**
- **메시지 타입**: `ADD_AI_PLAYER`
- **기능**:
  - AI 플레이어 추가 요청 처리
  - 난이도별 AI 플레이어 이름 생성 (Easy/Medium/Hard)
  - 최대 플레이어 수 검증 (7명)
  - 게임 상태 검증 (WAITING 상태만 추가 가능)
  - `isBot` 필드 포함하여 게임 상태 전송
  - 모든 플레이어에게 게임 상태 브로드캐스트
- **테스트 완료**: 최소 인원(4명)까지 AI 추가 및 게임 시작 테스트 완료

### 4. 메시지 프로토콜 표준화
- **클라이언트 → 서버**: `PLAYER_ACTION` 메시지 형식 프론트엔드 요청 형식으로 변경 완료
- **서버 → 클라이언트**: `GAME_STATE_UPDATE` 메시지 형식 프론트엔드 요청 형식으로 변경 완료
- **게임 이벤트 로그**: 최근 50개 이벤트 포함 (타입: `action`, `notification`, `error`)

---

## 🔌 WebSocket 엔드포인트 정보

### 로비 연결 엔드포인트

**URL 형식**:
```
ws://localhost:8080/lobby/{game_id}?player={playerName}
```

**예시**:
```
ws://localhost:8080/lobby/game_12345?player=홍길동
```

**동작**:
1. 연결 시 서버에서 플레이어 ID (UUID) 자동 생성
2. `CONNECTION_ESTABLISHED` 메시지 수신 (플레이어 ID 포함)
3. 자동으로 게임 참가 처리
4. `GAME_STATE_UPDATE` 메시지 자동 수신

---

## 📨 메시지 프로토콜

### 클라이언트 → 서버 메시지

#### 1. AI 플레이어 추가 요청 ⭐ **신규**
```json
{
  "type": "ADD_AI_PLAYER",
  "game_id": "game_12345",  // optional, 없으면 플레이어가 속한 게임 사용
  "count": 3,                // 추가할 AI 플레이어 수 (1-7)
  "difficulty": "medium"     // "easy" | "medium" | "hard"
}
```

**응답**:
- 성공: `ACTION_RESPONSE` 메시지 + `GAME_STATE_UPDATE` 브로드캐스트
- 실패: `ACTION_RESPONSE` 메시지 (에러 메시지 포함)

**성공 응답 예시**:
```json
{
  "type": "ACTION_RESPONSE",
  "data": {
    "success": true,
    "message": "AI 플레이어 3명이 추가되었습니다.",
    "game_id": "game_12345",
    "added_count": 3
  }
}
```

#### 2. 게임 시작 요청
```json
{
  "type": "START_GAME",
  "game_id": "game_12345"  // optional, 없으면 플레이어가 속한 게임 사용
}
```

#### 3. 플레이어 액션
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

### 서버 → 클라이언트 메시지

#### 1. 게임 상태 업데이트
```json
{
  "type": "GAME_STATE_UPDATE",
  "gameId": "game_12345",
  "players": [
    {
      "id": "player_001",
      "name": "홍길동",
      "hp": 4,
      "influence": 0,
      "role": "상단주",  // 자신의 역할만 표시, 다른 플레이어는 null
      "hand": [...],     // 자신의 핸드는 전체 카드, 다른 플레이어는 null
      "handCount": 2,    // 다른 플레이어의 핸드 개수
      "tableCards": [],
      "treasures": [],
      "isAlive": true,
      "position": 0,
      "isBot": false     // ⭐ AI 플레이어 구분 필드
    },
    {
      "id": "ai_12345678",
      "name": "AI_Player_1",
      "hp": 4,
      "influence": 0,
      "role": null,      // 다른 플레이어의 역할은 null
      "hand": null,      // AI 플레이어의 핸드는 null
      "handCount": 2,
      "tableCards": [],
      "treasures": [],
      "isAlive": true,
      "position": 1,
      "isBot": true      // ⭐ AI 플레이어 표시
    }
  ],
  "currentTurn": "player_001",
  "turnState": {
    "currentTurn": "player_001",
    "timeLeft": 60,
    "requiredResponse": {  // optional, 대응 단계일 때만
      "type": "RESPOND_ATTACK",
      "message": "홍길동이(가) 공격을 받았습니다. 회피하시겠습니까?"
    }
  },
  "events": [...],
  "phase": "lobby"  // "lobby" | "playing" | "finished"
}
```

---

## 🌐 서버 접속 정보

### 개발 환경 (로컬)
- **URL**: `ws://localhost:8080` 또는 `ws://192.168.0.10:8080`
- **HTTP**: `http://localhost:8080` 또는 `http://192.168.0.10:8080`
- **API 문서**: `http://localhost:8080/docs`

**⚠️ 중요**: 
- 로컬 서버 실행이 필요합니다.
- **`10.0.2.2`는 사용할 수 없습니다**. 이 IP는 Android 에뮬레이터 전용이며, 현재 서버 IP가 아닙니다.
- **올바른 IP**: `192.168.0.10` (로컬 네트워크) 또는 `localhost` (같은 머신)
- 자세한 내용은 `docs/WEBSOCKET_CONNECTION_TROUBLESHOOTING.md` 참고

### 프로덕션 환경
- **URL**: `wss://ledger-weight-api.livbee.co.kr`
- **HTTP**: `https://ledger-weight-api.livbee.co.kr`
- **API 문서**: `https://ledger-weight-api.livbee.co.kr/docs`

**현재 상태**: 프로덕션 서버는 배포 완료되어 사용 가능합니다.

---

## 🖥️ 서버 실행 방법 (로컬 개발 환경)

### 빠른 실행 (권장)

**PowerShell에서:**
```powershell
.\start_server.ps1
```

**또는 명령 프롬프트(CMD)에서:**
```cmd
start_server.bat
```

### 수동 실행

1. **가상환경 활성화**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

2. **서버 실행**
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
   ```

### 서버 실행 확인

서버가 정상적으로 실행되면 다음 URL에서 확인할 수 있습니다:
- **헬스 체크**: `http://localhost:8080/health`
- **API 문서**: `http://localhost:8080/docs`

---

## 🧪 연동 테스트 방법

### 1. 기본 연결 테스트

```javascript
const gameId = "test_game_001";
const playerName = "테스트플레이어";
const ws = new WebSocket(`ws://192.168.0.10:8080/lobby/${gameId}?player=${encodeURIComponent(playerName)}`);

ws.onopen = () => {
  console.log("WebSocket 연결 성공");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("수신 메시지:", message);
  
  switch (message.type) {
    case "CONNECTION_ESTABLISHED":
      console.log("플레이어 ID:", message.player_id);
      break;
    case "GAME_STATE_UPDATE":
      console.log("게임 상태:", message);
      break;
    case "ERROR":
      console.error("에러:", message.message);
      break;
  }
};
```

### 2. AI 플레이어 추가 테스트 ⭐ **신규**

```javascript
// 최소 4명이 되도록 AI 추가 (본인 1명 + AI 3명)
ws.send(JSON.stringify({
  type: "ADD_AI_PLAYER",
  count: 3,
  difficulty: "medium"
}));
```

### 3. 게임 시작 테스트

```javascript
// 최소 4명의 플레이어가 연결된 후
ws.send(JSON.stringify({
  type: "START_GAME",
  game_id: "test_game_001"
}));
```

---

## ⚠️ 주의사항 및 제한사항

### 1. 게임 시작 조건
- 최소 플레이어 수: **4명** (본인 포함)
- 최대 플레이어 수: **7명**
- 게임 상태가 `WAITING`일 때만 시작 가능

### 2. AI 플레이어 추가 조건
- 최대 플레이어 수: **7명**
- 게임 상태가 `WAITING`일 때만 추가 가능
- 난이도: `"easy"`, `"medium"`, `"hard"` 중 하나

### 3. 플레이어 ID 관리
- 플레이어 ID는 서버에서 자동 생성 (UUID)
- 로비 연결 시 `CONNECTION_ESTABLISHED` 메시지에서 `player_id` 수신
- 이후 메시지 전송 시 `player_id`는 필요 없음 (연결 정보로 자동 식별)

### 4. 게임 상태 Phase
- `lobby`: 게임 시작 전 대기 상태
- `playing`: 게임 진행 중
- `finished`: 게임 종료

### 5. 핸드 카드 정보
- 자신의 핸드: 전체 카드 정보 배열
- 다른 플레이어의 핸드: `null` (개수는 `handCount`로 확인)
- AI 플레이어의 핸드: `null` (개수는 `handCount`로 확인)

### 6. 역할 정보
- 자신의 역할: 역할 이름 문자열 (예: "상단주", "부하", "무법자", "배신자")
- 다른 플레이어의 역할: `null` (게임 시작 전까지)

### 7. AI 플레이어 식별
- `isBot: true` 필드로 AI 플레이어 구분
- AI 플레이어 이름: `AI_Player_1`, `AI_Easy_1`, `AI_Hard_1` 형식

---

## 📋 체크리스트

연동 테스트 전 확인 사항:

- [ ] 서버가 실행 중인가? (`http://localhost:8080/health` 확인)
- [ ] 올바른 IP 주소를 사용하는가? (`10.0.2.2` ❌ → `192.168.0.10` 또는 `localhost` ✅)
- [ ] 올바른 포트를 사용하는가? (`8080`)
- [ ] 올바른 엔드포인트 경로를 사용하는가? (`/lobby/{game_id}`)
- [ ] 쿼리 파라미터가 올바른가? (`?player={playerName}`)
- [ ] 플레이어 이름이 URL 인코딩되었는가? (`encodeURIComponent` 사용)
- [ ] 방화벽이 포트 8080을 차단하지 않는가?
- [ ] 프론트엔드와 백엔드가 같은 네트워크에 있는가?

---

## 📚 참고 문서

자세한 내용은 다음 문서를 참고하세요:

1. **프론트엔드 연동 준비 완료 보고서**: `docs/FRONTEND_COORDINATION_RESPONSE.md`
   - 구현 완료된 기능 상세 설명
   - 메시지 프로토콜 전체 내용
   - 연동 테스트 방법

2. **WebSocket 연결 문제 해결 가이드**: `docs/WEBSOCKET_CONNECTION_TROUBLESHOOTING.md`
   - 연결 오류 해결 방법
   - IP 주소 문제 해결
   - 방화벽 설정

---

## 🔄 다음 단계

### 즉시 테스트 가능
1. ✅ 로비 연결 및 게임 참가
2. ✅ AI 플레이어 추가
3. ✅ 게임 시작 프로토콜
4. ✅ 게임 상태 조회
5. ✅ 기본 플레이어 액션 (카드 사용, 턴 종료)

### 추가 구현 예정 (우선순위 순)
1. **턴 타이머**: 서버 측 타이머 관리 및 `timeLeft` 업데이트
2. **에러 코드 체계**: 표준화된 에러 코드 정의
3. **타겟팅 검증 강화**: 영향력 범위 검증 로직 개선
4. **게임 진행 중 재연결**: `/game/{game_id}` 엔드포인트 (선택사항)

---

## 📞 문의 및 피드백

연동 테스트 중 문제가 발생하거나 추가 기능이 필요한 경우, 언제든지 문의해주세요.

**연락 방법**:
- 이슈 트래커: GitHub Issues
- 이메일: [이메일 주소]
- 슬랙/디스코드: [채널 정보]

---

## 📝 변경 이력

- **2025-12-12**: 
  - 로비 엔드포인트 및 게임 시작 프로토콜 구현 완료
  - **AI 플레이어 추가 기능 구현 완료** (`ADD_AI_PLAYER` 메시지 처리)
  - 프론트엔드 연동 준비 문서 작성 완료
  - WebSocket 연결 문제 해결 가이드 작성
  - 서버 실행 스크립트 생성
  - 테스트 완료 (최소 인원 충족 및 게임 시작 테스트)
- **2025-12-11**: 메시지 프로토콜 표준화 완료

---

**작성자**: 백엔드 개발자  
**작성일**: 2025-12-12

