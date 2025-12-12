# 🔍 스플래시 화면 멈춤 디버깅 가이드

## 📋 현재 상황

앱이 스플래시 화면에서 멈춰서 진행되지 않습니다.

---

## 🔍 가능한 원인

### 1. JavaScript 번들이 로드되지 않음
- Metro bundler가 번들을 생성하지 못함
- 네트워크 연결 문제
- Expo Go 앱이 번들을 다운로드하지 못함

### 2. JavaScript 실행 전 네이티브 레벨 문제
- Expo SDK 버전 불일치
- 네이티브 모듈 초기화 실패
- `app.json` 설정 문제

### 3. JavaScript 실행 중 에러
- `index.ts` 실행 중 에러
- 컴포넌트 렌더링 중 에러

---

## ✅ 확인 사항

### 1. 터미널 확인

터미널에서 다음을 확인하세요:

```bash
# Metro bundler가 실행 중인지 확인
# 다음 메시지가 보여야 합니다:
# - "Metro waiting on..."
# - "Metro bundler is running..."
```

**중요**: 터미널에 `🚀🚀🚀 Index.ts: FILE LOADED` 메시지가 보이나요?

- ✅ **보임**: JavaScript 번들은 로드되었지만 실행 중 문제 발생
- ❌ **안 보임**: JavaScript 번들이 로드되지 않음

---

### 2. Expo Go 앱 확인

Expo Go 앱에서:

1. **QR 코드 스캔**: 올바른 프로젝트에 연결되었는지 확인
2. **네트워크**: PC와 같은 Wi-Fi에 연결되어 있는지 확인
3. **에러 메시지**: 앱 화면에 빨간색 에러 메시지가 있는지 확인

---

### 3. 브라우저에서 번들 확인

브라우저에서 다음 URL을 열어보세요:

```
http://localhost:8081/index.ts.bundle?platform=ios&dev=true
```

또는:

```
http://127.0.0.1:8081/index.ts.bundle?platform=ios&dev=true
```

**예상 결과**:
- ✅ **JavaScript 코드가 보임**: 번들링 성공
- ❌ **에러 메시지**: 번들링 실패

---

### 4. Metro Bundler 로그 확인

터미널에서 다음을 확인:

1. **번들링 시작 메시지**:
   ```
   Bundling JavaScript...
   ```

2. **번들링 완료 메시지**:
   ```
   Bundle finished...
   ```

3. **에러 메시지**:
   - 빨간색 에러 메시지
   - "Cannot find module" 같은 에러

---

## 🔧 해결 방법

### 방법 1: Metro Bundler 재시작

```bash
# 1. 현재 프로세스 종료 (Ctrl+C)
# 2. 캐시 클리어 후 재시작
npm run start:clear
```

---

### 방법 2: Expo Go 앱 재연결

1. Expo Go 앱 완전 종료
2. 앱 재시작
3. QR 코드 다시 스캔

---

### 방법 3: 네트워크 확인

1. **PC IP 주소 확인**:
   ```powershell
   ipconfig
   ```
   - `IPv4 Address` 확인 (예: `192.168.0.100`)

2. **Expo Go 앱에서 수동 연결**:
   - Expo Go 앱 열기
   - "Enter URL manually" 선택
   - `exp://192.168.0.100:8081` 입력 (본인 IP로 변경)

---

### 방법 4: `app.json` 확인

현재 설정:
- `newArchEnabled: false` ✅ (새 아키텍처 비활성화)
- `splash.image`: `./assets/splash-icon.png` ✅

---

### 방법 5: 최소 앱으로 테스트

현재 `App.ultra-minimal.tsx`를 사용 중입니다:
- 빨간색 배경
- "ULTRA MINIMAL TEST" 텍스트

이것도 안 보이면 네이티브 레벨 문제일 가능성이 높습니다.

---

## 🚨 다음 단계

1. **터미널 확인**: `🚀🚀🚀 Index.ts: FILE LOADED` 메시지가 보이는지 확인
2. **브라우저 확인**: 번들 URL이 정상적으로 로드되는지 확인
3. **결과 공유**: 위 확인 사항의 결과를 알려주세요

---

## 💡 참고

- 스플래시 화면은 Expo가 자동으로 표시합니다
- JavaScript 번들이 로드되면 스플래시가 사라지고 앱이 시작됩니다
- 스플래시에서 멈춘다는 것은 JavaScript 실행이 시작되지 않았다는 의미일 수 있습니다

