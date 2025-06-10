#!/bin/bash

# Script to handle the complete publishing process
# 1. Configures git for GitHub Actions
# 2. Modifies nx.json for publishing (sets preserveLocalDependencyProtocols to false)
# 3. Runs nx release version
# 4. Builds packages
# 5. Publishes packages

set -e

echo "Starting publish process..."

# Configure git for GitHub Actions
echo "Configuring git..."
git config user.name github-actions
git config user.email github-actions@github.com

echo "Modifying nx.json for publishing..."

# Check if nx.json exists
if [ ! -f "nx.json" ]; then
    echo "Error: nx.json not found in current directory"
    exit 1
fi

# Create a backup of nx.json
cp nx.json nx.json.backup

# Use sed to replace preserveLocalDependencyProtocols: true with false
# This uses a more specific pattern to ensure we only replace the correct line
sed -i.tmp 's/"preserveLocalDependencyProtocols": true,/"preserveLocalDependencyProtocols": false,/g' nx.json

# Remove the temporary file created by sed
rm -f nx.json.tmp

echo "Successfully modified nx.json - preserveLocalDependencyProtocols set to false"
echo "Backup saved as nx.json.backup"

# Run nx release version
echo "Running nx release version..."
npx nx release version --verbose

# Build packages
echo "Building packages..."
pnpm build:packages

# Publish packages
echo "Publishing packages..."
npx nx release publish --verbose

echo "Publish process completed successfully!" 