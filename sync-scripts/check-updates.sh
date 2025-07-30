#!/bin/bash
# Check for updates in the template repository

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Checking for template updates..."

# Check if template-core exists
if [ ! -d "template-core" ]; then
    echo -e "${YELLOW}Warning: template-core submodule not found.${NC}"
    echo "Run: git submodule add https://github.com/vibespec/vibespec-template.git template-core"
    exit 1
fi

# Navigate to template-core
cd template-core

# Fetch latest changes
echo "Fetching latest changes from template repository..."
git fetch origin --tags

# Get current version
CURRENT_VERSION=$(git describe --tags --always)
echo -e "Current version: ${GREEN}${CURRENT_VERSION}${NC}"

# Get latest version
LATEST_VERSION=$(git describe --tags origin/main --always)
echo -e "Latest version: ${GREEN}${LATEST_VERSION}${NC}"

# Compare versions
if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
    echo -e "${GREEN}✅ Template is up to date!${NC}"
    exit 0
else
    echo -e "${YELLOW}📦 Update available!${NC}"
    echo ""
    echo "Changes between versions:"
    echo "------------------------"
    git log --oneline ${CURRENT_VERSION}..origin/main
    echo ""
    echo "To view detailed changes, run:"
    echo "  cd template-core && git diff ${CURRENT_VERSION}..origin/main"
    echo ""
    echo "To update, run:"
    echo "  cd template-core && git pull origin main"
    echo "Or use the sync agent:"
    echo "  claude-code --command '/sync:analyze ${LATEST_VERSION}'"
    exit 0
fi