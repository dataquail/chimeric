# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Building
```bash
# Build all packages
pnpm run build:all

# Build only packages (exclude examples)
pnpm run build:packages

# Build specific package
npx nx build @chimeric/core
```

### Testing
```bash
# Run all tests
pnpm run test:all

# Test packages only
pnpm run test:packages

# Test specific package
npx nx test @chimeric/core

# Run tests in watch mode
npx nx test @chimeric/core --watch
```

### Type Checking
```bash
# Type check all packages
pnpm run typecheck:all
```

### Linting
```bash
# Lint all
pnpm run lint:all

# Lint packages only
pnpm run lint:packages

# Auto-fix lint issues
npx nx lint @chimeric/core --fix
```

### Development
```bash
# Watch all packages for changes
pnpm run dev:all

# Watch packages only
pnpm run watch:packages

# Serve todo app example
pnpm run serve:todo-app
```

### Pre-commit Check
```bash
# Run all checks before committing (lint, test, typecheck)
pnpm run precommit
```

### Release
```bash
# Dry run release to see what would happen
npx nx release --dry-run

# Create a new release
npx nx release
```

## Architecture

### Chimeric Pattern
The core architectural pattern provides dual interfaces for every operation:

1. **Idiomatic Interface**: Traditional function calls for complex orchestration
   ```typescript
   const result = await getTodos({ limit: 10 });
   ```

2. **Reactive Interface**: React hooks for simple component usage
   ```typescript
   const { data, loading } = getTodos.use({ limit: 10 });
   ```

3. **Chimeric Interface**: Fusion of both via `fuse` functions
   ```typescript
   const getTodos = fuseQuery(getTodosIdiomatic, getTodosReactive);
   ```

### Package Structure
- **@chimeric/core**: Core types and utilities (ChimericSync, ChimericAsync, ChimericQuery, ChimericMutation)
- **@chimeric/react**: React-specific implementations and hooks
- **@chimeric/react-query**: React Query integration with chimeric patterns
- **@chimeric/testing-***: Test harnesses for each package

### Key Architectural Principles
1. **Dual Interface Design**: Every operation supports both function calls and React hooks
2. **Type Safety**: Strong TypeScript types ensure consistency between interfaces
3. **Library Agnostic**: Can wrap any state management or data fetching library
4. **Testability**: Both execution paths are independently testable

### Implementation Patterns
- All reactive interfaces now use the `.use()` pattern (e.g., `getTodos.use()`)
- Chimeric types are created using fusion functions: `fuseSync`, `fuseAsync`, `fuseEagerAsync`, `fuseQuery`, `fuseMutation`
- Test harnesses are provided for each chimeric type to ensure consistent behavior
- Examples follow Domain-Driven Design with clear separation of domain, application, and infrastructure layers

### Development Workflow
1. Make changes to source files
2. Run `pnpm run dev:all` to watch for changes
3. Run `pnpm run test:all` to ensure tests pass
4. Run `pnpm run typecheck:all` to check types
5. Run `pnpm run lint:all` to check code style
6. Commit with conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)

### Testing Approach
- Unit tests are co-located with source files as `.spec.ts` files
- Use the test harnesses from `@chimeric/testing-*` packages for consistent testing
- Test both idiomatic and reactive interfaces independently
- Mock external dependencies using Vitest's mocking capabilities