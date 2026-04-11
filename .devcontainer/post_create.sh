#!/bin/bash
set -e

# Skip Claude Code onboarding when using CLAUDE_CODE_OAUTH_TOKEN
echo '{"hasCompletedOnboarding":true,"installMethod":"native"}' > /home/node/.claude/.claude.json

# Clone the chimeric repo
git clone https://${GITHUB_TOKEN}@github.com/dataquail/chimeric.git /workspace/chimeric

# Install dependencies
cd /workspace/chimeric
pnpm install

# Build all packages so everything is ready
pnpm run build:all
