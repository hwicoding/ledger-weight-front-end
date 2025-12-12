# 🔄 Metro Bundler 완전 재시작 가이드

## 🚨 현재 문제

- 터미널에 아무 로그도 나타나지 않음
- 앱이 스플래시 화면에서 멈춤
- Metro bundler는 실행 중이지만 응답이 없음

---

## ✅ 해결 방법: 완전 재시작

### 1단계: 모든 Node 프로세스 종료

PowerShell에서 실행:

```powershell
# 포트 8081 사용 중인 프로세스 종료
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess -Unique | 
  ForEach-Object { Stop-Process -Id $_ -Force }

# 모든 Node 프로세스 종료 (더 확실한 방법)
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2단계: 캐시 완전 삭제

```powershell
# Metro bundler 캐시 삭제
Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\haste-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\.expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\node_modules\.cache -ErrorAction SilentlyContinue
```

### 3단계: Expo 캐시 클리어 후 재시작

```powershell
# Expo 캐시 클리어
npx expo start --clear --port 8081
```

또는:

```powershell
npm run start:clear
```

---

## 🔍 추가 진단

### 브라우저에서 번들 확인

브라우저에서 다음 URL을 열어보세요:

```
http://localhost:8081/index.js.bundle?platform=ios&dev=true
```

또는:

```
http://127.0.0.1:8081/index.js.bundle?platform=ios&dev=true
```

**예상 결과**:
- ✅ **JavaScript 코드가 보임**: 번들링 성공
- ❌ **에러 메시지 또는 빈 화면**: 번들링 실패

---

## 📝 현재 설정

- **진입점**: `index.js` (JavaScript 버전으로 변경됨)
- **최소 앱**: 빨간색 배경, "ULTRA MINIMAL JS TEST" 텍스트

---

## 🎯 다음 단계

1. **모든 Node 프로세스 종료** (위 명령 실행)
2. **캐시 삭제** (위 명령 실행)
3. **`npm run start:clear` 실행**
4. **터미널에 로그가 나타나는지 확인**
5. **브라우저에서 번들 URL 접근 테스트**
6. **Expo Go 앱에서 `r` 키 눌러서 재로드**

---

## 💡 참고

- Metro bundler가 제대로 실행되면 터미널에 "Metro waiting on..." 메시지가 나타납니다
- 번들 요청이 들어오면 "Bundling JavaScript..." 메시지가 나타납니다
- 완료되면 "Bundle finished..." 메시지가 나타납니다

