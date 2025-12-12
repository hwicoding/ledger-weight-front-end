# 🔧 Chrome DevTools 디버거 연결 가이드 (단계별)

## 📋 준비 사항

### 필수 조건
- ✅ Metro 번들러 실행 중 (`npm start`)
- ✅ Expo Go 앱 실행 중
- ✅ PC와 기기가 같은 Wi-Fi에 연결
- ✅ Chrome 브라우저 설치됨

---

## 🚀 단계별 연결 방법

### 1단계: 개발자 메뉴 열기

#### 방법 A: 터미널에서 (가장 쉬움) ⭐
1. **Metro 번들러 터미널** 확인 (npm start 실행한 창)
2. 터미널에서 **`m` 키** 누르기
3. 개발자 메뉴가 기기에서 열립니다!

#### 방법 B: 기기에서
1. **기기 흔들기** (Shake gesture)
   - Samsung Galaxy S22 Ultra를 물리적으로 흔들기
2. 또는 **뒤로가기 버튼 3번 빠르게** 누르기
   - 일부 기기에서는 작동하지 않을 수 있음

---

### 2단계: 개발자 메뉴 확인

개발자 메뉴가 열리면 다음이 보여야 합니다:
- ✅ 앱 이름: "ledger-weight"
- ✅ SDK version: 54.0.0
- ✅ Connected to expo-cli
- ✅ IP 주소: 192.168.0.10:8081 (또는 다른 IP)

**메뉴 옵션:**
- Reload
- Go Home
- Show developer action button

---

### 3단계: "Show developer action button" 클릭

1. 개발자 메뉴에서 **"Show developer action button"** 클릭
   - 원 안에 'C' 아이콘이 있는 버튼
2. 더 많은 옵션이 나타납니다:
   - Debug Remote JS
   - Show Element Inspector
   - Show Perf Monitor
   - 등등...

---

### 4단계: "Debug Remote JS" 선택

1. **"Debug Remote JS"** 또는 **"Debug"** 클릭
2. Chrome 브라우저가 자동으로 열립니다
3. `http://localhost:8081/debugger-ui/` 주소로 연결됩니다

---

### 5단계: Chrome DevTools 확인

Chrome DevTools가 열리면:

#### 정상 연결 시:
- ✅ Chrome DevTools 창이 열림
- ✅ 여러 탭이 보임 (Console, Sources, Network 등)
- ✅ Console 탭에 로그가 표시됨

#### 흰 화면인 경우:
1. **Chrome DevTools 새로고침** (F5)
2. 또는 **앱 재로드** (개발자 메뉴 → Reload)
3. 또는 브라우저에서 직접 접속:
   ```
   http://localhost:8081/debugger-ui
   ```

---

### 6단계: Console 탭 확인

1. Chrome DevTools에서 **Console 탭** 클릭
2. 여기에 **모든 로그**가 표시됩니다!
   - `console.log()` 출력
   - `console.error()` 출력
   - 에러 메시지
   - 스택 트레이스

---

## ✅ 연결 확인 방법

### 정상 연결 확인
1. Chrome DevTools Console 탭 열기
2. 앱에서 어떤 액션 수행 (예: 버튼 클릭)
3. Console에 로그가 나타나면 성공! ✅

### 연결 실패 확인
- Chrome DevTools가 열리지 않음
- Console에 아무것도 안 보임
- "Connection failed" 메시지

---

## 🔧 문제 해결

### 문제 1: 개발자 메뉴가 안 열림

**해결:**
- 터미널에서 `m` 키 다시 누르기
- 기기 재시작
- Expo Go 앱 재시작

### 문제 2: "Debug Remote JS" 옵션이 안 보임

**해결:**
- "Show developer action button" 먼저 클릭
- 개발자 메뉴 스크롤해서 찾기

### 문제 3: Chrome DevTools가 흰 화면

**해결:**
1. Chrome DevTools 새로고침 (F5)
2. 앱 재로드 (개발자 메뉴 → Reload)
3. 브라우저에서 직접 접속:
   ```
   http://localhost:8081/debugger-ui
   ```

### 문제 4: Console에 로그가 안 보임

**해결:**
1. Console 탭이 선택되어 있는지 확인
2. 필터가 켜져 있는지 확인 (필터 아이콘 클릭)
3. 앱 재로드 (개발자 메뉴 → Reload)

---

## 📊 디버거 상태 확인

### 디버거 연결됨
- ✅ Chrome DevTools 열림
- ✅ Console에 로그 표시
- ✅ Metro 번들러 터미널에는 로그 없음 (정상)

### 디버거 미연결
- ✅ Metro 번들러 터미널에 로그 표시
- ✅ Chrome DevTools 열리지 않음

---

## 🎯 빠른 참조

### 디버거 연결
1. 터미널에서 `m` 키
2. "Show developer action button" 클릭
3. "Debug Remote JS" 선택
4. Chrome DevTools Console 탭 확인

### 디버거 연결 해제
1. 터미널에서 `m` 키
2. "Stop Debugging" 또는 "Disconnect" 선택
3. 이제 Metro 번들러 터미널에 로그 표시

---

## 💡 팁

### 빠른 로그 확인
- 디버거 미연결: Metro 번들러 터미널 확인

### 상세 디버깅
- 디버거 연결: Chrome DevTools 사용
- 브레이크포인트 설정 가능
- 네트워크 모니터링 가능

---

**최종 업데이트**: 2025-12-11

