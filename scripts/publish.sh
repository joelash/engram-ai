#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐘 memable publish script${NC}"
echo ""

# Get version from pyproject.toml
PY_VERSION=$(grep '^version = ' pyproject.toml | cut -d'"' -f2)
# Get version from package.json
NPM_VERSION=$(grep '"version"' packages/memable/package.json | head -1 | cut -d'"' -f4)

echo "Python version: $PY_VERSION"
echo "npm version:    $NPM_VERSION"

if [ "$PY_VERSION" != "$NPM_VERSION" ]; then
    echo "⚠️  Version mismatch! Sync versions first."
    exit 1
fi

echo ""
echo -e "${GREEN}Building Python package...${NC}"
rm -rf dist/
pyproject-build

echo ""
echo -e "${GREEN}Publishing to PyPI...${NC}"
twine upload dist/*

echo ""
echo -e "${GREEN}Building npm package...${NC}"
cd packages/memable
pnpm build

echo ""
echo -e "${GREEN}Publishing to npm...${NC}"
npm publish --access public

echo ""
echo -e "${GREEN}✅ Published memable v$PY_VERSION to PyPI and npm!${NC}"
