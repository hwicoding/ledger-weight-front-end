# 🖥️ Cursor IDE 디버그 콘솔 가이드

## 📋 개요

Cursor IDE는 VS Code 기반이므로 **디버그 콘솔**이 있습니다.  
하지만 React Native/Expo 앱의 경우 로그가 **자동으로 디버그 콘솔에 표시되지 않을 수 있습니다**.

---

## 🔍 React Native 로그가 표시되는 위치

### 1. Metro 번들러 터미널 (기본)
**조건:** 디버거 미연결 상태

```
console.log() → Metro 번들러 터미널
```

**확인 방법:**
- Cursor IDE의 **터미널 패널** 확인
- `npm start` 실행한 터미널 창

**장점:**
- ✅ 별도 설정 불필요
- ✅ 실시간 로그 확인 가능

---

### 2. Chrome DevTools Console (디버거 연결 시)
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

---

### 3. Cursor IDE 디버그 콘솔
**조건:** 디버그 세션 실행 중

```
console.log() → Cursor IDE Debug Console (제한적)
```

**확인 방법:**
- Cursor IDE → **디버그 콘솔** 패널
- F5로 디버그 세션 시작

**주의:**
- ⚠️ React Native 앱의 경우 **직접적으로 연결되지 않을 수 있습니다**
- ⚠️ Metro 번들러 터미널이나 Chrome DevTools를 사용하는 것이 더 확실합니다

---

## ✅ 권장 방법

### 방법 1: Metro 번들러 터미널 사용 (가장 간단)
1. Cursor IDE의 **터미널 패널** 열기
2. `npm start` 실행
3. 여기에 모든 로그가 표시됩니다!

### 방법 2: Chrome DevTools 사용 (상세 디버깅)
1. 앱에서 개발자 메뉴 열기
2. "Debug Remote JS" 선택
3. Chrome DevTools Console 탭 확인

### 방법 3: Cursor IDE 디버그 콘솔 (제한적)
1. `.vscode/launch.json` 설정 확인
2. F5로 디버그 세션 시작
3. 디버그 콘솔 패널 확인

---

## 🔧 Cursor IDE 디버그 콘솔 설정

### `.vscode/launch.json` 생성

프로젝트 루트에 `.vscode/launch.json` 파일을 생성하면:
- 디버그 세션을 시작할 수 있습니다
- 하지만 React Native 앱의 경우 **제한적**입니다

### 설정 예시

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Expo",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["start"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 💡 결론

**React Native/Expo 앱의 로그는:**
- ✅ **Metro 번들러 터미널**에 표시됩니다 (가장 확실)
- ✅ **Chrome DevTools Console**에 표시됩니다 (디버거 연결 시)
- ⚠️ **Cursor IDE 디버그 콘솔**에는 제한적으로 표시될 수 있습니다

**권장:**
- ✅ **터미널 패널**에서 Metro 번들러 로그 확인
- ✅ 또는 **Chrome DevTools Console** 사용

---

## 📊 로그 확인 위치 요약

| 위치 | 조건 | 확실성 |
|------|------|--------|
| Metro 번들러 터미널 | 디버거 미연결 | ⭐⭐⭐⭐⭐ |
| Chrome DevTools Console | 디버거 연결 | ⭐⭐⭐⭐⭐ |
| Cursor IDE 디버그 콘솔 | 디버그 세션 실행 | ⭐⭐ |

