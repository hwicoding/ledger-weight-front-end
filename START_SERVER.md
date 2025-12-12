# 🚀 개발 서버 실행 가이드

## 기본 실행 (포트 8081)

```bash
npm start
```

## 캐시 클리어 후 실행

```bash
npm run start:clear
```

## 다른 포트로 실행 (필요시)

```bash
npx expo start --port 8082
```

## 서버 종료

### Windows PowerShell
```powershell
# 포트 8081 사용 중인 프로세스 종료
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess -Unique | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```

### 모든 Node 프로세스 종료
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 연결 정보

- **로컬 URL**: `http://localhost:8081`
- **네트워크 URL**: `exp://192.168.0.10:8081` (PC IP 주소 확인 필요)

## Expo Go 연결

1. Expo Go 앱 실행
2. QR 코드 스캔 또는
3. "Enter URL manually" 선택 후 `exp://192.168.0.10:8081` 입력

---

**최종 업데이트**: 2025-12-11

