# Release Process

This document outlines the process for publishing our packages to npm.

## Prerequisites

1. Ensure you have an npm account and are added as a collaborator to the @chimeric organization.
2. Create an npm access token with publish permissions.
3. Add your npm token as a repository secret in GitHub named `NPM_TOKEN`.

## Publishing Packages

### Using GitHub Actions (Recommended)

1. Go to the "Actions" tab in the GitHub repository.
2. Select the "Publish to npm" workflow from the sidebar.
3. Click the "Run workflow" button.
4. Configure the options:
   - **Version**: Choose the semantic version increment (patch, minor, major) or select "custom" to specify a version.
   - **Custom Version** (if applicable): Enter a specific version number if you selected "custom" (e.g., "1.2.3").
   - **Tag**: Choose an npm tag (default is "latest"). Use "beta" or "alpha" for pre-releases.
5. Click "Run workflow" to start the process.

The workflow will:

- Run linting, tests, and build for all packages
- Bump versions in all package.json files
- Commit and tag the changes
- Publish the packages to npm

### Manual Publishing

If you need to publish packages manually:

1. Ensure all tests pass: `pnpm exec nx run-many --target=test --projects=packages/*`
2. Build all packages: `pnpm exec nx run-many --target=build --projects=packages/*`
3. For each package you want to publish:
   ```bash
   cd packages/[package-name]
   npm version [patch|minor|major]
   npm publish --access public
   ```

## Version Management

We follow semantic versioning:

- **patch**: Bug fixes and minor changes (0.0.x)
- **minor**: New features, backward compatible (0.x.0)
- **major**: Breaking changes (x.0.0)

For pre-releases, use:

- **prepatch/preminor/premajor**: Creates a pre-release version (e.g., 1.0.0-0)
- **prerelease**: Increments the pre-release version (e.g., 1.0.0-1)

## Post-Release

After a successful release:

- Update the changelog with the new version and changes
- Notify the team of the new release
- Update any documentation that references package versions
