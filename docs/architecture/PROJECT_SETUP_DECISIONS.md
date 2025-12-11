# 🔧 프로젝트 설정 결정 사항

## 📋 결정 필요 사항 체크리스트

### ✅ 이미 결정된 사항
- [x] 프레임워크: React Native (TypeScript)
- [x] 아키텍처: 클린 아키텍처 + MVVM
- [x] 상태 관리: Redux Toolkit
- [x] 통신 방식: WebSocket

### ⏳ 결정 필요 사항

---

## 1️⃣ React Native 초기화 방식

### 옵션 A: Expo (권장) ⭐⭐⭐⭐⭐

**장점**:
- ✅ 빠른 개발 시작
- ✅ OTA 업데이트 지원
- ✅ 크로스 플랫폼 빌드 (EAS Build)
- ✅ 많은 내장 API
- ✅ 개발 도구 우수

**단점**:
- ❌ 네이티브 모듈 추가 시 제한적 (하지만 config plugin으로 해결 가능)
- ❌ 번들 크기 약간 큼

**추천 이유**: 게임 앱이므로 특별한 네이티브 모듈이 필요 없을 가능성이 높음

### 옵션 B: React Native CLI

**장점**:
- ✅ 완전한 네이티브 코드 접근
- ✅ 더 작은 번들 크기
- ✅ 커스터마이징 자유도 높음

**단점**:
- ❌ 초기 설정 복잡
- ❌ 빌드 환경 설정 필요
- ❌ 개발 시작 시간 오래 걸림

**결정**: ⏳ **Expo 추천** (특별한 네이티브 모듈 필요 없을 경우)

---

## 2️⃣ 네비게이션 라이브러리

### 옵션 A: React Navigation ⭐⭐⭐⭐⭐ (권장)

**장점**:
- ✅ React Native 공식 추천
- ✅ TypeScript 지원 우수
- ✅ 다양한 네비게이션 타입 (Stack, Tab, Drawer)
- ✅ 성숙한 생태계
- ✅ 커뮤니티 활발

**단점**:
- ❌ 러닝 커브 존재

**추천 이유**: 가장 표준적이고 안정적

### 옵션 B: React Native Navigation (Wix)

**장점**:
- ✅ 네이티브 네비게이션
- ✅ 성능 우수

**단점**:
- ❌ 설정 복잡
- ❌ TypeScript 지원 제한적
- ❌ 커뮤니티 상대적으로 작음

**결정**: ⏳ **React Navigation 추천**

---

## 3️⃣ 스타일링 방식

### 옵션 A: StyleSheet (기본) ⭐⭐⭐⭐

**장점**:
- ✅ React Native 기본 제공
- ✅ 성능 우수
- ✅ 추가 의존성 없음
- ✅ TypeScript 지원

**단점**:
- ❌ 동적 스타일링 제한적
- ❌ 테마 관리 어려움

### 옵션 B: styled-components ⭐⭐⭐

**장점**:
- ✅ CSS-in-JS
- ✅ 동적 스타일링 용이
- ✅ 테마 관리 편리

**단점**:
- ❌ 추가 의존성
- ✅ 성능 오버헤드 (미미)

### 옵션 C: NativeWind (Tailwind CSS) ⭐⭐⭐⭐

**장점**:
- ✅ 유틸리티 퍼스트
- ✅ 빠른 개발
- ✅ 일관된 디자인

**단점**:
- ❌ 추가 설정 필요
- ❌ 러닝 커브 (Tailwind CSS 학습)

**결정**: ⏳ **StyleSheet (기본) 추천** (게임 UI는 커스텀 디자인이 많을 것으로 예상)

---

## 4️⃣ 폼 관리 (필요시)

### 옵션 A: React Hook Form ⭐⭐⭐⭐⭐

**장점**:
- ✅ 성능 우수
- ✅ TypeScript 지원
- ✅ 작은 번들 크기

### 옵션 B: Formik

**장점**:
- ✅ 성숙한 라이브러리

**단점**:
- ❌ 성능 이슈 (리렌더링 많음)

**결정**: ⏳ **React Hook Form** (로비에서 닉네임 입력 등 필요 시)

---

## 5️⃣ 날짜/시간 처리

### 옵션 A: date-fns ⭐⭐⭐⭐⭐

**장점**:
- ✅ 트리 쉐이킹 지원
- ✅ 작은 번들 크기
- ✅ 함수형 프로그래밍 스타일

### 옵션 B: moment.js

**단점**:
- ❌ 번들 크기 큼 (사용하지 않음)

**결정**: ⏳ **date-fns** (턴 타이머 등 필요 시)

---

## 6️⃣ 유틸리티 라이브러리

### 옵션 A: lodash-es ⭐⭐⭐⭐

**장점**:
- ✅ 많은 유틸리티 함수
- ✅ 트리 쉐이킹 지원

**단점**:
- ❌ 번들 크기 (선택적 import로 해결)

### 옵션 B: 직접 구현

