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

### ChimericQueryTestHarness

Test chimeric queries using parametrized testing with different methods (idiomatic, reactive, chimeric).

```typescript
import {
  ChimericQueryTestHarness,
  chimericMethods,
  ChimericQueryFactory,
} from '@chimeric/testing-react-query';
import { setupServer } from 'msw/node';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { QueryClient, queryOptions } from '@tanstack/react-query';

describe('Todo Service', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const getTodoService = () => {
    const queryClient = new QueryClient();
    // Get your service instance (e.g., from DI container)
    return {
      getAll: ChimericQueryFactory(queryClient, () =>
        queryOptions({
          queryKey: ['get-all-todos'],
          queryFn: async () => fetch(`/api/todos`).then((r) => r.json()),
        }),
      ),
      getOneById: ChimericQueryFactory(queryClient, (params: { id: number }) =>
        queryOptions({
          queryKey: ['get-todos'],
          queryFn: async () =>
            fetch(`/api/todos/${params.id}`).then((r) => r.json()),
        }),
      ),
    };
  };

  const withMockTodos = () => {
    // Setup MSW handlers for your API endpoints
    server.use(
      http.get('/api/todos', () => {
        return HttpResponse.json({
          total_count: 2,
          list: [
            { id: '1', title: 'Todo 1', completed: false },
            { id: '2', title: 'Todo 2', completed: true },
          ],
        });
      }),
    );
  };

  it.each(chimericMethods)('getAll.%s', async (method) => {
    withMockTodos();
    const todoService = getTodoService();

    const harness = ChimericQueryTestHarness({
      chimericQuery: todoService.getAll,
      method,
      wrapper: getTestWrapper(), // Your test wrapper with providers
    });

    // Test initial pending state
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);

    // Wait for query to complete
    await harness.waitFor(() =>
      expect(harness.result.current.isPending).toBe(false),
    );

    // Verify successful data fetch
    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.data?.length).toBe(2);
    expect(harness.result.current.data?.[0].id).toBe('1');
    expect(harness.result.current.data?.[0].title).toBe('Todo 1');
  });

  it.each(chimericMethods)('getOneById.%s', async (method) => {
    server.use(
      http.get('/api/todos/1', () => {
        return HttpResponse.json({
          id: 1,
          title: 'Todo 1',
          completed: false,
          created_at: '2024-01-01T00:00:00Z',
        });
      }),
    );

    const todoService = getTodoService();

    const harness = ChimericQueryTestHarness({
      chimericQuery: todoService.getOneById,
      method,
      params: { id: 1 }, // Query parameters
      wrapper: getTestWrapper(),
    });

    expect(harness.result.current.isPending).toBe(true);

    await harness.waitFor(() =>
      expect(harness.result.current.isPending).toBe(false),
    );

    expect(harness.result.current.data?.id).toBe('1');
    expect(harness.result.current.data?.title).toBe('Todo 1');
  });
});
```

### ReactiveQueryTestHarness

Test reactive queries that automatically execute when mounted.

```typescript
import { ReactiveQueryTestHarness } from '@chimeric/testing-react-query';
import { ReactiveQueryFactory } from '@chimeric/react-query';

describe('ReactiveQueryFactory Operations', () => {
  it('should test reactive user query', async () => {
    const fetchUser = ReactiveQueryFactory((params: { id: string }) =>
      queryOptions({
        queryKey: ['user', params.id],
        queryFn: async () => {
          // Your query function
          const response = await fetch(`/api/users/${params.id}`);
          return response.json();
        },
      }),
    );

    const harness = ReactiveQueryTestHarness({
      reactiveQuery: fetchUser,
      wrapper: getTestWrapper(),
      params: { id: 'user-123' },
    });

    // Test initial state
    expect(harness.result.current.isPending).toBe(true);

    // Wait for completion
    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
    });

    expect(harness.result.current.data).toBeDefined();
  });
});
```

### IdiomaticQueryTestHarness

Test idiomatic queries that are called programmatically.

```typescript
import { IdiomaticQueryTestHarness } from '@chimeric/testing-react-query';
import { IdiomaticQueryFactory } from '@chimeric/react-query';

describe('IdiomaticQueryFactory Operations', () => {
  it('should test idiomatic query execution', async () => {
    const fetchPosts = IdiomaticQueryFactory(
      queryClient,
      (params: { userId: string }) =>
        queryOptions({
          queryKey: ['posts', params.userId],
          queryFn: async () => {
            const response = await fetch(`/api/users/${params.userId}/posts`);
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
    });

    // Wait for result
    const result = await promise;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
```

## Testing Mutation Operations

### ChimericMutationTestHarness

Test chimeric mutations with state updates and cache invalidation.

