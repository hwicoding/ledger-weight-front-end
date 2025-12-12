# 🚀 빠른 시작 가이드

## QR 코드 보기

### 터미널에서 직접 실행
```bash
npm start
```
또는
```bash
npx expo start
```

터미널에 QR 코드와 URL이 표시됩니다!

---

## QR 코드가 안 보일 때

### 방법 1: URL 수동 입력 (가장 빠름!)

1. **Expo Go 앱 실행**
2. **"Enter URL manually" 선택**
3. **다음 URL 입력:**
   ```
   exp://192.168.0.10:8081
   ```
   ⚠️ **주의**: PC IP 주소가 다를 수 있으니 아래 방법으로 확인하세요!

4. **PC IP 주소 확인 방법:**
   ```powershell
   ipconfig | Select-String -Pattern "IPv4"
   ```
   또는
   ```powershell
   ipconfig
   ```
   "IPv4 주소" 항목에서 `192.168.x.x` 형식의 주소를 찾으세요.

5. **URL 형식:**
   ```
   exp://[PC의 IP 주소]:8081
   ```
   예: `exp://192.168.0.10:8081`

---

### 방법 2: 개발 서버 재시작

1. **기존 프로세스 종료** (Ctrl+C)
2. **캐시 클리어 후 재시작:**
   ```bash
   npx expo start --clear
   ```

---

### 방법 3: 다른 포트 사용

```bash
npx expo start --port 8082
```
그러면 URL은 `exp://192.168.0.10:8082`가 됩니다.

---

## 현재 PC IP 주소

**로컬 네트워크 IP**: `192.168.0.10`

**연결 URL**: `exp://192.168.0.10:8081`

---

## 문제 해결

### 연결이 안 될 때
1. PC와 휴대폰이 같은 Wi-Fi에 연결되어 있는지 확인
2. 방화벽이 8081 포트를 차단하지 않는지 확인
3. 개발 서버가 실행 중인지 확인 (터미널 확인)

### 여전히 안 될 때
```bash
# Tunnel 모드로 실행 (느리지만 안정적)
npx expo start --tunnel
```

