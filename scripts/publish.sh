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

# Run nx release version
echo "Running nx release version..."
npx nx release --skip-publish --verbose

# Publish packages
echo "Publishing packages..."
npx nx release publish --verbose

echo "Publish process completed successfully!" 