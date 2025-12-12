# 📶 Wi-Fi 연결 가이드 (USB 케이블 불필요!)

## ✅ 전제 조건

- PC와 휴대폰이 **같은 Wi-Fi 네트워크**에 연결되어 있어야 합니다
- 방화벽이 8081 포트를 차단하지 않아야 합니다

---

## 🚀 빠른 시작 (3단계)

### 1단계: Expo Go 설치
- Google Play Store에서 "Expo Go" 검색 후 설치

### 2단계: 개발 서버 실행
```bash
npm start
```

터미널에 다음과 같은 화면이 표시됩니다:
```
› Metro waiting on exp://192.168.0.10:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
│ i │ open iOS simulator
│ w │ open web

› Press r │ reload app
│ m │ toggle menu
```

### 3단계: Expo Go에서 연결
**방법 A: QR 코드 스캔 (가장 쉬움)**
1. Expo Go 앱 실행
2. "Scan QR code" 선택
3. 터미널에 표시된 QR 코드 스캔
4. 앱 자동 로드!

**방법 B: URL 수동 입력**
1. Expo Go 앱 실행
2. "Enter URL manually" 선택
3. 다음 URL 입력: `exp://192.168.0.10:8081`
   - **참고**: PC IP 주소가 다를 수 있으니 터미널에 표시된 URL을 사용하세요
4. "Connect" 버튼 클릭

---

## 🔍 PC IP 주소 확인 방법

### Windows
```powershell
ipconfig | Select-String -Pattern "IPv4"
```

### Mac/Linux
```bash
ifconfig | grep "inet "
```

터미널에 표시된 URL의 IP 주소를 사용하면 됩니다!

---

## 🐛 문제 해결

### 연결이 안 될 때

#### 1. 같은 Wi-Fi 네트워크 확인
- PC: `ipconfig`로 IP 주소 확인 (예: 192.168.0.10)
- 휴대폰: 설정 → Wi-Fi → 연결된 네트워크 정보
- 두 IP 주소의 앞 3자리가 같아야 함 (예: 192.168.0.x)

#### 2. 방화벽 설정
**Windows 방화벽:**
1. Windows 보안 → 방화벽 및 네트워크 보호
2. 고급 설정
3. 인바운드 규칙 → 새 규칙
4. 포트 선택 → TCP → 특정 로컬 포트: 8081
5. 연결 허용 선택
6. 모든 프로필 적용

**또는 개발 중에는 방화벽 일시 비활성화** (권장하지 않음)

#### 3. 개발 서버 재시작
```bash
# 캐시 클리어 후 재시작
expo start --clear
```

#### 4. 수동 URL 입력
- 터미널에 표시된 정확한 URL 사용
- 형식: `exp://[IP주소]:8081`
- 예: `exp://192.168.0.10:8081`

#### 5. 네트워크 재연결
- PC와 휴대폰 모두 Wi-Fi 재연결
- 공유기 재시작 (필요시)

---

## 💡 Wi-Fi 연결의 장점

- ✅ **USB 케이블 불필요** - 자유롭게 기기 사용 가능
- ✅ **여러 기기 동시 연결** - 여러 휴대폰에서 동시 테스트 가능
- ✅ **빠른 연결 속도** - USB보다 빠를 수 있음
- ✅ **편리함** - 케이블 연결/해제 불필요

---

## 📱 현재 설정 정보

**PC IP 주소**: `192.168.0.10` (로컬 네트워크)

**연결 URL**: `exp://192.168.0.10:8081`

**포트**: `8081` (Expo 기본 포트)

---

## 🔧 고급 설정

### 다른 포트 사용
```bash
expo start --port 8082
```

### LAN 모드로 실행 (더 안정적)
```bash
expo start --lan
```

### Tunnel 모드 (다른 네트워크에서도 연결 가능, 느림)
```bash
expo start --tunnel
```

---

**최종 업데이트**: 2025-12-11

