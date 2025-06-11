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
  it('should test data processing with exponential backoff', async () => {
    const processData = IdiomaticAsyncFactory(
      async (data: { items: string[]; delay?: number }) => {
        // Simulate processing time
        if (data.delay) {
          await new Promise((resolve) => setTimeout(resolve, data.delay));
        }

        return data.items.map((item) => ({
          original: item,
          processed: item.toUpperCase(),
          timestamp: Date.now(),
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

### Testing ChimericAsyncFactory

Test chimeric operations that support both idiomatic and reactive patterns.

```typescript
import { ChimericAsyncTestHarness } from '@chimeric/testing-react';
import { ChimericAsyncFactory, DefineChimericAsync } from '@chimeric/react';

describe('ChimericAsyncFactory Operations', () => {
  it('should test both idiomatic and reactive patterns', async () => {
    type ApiCall = DefineChimericAsync<
      (params: { endpoint: string; method: string }) => Promise<ApiResponse>
    >;

    const apiCall: ApiCall = ChimericAsyncFactory(async (params) => {
      const response = await fetch(params.endpoint, {
        method: params.method,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: apiCall,
    });

    // Test idiomatic usage
    const idiomaticResult = await harness.result.current.idiomatic({
      endpoint: '/api/data',
      method: 'GET',
    });

    expect(idiomaticResult).toBeDefined();

    // Test reactive usage
    const reactivePromise = harness.result.current.reactive.call({
      endpoint: '/api/users',
      method: 'POST',
    });

    // Verify reactive state changes
    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isPending).toBe(true);
    });

    const reactiveResult = await reactivePromise;

    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isSuccess).toBe(true);
      expect(harness.result.current.reactive.data).toEqual(reactiveResult);
    });
  });

  it('should test error handling in both patterns', async () => {
    const failingOperation = ChimericAsyncFactory(async () => {
      throw new Error('Operation failed');
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: failingOperation,
    });

    // Test idiomatic error handling
    await expect(harness.result.current.idiomatic()).rejects.toThrow(
      'Operation failed',
    );

    // Test reactive error handling
    await expect(harness.result.current.reactive.call()).rejects.toThrow(
      'Operation failed',
    );

    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isError).toBe(true);
      expect(harness.result.current.reactive.error?.message).toBe(
        'Operation failed',
      );
    });
  });
});
```

## Testing with React Context

### Testing with Providers

```typescript
import { ReactiveAsyncTestHarness } from '@chimeric/testing-react';
import { ReactiveAsyncFactory } from '@chimeric/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

describe('Operations with React Context', () => {
  it('should test with multiple providers', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const theme = {
      colors: { primary: '#007bff' },
      spacing: { unit: 8 },
    };

    // Custom wrapper with multiple providers
    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={mockStore}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </Provider>
      </QueryClientProvider>
    );

    const contextAwareOperation = ReactiveAsyncFactory(async () => {
      // This operation might use context values
      return { message: 'Success with context' };
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: contextAwareOperation,
      wrapper: TestWrapper,
    });

    const result = await harness.result.current.call();
    expect(result.message).toBe('Success with context');

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
    });
  });
});
```

## Advanced Testing Patterns

### Testing State Management Integration

```typescript
import { ReactiveAsyncTestHarness } from '@chimeric/testing-react';
import { ReactiveAsyncFactory } from '@chimeric/react';

describe('State Management Integration', () => {
  it('should test operations that update external state', async () => {
    const mockDispatch = vi.fn();
    const mockStore = {
      getState: () => ({ users: [] }),
      dispatch: mockDispatch,
    };

    const fetchAndStoreUsers = ReactiveAsyncFactory(async () => {
      const response = await fetch('/api/users');
      const users = await response.json();

      // Update external store
      mockDispatch({ type: 'SET_USERS', payload: users });

      return users;
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: fetchAndStoreUsers,
    });

    const result = await harness.result.current.call();

    // Verify external state was updated
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_USERS',
      payload: result,
    });

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toEqual(result);
    });
  });
});
```

### Testing MetaAggregatorFactory

```typescript
import { ReactiveAsyncTestHarness } from '@chimeric/testing-react';
import { ReactiveAsyncFactory, MetaAggregatorFactory } from '@chimeric/react';

describe('MetaAggregatorFactory', () => {
  it('should test aggregated state from multiple operations', async () => {
    const fetchUser = ReactiveAsyncFactory(async (params: { id: string }) => {
      return { id: params.id, name: 'John Doe', email: 'john@example.com' };
    });

    const fetchPosts = ReactiveAsyncFactory(
      async (params: { userId: string }) => {
        return [
          { id: 1, title: 'Post 1', userId: params.userId },
          { id: 2, title: 'Post 2', userId: params.userId },
        ];
      },
    );

    // Create individual harnesses
    const userHarness = ReactiveAsyncTestHarness({
      reactiveAsync: fetchUser,
    });

    const postsHarness = ReactiveAsyncTestHarness({
      reactiveAsync: fetchPosts,
    });

    // Start both operations
    const userPromise = userHarness.result.current.call({ id: 'user-123' });
    const postsPromise = postsHarness.result.current.call({
      userId: 'user-123',
    });

    // Wait for both to complete
    await Promise.all([userPromise, postsPromise]);

    // Test aggregated state
    const aggregatedState = MetaAggregatorFactory(
      [userHarness.result.current, postsHarness.result.current],
      ([userData, postsData]) => ({
        user: userData,
        posts: postsData,
        totalPosts: postsData?.length || 0,
      }),
    );

    expect(aggregatedState.isSuccess).toBe(true);
    expect(aggregatedState.data?.user.name).toBe('John Doe');
    expect(aggregatedState.data?.totalPosts).toBe(2);
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

    if (method === 'idiomatic') {
      const result = await harness.result.current.idiomatic({ value: 5 });
      expect(result).toBe(10);
    } else if (method === 'reactive') {
      const result = await harness.result.current.reactive.call({ value: 5 });
      expect(result).toBe(10);

      await harness.waitFor(() => {
        expect(harness.result.current.reactive.isSuccess).toBe(true);
        expect(harness.result.current.reactive.data).toBe(10);
      });
    }
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

## Performance Testing

### Testing Operation Timing

```typescript
describe('Performance Testing', () => {
  it('should complete operations within expected timeframes', async () => {
    const timedOperation = ReactiveAsyncFactory(async () => {
      // Simulate work that should complete quickly
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'completed';
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: timedOperation,
    });

    const startTime = Date.now();
    await harness.result.current.call();
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(200); // Should complete within 200ms

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
    });
  });
});
```

## Configuration and Utilities

### Custom Wait Options

```typescript
// Test with custom timeout and interval
await harness.waitFor(
  () => {
    expect(harness.result.current.isSuccess).toBe(true);
  },
  {
    timeout: 10000, // 10 seconds
    interval: 50, // Check every 50ms
  },
);
```

### Testing Cleanup

```typescript
describe('Cleanup Testing', () => {
  afterEach(() => {
    // Clean up any side effects
    vi.clearAllMocks();
    // Reset any global state
  });

  it('should clean up properly after operations', async () => {
    const operation = ReactiveAsyncFactory(async () => {
      // Operation that might have side effects
      return 'result';
    });

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: operation,
    });

    await harness.result.current.call();

    // Verify cleanup
    // ... cleanup assertions
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