```typescript
import { ChimericMutationTestHarness } from '@chimeric/testing-react-query';
import { act } from 'react';

describe('Todo Mutations', () => {
  it.each(chimericMethods)('deleteTodo.%s', async (method) => {
    // Setup initial data
    withMockTodos();

    const todoService = getTodoService();
    const testWrapper = getTestWrapper();

    const deleteHarness = ChimericMutationTestHarness({
      chimericMutation: todoService.deleteOne,
      method,
      wrapper: testWrapper,
    });

    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: todoService.getAll,
      method,
      wrapper: testWrapper,
    });

    // Wait for initial data to load
    await getAllHarness.waitFor(() =>
      expect(getAllHarness.result.current.isPending).toBe(false),
    );
    expect(getAllHarness.result.current.data?.length).toBe(2);

    // Setup mock for successful deletion and updated list
    withSuccessfulDeletion();
    withUpdatedTodoList(); // Returns list with one item removed

    // Execute mutation
    act(() => {
      deleteHarness.result.current.call({ id: '1' });
    });

    // Wait for mutation to complete
    await deleteHarness.waitFor(() =>
      expect(deleteHarness.result.current.isPending).toBe(false),
    );

    // Wait for cache invalidation to trigger refetch
    await getAllHarness.waitFor(
      () => expect(getAllHarness.result.current.isPending).toBe(false),
      { reinvokeIdiomaticFn: true }, // Forces idiomatic test to reinvoke the function to recalculate value
    );

    // Verify updated data
    expect(getAllHarness.result.current.data?.length).toBe(1);
  });
});
```

### ReactiveMutationTestHarness

Test reactive mutations with state management.

```typescript
import { ReactiveMutationTestHarness } from '@chimeric/testing-react-query';

describe('ReactiveMutationFactory Operations', () => {
  it('should test reactive mutation', async () => {
    const updateUser = ReactiveMutationFactory({
      mutationFn: async (params: { id: string; name: string }) => {
        const response = await fetch(`/api/users/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: params.name }),
        });
        return response.json();
      },
    });

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: updateUser,
      wrapper: getTestWrapper(),
    });

    // Test initial state
    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);

    // Execute mutation
    const promise = harness.result.current.call({
      id: 'user-123',
      name: 'Jane Doe',
    });

    // Check pending state
    await harness.waitFor(() => {
      expect(harness.result.current.isPending).toBe(true);
    });

    // Wait for completion
    const result = await promise;
    expect(result.name).toBe('Jane Doe');

    await harness.waitFor(() => {
      expect(harness.result.current.isSuccess).toBe(true);
      expect(harness.result.current.data).toEqual(result);
    });
  });
});
```

## Advanced Testing Patterns

### Coordinating Multiple Harnesses

Test how mutations affect query state through cache invalidation.

```typescript
describe('Coordinated Operations', () => {
  it.each(chimericMethods)(
    'should coordinate mutation and query.%s',
    async (method) => {
      const todoService = getTodoService();
      const testWrapper = getTestWrapper();

      // Create harnesses for both operations
      const createHarness = ChimericMutationTestHarness({
        chimericMutation: todoService.createOne,
        method,
        wrapper: testWrapper,
      });

      const listHarness = ChimericQueryTestHarness({
        chimericQuery: todoService.getAll,
        method,
        wrapper: testWrapper,
      });

      // Wait for initial query to load
      await listHarness.waitFor(() =>
        expect(listHarness.result.current.isPending).toBe(false),
      );

      const initialCount = listHarness.result.current.data?.length ?? 0;

      // Setup mocks for creation and updated list
      withSuccessfulCreation();
      withUpdatedListAfterCreation();

      // Execute mutation
      act(() => {
        createHarness.result.current.call({
          title: 'New Todo',
          completed: false,
        });
      });

      // Wait for mutation
      await createHarness.waitFor(() =>
        expect(createHarness.result.current.isPending).toBe(false),
      );

      // Wait for list to update via cache invalidation
      await listHarness.waitFor(
        () =>
          expect(listHarness.result.current.data?.length).toBe(
            initialCount + 1,
          ),
        { reinvokeIdiomaticFn: true },
      );
    },
  );
});
```

### Using reinvokeIdiomaticFn

When testing cache invalidation with idiomatic patterns, use the `reinvokeIdiomaticFn` option:

```typescript
// Wait for cache invalidation to trigger idiomatic refetch
await harness.waitFor(
  () => expect(harness.result.current.data?.length).toBe(expectedLength),
  { reinvokeIdiomaticFn: true },
);
```

### Parameterized Testing with chimericMethods

Use `chimericMethods` array to test all supported patterns (idiomatic, reactive) in a single test:

```typescript
import { chimericMethods } from '@chimeric/testing-react-query';

describe.each(chimericMethods)('Todo Operations - %s method', (method) => {
  it(`should fetch todos using ${method} pattern`, async () => {
    withMockTodos();

    const todoService = getTodoService();
    const harness = ChimericQueryTestHarness({
      chimericQuery: todoService.getAll,
      method, // This determines which pattern to test
      wrapper: getTestWrapper(),
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isPending).toBe(false),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.data?.length).toBeGreaterThan(0);
  });
});
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
