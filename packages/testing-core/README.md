# @chimeric/testing-core

Core testing utilities for chimeric interfaces using React Testing Library - providing test harnesses and utilities to test all chimeric operation patterns with consistent APIs and comprehensive state validation.

## Installation

This package should be installed as a development dependency:

```bash
# Using npm
npm install --save-dev @chimeric/testing-core

# Using yarn
yarn add --dev @chimeric/testing-core

# Using pnpm
pnpm add -D @chimeric/testing-core
```

**Note**: This package requires React 18 or 19 and `@testing-library/react` v14.3.1 or higher as peer dependencies.

## Overview

`@chimeric/testing-core` provides test harnesses for all chimeric operation types, enabling you to:

- ✅ **Test All Patterns**: Idiomatic, Reactive, and Chimeric operations
- ✅ **Consistent API**: Unified testing interface across all operation types
- ✅ **State Validation**: Test loading states, error handling, and data flow
- ✅ **Async Testing**: Built-in utilities for testing async operations
- ✅ **React Integration**: Seamless integration with React Testing Library
- ✅ **TypeScript Support**: Full type safety for test scenarios

## Core Exports

```typescript
import {
  // Async Test Harnesses
  ReactiveAsyncTestHarness,
  IdiomaticAsyncTestHarness,
  ChimericAsyncTestHarness,

  // EagerAsync Test Harnesses
  ReactiveEagerAsyncTestHarness,
  IdiomaticEagerAsyncTestHarness,
  ChimericEagerAsyncTestHarness,

  // Sync Test Harnesses
  ReactiveSyncTestHarness,
  IdiomaticSyncTestHarness,
  ChimericSyncTestHarness,

  // Query Test Harnesses
  ReactiveQueryTestHarness,
  IdiomaticQueryTestHarness,
  ChimericQueryTestHarness,

  // Mutation Test Harnesses
  ReactiveMutationTestHarness,
  IdiomaticMutationTestHarness,
  ChimericMutationTestHarness,

  // Types
  type AsyncTestHarnessReturnType,
  type EagerAsyncTestHarnessReturnType,
  type SyncTestHarnessReturnType,
  type QueryTestHarnessReturnType,
  type MutationTestHarnessReturnType,

  // Testing Methods
  chimericMethods,
  idiomaticMethods,
  reactiveMethods,
} from '@chimeric/testing-core';
```

## Test Harness Patterns

All test harnesses follow a consistent pattern, providing:

- **`result.current`**: Access to the current state and methods
- **`waitFor`**: Utility to wait for state changes
- **Type Safety**: Full TypeScript support for parameters and return types

## Async Operation Testing

### ReactiveAsyncTestHarness

Test reactive async operations with React hooks.

```typescript
import { ReactiveAsyncTestHarness } from '@chimeric/testing-core';
import { createReactiveAsync } from '@chimeric/core';

describe('User API', () => {
  it('should fetch user data successfully', async () => {
    // Create a reactive async operation
    const fetchUser = createReactiveAsync(async (params: { id: string }) => {
      const response = await fetch(`/api/users/${params.id}`);
      return response.json();
    });

    // Create test harness
    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: fetchUser,
      reactiveOptions: { retry: 3 },
    });

    // Initial state
    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.data).toBeUndefined();

    // Trigger the async operation
    const promise = harness.result.current.call({ id: 'user-123' });

    // Wait for pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isIdle).toBe(false);
    });

    // Wait for completion
    const result = await promise;

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.isPending).toBe(false);
      expect(harness.result.current.data).toEqual(result);
    });
  });

  it('should handle errors correctly', async () => {
    const failingFetch = createReactiveAsync(async () => {
      throw new Error('Network error');
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: failingFetch,
    });

    // Trigger operation and expect it to throw
    await expect(harness.result.current.call()).rejects.toThrow(
      'Network error',
    );

    // Verify error state
    await harness.waitFor(() => {
      expect(harness.result.current.isError).toBe(true);
      expect(harness.result.current.error?.message).toBe('Network error');
      expect(harness.result.current.isPending).toBe(false);
    });
  });
});
```

### IdiomaticAsyncTestHarness

Test idiomatic async operations (promise-based).

