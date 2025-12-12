# 🔧 PowerShell 테마 원래대로 되돌리기

## 📋 문제 상황

PowerShell 확장에서 "Set Color Theme"을 선택해서 터미널이 하얗게 바뀌었습니다.

---

## ✅ 해결 방법

### 방법 1: 명령 팔레트 사용 (가장 간단)

1. **`Ctrl + Shift + P`** (또는 `F1`) 눌러서 명령 팔레트 열기
2. **"PowerShell: Set Color Theme"** 입력
3. 원하는 테마 선택:
   - **"PowerShell ISE"** (기본 파란색)
   - **"Visual Studio Code"** (기본 다크)
   - **"Monokai"** (다크 테마)
   - 또는 다른 원하는 테마

---

### 방법 2: 설정 파일 직접 수정

1. **`Ctrl + Shift + P`** 눌러서 명령 팔레트 열기
2. **"Preferences: Open User Settings (JSON)"** 입력
3. 다음 설정 추가/수정:

```json
{
  "workbench.colorCustomizations": {
    "terminal.background": "#1e1e1e",
    "terminal.foreground": "#cccccc"
  },
  "powershell.integratedConsole.showOnStartup": false
}
```

또는 PowerShell 테마만 리셋:

```json
{
  "powershell.powerShellDefaultVersion": "Windows PowerShell",
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

---

### 방법 3: Cursor IDE 설정에서 변경

1. **`Ctrl + ,`** 눌러서 설정 열기
2. 검색창에 **"powershell color"** 입력
3. **"PowerShell: Color Theme"** 설정 찾기
4. 드롭다운에서 원하는 테마 선택

---

## 🎨 추천 테마

### 기본 테마 (권장)
- **"PowerShell ISE"** - 파란색 배경, 기본 PowerShell 테마
- **"Visual Studio Code"** - 다크 테마, VS Code 기본

### 다크 테마
- **"Monokai"** - 다크 테마
- **"Solarized Dark"** - 다크 테마

### 라이트 테마
- **"Solarized Light"** - 라이트 테마
- **"Git Bash"** - 라이트 테마

---

## 🔄 빠른 리셋

가장 빠른 방법:
1. `Ctrl + Shift + P`
2. "PowerShell: Set Color Theme"
3. "PowerShell ISE" 선택 (기본)

---

## 💡 참고

- 테마 변경은 즉시 적용됩니다
- 터미널을 재시작할 필요 없습니다
- 각 터미널 세션마다 개별적으로 설정할 수 있습니다

