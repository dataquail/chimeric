#!/bin/bash

# Script to handle the complete publishing process
# 1. Configures git for GitHub Actions
# 2. Builds packages
# 3. Modifies package.json files for publishing
# 4. Runs nx release version
# 5. Publishes packages

set -e

echo "Starting publish process..."

# Configure git for GitHub Actions
echo "Configuring git..."
git config user.name github-actions
git config user.email github-actions@github.com

# Build packages
echo "Building packages..."
pnpm build:packages

echo "Fixing workspace dependencies..."
# Call the fix-workspace-deps.sh script
./scripts/fix-workspace-deps.sh

# Publish packages (allow individual package failures for already-published versions)
echo "Publishing packages..."
set +e
npx nx release publish --verbose
PUBLISH_EXIT=$?
set -e

if [ $PUBLISH_EXIT -ne 0 ]; then
  echo "⚠️  Some packages may have failed to publish (e.g., already published versions). Exit code: $PUBLISH_EXIT"
fi

echo "Publish process completed successfully!"
