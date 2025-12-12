# 🖥️ 터미널 실시간 디버깅 가이드

## 📋 개요

이제 모든 로그가 **Metro 번들러 터미널**에 실시간으로 표시됩니다!

## 🎯 터미널에서 확인할 수 있는 로그

### 로그 형식
```
❌ [14:30:25.123] [ERROR] [Category] 메시지
⚠️ [14:30:25.456] [WARN] [Category] 경고 메시지
ℹ️ [14:30:25.789] [INFO] [Category] 정보 메시지
🔍 [14:30:26.012] [DEBUG] [Category] 디버그 메시지
```

### 로그 카테고리

#### App
- 앱 초기화
- 컴포넌트 마운트/언마운트
- 전역 에러

#### LobbyViewModel
- WebSocket 서비스 초기화
- 로비 참가 시도
- 연결 성공/실패

#### WebSocket
- 연결 시도
- 메시지 수신/전송
- 연결 종료
- 에러 발생

#### Redux
- 액션 디스패치
- 상태 변경

#### ErrorBoundary
- 에러 캐치
- 에러 바운더리 리셋

---

## 🚀 사용 방법

### 1. 개발 서버 실행
```bash
npm start
```

### 2. 터미널 확인
터미널에서 실시간으로 로그를 확인할 수 있습니다:

```
🚀 ========================================
🚀 Ledger Weight App Starting...
🚀 ========================================
ℹ️ [14:30:25.123] [INFO] [App] 앱 초기화 시작
🔄 AppNavigator rendering...
📍 Initial route: Lobby
🔧 LobbyViewModel: Initializing WebSocket services...
✅ LobbyViewModel: Services initialized
```

### 3. 에러 발생 시
에러가 발생하면 터미널에 빨간색으로 표시됩니다:

```
❌ [14:30:30.456] [ERROR] [LobbyViewModel] Failed to join lobby
Stack: Error: Connection failed
    at WebSocketClient.connect (WebSocketClient.ts:45)
    ...
```

---

## 📊 로그 레벨

- **❌ ERROR**: 에러 발생 (빨간색)
- **⚠️ WARN**: 경고 (노란색)
- **ℹ️ INFO**: 정보 (파란색)
- **🔍 DEBUG**: 디버그 (회색)

---

## 🔧 고급 사용법

### 특정 카테고리만 필터링
터미널에서 `Ctrl+F`로 검색:
- `[LobbyViewModel]` - LobbyViewModel 로그만
- `[WebSocket]` - WebSocket 로그만
- `[ERROR]` - 에러만

### 로그 파일로 저장
터미널 출력을 파일로 저장:
```bash
npm start > debug.log 2>&1
```

---

## 💡 팁

1. **터미널을 넓게 열기**: 긴 스택 트레이스를 보기 쉽게
2. **로그 검색**: `Ctrl+F`로 특정 에러 검색
3. **타임스탬프 확인**: 정확한 에러 발생 시간 확인
4. **이모지 활용**: 로그 레벨을 빠르게 식별

---

**최종 업데이트**: 2025-12-11