**장점**:
- ✅ 번들 크기 작음
- ✅ 필요한 것만 구현

**결정**: ⏳ **lodash-es** (필요한 함수만 import)

---

## 7️⃣ 테스트 프레임워크

### 옵션 A: Jest + React Native Testing Library ⭐⭐⭐⭐⭐

**장점**:
- ✅ React Native 기본 제공
- ✅ 컴포넌트 테스트 용이
- ✅ 커뮤니티 활발

**결정**: ⏳ **Jest + React Native Testing Library** (기본 설정)

---

## 8️⃣ 린팅 & 포매팅

### ESLint
- ✅ React Native 기본 제공
- ✅ TypeScript 규칙 추가

### Prettier
- ✅ 코드 포매팅
- ✅ ESLint와 통합

**결정**: ⏳ **ESLint + Prettier** (기본 설정)

---

## 9️⃣ 환경 변수 관리

### 옵션 A: react-native-config ⭐⭐⭐⭐

**장점**:
- ✅ .env 파일 지원
- ✅ 간단한 사용법

### 옵션 B: Expo Constants

**장점**:
- ✅ Expo 기본 제공
- ✅ 추가 설정 불필요

**결정**: ⏳ **Expo 사용 시 Constants**, **RN CLI 사용 시 react-native-config**

---

## 🔟 에러 핸들링 & 로깅

### 옵션 A: Sentry ⭐⭐⭐⭐⭐

**장점**:
- ✅ 프로덕션 에러 추적
- ✅ React Native 지원 우수
- ✅ 무료 플랜 제공

### 옵션 B: React Native Error Boundary

**장점**:
- ✅ 추가 의존성 없음

**단점**:
- ❌ 프로덕션 추적 제한적

**결정**: ⏳ **Sentry** (프로덕션 배포 시)

---

## 1️⃣1️⃣ 애니메이션

### 옵션 A: React Native Reanimated ⭐⭐⭐⭐⭐

**장점**:
- ✅ 성능 우수 (UI 스레드에서 실행)
- ✅ 복잡한 애니메이션 지원
- ✅ Gesture Handler와 통합

### 옵션 B: Animated API (기본)

**장점**:
- ✅ React Native 기본 제공

**단점**:
- ❌ 성능 제한적

**결정**: ⏳ **React Native Reanimated** (카드 드래그, 게임 보드 애니메이션 등)

---

## 1️⃣2️⃣ 아이콘

### 옵션 A: react-native-vector-icons ⭐⭐⭐⭐

**장점**:
- ✅ 많은 아이콘 세트 (FontAwesome, Material 등)
- ✅ 성숙한 라이브러리

### 옵션 B: Expo Icons

**장점**:
- ✅ Expo 기본 제공
- ✅ 추가 설정 불필요

**결정**: ⏳ **Expo 사용 시 Expo Icons**, **RN CLI 사용 시 react-native-vector-icons**

---

## 📊 최종 추천 스택

| 카테고리 | 선택 | 이유 |
|---------|------|------|
| **초기화** | Expo | 빠른 개발 시작, OTA 업데이트 |
| **네비게이션** | React Navigation | 표준적이고 안정적 |
| **스타일링** | StyleSheet | 성능, 커스텀 디자인 |
| **상태 관리** | Redux Toolkit | ✅ 이미 결정 |
| **폼 관리** | React Hook Form | 필요 시 사용 |
| **날짜/시간** | date-fns | 필요 시 사용 |
| **유틸리티** | lodash-es | 필요 시 선택적 import |
| **테스트** | Jest + RTL | 기본 제공 |
| **린팅** | ESLint + Prettier | 기본 설정 |
| **에러 추적** | Sentry | 프로덕션 배포 시 |
| **애니메이션** | Reanimated | 카드 드래그 등 |
| **아이콘** | Expo Icons | Expo 사용 시 |

---

## 📝 의사결정 기록

### 결정 필요 사항
1. ⏳ **Expo vs React Native CLI** - Expo 추천
2. ⏳ **네비게이션** - React Navigation 추천
3. ⏳ **스타일링** - StyleSheet 추천
4. ⏳ **애니메이션** - Reanimated 추천

### 즉시 결정 가능한 사항
- 테스트: Jest + React Native Testing Library
- 린팅: ESLint + Prettier
- 폼: React Hook Form (필요 시)
- 날짜: date-fns (필요 시)

### 나중에 결정 가능한 사항
- 에러 추적: Sentry (프로덕션 배포 시)
- 유틸리티: lodash-es (필요 시)

---

## 🚀 다음 단계

1. **Expo vs React Native CLI 최종 결정**
2. **프로젝트 초기화**
3. **필수 라이브러리 설치**
4. **폴더 구조 생성** (클린 아키텍처 + MVVM)
5. **기본 설정** (ESLint, Prettier, TypeScript)

---

**문서 상태**: ✅ 완료  
**최종 업데이트**: 2025-12-11