```typescript
import { IdiomaticAsyncTestHarness } from '@chimeric/testing-core';
import { createIdiomaticAsync } from '@chimeric/core';

describe('Data Service', () => {
  it('should process data idiomatically', async () => {
    const processData = createIdiomaticAsync(
      async (data: { items: string[] }) => {
        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 100));
        return data.items.map((item) => item.toUpperCase());
      },
    );

    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync: processData,
      idiomaticOptions: { retry: 2 },
    });

    // Initial state
    expect(harness.result.current.isIdle).toBe(true);

    // Start operation
    const promise = harness.result.current.call({
      items: ['hello', 'world'],
    });

    // Check pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
    });

    // Wait for completion
    const result = await promise;

    expect(result).toEqual(['HELLO', 'WORLD']);

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toEqual(['HELLO', 'WORLD']);
    });
  });
});
```

### ChimericAsyncTestHarness

Test chimeric operations that support both idiomatic and reactive patterns.

```typescript
import { ChimericAsyncTestHarness } from '@chimeric/testing-core';
import { fuseChimericAsync } from '@chimeric/core';

describe('Chimeric Operations', () => {
  it('should test both idiomatic and reactive methods', async () => {
    const chimericOperation = fuseChimericAsync({
      idiomatic: createIdiomaticAsync(
        async (data: { value: number }) => data.value * 2,
      ),
      reactive: createReactiveAsync(
        async (data: { value: number }) => data.value * 2,
      ),
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: chimericOperation,
    });

    // Test idiomatic method
    const idiomaticResult = await harness.result.current.idiomatic({
      value: 5,
    });
    expect(idiomaticResult).toBe(10);

    // Test reactive method
    const reactivePromise = harness.result.current.reactive.call({ value: 7 });

    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isPending).toBe(true);
    });

    const reactiveResult = await reactivePromise;
    expect(reactiveResult).toBe(14);

    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isSuccess).toBe(true);
      expect(harness.result.current.reactive.data).toBe(14);
    });
  });
});
```

## Sync Operation Testing

### ReactiveSyncTestHarness

Test synchronous reactive operations.

```typescript
import { ReactiveSyncTestHarness } from '@chimeric/testing-core';
import { createReactiveSync } from '@chimeric/core';

describe('Sync Operations', () => {
  it('should test reactive sync operations', () => {
    const getFormattedDate = createReactiveSync(() => {
      return new Date().toISOString().split('T')[0];
    });

    const harness = ReactiveSyncTestHarness({
      reactiveSync: getFormattedDate,
    });

    const result = harness.result.current.useSync();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should test sync operations with parameters', () => {
    const formatName = createReactiveSync(
      (params: { first: string; last: string }) => {
        return `${params.first} ${params.last}`;
      },
    );

    const harness = ReactiveSyncTestHarness({
      reactiveSync: formatName,
    });

    const result = harness.result.current.useSync({
      first: 'John',
      last: 'Doe',
    });

    expect(result).toBe('John Doe');
  });
});
```

## EagerAsync Operation Testing

### ReactiveEagerAsyncTestHarness

Test eager async operations that execute immediately.

```typescript
import { ReactiveEagerAsyncTestHarness } from '@chimeric/testing-core';
import { createReactiveEagerAsync } from '@chimeric/core';

describe('Eager Async Operations', () => {
  it('should execute immediately and provide state', async () => {
    const eagerFetch = createReactiveEagerAsync(
      async (params: { endpoint: string }) => {
        const response = await fetch(params.endpoint);
        return response.json();
      },
    );

    const harness = ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: eagerFetch,
      params: { endpoint: '/api/data' },
    });

    // Should start executing immediately
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
    });

    // Wait for completion
    await harness.waitFor(
      () => {
        expect(harness.result.current.isSuccess).toBe(true);
        expect(harness.result.current.data).toBeDefined();
      },
      { timeout: 5000 },
    );
  });
});
```

## Query and Mutation Testing

### ReactiveQueryTestHarness

Test query operations with caching and refetching capabilities.

```typescript
import { ReactiveQueryTestHarness } from '@chimeric/testing-core';
import { createReactiveQuery } from '@chimeric/core';

describe('Query Operations', () => {
  it('should test query with refetch capability', async () => {
    const userQuery = createReactiveQuery((params: { id: string }) => ({
      isIdle: false,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: async () => {
        // Simulate refetch
        return { id: params.id, name: 'John Doe' };
      },
      native: {},
    }));

    const harness = ReactiveQueryTestHarness({
      reactiveQuery: userQuery,
      params: { id: 'user-123' },
      options: { enabled: true },
    });

    // Test refetch functionality
    const refetchResult = await harness.result.current.refetch();
    expect(refetchResult).toEqual({ id: 'user-123', name: 'John Doe' });
  });
});
```

