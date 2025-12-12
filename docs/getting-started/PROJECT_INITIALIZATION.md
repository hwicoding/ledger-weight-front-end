# 🚀 React Native 프로젝트 초기화 가이드

## 📋 결정된 스택

- ✅ **Expo**: 프로젝트 초기화 방식
- ✅ **React Navigation**: 네비게이션 라이브러리
- ✅ **StyleSheet**: 스타일링 방식
- ✅ **React Native Reanimated**: 애니메이션 라이브러리
- ✅ **Redux Toolkit**: 상태 관리
- ✅ **TypeScript**: 타입 안정성

---

## 🛠️ 프로젝트 생성 방법

### 방법 1: Expo CLI 사용 (권장)

```bash
# Expo CLI 전역 설치 (없는 경우)
npm install -g expo-cli

# 또는 npx 사용 (권장 - 최신 버전 사용)
npx create-expo-app ledger-weight-front-end --template

# TypeScript 템플릿 사용
npx create-expo-app ledger-weight-front-end --template blank-typescript
```

### 방법 2: Expo CLI 없이 직접 생성

```bash
# npx로 직접 실행 (최신 Expo 사용)
npx create-expo-app@latest ledger-weight-front-end --template blank-typescript
```

### 프로젝트 생성 옵션

```bash
# 빈 템플릿 (TypeScript)
npx create-expo-app@latest ledger-weight-front-end --template blank-typescript

# Navigation 템플릿 (필요 시)
npx create-expo-app@latest ledger-weight-front-end --template tabs-typescript
```

**권장**: `blank-typescript` 템플릿 사용 (우리가 직접 구조를 만들 예정이므로)

---

## 📦 필수 패키지 설치

### 1. 네비게이션

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

### 2. 상태 관리 (Redux Toolkit)

```bash
npm install @reduxjs/toolkit react-redux
npm install --save-dev @types/react-redux
```

### 3. 애니메이션

```bash
npm install react-native-reanimated
```

### 4. 개발 도구

```bash
# TypeScript (이미 포함되어 있을 수 있음)
npm install --save-dev typescript @types/react @types/react-native

# ESLint & Prettier
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

---

## 📁 프로젝트 구조 생성

### 클린 아키텍처 + MVVM 구조

```
ledger-weight-front-end/
├── src/
│   ├── domain/                    # Domain Layer
│   │   ├── entities/
│   │   ├── usecases/
│   │   └── repositories/
│   ├── application/                # Application Layer
│   │   ├── services/
│   │   └── mappers/
│   ├── infrastructure/             # Infrastructure Layer
│   │   ├── websocket/
│   │   └── storage/
│   ├── presentation/               # Presentation Layer (MVVM)
│   │   ├── features/
│   │   │   ├── lobby/
│   │   │   │   ├── view/
│   │   │   │   ├── viewmodel/
│   │   │   │   └── components/
│   │   │   └── game/
│   │   │       ├── view/
│   │   │       ├── viewmodel/
│   │   │       └── components/
│   │   └── shared/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── utils/
│   └── store/                      # Redux Store
│       ├── slices/
│       └── store.ts
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

---

## ⚙️ 초기 설정 파일

### 1. tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/domain/*": ["src/domain/*"],
      "@/application/*": ["src/application/*"],
      "@/infrastructure/*": ["src/infrastructure/*"],
      "@/presentation/*": ["src/presentation/*"],
      "@/store/*": ["src/store/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### 2. .eslintrc.js

```javascript
module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

### 3. .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 4. babel.config.js (Expo 기본 + 경로 별칭)

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/domain': './src/domain',
            '@/application': './src/application',
            '@/infrastructure': './src/infrastructure',
            '@/presentation': './src/presentation',
            '@/store': './src/store',
          },
        },
      ],
      'react-native-reanimated/plugin', // Reanimated는 마지막에
    ],
  };
};
```

**필수**: `babel-plugin-module-resolver` 설치 필요
```bash
npm install --save-dev babel-plugin-module-resolver
```

---

## 🎯 초기화 순서

### Step 1: 프로젝트 생성

```bash
npx create-expo-app@latest ledger-weight-front-end --template blank-typescript
cd ledger-weight-front-end
```

### Step 2: 필수 패키지 설치

```bash
# 네비게이션
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# 상태 관리
npm install @reduxjs/toolkit react-redux

# 애니메이션
npm install react-native-reanimated

# 개발 도구
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev babel-plugin-module-resolver
```

### Step 3: 폴더 구조 생성

```bash
# PowerShell (Windows)
mkdir -p src/domain/entities,src/domain/usecases,src/domain/repositories
mkdir -p src/application/services,src/application/mappers
mkdir -p src/infrastructure/websocket,src/infrastructure/storage
mkdir -p src/presentation/features/lobby/view,src/presentation/features/lobby/viewmodel,src/presentation/features/lobby/components
mkdir -p src/presentation/features/game/view,src/presentation/features/game/viewmodel,src/presentation/features/game/components
mkdir -p src/presentation/shared/components,src/presentation/shared/hooks,src/presentation/shared/utils
mkdir -p src/store/slices
```

### Step 4: 설정 파일 생성

- `tsconfig.json` 수정 (경로 별칭 추가)
- `.eslintrc.js` 생성
- `.prettierrc` 생성
- `babel.config.js` 수정 (경로 별칭 + Reanimated 플러그인)

### Step 5: 기본 파일 생성

- `src/store/store.ts` - Redux Store 설정
- `App.tsx` - 네비게이션 설정
- 기본 컴포넌트 구조

---

## 📝 의사결정 기록

### 선택한 스택
- **Expo**: 빠른 개발 시작, OTA 업데이트
- **React Navigation**: 표준 네비게이션 라이브러리
- **StyleSheet**: 기본 스타일링 (성능 우수)
- **React Native Reanimated**: 고성능 애니메이션
- **Redux Toolkit**: 상태 관리
- **TypeScript**: 타입 안정성

### 프로젝트 생성 방식
- **방법**: `npx create-expo-app@latest --template blank-typescript`
- **이유**: 빈 템플릿으로 시작하여 우리가 직접 구조를 만들기 위함

---

## 🚀 다음 단계

1. 프로젝트 생성 실행
2. 필수 패키지 설치
3. 폴더 구조 생성
4. 설정 파일 구성
5. 기본 Store 및 네비게이션 설정

---

**문서 상태**: ✅ 완료  
**최종 업데이트**: 2025-12-11

