# 🔍 터미널 로그가 안 보이는 이유

## 📋 문제 상황

React Native/Expo Go에서 `console.log`를 사용해도 **Metro 번들러 터미널에 로그가 표시되지 않는 경우**가 있습니다.

---

## 🔬 원인 분석

### 1. 디버거 연결 시 로그 리다이렉션

**Chrome DevTools ("Debug Remote JS")를 연결하면:**
- 모든 `console.log`가 **Chrome DevTools Console로만** 전송됩니다
- Metro 번들러 터미널에는 **표시되지 않습니다**
- 이것은 **정상적인 동작**입니다!

### 2. React Native의 로깅 시스템

React Native는 두 가지 로깅 경로를 사용합니다:

#### 경로 1: Metro 번들러 터미널 (디버거 미연결 시)
- `console.log` → Metro 번들러 터미널
- 개발 서버 터미널에서 확인 가능

#### 경로 2: Chrome DevTools Console (디버거 연결 시)
- `console.log` → Chrome DevTools Console
- Metro 번들러 터미널에는 표시 안 됨

---

## ✅ 해결 방법

### 방법 1: Chrome DevTools Console 확인 (권장)

**디버거가 연결된 상태에서는:**
1. Chrome DevTools가 열려 있는지 확인
2. **Console 탭** 클릭
3. 여기에 모든 로그가 표시됩니다!

**Chrome DevTools가 흰 화면인 경우:**
- 앱을 **재로드** (개발자 메뉴 → Reload)
- Chrome DevTools를 **새로고침** (F5)
- 또는 디버거 연결 해제 후 다시 연결

### 방법 2: 디버거 연결 해제

**터미널에서 로그를 보고 싶다면:**
1. 개발자 메뉴 열기
2. "Stop Debugging" 또는 "Disconnect" 선택
3. 이제 Metro 번들러 터미널에 로그가 표시됩니다

### 방법 3: 두 곳 모두 확인

**가장 확실한 방법:**
- 디버거 연결 상태: Chrome DevTools Console 확인
- 디버거 미연결 상태: Metro 번들러 터미널 확인

---

## 🎯 실전 가이드

### 시나리오 1: 디버거 연결 중

**상황:**
- Chrome DevTools 열림
- Metro 번들러 터미널에 로그 없음

**해결:**
- ✅ Chrome DevTools **Console 탭** 확인
- ✅ 모든 로그가 여기에 표시됩니다

### 시나리오 2: 디버거 미연결

**상황:**
- Chrome DevTools 열리지 않음
- Metro 번들러 터미널에 로그 없음

**해결:**
- ✅ Metro 번들러 터미널 확인
- ✅ 로그가 여기에 표시되어야 합니다
- ❌ 안 보이면 앱 재로드 (개발자 메뉴 → Reload)

### 시나리오 3: Chrome DevTools 흰 화면

**상황:**
- "Debug Remote JS" 선택했는데 흰 화면만 나옴

**해결:**
1. Chrome DevTools **새로고침** (F5)
2. 앱 **재로드** (개발자 메뉴 → Reload)
3. 또는 브라우저에서 직접 접속:
   ```
   http://localhost:8081/debugger-ui
   ```

---

## 📊 로그 확인 위치 요약

| 상황 | 로그 위치 |
|------|----------|
| 디버거 연결됨 | Chrome DevTools Console |
| 디버거 미연결 | Metro 번들러 터미널 |
| Chrome DevTools 흰 화면 | 새로고침 또는 직접 접속 |

---

## 🔧 추가 팁

### 로그 강제 출력 (코드 레벨)

만약 정말로 터미널에 로그를 보고 싶다면:

```typescript
// React Native에서는 process.stdout이 없습니다
// 대신 원본 console.log를 사용하세요
console.log('This will go to Metro terminal (if debugger not connected)');
console.log('Or Chrome DevTools (if debugger connected)');
```

### 디버거 상태 확인

```typescript
// 디버거 연결 여부 확인
if (__DEV__) {
  console.log('Debugger connected:', typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
}
```

---

## 💡 결론

**터미널에 로그가 안 보이는 이유:**
- ✅ 디버거가 연결되어 있어서 Chrome DevTools로만 가는 경우 (정상)
- ✅ Chrome DevTools Console 탭을 확인해야 합니다

**해결:**
- ✅ Chrome DevTools Console 탭 확인
- ✅ 또는 디버거 연결 해제 후 Metro 번들러 터미널 확인

---

**최종 업데이트**: 2025-12-11