### ReactiveMutationTestHarness

Test mutation operations with state management.

```typescript
import { ReactiveMutationTestHarness } from '@chimeric/testing-core';
import { createReactiveMutation } from '@chimeric/core';

describe('Mutation Operations', () => {
  it('should test mutation with reset capability', async () => {
    const updateUser = createReactiveMutation(() => ({
      call: async (data: { id: string; name: string }) => {
        // Simulate API call
        return { ...data, updatedAt: new Date().toISOString() };
      },
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: () => {
        // Reset mutation state
      },
      native: {},
    }));

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: updateUser,
    });

    // Test mutation call
    const result = await harness.result.current.call({
      id: 'user-123',
      name: 'Jane Doe',
    });

    expect(result.name).toBe('Jane Doe');
    expect(result.updatedAt).toBeDefined();

    // Test reset functionality
    harness.result.current.reset();
    // Verify reset behavior
  });
});
```

## Advanced Testing Patterns

### Testing with Custom Wrappers

```typescript
import { ReactiveAsyncTestHarness } from '@chimeric/testing-core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

describe('Operations with Context', () => {
  it('should test with React Query provider', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: myOperation,
      wrapper: CustomWrapper,
    });

    // Test with full context
    await harness.result.current.call();
    // ... assertions
  });
});
```

### Testing Error Scenarios

```typescript
describe('Error Handling', () => {
  it('should handle network errors', async () => {
    const failingOperation = createReactiveAsync(async () => {
      throw new Error('Network timeout');
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: failingOperation,
    });

    await expect(harness.result.current.call()).rejects.toThrow(
      'Network timeout',
    );

    await harness.waitFor(() => {
      expect(harness.result.current.isError).toBe(true);
      expect(harness.result.current.error?.message).toBe('Network timeout');
    });
  });

  it('should test retry behavior', async () => {
    let attemptCount = 0;
    const retryOperation = createReactiveAsync(async () => {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error('Temporary failure');
      }
      return 'Success after retries';
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: retryOperation,
      reactiveOptions: { retry: 3 },
    });

    const result = await harness.result.current.call();
    expect(result).toBe('Success after retries');
    expect(attemptCount).toBe(3);
  });
});
```

### Testing State Transitions

```typescript
describe('State Transitions', () => {
  it('should verify complete state lifecycle', async () => {
    const slowOperation = createReactiveAsync(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'completed';
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: slowOperation,
    });

    // Initial state
    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);

    // Start operation
    const promise = harness.result.current.call();

    // Pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isIdle).toBe(false);
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isSuccess).toBe(false);
      expect(harness.result.current.isError).toBe(false);
    });

    // Wait for completion
    await promise;

    // Success state
    await harness.waitFor(() => {
      expect(harness.result.current.isIdle).toBe(false);
      expect(harness.result.current.isPending).toBe(false);
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.isError).toBe(false);
      expect(harness.result.current.data).toBe('completed');
    });
  });
});
```

## Testing Methods Constants

Use these constants for parameterized testing across different operation patterns:

```typescript
import {
  chimericMethods,
  idiomaticMethods,
  reactiveMethods,
} from '@chimeric/testing-core';

describe.each(chimericMethods)('Chimeric Operation - %s method', (method) => {
  it(`should work with ${method} pattern`, async () => {
    const harness = ChimericAsyncTestHarness({
      chimericAsync: myChimericOperation,
      method,
    });

    act(() => {
      harness.result.current.call();
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isPending).toBe(false),
    );

    expect(harness.result.current.data).toBeDefined();
  });
});
```

## Configuration Options

### WaitFor Options

```typescript
// Custom timeout and interval
await harness.waitFor(
  () => {
    expect(harness.result.current.isSuccess).toBe(true);
  },
  {
    timeout: 10000, // 10 seconds
    interval: 100, // Check every 100ms
  },
);
```

## Development

### Building

```bash
nx build testing-core
```

### Running Tests

```bash
nx test testing-core
```

The test harnesses are thoroughly tested and serve as examples for implementing your own testing patterns.
