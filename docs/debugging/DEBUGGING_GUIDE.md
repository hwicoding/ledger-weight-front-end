# 🔍 정밀 디버깅 가이드

## 📱 기기 연결 (삼성 갤럭시 S22 울트라)

### 방법 1: Wi-Fi 연결 (권장) ⭐

**USB 케이블 없이 바로 연결 가능!**

#### 전제 조건
- ✅ 개발 PC와 휴대폰이 **같은 Wi-Fi 네트워크**에 연결되어 있어야 함
- ✅ 방화벽이 8081 포트를 차단하지 않아야 함

#### 연결 방법
1. **Expo Go 설치**
   - Google Play Store에서 "Expo Go" 검색 후 설치

2. **개발 서버 실행**
   ```bash
   npm start
   ```
   또는
   ```bash
   expo start
   ```

3. **QR 코드 스캔**
   - 터미널에 표시된 QR 코드를 Expo Go 앱으로 스캔
   - 또는 Expo Go 앱에서 "Enter URL manually" 선택 후 터미널에 표시된 URL 입력
   - 예: `exp://192.168.0.100:8081`

4. **연결 확인**
   - 앱이 로드되면 연결 성공!
   - 터미널에서 연결 로그 확인 가능

#### Wi-Fi 연결 장점
- ✅ USB 케이블 불필요
- ✅ 기기 이동 자유로움
- ✅ 여러 기기 동시 연결 가능
- ✅ 빠른 연결 속도

---

### 방법 2: USB 연결 (선택사항)

**ADB 로그 확인이 필요한 경우에만 사용**

#### 1. USB 디버깅 활성화
1. 설정 → 개발자 옵션 → USB 디버깅 활성화
2. USB 연결 시 "이 컴퓨터를 항상 허용" 체크
3. USB로 PC에 연결

#### 2. 기기 연결 확인
```bash
adb devices
```
기기가 표시되면 연결 성공

#### 3. ADB over Wi-Fi (USB 한 번만 연결 후 Wi-Fi로 전환)
```bash
# USB로 연결 후 기기 IP 확인
adb tcpip 5555

# 기기 IP 주소 확인 (설정 → Wi-Fi → 연결된 네트워크 정보)
# 예: 192.168.0.100

# Wi-Fi로 연결
adb connect 192.168.0.100:5555

# 연결 확인
adb devices
```

**참고**: Expo Go는 USB 연결 없이도 Wi-Fi로 충분히 개발 가능합니다!

---

## 🚀 개발 서버 실행

### 기본 실행
```bash
npm start
```

### Android 기기에서 직접 실행 (USB 연결 필요)
```bash
npm run android
```
**참고**: Wi-Fi 연결 시에는 `npm start` 후 QR 코드 스캔이 더 편리합니다.

### 캐시 클리어 후 실행
```bash
expo start --clear
```

---

## 🛠️ 디버깅 도구

### 1. 로거 (Logger)
모든 로그는 `logger` 유틸리티를 통해 기록됩니다.

**사용 예시:**
```typescript
import { logger } from '@/utils';

logger.info('Category', '메시지', { data });
logger.debug('Category', '디버그 메시지', { data });
logger.warn('Category', '경고 메시지', { data });
logger.error('Category', '에러 메시지', error);
```

**전역 접근 (디버깅용):**
```javascript
// React Native Debugger 콘솔에서
global.__LOGGER__.getLogs()           // 모든 로그
global.__LOGGER__.getErrorLogs()      // 에러 로그만
global.__LOGGER__.getLogsByCategory('WebSocket')  // 카테고리별 로그
global.__LOGGER__.exportLogs()        // JSON 형식으로 내보내기
```

### 2. 에러 핸들러 (ErrorHandler)
자동으로 에러를 추적하고 로깅합니다.

**에러 타입:**
- React 컴포넌트 에러
- WebSocket 에러
- Redux 에러
- Promise rejection

### 3. Error Boundary
앱 전체를 감싸서 React 에러를 캐치하고 상세 정보를 표시합니다.

