# 🚨 앱 비정상 종료 디버깅 가이드

## 📋 현재 문제

- 앱이 스플래시 화면에서 멈춤
- 앱이 비정상적으로 종료됨
- 터미널에 로그가 나타나지 않음

---

## 🔍 가능한 원인

### 1. React 버전 호환성 문제 ⚠️

현재 `package.json`:
- `react`: `19.1.0` (매우 최신 버전)
- `react-native`: `0.81.5`
- `expo`: `~54.0.28`

**문제**: React 19는 아직 안정화되지 않았고, Expo SDK 54는 React 18.x를 사용합니다.

### 2. JavaScript 번들 실행 실패

- 번들링은 성공했지만 실행 중 에러 발생
- 네이티브 모듈 초기화 실패

### 3. 네이티브 레벨 크래시

- Expo Go 앱과 JavaScript 번들 간 통신 실패
- 네이티브 브릿지 초기화 실패

---

## ✅ 해결 방법

### 방법 1: React 버전 다운그레이드 (권장)

Expo SDK 54는 React 18.x를 사용합니다:

```json
{
  "react": "18.2.0",
  "react-native": "0.76.5"
}
```

**주의**: React Native 버전도 함께 조정해야 합니다.

### 방법 2: 브라우저에서 번들 확인

브라우저에서 다음 URL을 열어보세요:

```
http://localhost:8081/index.js.bundle?platform=ios&dev=true
```

**확인 사항**:
- ✅ JavaScript 코드가 보임: 번들링 성공
- ❌ 에러 메시지: 번들링 실패
- ❌ 빈 화면: 번들 요청 실패

### 방법 3: 터미널 로그 확인

앱을 로드한 후 터미널에 다음이 나타나야 합니다:

```
🚀🚀🚀 Index.js: FILE LOADED
✅ Index.js: All imports loaded
🚀🚀🚀 App component rendering
```

**안 보이면**: JavaScript 번들이 실행되지 않음

---

## 🔧 현재 변경 사항

1. ✅ `index.js`를 ES6 import로 변경
2. ✅ JSX 문법 사용 (React.createElement 대신)
3. ✅ 최소한의 앱 컴포넌트

---

## 📝 다음 단계

1. **터미널에서 `r` 키 눌러서 앱 재로드**
2. **브라우저에서 번들 URL 확인**
3. **터미널에 로그가 나타나는지 확인**

---

## 🚨 React 버전 문제 해결

만약 여전히 문제가 발생하면:

1. `package.json`에서 React 버전 확인
2. Expo SDK 54 호환 버전으로 다운그레이드
3. `npm install` 실행
4. `npm run start:clear` 실행

---

## 💡 참고

- React 19는 아직 실험적 버전입니다
- Expo SDK 54는 React 18.x를 권장합니다
- 버전 불일치가 앱 크래시의 주요 원인일 수 있습니다

