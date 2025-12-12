# 📁 문서 시스템 가이드

## 📋 구조 설명

```
docs/
├── README.md                          # 이 파일 (문서 가이드)
├── INDEX.md                           # 빠른 탐색 인덱스
│
├── getting-started/                   # 🚀 시작 가이드
│   ├── QUICK_START.md                 # 빠른 시작 가이드
│   ├── PROJECT_INITIALIZATION.md      # 프로젝트 초기화
│   └── WIFI_CONNECTION_GUIDE.md       # Wi-Fi 연결 가이드
│
├── debugging/                         # 🐛 디버깅 관련
│   ├── DEBUGGING_GUIDE.md             # 디버깅 가이드
│   ├── TERMINAL_DEBUGGING.md          # 터미널 디버깅
│   ├── CHROME_DEVTOOLS_GUIDE.md       # Chrome DevTools 가이드
│   ├── APP_ERROR_DEBUGGING.md         # 앱 에러 디버깅
│   ├── SPLASH_SCREEN_DEBUG.md         # 스플래시 화면 디버깅
│   ├── CRASH_DEBUG.md                 # 크래시 디버깅
│   └── PROBLEM_SOLVED.md              # 해결된 문제 요약
│
├── troubleshooting/                   # 🔧 문제 해결
│   ├── PLATFORMCONSTANTS_ERROR.md     # PlatformConstants 에러
│   ├── VERSION_FIX.md                 # 버전 호환성 문제
│   ├── FINAL_DEBUG_STEPS.md           # 최종 디버깅 단계
│   ├── LAST_RESORT.md                 # 최후의 수단
│   ├── WHY_NO_LOGS_IN_TERMINAL.md     # 터미널 로그가 안 보이는 이유
│   └── TERMINAL_LOGGING_EXPLAINED.md  # 터미널 로깅 설명
│
├── tools/                             # 🛠️ 도구 사용 가이드
│   ├── EXPO_GO_DEVELOPER_MENU.md      # Expo Go 개발자 메뉴
│   ├── EXPO_GO_LOGGING_EXPLAINED.md   # Expo Go 로깅 설명
│   ├── DEBUGGER_SETUP_STEP_BY_STEP.md # 디버거 설정 단계별 가이드
│   ├── DIRECT_DEBUGGER_ACCESS.md      # 디버거 직접 접근
│   ├── CHECK_LOGS_WITHOUT_DEBUGGER.md # 디버거 없이 로그 확인
│   ├── CURSOR_IDE_DEBUG_CONSOLE.md    # Cursor IDE 디버그 콘솔
│   └── POWERSHELL_THEME_RESET.md      # PowerShell 테마 리셋
│
├── architecture/                      # 🏗️ 아키텍처
│   ├── DESIGN_PATTERNS.md             # 디자인 패턴
│   ├── PROJECT_SETUP_DECISIONS.md     # 프로젝트 설정 결정사항
│   └── STATE_MANAGEMENT.md            # 상태 관리
│
├── react-native/                      # ⚛️ React Native 관련
│   └── (React Native 기술 문서들)
│
└── websocket/                         # 🔌 WebSocket 관련
    └── (WebSocket 통신 문서들)
```

## 📝 문서 작성 가이드

### 각 문서에 포함할 내용

1. **코드 예시**
   - 실제 구현 코드 스니펫
   - 사용 예시

2. **의사결정 기록**
   - 선택한 이유
   - 고려한 대안
   - 최종 결정 근거

3. **트러블슈팅**
   - 발생한 문제
   - 해결 과정
   - 참고 자료

4. **성능 고려사항**
   - 최적화 포인트
   - 주의사항

## 📊 문서 상태 관리

각 문서의 상태는 다음과 같이 표시합니다:

- ✅ **완료**: 문서 작성 완료
- ⏳ **예정**: 작성 예정
- 🚧 **진행 중**: 작성 중

## 📂 카테고리별 문서

### getting-started/
프로젝트 시작을 위한 기본 가이드, 초기 설정, 연결 방법 등

### debugging/
디버깅 방법, 로그 확인, 에러 추적 등

### troubleshooting/
발생한 문제와 해결 방법, 에러 해결 가이드 등

### tools/
개발 도구 사용법, 설정 방법 등

### architecture/
시스템 아키텍처, 전체 설계, 컴포넌트 구조 등

### react-native/
React Native 관련 기술 문서, 컴포넌트 가이드, 네비게이션 등

### websocket/
WebSocket 통신 프로토콜, 메시지 형식, 연결 관리 등

## 🔄 문서 업데이트 원칙

1. 구현과 함께 문서 업데이트
2. 의사결정 시 즉시 기록
3. 문제 해결 시 트러블슈팅 추가
4. 주기적으로 문서 검토 및 갱신

## 🗺️ 빠른 탐색

- [빠른 탐색 인덱스](./INDEX.md) - 모든 문서의 빠른 링크
- [프로젝트 개요](./ledger-weight-front-end_OVERVIEW.md) - 프로젝트 전체 개요
- [개발 계획서](./DEVELOPMENT_PLAN.md) - 개발 일정 및 계획
