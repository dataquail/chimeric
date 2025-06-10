#!/bin/bash

# Script to replace workspace:* dependencies with actual version numbers
# in all package.json files under packages/*/dist/

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Fixing workspace dependencies in dist package.json files...${NC}"

# Get the workspace root directory
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGES_DIR="$WORKSPACE_ROOT/packages"

# Check if packages directory exists
if [ ! -d "$PACKAGES_DIR" ]; then
    echo -e "${RED}❌ Error: packages directory not found at $PACKAGES_DIR${NC}"
    exit 1
fi

# Create a temporary file to store package name to version mappings
TEMP_MAPPING=$(mktemp)
trap "rm -f $TEMP_MAPPING" EXIT

echo -e "${YELLOW}📋 Building package version mapping...${NC}"

# Build mapping of package names to versions from source package.json files
for pkg_dir in "$PACKAGES_DIR"/*; do
    if [ -d "$pkg_dir" ] && [ -f "$pkg_dir/package.json" ]; then
        # Extract package name and version using node
        node -e "
            const pkg = require('$pkg_dir/package.json');
            if (pkg.name && pkg.version) {
                console.log(pkg.name + '=' + pkg.version);
            }
        " >> "$TEMP_MAPPING" 2>/dev/null || true
    fi
done

if [ ! -s "$TEMP_MAPPING" ]; then
    echo -e "${RED}❌ Error: No package mappings found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found $(wc -l < "$TEMP_MAPPING") packages${NC}"

# Process each dist/package.json file
processed_count=0
for dist_pkg_json in "$PACKAGES_DIR"/*/dist/package.json; do
    if [ -f "$dist_pkg_json" ]; then
        echo -e "${YELLOW}🔄 Processing: $dist_pkg_json${NC}"
        
        # Create a backup
        cp "$dist_pkg_json" "$dist_pkg_json.bak"
        
        # Read the current package.json
        temp_file=$(mktemp)
        cp "$dist_pkg_json" "$temp_file"
        
        # Replace workspace:* dependencies with actual versions
        while IFS='=' read -r pkg_name pkg_version; do
            # Skip empty lines
            [ -z "$pkg_name" ] && continue
            
            # Use node to safely update the JSON
            node -e "
                const fs = require('fs');
                const path = '$temp_file';
                try {
                    const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
                    let modified = false;
                    
                    // Update dependencies
                    if (pkg.dependencies && pkg.dependencies['$pkg_name'] === 'workspace:*') {
                        pkg.dependencies['$pkg_name'] = '$pkg_version';
                        modified = true;
                        console.log('  ✓ Updated dependencies[\"$pkg_name\"] to $pkg_version');
                    }
                    
                    // Update devDependencies
                    if (pkg.devDependencies && pkg.devDependencies['$pkg_name'] === 'workspace:*') {
                        pkg.devDependencies['$pkg_name'] = '$pkg_version';
                        modified = true;
                        console.log('  ✓ Updated devDependencies[\"$pkg_name\"] to $pkg_version');
                    }
                    
                    // Update peerDependencies
                    if (pkg.peerDependencies && pkg.peerDependencies['$pkg_name'] === 'workspace:*') {
                        pkg.peerDependencies['$pkg_name'] = '$pkg_version';
                        modified = true;
                        console.log('  ✓ Updated peerDependencies[\"$pkg_name\"] to $pkg_version');
                    }
                    
                    // Update optionalDependencies
                    if (pkg.optionalDependencies && pkg.optionalDependencies['$pkg_name'] === 'workspace:*') {
                        pkg.optionalDependencies['$pkg_name'] = '$pkg_version';
                        modified = true;
                        console.log('  ✓ Updated optionalDependencies[\"$pkg_name\"] to $pkg_version');
                    }
                    
                    if (modified) {
                        fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
                    }
                } catch (error) {
                    console.error('Error processing $pkg_name:', error.message);
                    process.exit(1);
                }
            " || {
                echo -e "${RED}❌ Error processing $pkg_name in $dist_pkg_json${NC}"
                # Restore backup on error
                mv "$dist_pkg_json.bak" "$dist_pkg_json"
                rm -f "$temp_file"
                exit 1
            }
        done < "$TEMP_MAPPING"
        
        # Replace the original file with the updated one
        mv "$temp_file" "$dist_pkg_json"
        
        # Remove backup
        rm -f "$dist_pkg_json.bak"
        
        processed_count=$((processed_count + 1))
        echo -e "${GREEN}✅ Completed: $dist_pkg_json${NC}"
    fi
done

if [ $processed_count -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No dist/package.json files found to process${NC}"
else
    echo -e "${GREEN}🎉 Successfully processed $processed_count package.json files${NC}"
fi

echo -e "${GREEN}✨ Workspace dependency fixing complete!${NC}" 