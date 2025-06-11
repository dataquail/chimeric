# @chimeric/testing-react-query

Testing utilities for chimeric interfaces from `@chimeric/react-query` - providing specialized test harnesses for TanStack Query-integrated chimeric operations with comprehensive cache testing, query/mutation state validation, and native TanStack Query feature testing.

## Installation

This package should be installed as a development dependency:

```bash
# Using npm
npm install --save-dev @chimeric/testing-react-query

# Using yarn
yarn add --dev @chimeric/testing-react-query

# Using pnpm
pnpm add -D @chimeric/testing-react-query
```

**Note**: This package requires React 18 or 19 as a peer dependency. It also depends on `@chimeric/core`, `@chimeric/react-query`, and `@chimeric/testing-core` packages.

## Overview

`@chimeric/testing-react-query` extends `@chimeric/testing-core` with TanStack Query-specific testing capabilities for operations created with `@chimeric/react-query` factory functions. It provides:

- ✅ **TanStack Query Integration**: Test harnesses for `@chimeric/react-query` factory functions
- ✅ **Cache Testing**: Validate query caching, invalidation, and background updates
- ✅ **Query State Management**: Test loading, error, and success states with TanStack Query
- ✅ **Mutation Testing**: Test optimistic updates, rollbacks, and mutation states
- ✅ **Native Feature Access**: Test native TanStack Query options and return values
- ✅ **Managed Store Testing**: Test queries that sync with external state management
- ✅ **TypeScript Support**: Full type safety for TanStack Query testing scenarios

## Core Exports

```typescript
import {
  // Query Test Harnesses
  ReactiveQueryTestHarness,
  IdiomaticQueryTestHarness,
  ChimericQueryTestHarness,

  // Mutation Test Harnesses
  ReactiveMutationTestHarness,
  IdiomaticMutationTestHarness,
  ChimericMutationTestHarness,

  // Testing method constants (re-exported from @chimeric/testing-core)
  chimericMethods,
  idiomaticMethods,
  reactiveMethods,
} from '@chimeric/testing-react-query';
```

## Testing Query Operations

### ReactiveQueryTestHarness

Test reactive queries with TanStack Query caching and state management.

```typescript
import { ReactiveQueryTestHarness } from '@chimeric/testing-react-query';
import { ReactiveQueryFactory } from '@chimeric/react-query';
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
} from '@tanstack/react-query';

describe('ReactiveQueryFactory Operations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should test user query with caching', async () => {
    // Create a reactive query
    const fetchUser = ReactiveQueryFactory((params: { id: string }) =>
      queryOptions({
        queryKey: ['user', params.id],
        queryFn: async () => {
          const response = await fetch(`/api/users/${params.id}`);
          if (!response.ok) throw new Error('User not found');
          return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      }),
    );

    // Create test wrapper with QueryClient
    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Create test harness
    const harness = ReactiveQueryTestHarness({
      reactiveQuery: fetchUser,
      wrapper: TestWrapper,
      params: { id: 'user-123' },
      options: { enabled: true },
      nativeOptions: { retry: 3 },
    });

    // Test initial state
    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);

    // Wait for query to complete
    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toBeDefined();
    });

    // Test refetch functionality
    const refetchResult = await harness.result.current.refetch();
    expect(refetchResult).toBeDefined();

    // Test native TanStack Query features
    expect(harness.result.current.native.dataUpdatedAt).toBeGreaterThan(0);
    expect(harness.result.current.native.isFetched).toBe(true);
  });

  it('should test query with disabled state', async () => {
    const disabledQuery = ReactiveQueryFactory(() =>
      queryOptions({
        queryKey: ['disabled-query'],
        queryFn: async () => 'should not execute',
      }),
    );

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ReactiveQueryTestHarness({
      reactiveQuery: disabledQuery,
      wrapper: TestWrapper,
      options: { enabled: false }, // Disabled query
    });

    // Should remain idle when disabled
    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.data).toBeUndefined();
  });
});
```

### IdiomaticQueryTestHarness

Test idiomatic queries that integrate with TanStack Query's cache.

