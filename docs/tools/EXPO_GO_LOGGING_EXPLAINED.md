# 📱 Expo Go 로깅 시스템 완전 정리

## 🤔 왜 Chrome DevTools가 갑자기 나왔나요?

### 원인: "Debug Remote JS" 선택

개발자 메뉴에서 **"Debug Remote JS"**를 선택하면:
- React Native가 **원격 디버깅 모드**로 전환됩니다
- Chrome DevTools가 자동으로 열립니다
- 이것은 **정상적인 동작**입니다!

---

## 📊 Expo Go 로깅 시스템 구조

### 두 가지 로깅 경로

#### 경로 1: Metro 번들러 터미널 (기본)
**조건:** 디버거 미연결 상태

```
console.log() → Metro 번들러 터미널
```

**확인 방법:**
- 개발 서버 터미널에서 직접 확인
- `npm start` 실행한 터미널 창

**장점:**
- ✅ 별도 설정 불필요
- ✅ 빠른 확인 가능

**단점:**
- ❌ 스택 트레이스가 제한적
- ❌ 브레이크포인트 사용 불가

---

#### 경로 2: Chrome DevTools Console (디버거 연결 시)
**조건:** "Debug Remote JS" 선택

```
console.log() → Chrome DevTools Console
```

**확인 방법:**
- Chrome DevTools → Console 탭
- 브라우저에서 `http://localhost:8081/debugger-ui` 접속

**장점:**
- ✅ 상세한 스택 트레이스
- ✅ 브레이크포인트 사용 가능
- ✅ 네트워크 모니터링
- ✅ React DevTools 사용 가능

**단점:**
- ❌ Metro 번들러 터미널에는 표시 안 됨

---

## 🎯 실전 사용 가이드

### 시나리오 1: 터미널에서 로그 확인하고 싶을 때

**방법:**
1. 개발자 메뉴 열기 (터미널에서 `m` 키)
2. **"Stop Debugging"** 또는 **"Disconnect"** 선택
3. 이제 Metro 번들러 터미널에 로그가 표시됩니다!

**확인 위치:**
- `npm start` 실행한 터미널 창

---

### 시나리오 2: Chrome DevTools에서 상세 디버깅하고 싶을 때

**방법:**
1. 개발자 메뉴 열기
2. **"Debug Remote JS"** 선택
3. Chrome DevTools Console 탭 확인

**확인 위치:**
- Chrome DevTools → Console 탭

---

## 🔄 상태 전환 요약

| 상태 | 로그 위치 | 확인 방법 |
|------|----------|----------|
| 디버거 미연결 | Metro 번들러 터미널 | `npm start` 터미널 창 |
| 디버거 연결됨 | Chrome DevTools Console | Chrome DevTools → Console 탭 |

---

## ❓ 자주 묻는 질문

### Q1: Expo Go로는 안 되나요?

**A:** 아니요! Expo Go로도 됩니다!

- **디버거 미연결:** Metro 번들러 터미널에 로그 표시 ✅
- **디버거 연결:** Chrome DevTools Console에 로그 표시 ✅

둘 다 정상적으로 작동합니다!

---

### Q2: 왜 갑자기 Chrome DevTools가 열렸나요?

**A:** "Debug Remote JS"를 선택했기 때문입니다!

- 개발자 메뉴에서 "Debug Remote JS" 선택
- → React Native가 원격 디버깅 모드로 전환
- → Chrome DevTools 자동 열림
- → 모든 로그가 Chrome DevTools로 리다이렉트

**이것은 정상적인 동작입니다!**

---

### Q3: 터미널에 로그를 다시 보고 싶어요

**A:** 디버거 연결을 해제하세요!

1. 개발자 메뉴 열기
2. "Stop Debugging" 선택
3. 이제 Metro 번들러 터미널에 로그가 표시됩니다

---

### Q4: Chrome DevTools가 흰 화면이에요

**A:** 다음을 시도하세요:

1. **Chrome DevTools 새로고침** (F5)
2. **앱 재로드** (개발자 메뉴 → Reload)
3. **브라우저에서 직접 접속:**
   ```
   http://localhost:8081/debugger-ui
   ```

---

## 💡 권장 사용법

### 빠른 로그 확인
- **디버거 미연결 상태 유지**
- Metro 번들러 터미널에서 확인

### 상세 디버깅 필요 시
- **"Debug Remote JS" 선택**
- Chrome DevTools에서 확인
- 브레이크포인트 사용

---

## 📝 요약

1. **Expo Go는 정상 작동합니다!** ✅
2. **"Debug Remote JS" 선택 시 Chrome DevTools가 열리는 것이 정상입니다** ✅
3. **터미널 로그를 보려면 디버거 연결을 해제하세요** ✅
4. **Chrome DevTools에서 상세 디버깅 가능합니다** ✅

---

**최종 업데이트**: 2025-12-11

