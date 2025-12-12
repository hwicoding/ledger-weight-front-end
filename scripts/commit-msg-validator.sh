#!/bin/bash
# 커밋 메시지 한글 깨짐 검증 스크립트
# 사용법: bash scripts/commit-msg-validator.sh [커밋 메시지 파일 경로]

set -e

COMMIT_MSG_FILE="${1:-.git/COMMIT_EDITMSG}"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 커밋 메시지 검증 중..."

# 커밋 메시지 파일이 존재하는지 확인
if [ ! -f "$COMMIT_MSG_FILE" ]; then
    echo -e "${YELLOW}⚠️  커밋 메시지 파일을 찾을 수 없습니다: $COMMIT_MSG_FILE${NC}"
    echo "💡 커밋 메시지를 파일로 작성하고 -F 옵션을 사용하세요."
    exit 1
fi

# 커밋 메시지 읽기
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# 빈 메시지 확인
if [ -z "$COMMIT_MSG" ]; then
    echo -e "${RED}❌ 커밋 메시지가 비어있습니다!${NC}"
    exit 1
fi

# 한글 깨짐 패턴 확인 (일반적인 깨진 문자 패턴)
if echo "$COMMIT_MSG" | grep -qE '[?][가-힣]|[諛깆뿏]|[낅뜲댄듃]'; then
    echo -e "${RED}❌ 한글이 깨진 것으로 보입니다!${NC}"
    echo ""
    echo "현재 메시지:"
    echo "$COMMIT_MSG"
    echo ""
    echo -e "${YELLOW}💡 해결 방법:${NC}"
    echo "1. Git Bash에서 커밋 메시지를 다시 작성하세요"
    echo "2. UTF-8 인코딩으로 파일을 저장하세요"
    echo "3. git commit -F commit_msg.txt 형식으로 커밋하세요"
    exit 1
fi

# 커밋 메시지 형식 확인 (선택사항)
if ! echo "$COMMIT_MSG" | grep -qE '^[0-9]{6} > front-end > react-native >'; then
    echo -e "${YELLOW}⚠️  커밋 메시지 형식이 약속한 형식과 다릅니다${NC}"
    echo "예상 형식: YYMMDD > front-end > react-native > [변경 내용]"
    echo ""
    echo "현재 메시지:"
    echo "$COMMIT_MSG"
    echo ""
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 한글이 포함되어 있는지 확인
if echo "$COMMIT_MSG" | grep -qE '[가-힣]'; then
    echo -e "${GREEN}✅ 한글이 포함되어 있으며 정상적으로 표시됩니다${NC}"
else
    echo -e "${YELLOW}ℹ️  한글이 포함되어 있지 않습니다${NC}"
fi

echo -e "${GREEN}✅ 커밋 메시지 검증 완료!${NC}"
echo ""
echo "커밋 메시지 미리보기:"
echo "─────────────────────────────────────"
echo "$COMMIT_MSG"
echo "─────────────────────────────────────"

