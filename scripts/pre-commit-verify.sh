#!/bin/bash
# 커밋 전 커밋 메시지 확인 스크립트
# Git Bash에서 실행

COMMIT_MSG_FILE="commit_msg.txt"

if [ ! -f "$COMMIT_MSG_FILE" ]; then
    echo "❌ 오류: commit_msg.txt 파일이 없습니다."
    exit 1
fi

echo "📋 커밋 메시지 확인 중..."
echo ""

# 커밋 메시지 내용 확인
echo "=== 커밋 메시지 내용 ==="
cat "$COMMIT_MSG_FILE"
echo ""
echo ""

# 한글 깨짐 확인
if grep -q "?곌껐\|?닿껐\|?섍꼍\|?깅뒫\|?몃뜳" "$COMMIT_MSG_FILE"; then
    echo "❌ 경고: 커밋 메시지에 깨진 한글이 감지되었습니다!"
    echo "   Git Bash에서 UTF-8로 다시 작성해주세요."
    exit 1
fi

# 형식 확인 (YYMMDD > front-end > react-native > ...)
if ! grep -q "^[0-9]\{6\} > front-end > react-native >" "$COMMIT_MSG_FILE"; then
    echo "⚠️  경고: 커밋 메시지 형식이 올바르지 않을 수 있습니다."
    echo "   형식: YYMMDD > front-end > react-native > [변경 내용]"
    read -p "계속하시겠습니까? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ 커밋 메시지 확인 완료"
echo ""

# dry-run 실행
echo "🔍 커밋 미리보기 (dry-run)..."
git commit -F "$COMMIT_MSG_FILE" --dry-run

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 커밋 준비 완료"
    echo "   다음 명령으로 커밋하세요:"
    echo "   git commit -F commit_msg.txt"
else
    echo ""
    echo "❌ 커밋 미리보기 실패"
    exit 1
fi

