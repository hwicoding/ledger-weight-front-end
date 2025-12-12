#!/bin/bash
# 커밋 전 자동 검증 스크립트
# Git hook으로 사용하거나 수동으로 실행

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 커밋 전 검증 시작...${NC}"
echo ""

# 1. 커밋 메시지 확인
if [ -f ".git/COMMIT_EDITMSG" ]; then
    echo -e "${BLUE}1. 커밋 메시지 검증${NC}"
    bash scripts/commit-msg-validator.sh .git/COMMIT_EDITMSG
    echo ""
fi

# 2. 스테이징된 파일 확인
echo -e "${BLUE}2. 스테이징된 파일 확인${NC}"
STAGED_FILES=$(git diff --cached --name-only)
if [ -z "$STAGED_FILES" ]; then
    echo -e "${YELLOW}⚠️  스테이징된 파일이 없습니다${NC}"
else
    echo -e "${GREEN}✅ 스테이징된 파일:${NC}"
    echo "$STAGED_FILES" | while read -r file; do
        echo "  - $file"
    done
fi
echo ""

# 3. 최종 확인
echo -e "${BLUE}3. 최종 확인${NC}"
echo -e "${YELLOW}⚠️  커밋하기 전에 다음을 확인하세요:${NC}"
echo "  - [ ] 커밋 메시지가 올바른 형식인가?"
echo "  - [ ] 한글이 정상적으로 표시되는가?"
echo "  - [ ] 스테이징된 파일이 올바른가?"
echo ""

read -p "커밋을 진행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}커밋이 취소되었습니다${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 커밋 진행...${NC}"

