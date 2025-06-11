# @chimeric/testing-react

Testing utilities for chimeric interfaces from `@chimeric/react` - providing specialized test harnesses for React-specific chimeric operations with built-in React Testing Library integration and factory function testing support.

## Installation

This package should be installed as a development dependency:

```bash
# Using npm
npm install --save-dev @chimeric/testing-react

# Using yarn
yarn add --dev @chimeric/testing-react

# Using pnpm
pnpm add -D @chimeric/testing-react
```

**Note**: This package depends on `@chimeric/testing-core`, which requires React 18 or 19 and `@testing-library/react` v14.3.1 or higher as peer dependencies.

## Overview

`@chimeric/testing-react` extends `@chimeric/testing-core` with React-specific testing capabilities for operations created with `@chimeric/react` factory functions. It provides:

- ✅ **React Factory Testing**: Test harnesses for `@chimeric/react` factory functions
- ✅ **Built-in State Management**: Test React hooks with automatic state tracking
- ✅ **Retry Logic Testing**: Validate retry behavior and exponential backoff
- ✅ **Error Handling**: Test error states and recovery mechanisms
- ✅ **All Core Features**: Full access to `@chimeric/testing-core` functionality
- ✅ **TypeScript Support**: Complete type safety for React testing scenarios

## Core Exports

This package re-exports all utilities from `@chimeric/testing-core` plus provides React-specific enhancements:

```typescript
import {
  // Re-exported from @chimeric/testing-core
  ReactiveAsyncTestHarness,
  IdiomaticAsyncTestHarness,
  ChimericAsyncTestHarness,
  ReactiveEagerAsyncTestHarness,
  IdiomaticEagerAsyncTestHarness,
  ChimericEagerAsyncTestHarness,
  ReactiveSyncTestHarness,
  IdiomaticSyncTestHarness,
  ChimericSyncTestHarness,

  // Types
  type AsyncTestHarnessReturnType,
  type EagerAsyncTestHarnessReturnType,
  type SyncTestHarnessReturnType,

  // Testing method constants
  chimericMethods,
  idiomaticMethods,
  reactiveMethods,
} from '@chimeric/testing-react';
```

## Testing React Factory Functions

### Testing ReactiveAsyncFactory

Test reactive async operations created with `ReactiveAsyncFactory` from `@chimeric/react`.

```typescript
import { ReactiveAsyncTestHarness } from '@chimeric/testing-react';
import { ReactiveAsyncFactory } from '@chimeric/react';

describe('ReactiveAsyncFactory Operations', () => {
  it('should test user fetching with retry logic', async () => {
    // Create operation using React factory
    const fetchUser = ReactiveAsyncFactory(async (params: { id: string }) => {
      const response = await fetch(`/api/users/${params.id}`);
      if (!response.ok) throw new Error('User not found');
      return response.json();
    });

    // Create test harness
    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: fetchUser,
      reactiveOptions: { retry: 3 }, // Test retry behavior
    });

    // Initial state validation
    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.data).toBeUndefined();
    expect(harness.result.current.error).toBeNull();

    // Trigger operation
    const promise = harness.result.current.call({ id: 'user-123' });

    // Test pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isIdle).toBe(false);
    });

    // Wait for completion and validate success state
    const result = await promise;

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.isPending).toBe(false);
      expect(harness.result.current.data).toEqual(result);
      expect(harness.result.current.error).toBeNull();
    });
  });

  it('should test error handling and retry behavior', async () => {
    let attemptCount = 0;

    const failingOperation = ReactiveAsyncFactory(async () => {
      attemptCount++;
      if (attemptCount <= 2) {
        throw new Error(`Attempt ${attemptCount} failed`);
      }
      return 'Success after retries';
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: failingOperation,
      reactiveOptions: { retry: 3 },
    });

    // Should succeed after retries
    const result = await harness.result.current.call();
    expect(result).toBe('Success after retries');
    expect(attemptCount).toBe(3);

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toBe('Success after retries');
    });
  });
});
```

### Testing IdiomaticAsyncFactory

Test idiomatic async operations with built-in retry logic.

```typescript
import { IdiomaticAsyncTestHarness } from '@chimeric/testing-react';
import { IdiomaticAsyncFactory } from '@chimeric/react';

describe('IdiomaticAsyncFactory Operations', () => {
  it('should test data processing', async () => {
    const processData = IdiomaticAsyncFactory(
      async (data: { items: string[]; delay?: number }) => {
        // Simulate processing time
        if (data.delay) {
          await new Promise((resolve) => setTimeout(resolve, data.delay));
        }

        return data.items.map((item) => ({
          original: item,
          processed: item.toUpperCase(),
        }));
      },
    );

    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync: processData,
      idiomaticOptions: { retry: 2 },
    });

    // Test initial state
    expect(harness.result.current.isIdle).toBe(true);

    // Start operation
    const promise = harness.result.current.call({
      items: ['hello', 'world'],
      delay: 50,
    });

    // Verify pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isIdle).toBe(false);
    });

    // Wait for completion
    const result = await promise;

    expect(result).toHaveLength(2);
    expect(result[0].original).toBe('hello');
    expect(result[0].processed).toBe('HELLO');
    expect(result[1].original).toBe('world');
    expect(result[1].processed).toBe('WORLD');

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toEqual(result);
    });
  });
});
```

### Parameterized Testing

Use the exported method constants for comprehensive testing:

```typescript
import {
  ChimericAsyncTestHarness,
  chimericMethods,
  idiomaticMethods,
  reactiveMethods,
} from '@chimeric/testing-react';

describe.each(chimericMethods)('Chimeric Operation - %s method', (method) => {
  it(`should handle ${method} pattern correctly`, async () => {
    const operation = ChimericAsyncFactory(async (data: { value: number }) => {
      return data.value * 2;
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: operation,
    });

    act(() => {
      harness.result.current.call({ value: 5 });
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isPending).toBe(false),
    );

    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isSuccess).toBe(true);
      expect(harness.result.current.reactive.data).toBe(10);
    });
  });
});

describe.each(idiomaticMethods)('Idiomatic Operations', (method) => {
  it(`should test ${method} operations`, async () => {
    // Test idiomatic-specific functionality
  });
});

describe.each(reactiveMethods)('Reactive Operations', (method) => {
  it(`should test ${method} operations`, async () => {
    // Test reactive-specific functionality
  });
});
```

## Development

### Building

```bash
nx build testing-react
```

### Running Tests

```bash
nx test testing-react
```

This package provides a complete testing solution for React-specific chimeric operations, ensuring your `@chimeric/react` implementations work correctly in all scenarios.
