# 📱 Expo Go 개발자 메뉴 열기 가이드

## ⚠️ 중요: 뒤로가기 버튼이 작동하지 않을 때

뒤로가기 버튼 3번 누르기가 작동하지 않으면 다음 방법을 시도하세요:

### 방법 1: 기기 흔들기 (가장 확실!)
- **Samsung Galaxy S22 Ultra를 물리적으로 흔들기**
- 개발자 메뉴가 즉시 나타납니다

### 방법 2: 터미널에서 'm' 키 누르기
- Metro 번들러 터미널에서 **`m` 키** 누르기
- 개발자 메뉴가 기기에서 열립니다

### 방법 3: ADB 명령어 사용
```bash
adb shell input keyevent 82
```
- USB 연결 필요 (또는 Wi-Fi ADB 설정)

### 방법 4: Expo Go 앱 재시작
- Expo Go 앱 완전히 종료
- 다시 시작
- QR 코드 다시 스캔

---

## 📋 기본 방법

## Android 기기 (삼성 갤럭시 S22 울트라)

### 방법 1: 뒤로가기 버튼 3번 빠르게 누르기 (가장 확실함)
1. 앱이 실행 중인 상태에서
2. **뒤로가기 버튼을 3번 빠르게 연속으로 누르기**
3. 개발자 메뉴가 나타남

### 방법 2: 기기 흔들기
1. 앱이 실행 중인 상태에서
2. **기기를 흔들기** (Shake gesture)
3. 일부 기기에서는 작동하지 않을 수 있음

### 방법 3: 앱 설정에서 활성화
1. Expo Go 앱 설정 확인
2. 개발자 옵션이 활성화되어 있는지 확인

---

## 개발자 메뉴 옵션

개발자 메뉴가 나타나면:
- **"Debug Remote JS"** - Chrome DevTools 연결
- **"Show Element Inspector"** - UI 요소 검사
- **"Reload"** - 앱 재로드
- **"Show Perf Monitor"** - 성능 모니터

---

## 개발자 메뉴가 나타나지 않을 때

### 1. Expo Go 버전 확인
- 최신 버전인지 확인
- Google Play Store에서 업데이트

### 2. 앱 재시작
- Expo Go 앱 완전 종료
- 다시 실행

### 3. 개발 서버 재연결
- 개발 서버 재시작
- Expo Go에서 다시 연결

### 4. 대안: 직접 Chrome DevTools 연결
개발 서버가 실행 중이면:
- 브라우저에서 `http://localhost:8081/debugger-ui` 접속
- 또는 `chrome://inspect` 접속

---

## 빠른 디버깅 (개발자 메뉴 없이)

### Chrome DevTools 직접 접속
1. 개발 서버 실행 중 (`npm start`)
2. 브라우저에서 다음 URL 접속:
   ```
   http://localhost:8081/debugger-ui
   ```
3. 또는 Chrome에서:
   ```
   chrome://inspect
   ```
4. "inspect" 클릭

### 로거 확인 (앱 내에서)
앱 코드에서 직접 로거 확인:
- ErrorBoundary 화면에서 디버그 정보 확인
- 또는 코드에 `console.log` 추가

---

**최종 업데이트**: 2025-12-11