---

## 📊 로깅 카테고리

### WebSocket
- 연결/해제 이벤트
- 메시지 수신/전송
- 에러 발생

### Redux
- 모든 액션 디스패치
- 상태 변경 추적

### App
- 앱 초기화
- 컴포넌트 마운트/언마운트

---

## 🔧 Chrome DevTools 사용

### 1. React Native Debugger 연결
1. Expo Go 앱에서 흔들기 (Shake gesture)
2. "Debug Remote JS" 선택
3. Chrome DevTools 자동 열림

### 2. 네트워크 모니터링
- Chrome DevTools → Network 탭
- WebSocket 연결 확인
- 메시지 전송/수신 모니터링

### 3. Redux DevTools
- React Native Debugger에 내장
- Redux 상태 및 액션 추적

---

## 📝 로그 확인 방법

### 1. Metro 번들러 콘솔
개발 서버 실행 시 터미널에서 실시간 로그 확인

### 2. React Native Debugger
Chrome DevTools에서 `global.__LOGGER__` 사용

### 3. 기기 로그 (Logcat)
```bash
# Android 로그 확인
adb logcat | grep -i "ledger-weight"

# React Native 로그만
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 🐛 문제 해결

### 기기가 연결되지 않을 때 (Wi-Fi)
1. **같은 Wi-Fi 네트워크 확인**
   - PC와 휴대폰이 같은 공유기에 연결되어 있는지 확인
   - PC IP 주소 확인: `ipconfig` (Windows) 또는 `ifconfig` (Mac/Linux)
   - 휴대폰 IP 주소 확인: 설정 → Wi-Fi → 연결된 네트워크 정보

2. **방화벽 설정 확인**
   - Windows 방화벽에서 8081 포트 허용
   - 또는 개발 중에는 방화벽 일시 비활성화

3. **개발 서버 재시작**
   ```bash
   expo start --clear
   ```

4. **수동 URL 입력**
   - Expo Go 앱에서 "Enter URL manually" 선택
   - `exp://[PC의 IP 주소]:8081` 형식으로 입력
   - 예: `exp://192.168.0.100:8081`

### 기기가 연결되지 않을 때 (USB)
1. USB 디버깅 재활성화
2. USB 케이블 교체
3. USB 드라이버 재설치

### 앱이 로드되지 않을 때
1. 캐시 클리어: `expo start --clear`
2. node_modules 재설치: `rm -rf node_modules && npm install`
3. Metro 번들러 재시작

### WebSocket 연결 실패
1. 서버 URL 확인
2. 방화벽 설정 확인
3. 네트워크 연결 확인
4. 로그 확인: `global.__LOGGER__.getLogsByCategory('WebSocket')`

---

## 📌 디버깅 체크리스트

### Wi-Fi 연결 (권장)
- [ ] PC와 휴대폰이 같은 Wi-Fi 네트워크에 연결
- [ ] Expo Go 설치 (Google Play Store)
- [ ] 개발 서버 실행 (`npm start`)
- [ ] Expo Go에서 QR 코드 스캔 또는 URL 수동 입력
- [ ] 앱 로드 확인
- [ ] Chrome DevTools 연결 (앱 흔들기 → Debug Remote JS)
- [ ] 로거 전역 접근 확인 (`global.__LOGGER__`)
- [ ] WebSocket 연결 테스트
- [ ] Redux 상태 확인

### USB 연결 (선택사항)
- [ ] USB 디버깅 활성화
- [ ] USB로 PC에 연결
- [ ] 기기 연결 확인 (`adb devices`)
- [ ] 개발 서버 실행 (`npm start`)
- [ ] Expo Go에서 QR 코드 스캔
- [ ] Chrome DevTools 연결
- [ ] 로거 전역 접근 확인 (`global.__LOGGER__`)
- [ ] WebSocket 연결 테스트
- [ ] Redux 상태 확인

---

**최종 업데이트**: 2025-12-11

