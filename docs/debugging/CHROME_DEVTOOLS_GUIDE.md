# 🔍 Chrome DevTools 디버깅 가이드

## 📋 개요

React Native/Expo Go에서는 **터미널에 로그가 표시되지 않을 수 있습니다**.  
이 경우 **Chrome DevTools**를 사용하여 콘솔 로그를 확인해야 합니다.

---

## 🚀 Chrome DevTools 연결 방법

### 1단계: 개발자 메뉴 열기

**Android (실제 기기):**
- 기기를 **3번 빠르게 뒤로가기 버튼** 누르기
- 또는 기기를 **흔들기** (Shake gesture)

**Android (에뮬레이터):**
- `Ctrl + M` (Windows/Linux)
- `Cmd + M` (Mac)

**iOS (시뮬레이터):**
- `Cmd + D`

**iOS (실제 기기):**
- 기기를 **흔들기** (Shake gesture)

### 2단계: "Debug Remote JS" 선택

개발자 메뉴에서:
1. **"Debug Remote JS"** 또는 **"Debug"** 선택
2. Chrome 브라우저가 자동으로 열립니다
3. `http://localhost:8081/debugger-ui/` 주소로 연결됩니다

### 3단계: Console 탭 확인

Chrome DevTools가 열리면:
1. **Console 탭** 클릭
2. 여기에 **모든 로그**가 표시됩니다!

---

## 📊 확인할 수 있는 로그

### 일반 로그
```javascript
console.log('✅ App component mounted');
console.log('🔄 AppNavigator rendering...');
```

### 에러 로그
```javascript
console.error('❌ Error:', error);
console.error('Stack:', error.stack);
```

### 경고 로그
```javascript
console.warn('⚠️ Warning:', message);
```

---

## 🎯 실전 사용법

### 1. 앱 실행 중 에러 확인

1. **앱 실행** (Expo Go)
2. **개발자 메뉴 열기** (3번 뒤로가기 또는 흔들기)
3. **"Debug Remote JS"** 선택
4. **Chrome DevTools Console 탭** 확인
5. 에러 메시지 확인!

### 2. 실시간 로그 모니터링

Chrome DevTools Console에서:
- 모든 `console.log` 출력 확인
- 모든 `console.error` 출력 확인
- 스택 트레이스 확인

### 3. 네트워크 모니터링

Chrome DevTools에서:
1. **Network 탭** 클릭
2. **WS (WebSocket)** 필터 선택
3. WebSocket 연결 및 메시지 확인

---

## 🔧 고급 기능

### Redux DevTools

React Native Debugger를 사용하면:
- Redux 상태 확인
- Redux 액션 추적
- 시간 여행 디버깅

### React DevTools

1. Chrome DevTools → **React** 탭
2. 컴포넌트 트리 확인
3. Props 및 State 확인

---

## ⚠️ 주의사항

### 1. Metro 번들러 실행 중이어야 함

Chrome DevTools를 사용하려면:
- Metro 번들러가 실행 중이어야 합니다 (`npm start`)
- `http://localhost:8081`이 접근 가능해야 합니다

### 2. 네트워크 연결 확인

- PC와 기기가 같은 Wi-Fi에 연결되어 있어야 합니다
- 또는 USB 디버깅 사용

### 3. 로그가 안 보일 때

- Chrome DevTools를 **새로고침** (F5)
- 앱을 **재로드** (개발자 메뉴 → Reload)
- Metro 번들러 **재시작**

---

## 📝 예시

### 에러 발생 시

1. 앱에서 에러 발생
2. 개발자 메뉴 열기
3. "Debug Remote JS" 선택
4. Chrome DevTools Console에서 확인:

```
❌ ERROR BOUNDARY CAUGHT ERROR
Error Message: Cannot read property 'map' of undefined
Stack: at LobbyScreen (LobbyScreen.tsx:45)
      at ...
```

### 로그 확인 시

Chrome DevTools Console에서:
```
🚀 ========================================
🚀 Ledger Weight App Starting...
🚀 ========================================
✅ App component mounted successfully
🔄 AppNavigator rendering...
📍 Initial route: Lobby
🔧 LobbyViewModel: Initializing WebSocket services...
```

---

## 🎯 요약

**터미널에 로그가 안 보일 때:**
1. ✅ Chrome DevTools 사용 (가장 확실!)
2. ✅ 개발자 메뉴 → "Debug Remote JS"
3. ✅ Console 탭에서 모든 로그 확인

**이 방법이 가장 확실합니다!**