```typescript
import { IdiomaticQueryTestHarness } from '@chimeric/testing-react-query';
import { IdiomaticQueryFactory } from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';

describe('IdiomaticQueryFactory Operations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should test idiomatic query with cache integration', async () => {
    const fetchPosts = IdiomaticQueryFactory(
      queryClient,
      (params: { userId: string; limit?: number }) =>
        queryOptions({
          queryKey: ['posts', params.userId, params.limit],
          queryFn: async () => {
            const response = await fetch(
              `/api/users/${params.userId}/posts?limit=${params.limit || 10}`,
            );
            return response.json();
          },
        }),
    );

    const harness = IdiomaticQueryTestHarness({
      idiomaticQuery: fetchPosts,
    });

    // Test initial state
    expect(harness.result.current.isIdle).toBe(true);

    // Execute query
    const promise = harness.result.current.call({
      userId: 'user-123',
      limit: 5,
      options: { forceRefetch: false },
      nativeOptions: { staleTime: 1000 },
    });

    // Check pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
    });

    // Wait for completion
    const result = await promise;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toEqual(result);
    });

    // Verify cache was populated
    const cachedData = queryClient.getQueryData(['posts', 'user-123', 5]);
    expect(cachedData).toEqual(result);
  });

  it('should test force refetch behavior', async () => {
    const cachedQuery = IdiomaticQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['cached-data'],
        queryFn: async () => ({ timestamp: Date.now() }),
      }),
    );

    const harness = IdiomaticQueryTestHarness({
      idiomaticQuery: cachedQuery,
    });

    // First call
    const firstResult = await harness.result.current.call({
      options: { forceRefetch: false },
    });

    // Second call without force refetch (should use cache)
    const secondResult = await harness.result.current.call({
      options: { forceRefetch: false },
    });

    // Third call with force refetch (should fetch fresh data)
    const thirdResult = await harness.result.current.call({
      options: { forceRefetch: true },
    });

    expect(firstResult.timestamp).toBe(secondResult.timestamp); // Same from cache
    expect(thirdResult.timestamp).toBeGreaterThan(firstResult.timestamp); // Fresh data
  });
});
```

### ChimericQueryTestHarness

Test chimeric queries that work both idiomatically and reactively with shared cache.

```typescript
import { ChimericQueryTestHarness } from '@chimeric/testing-react-query';
import {
  ChimericQueryFactory,
  DefineChimericQuery,
} from '@chimeric/react-query';
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
} from '@tanstack/react-query';

describe('ChimericQueryFactory Operations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should test shared cache between idiomatic and reactive usage', async () => {
    type UserDataQuery = DefineChimericQuery<
      (params: {
        id: string;
        includeProfile: boolean;
      }) => Promise<UserWithProfile>
    >;

    const fetchUserData: UserDataQuery = ChimericQueryFactory(
      queryClient,
      (params: { id: string; includeProfile: boolean }) =>
        queryOptions({
          queryKey: ['user-data', params.id, params.includeProfile],
          queryFn: async () => {
            const [user, profile] = await Promise.all([
              fetch(`/api/users/${params.id}`).then((r) => r.json()),
              params.includeProfile
                ? fetch(`/api/users/${params.id}/profile`).then((r) => r.json())
                : Promise.resolve(null),
            ]);

            return { user, profile };
          },
        }),
    );

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ChimericQueryTestHarness({
      chimericQuery: fetchUserData,
      wrapper: TestWrapper,
    });

    // Test idiomatic usage
    const idiomaticResult = await harness.result.current.idiomatic({
      id: 'user-123',
      includeProfile: true,
      nativeOptions: { retry: 2 },
    });

    expect(idiomaticResult.user).toBeDefined();
    expect(idiomaticResult.profile).toBeDefined();

    // Verify cache was populated
    const cachedData = queryClient.getQueryData([
      'user-data',
      'user-123',
      true,
    ]);
    expect(cachedData).toEqual(idiomaticResult);

    // Test reactive usage (should use cached data)
    const reactivePromise = harness.result.current.reactive.useQuery({
      id: 'user-123',
      includeProfile: true,
      options: { enabled: true },
    });

    // Should immediately have cached data
    expect(harness.result.current.reactive.data).toEqual(idiomaticResult);
    expect(harness.result.current.reactive.isSuccess).toBe(true);

    // Test cache status
    expect(harness.result.current.reactive.native.isFetched).toBe(true);
    expect(harness.result.current.reactive.native.isStale).toBe(false);
  });

  it('should test error handling in both patterns', async () => {
    const failingQuery = ChimericQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['failing-query'],
        queryFn: async () => {
          throw new Error('Query failed');
        },
      }),
    );

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ChimericQueryTestHarness({
      chimericQuery: failingQuery,
      wrapper: TestWrapper,
    });

    // Test idiomatic error handling
    await expect(harness.result.current.idiomatic()).rejects.toThrow(
      'Query failed',
    );

    // Test reactive error handling
    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isError).toBe(true);
      expect(harness.result.current.reactive.error?.message).toBe(
        'Query failed',
      );
    });
  });
});
```

