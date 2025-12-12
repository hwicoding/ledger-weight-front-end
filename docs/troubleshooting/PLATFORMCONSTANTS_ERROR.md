# 🚨 PlatformConstants 에러 해결 가이드

## 📋 에러 내용

```
Invariant Violation: TurboModuleRegistry.getEnforcing(...): 
'PlatformConstants' could not be found.
```

---

## 🔍 원인

이 에러는 보통 다음 경우에 발생합니다:

1. **Expo Go 앱 버전 불일치**
   - Expo Go 앱이 프로젝트의 Expo SDK 버전과 맞지 않음
   - Expo Go 앱이 오래된 버전일 수 있음

2. **버전 불일치**
   - `package.json`의 React/React Native 버전이 Expo SDK와 맞지 않음
   - 현재: Expo SDK 54는 React 19.1.0, React Native 0.81.5를 요구

3. **네이티브 모듈 로드 실패**
   - TurboModuleRegistry가 네이티브 모듈을 찾지 못함
   - Expo Go 앱과 JavaScript 번들 간 통신 문제

---

## ✅ 해결 방법

### 방법 1: Expo Go 앱 업데이트 (가장 중요)

1. **앱 스토어에서 Expo Go 업데이트**
   - Google Play Store (Android)
   - App Store (iOS)
   - 최신 버전으로 업데이트

2. **Expo Go 앱 완전 종료 후 재시작**
   - 백그라운드에서도 완전히 종료
   - 앱 재시작

### 방법 2: 버전 확인 및 수정

Expo SDK 54는 다음 버전을 요구합니다:

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@types/react": "~19.1.0"
}
```

**현재 `package.json`이 올바른 버전인지 확인하세요.**

### 방법 3: 캐시 클리어 및 재시작

```powershell
# 1. Metro bundler 종료 (Ctrl+C)

# 2. 캐시 클리어 후 재시작
npm run start:clear

# 3. Expo Go 앱에서 앱 재로드 (r 키)
```

### 방법 4: Expo Go 앱 재연결

1. **Expo Go 앱 완전 종료**
2. **앱 재시작**
3. **QR 코드 다시 스캔** 또는 **URL 수동 입력**

---

## 🔍 확인 사항

### 1. Expo Go 앱 버전 확인

Expo Go 앱에서:
- 설정 → 앱 정보 → 버전 확인
- 최신 버전인지 확인

### 2. 터미널 경고 확인

터미널에 다음 경고가 나타나면 버전이 맞지 않습니다:

```
The following packages should be updated for best compatibility:
  react@18.2.0 - expected version: 19.1.0
  react-native@0.76.5 - expected version: 0.81.5
```

**해결**: `package.json`을 올바른 버전으로 수정 후 `npm install`

### 3. 브라우저에서 번들 확인

```
http://localhost:8081/index.js.bundle?platform=android&dev=true
```

- JavaScript 코드가 보이면: 번들링 성공
- 에러가 보이면: 번들링 실패

---

## 💡 참고

- **PlatformConstants**는 Expo의 네이티브 모듈입니다
- 이 모듈은 Expo Go 앱에 내장되어 있어야 합니다
- 버전 불일치가 주요 원인입니다

---

## 🎯 다음 단계

1. **Expo Go 앱 업데이트** (가장 중요)
2. **버전 확인**: `package.json`이 올바른 버전인지 확인
3. **의존성 재설치**: `npm install`
4. **Metro bundler 재시작**: `npm run start:clear`
5. **앱 재로드**: Expo Go 앱에서 `r` 키

