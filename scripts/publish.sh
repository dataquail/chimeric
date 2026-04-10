#!/bin/bash

# Script to handle the complete publishing process
# 1. Builds packages (all, or a specific package when PROJECT_NAME is set)
# 2. Modifies package.json files for publishing
# 3. Publishes packages via nx release publish
#
# When PROJECT_NAME is set (e.g. @chimeric/core), only that package is built
# and published. This is used by the per-package GitHub Release workflow so
# each release triggers exactly one npm publish rather than republishing every
# package on every release.

set -e

echo "Starting publish process..."

# Accept an optional project filter via env var (set by publish.yml from the release tag)
PROJECT_NAME="${PROJECT_NAME:-}"

if [ -n "$PROJECT_NAME" ]; then
  echo "Building $PROJECT_NAME..."
  # Build only the target project; nx respects ^build so dependencies build first
  npx nx build "$PROJECT_NAME"
else
  echo "Building all packages..."
  pnpm build:packages
fi

echo "Fixing workspace dependencies..."
./scripts/fix-workspace-deps.sh

# Publish packages (allow individual package failures for already-published versions)
echo "Publishing packages..."
set +e
if [ -n "$PROJECT_NAME" ]; then
  echo "Publishing $PROJECT_NAME only..."
  npx nx release publish --projects="$PROJECT_NAME" --verbose
else
  echo "Publishing all packages..."
  npx nx release publish --verbose
fi
PUBLISH_EXIT=$?
set -e

if [ $PUBLISH_EXIT -ne 0 ]; then
  echo "⚠️  Some packages may have failed to publish (e.g., already published versions). Exit code: $PUBLISH_EXIT"
fi

echo "Publish process completed successfully!"