## Testing Mutation Operations

### ReactiveMutationTestHarness

Test reactive mutations with TanStack Query's mutation capabilities.

```typescript
import { ReactiveMutationTestHarness } from '@chimeric/testing-react-query';
import { ReactiveMutationFactory } from '@chimeric/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ReactiveMutationFactory Operations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
  });

  it('should test user update mutation', async () => {
    const updateUser = ReactiveMutationFactory({
      mutationFn: async (params: {
        id: string;
        name: string;
        email: string;
      }) => {
        const response = await fetch(`/api/users/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: params.name, email: params.email }),
        });

        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
      },
      onSuccess: (data, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      },
      onError: (error, variables) => {
        console.error('Update failed:', error);
      },
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: updateUser,
      wrapper: TestWrapper,
    });

    // Test initial state
    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.data).toBeUndefined();

    // Execute mutation
    const promise = harness.result.current.call({
      id: 'user-123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      nativeOptions: {
        onSuccess: () => {
          // Additional success handling
        },
      },
    });

    // Check pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isIdle).toBe(false);
    });

    // Wait for completion
    const result = await promise;
    expect(result.name).toBe('Jane Doe');
    expect(result.email).toBe('jane@example.com');

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toEqual(result);
      expect(harness.result.current.isPending).toBe(false);
    });

    // Test reset functionality
    harness.result.current.reset();

    await harness.waitFor(() => {
      expect(harness.result.current.isIdle).toBe(true);
      expect(harness.result.current.data).toBeUndefined();
    });

    // Test native TanStack Query mutation features
    expect(harness.result.current.native.submittedAt).toBeGreaterThan(0);
  });
});
```

### ChimericMutationTestHarness

Test chimeric mutations that work both idiomatically and reactively.

```typescript
import { ChimericMutationTestHarness } from '@chimeric/testing-react-query';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ChimericMutationFactory Operations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('should test both idiomatic and reactive mutation patterns', async () => {
    const deleteUser = ChimericMutationFactory({
      mutationFn: async (params: { id: string }) => {
        const response = await fetch(`/api/users/${params.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user');
        return { success: true, deletedId: params.id };
      },
      onSuccess: (data) => {
        // Invalidate user queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ChimericMutationTestHarness({
      chimericMutation: deleteUser,
      wrapper: TestWrapper,
    });

    // Test idiomatic usage
    const idiomaticResult = await harness.result.current.idiomatic({
      id: 'user-123',
      nativeOptions: {
        onSuccess: () => {
          // Additional success handling
        },
      },
    });

    expect(idiomaticResult.success).toBe(true);
    expect(idiomaticResult.deletedId).toBe('user-123');

    // Test reactive usage
    const reactivePromise = harness.result.current.reactive.call({
      id: 'user-456',
    });

    // Check reactive state changes
    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isPending).toBe(true);
    });

    const reactiveResult = await reactivePromise;
    expect(reactiveResult.deletedId).toBe('user-456');

    await harness.waitFor(() => {
      expect(harness.result.current.reactive.isSuccess).toBe(true);
      expect(harness.result.current.reactive.data).toEqual(reactiveResult);
    });
  });
});
```

## Testing Managed Store Queries

### Testing ReactiveQueryWithManagedStoreFactory

Test queries that sync TanStack Query with external state management.

```typescript
import { ReactiveQueryTestHarness } from '@chimeric/testing-react-query';
import { ReactiveQueryWithManagedStoreFactory } from '@chimeric/react-query';
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
} from '@tanstack/react-query';
import { Provider, useSelector } from 'react-redux';

describe('Managed Store Query Operations', () => {
  let queryClient: QueryClient;
  let mockStore: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    mockStore = {
      getState: () => ({ users: { list: [] } }),
      dispatch: vi.fn(),
      subscribe: vi.fn(),
    };
  });

  it('should test query that syncs with Redux store', async () => {
    const fetchAndStoreUsers = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['users'],
          queryFn: async () => {
            const response = await fetch('/api/users');
            const users = await response.json();

            // Update Redux store
            mockStore.dispatch({ type: 'SET_USERS', payload: users });

            return null; // Data comes from store
          },
          staleTime: 5 * 60 * 1000,
        }),

      useFromStore: () => useSelector((state: any) => state.users.list),
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={mockStore}>{children}</Provider>
      </QueryClientProvider>
    );

    const harness = ReactiveQueryTestHarness({
      reactiveQuery: fetchAndStoreUsers,
      wrapper: TestWrapper,
    });

    // Wait for query to complete
    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
    });

    // Verify store was updated
    expect(mockStore.dispatch).toHaveBeenCalledWith({
      type: 'SET_USERS',
      payload: expect.any(Array),
    });

    // Test refetch functionality
    const refetchResult = await harness.result.current.refetch();
    expect(refetchResult).toBeDefined();

    // Verify TanStack Query cache status
    expect(harness.result.current.native.isFetched).toBe(true);
  });
});
```

## Advanced Testing Patterns

### Testing Cache Invalidation

```typescript
describe('Cache Management', () => {
  it('should test query invalidation', async () => {
    const userQuery = ReactiveQueryFactory((params: { id: string }) =>
      queryOptions({
        queryKey: ['user', params.id],
        queryFn: async () => ({ id: params.id, name: 'John Doe' }),
      }),
    );

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ReactiveQueryTestHarness({
      reactiveQuery: userQuery,
      wrapper: TestWrapper,
      params: { id: 'user-123' },
    });

    // Wait for initial load
    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
    });

    // Invalidate the query
    queryClient.invalidateQueries({ queryKey: ['user', 'user-123'] });

    // Should trigger refetch
    await harness.waitFor(() => {
      expect(harness.result.current.native.isFetching).toBe(true);
    });

    await harness.waitFor(() => {
      expect(harness.result.current.native.isFetching).toBe(false);
      expect(harness.result.current.isSuccess).toBe(true);
    });
  });
});
```

### Testing Optimistic Updates

```typescript
describe('Optimistic Updates', () => {
  it('should test optimistic mutation with rollback', async () => {
    const optimisticUpdate = ChimericMutationFactory({
      mutationFn: async (params: { id: string; name: string }) => {
        // Simulate failure
        throw new Error('Update failed');
      },

      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['user', variables.id] });

        // Snapshot previous value
        const previousUser = queryClient.getQueryData(['user', variables.id]);

        // Optimistically update
        queryClient.setQueryData(['user', variables.id], (old: any) => ({
          ...old,
          name: variables.name,
        }));

        return { previousUser };
      },

      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousUser) {
          queryClient.setQueryData(
            ['user', variables.id],
            context.previousUser,
          );
        }
      },
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Set initial data
    queryClient.setQueryData(['user', 'user-123'], {
      id: 'user-123',
      name: 'John',
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation: optimisticUpdate,
      wrapper: TestWrapper,
    });

    // Trigger optimistic update (will fail)
    await expect(
      harness.result.current.reactive.call({
        id: 'user-123',
        name: 'Jane',
      }),
    ).rejects.toThrow('Update failed');

    // Verify rollback occurred
    const finalData = queryClient.getQueryData(['user', 'user-123']);
    expect(finalData).toEqual({ id: 'user-123', name: 'John' });
  });
});
```

### Parameterized Testing

```typescript
import { chimericMethods } from '@chimeric/testing-react-query';

describe.each(chimericMethods)('Query Operations - %s method', (method) => {
  it(`should work with ${method} pattern`, async () => {
    const query = ChimericQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: async () => ({ data: 'test' }),
      }),
    );

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const harness = ChimericQueryTestHarness({
      chimericQuery: query,
      wrapper: TestWrapper,
    });

    if (method === 'idiomatic') {
      const result = await harness.result.current.idiomatic();
      expect(result.data).toBe('test');
    } else if (method === 'reactive') {
      await harness.waitFor(() => {
        expect(harness.result.current.reactive.isSuccess).toBe(true);
        expect(harness.result.current.reactive.data?.data).toBe('test');
      });
    }
  });
});
```

## Configuration and Best Practices

### Test Setup

```typescript
// Global test setup
beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});
```

### Custom Wait Options

```typescript
// Test with custom timeout for slow operations
await harness.waitFor(
  () => {
    expect(harness.result.current.isSuccess).toBe(true);
  },
  {
    timeout: 15000, // 15 seconds for slow queries
    interval: 100, // Check every 100ms
  },
);
```

## Development

### Building

```bash
nx build testing-react-query
```

### Running Tests

```bash
nx test testing-react-query
```

This package provides comprehensive testing utilities for TanStack Query-integrated chimeric operations, ensuring your `@chimeric/react-query` implementations work correctly with caching, mutations, and all TanStack Query features.
