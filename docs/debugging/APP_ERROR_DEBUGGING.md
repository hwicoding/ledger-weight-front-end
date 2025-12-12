# 🔍 앱 화면 에러 디버깅 가이드

## 📱 Expo Go에서 에러 확인 방법

### 방법 1: 개발자 메뉴 (가장 빠름)

1. **앱을 흔들기** (Shake gesture)
   - 또는 Android: `Ctrl + M` (에뮬레이터) / 3번 뒤로가기 버튼 (실제 기기)
   - 또는 iOS: `Cmd + D` (시뮬레이터) / 흔들기 (실제 기기)

2. **개발자 메뉴에서 선택:**
   - "Show Element Inspector" - UI 요소 검사
   - "Debug Remote JS" - Chrome DevTools 연결
   - "Show Perf Monitor" - 성능 모니터
   - "Reload" - 앱 재로드

### 방법 2: Chrome DevTools 연결

1. 앱 흔들기 → "Debug Remote JS" 선택
2. Chrome DevTools 자동 열림
3. **Console 탭**에서 에러 확인
4. **Sources 탭**에서 스택 트레이스 확인

### 방법 3: ErrorBoundary 확인

우리 앱에는 ErrorBoundary가 설정되어 있습니다:
- 에러 발생 시 자동으로 에러 화면 표시
- 에러 메시지, 스택 트레이스, 컴포넌트 스택 표시
- 디버그 정보 포함

### 방법 4: 로거 확인 (전역 접근)

Chrome DevTools Console에서:
```javascript
// 모든 로그 확인
global.__LOGGER__.getLogs()

// 에러 로그만 확인
global.__LOGGER__.getErrorLogs()

// 카테고리별 로그
global.__LOGGER__.getLogsByCategory('App')
global.__LOGGER__.getLogsByCategory('Redux')
global.__LOGGER__.getLogsByCategory('WebSocket')

// JSON으로 내보내기
global.__LOGGER__.exportLogs()
```

### 방법 5: Metro 번들러 로그

터미널에서 Metro 번들러 로그 확인:
- 빨간색 에러 메시지 확인
- 노란색 경고 메시지 확인
- 빌드 실패 메시지 확인

---

## 🐛 일반적인 에러 유형

### 1. 컴포넌트 렌더링 에러
- **증상**: 빈 화면 또는 에러 메시지
- **확인**: ErrorBoundary 화면 또는 Chrome DevTools Console
- **원인**: 잘못된 props, undefined 변수 접근

### 2. 네비게이션 에러
- **증상**: 화면 전환 실패
- **확인**: Redux 상태 확인, 네비게이션 로그
- **원인**: 잘못된 route params, 존재하지 않는 화면

### 3. Redux 상태 에러
- **증상**: 데이터가 표시되지 않음
- **확인**: Redux DevTools, `global.__LOGGER__.getLogsByCategory('Redux')`
- **원인**: 잘못된 액션, 상태 업데이트 실패

### 4. WebSocket 연결 에러
- **증상**: 서버와 통신 실패
- **확인**: `global.__LOGGER__.getLogsByCategory('WebSocket')`
- **원인**: 서버 URL 오류, 네트워크 문제

### 5. 타입 에러 (런타임)
- **증상**: 예상치 못한 동작
- **확인**: Chrome DevTools Console, TypeScript 컴파일 에러
- **원인**: 타입 불일치, null/undefined 처리 누락

---

## 🔧 실시간 에러 확인 스크립트

Chrome DevTools Console에서 실행:

```javascript
// 에러 모니터링 시작
const errorMonitor = setInterval(() => {
  const errors = global.__LOGGER__.getErrorLogs();
  if (errors.length > 0) {
    console.group('🚨 New Errors Detected');
    errors.forEach(err => {
      console.error(`[${err.category}] ${err.message}`, err.data);
    });
    console.groupEnd();
  }
}, 5000); // 5초마다 확인

// 모니터링 중지
// clearInterval(errorMonitor);
```

---

## 📝 에러 리포트 작성 시 포함할 정보

1. **에러 메시지**: 정확한 에러 텍스트
2. **스택 트레이스**: 어느 파일의 몇 번째 줄에서 발생
3. **재현 단계**: 어떤 동작을 했을 때 발생하는지
4. **Redux 상태**: `store.getState()` 결과
5. **로거 로그**: `global.__LOGGER__.exportLogs()`
6. **스크린샷**: ErrorBoundary 화면 또는 에러 화면

---

## 🚀 빠른 디버깅 체크리스트

- [ ] 앱 흔들기 → 개발자 메뉴 열기
- [ ] "Debug Remote JS" 선택 → Chrome DevTools 열기
- [ ] Console 탭에서 에러 확인
- [ ] `global.__LOGGER__.getErrorLogs()` 실행
- [ ] ErrorBoundary 화면 확인 (에러 발생 시)
- [ ] Metro 번들러 터미널 로그 확인
- [ ] Redux DevTools로 상태 확인

---

**최종 업데이트**: 2025-12-11

