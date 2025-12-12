# WebSocket 연결 문제 해결 가이드

**작성일**: 2025-12-12  
**대상**: 프론트엔드 개발자

---

## 🔍 문제 진단 결과

### 서버 상태 확인
- ✅ **서버 실행 중**: `0.0.0.0:8080`에서 리스닝 중
- ✅ **헬스 체크**: `http://localhost:8080/health` 정상 응답
- ✅ **WebSocket 엔드포인트**: `/lobby/{game_id}` 정상 작동

### 네트워크 확인
- **현재 서버 IP 주소**:
  - Tailscale IP: `100.71.130.16`
  - 로컬 네트워크 IP: `192.168.0.10`
- **요청된 IP**: `10.0.2.2` ❌ (연결 실패)

---

## ⚠️ 문제 원인

`10.0.2.2`는 **Android 에뮬레이터나 가상 머신**에서 호스트 머신을 가리키는 특수 IP 주소입니다.

**현재 상황**:
- 서버는 실제 물리 머신에서 실행 중
- `10.0.2.2`는 현재 서버의 IP가 아님
- 따라서 연결이 실패함

---

## ✅ 해결 방법

### 방법 1: 환경 변수 사용 (권장)

프로젝트 루트에 `.env` 파일을 생성하거나 수정:

```bash
# .env 파일
EXPO_PUBLIC_WS_URL=ws://192.168.0.10:8080

# 또는 Android 전용 설정
EXPO_PUBLIC_ANDROID_WS_URL=ws://192.168.0.10:8080
```

**참고**: Expo는 `.env` 파일을 자동으로 읽습니다. 변경 후 앱을 재시작해야 합니다.

### 방법 2: 코드에서 직접 수정

`src/config/websocket.ts` 파일에서 기본값을 변경:

```typescript
// Android인 경우 로컬 네트워크 IP 사용
if (Platform.OS === 'android') {
  return 'ws://192.168.0.10:8080';  // 서버 IP로 변경
}
```

### 방법 3: 같은 머신에서 실행하는 경우

프론트엔드와 백엔드가 같은 머신에서 실행되는 경우:

```typescript
// 모든 플랫폼에서 localhost 사용
return 'ws://localhost:8080';
```

---

## 🔌 올바른 WebSocket 연결 URL 형식

### 기본 형식
```
ws://[서버_IP]:8080/lobby/{game_id}?player={playerName}
```

### 예시
```javascript
// 게임 ID와 플레이어 이름
const gameId = "test_game_001";
const playerName = "홍길동";

// 올바른 연결 방법
const ws = new WebSocket(
  `ws://192.168.0.10:8080/lobby/${gameId}?player=${encodeURIComponent(playerName)}`
);
```

---

## 🧪 연결 테스트 방법

### 1. 브라우저 콘솔에서 테스트

```javascript
const ws = new WebSocket('ws://192.168.0.10:8080/lobby/test_game?player=TestPlayer');

ws.onopen = () => {
  console.log('✅ WebSocket 연결 성공!');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('📨 수신 메시지:', message);
};

ws.onerror = (error) => {
  console.error('❌ WebSocket 에러:', error);
};

ws.onclose = (event) => {
  console.log('🔌 연결 종료:', event.code, event.reason);
};
```

### 2. curl로 테스트 (PowerShell)

```powershell
# WebSocket 연결 테스트 (간단한 HTTP 요청으로 확인)
Invoke-WebRequest -Uri http://192.168.0.10:8080/health -UseBasicParsing
```

---

## 📋 체크리스트

연결 문제가 발생하면 다음을 확인하세요:

- [ ] 서버가 실행 중인가? (`http://localhost:8080/health` 확인)
- [ ] 올바른 IP 주소를 사용하는가? (`10.0.2.2` ❌ → `192.168.0.10` 또는 `localhost` ✅)
- [ ] 올바른 포트를 사용하는가? (`8080`)
- [ ] 올바른 엔드포인트 경로를 사용하는가? (`/lobby/{game_id}`)
- [ ] 쿼리 파라미터가 올바른가? (`?player={playerName}`)
- [ ] 플레이어 이름이 URL 인코딩되었는가? (`encodeURIComponent` 사용)
- [ ] 방화벽이 포트 8080을 차단하지 않는가?
- [ ] 프론트엔드와 백엔드가 같은 네트워크에 있는가?

---

## 🔧 추가 문제 해결

### 방화벽 확인

Windows 방화벽에서 포트 8080이 허용되어 있는지 확인:

```powershell
# 방화벽 규칙 확인
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*8080*"}

# 방화벽 규칙 추가 (필요시)
New-NetFirewallRule -DisplayName "Ledger Weight Backend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### 서버 재시작

서버를 재시작해야 할 경우:

```bash
# 서버 중지: Ctrl+C
# 서버 재시작
cd ledger-weight-back-end
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### 환경 변수 확인

Expo 앱에서 환경 변수가 제대로 로드되었는지 확인:

```javascript
// 앱 내에서 확인
console.log('WebSocket URL:', process.env.EXPO_PUBLIC_WS_URL);
```

---

## 📱 플랫폼별 주의사항

### Android 에뮬레이터
- **같은 네트워크 필요**: 에뮬레이터와 서버가 같은 Wi-Fi 네트워크에 있어야 함
- **로컬 네트워크 IP 사용**: `192.168.0.10:8080` 사용
- **`10.0.2.2` 사용 불가**: 현재 서버 IP가 아니므로 연결 실패

### Android 실제 기기
- **같은 네트워크 필요**: 기기와 서버가 같은 Wi-Fi 네트워크에 있어야 함
- **로컬 네트워크 IP 사용**: `192.168.0.10:8080` 사용
- **환경 변수 권장**: `.env` 파일에 `EXPO_PUBLIC_ANDROID_WS_URL` 설정

### iOS 시뮬레이터
- **localhost 사용 가능**: 같은 머신에서 실행 시 `localhost:8080` 사용
- **로컬 네트워크 IP 사용 가능**: `192.168.0.10:8080` 사용

### iOS 실제 기기
- **같은 네트워크 필요**: 기기와 서버가 같은 Wi-Fi 네트워크에 있어야 함
- **로컬 네트워크 IP 사용**: `192.168.0.10:8080` 사용
- **환경 변수 권장**: `.env` 파일에 `EXPO_PUBLIC_WS_URL` 설정

---

## 📞 문의

추가 문제가 발생하면 다음 정보를 포함하여 문의해주세요:

1. 사용 중인 IP 주소
2. 에러 메시지 전체 내용
3. 브라우저/앱 환경 (Chrome, Android 에뮬레이터 등)
4. 네트워크 환경 (같은 Wi-Fi, 다른 네트워크 등)
5. 환경 변수 설정 여부

---

**작성자**: 프론트엔드 개발자  
**최종 업데이트**: 2025-12-12

