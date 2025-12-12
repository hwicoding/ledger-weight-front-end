# 🔒 Git 커밋 메시지 한글 깨짐 방지 규칙

## ⚠️ 중요: 한글 깨짐 방지

Git 커밋 메시지에 한글을 사용할 때 PowerShell의 인코딩 문제로 인해 깨질 수 있습니다.

---

## 📋 커밋 메시지 작성 규칙

### 1. 커밋 메시지 파일 사용 (권장)

**PowerShell에서 한글 커밋 메시지를 사용할 때:**

```bash
# ❌ 잘못된 방법 (한글 깨짐 발생 가능)
git commit -m "한글 메시지"

# ✅ 올바른 방법 (파일 사용)
# 1. 커밋 메시지를 파일로 작성
echo "251212 > front-end > react-native > 한글 메시지" > commit_msg.txt

# 2. 파일을 사용하여 커밋
git commit -F commit_msg.txt

# 3. 임시 파일 삭제
rm commit_msg.txt
```

### 2. Git Bash 사용 (권장)

**Git Bash에서는 한글이 정상적으로 처리됩니다:**

```bash
# Git Bash에서 직접 실행
git commit -m "251212 > front-end > react-native > 한글 메시지"
```

### 3. UTF-8 인코딩 확인

**커밋 메시지 파일은 반드시 UTF-8 인코딩으로 저장:**

```bash
# PowerShell에서 UTF-8로 파일 생성
[System.IO.File]::WriteAllText('commit_msg.txt', '한글 메시지', [System.Text.Encoding]::UTF8)
```

---

## 🔍 커밋 전 검증 방법

### 자동 검증 스크립트

커밋 전에 다음 스크립트를 실행하여 메시지가 올바른지 확인:

```bash
# commit-msg-validator.sh 실행
bash scripts/commit-msg-validator.sh
```

### 수동 확인 방법

1. **커밋 메시지 미리보기:**
   ```bash
   git log --oneline -1
   ```

2. **한글 깨짐 확인:**
   - `?낅뜲?댄듃` 같은 깨진 문자가 보이면 안 됨
   - 한글이 정상적으로 표시되어야 함

3. **커밋 전 최종 확인:**
   ```bash
   git status
   git diff --staged
   git log --oneline -1  # 마지막 커밋 메시지 확인
   ```

---

## 🛠️ 문제 발생 시 해결 방법

### 한글이 깨진 커밋이 이미 생성된 경우

1. **커밋 메시지 수정 (아직 푸시하지 않은 경우):**
   ```bash
   git commit --amend -F commit_msg.txt
   ```

2. **이미 푸시한 경우:**
   ```bash
   # Git Bash에서 실행
   bash scripts/fix_commit_messages.sh
   git push --force-with-lease
   ```

---

## 📝 커밋 메시지 형식

**약속한 형식:**
```
YYMMDD > front-end > react-native > [변경 내용 설명]
```

**예시:**
```
251212 > front-end > react-native > 방 생성 UI 및 AI 플레이어 표시 기능 구현: 방 생성 모달 추가 (방 이름, 최소/최대 플레이어 수, AI 플레이어 수, AI 난이도 설정), Player 타입에 isBot 필드 추가, PlayerCard에 AI 플레이어 배지 표시, LobbyScreen 및 GameScreen에 AI 플레이어 표시 연동, 백엔드 공조 문서 작성 (WebSocket 프로토콜 정의, 협의 사항 정리)
```

---

## ✅ 체크리스트

커밋하기 전에 다음을 확인하세요:

- [ ] 커밋 메시지가 올바른 형식인가?
- [ ] 한글이 포함된 경우 파일을 사용했는가?
- [ ] Git Bash에서 실행했는가? (PowerShell 사용 시)
- [ ] **커밋 전에 반드시 `git commit --dry-run` 또는 `git log --oneline -1`로 메시지 확인했는가?**
- [ ] **한글 깨짐이 없는가? (깨진 문자가 보이면 커밋하지 않음)**
- [ ] **커밋 실행 전에 최종 확인을 거쳤는가?**

## 🚨 중요: 커밋 전 필수 확인 절차

**커밋 실행 전 반드시 다음 단계를 거쳐야 합니다:**

1. **커밋 메시지 파일 생성 (UTF-8)**
   ```powershell
   [System.IO.File]::WriteAllText('commit_msg.txt', '한글 메시지', [System.Text.Encoding]::UTF8)
   ```

2. **커밋 메시지 미리보기 (dry-run)**
   ```bash
   git commit -F commit_msg.txt --dry-run
   ```

3. **커밋 메시지 내용 확인**
   ```bash
   cat commit_msg.txt
   # 또는 PowerShell에서
   Get-Content commit_msg.txt -Encoding UTF8
   ```

4. **한글 깨짐 확인**
   - `?곌껐`, `?닿껐` 같은 깨진 문자가 보이면 **절대 커밋하지 않음**
   - 한글이 정상적으로 표시되어야 함

5. **최종 확인 후 커밋**
   - 모든 확인이 완료된 후에만 `git commit -F commit_msg.txt` 실행
   - 커밋 후 즉시 `git log --oneline -1`로 확인
   - 한글이 깨져 있으면 `git commit --amend`로 수정

---

## 🚨 주의사항

1. **PowerShell에서 직접 `-m` 옵션 사용 금지**
   - 한글 깨짐 발생 가능성 높음
   - 반드시 파일(`-F`) 사용 또는 Git Bash 사용

2. **Force Push 주의**
   - 이미 푸시한 커밋을 수정할 때만 사용
   - 다른 사람과 협업 중이면 반드시 확인 후 진행

3. **커밋 전 검증 습관화**
   - 커밋 후 바로 `git log --oneline -1`로 확인
   - 깨진 문자가 보이면 즉시 수정

---

**마지막 업데이트**: 2025-12-12

