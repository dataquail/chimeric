# @chimeric/react-query

TanStack Query integration for the chimeric library — providing dual-interface patterns (idiomatic function calls + reactive hooks) on top of TanStack Query's caching and server state management.

## Installation

```bash
npm install @chimeric/react-query @tanstack/react-query
```

Requires `@tanstack/react-query` v5+.

## Overview

`@chimeric/react-query` provides factory functions that create chimeric queries, mutations, and infinite queries backed by TanStack Query. Each factory produces an object that can be called idiomatically (async/await) or reactively (`.useHook()` inside a React component), sharing the same underlying TanStack Query cache.

## Query Factories

### ChimericQueryFactory

```typescript
import { ChimericQueryFactory } from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';

const queryClient = new QueryClient();

const getUser = ChimericQueryFactory<{ id: string }, User>({
  queryClient,
  getQueryOptions: (params) =>
    queryOptions({
      queryKey: ['user', params.id],
      queryFn: () => fetch(`/api/users/${params.id}`).then((r) => r.json()),
    }),
});
```

**Idiomatic usage:**

```typescript
const user = await getUser({ id: '123' });

// Force a fresh fetch, ignoring cache
const user = await getUser({ id: '123' }, { options: { forceRefetch: true } });

// Prefetch into cache without returning
await getUser.prefetch({ id: '123' });
```

**Reactive usage (in a React component):**

```tsx
const { data, isPending, isError, error, refetch, native } = getUser.useHook(
  { id: userId },
  { options: { enabled: !!userId } },
);

// Suspense variant — data is guaranteed non-undefined
const { data } = getUser.useSuspenseHook({ id: userId });

// Prefetch hook
getUser.usePrefetchHook({ id: userId });
```

`IdiomaticQueryFactory` and `ReactiveQueryFactory` are also available if you only need one path.

## Mutation Factories

### ChimericMutationFactory

```typescript
import { ChimericMutationFactory } from '@chimeric/react-query';

const updateUser = ChimericMutationFactory<{ id: string; name: string }, User>({
  queryClient,
  mutationFn: async (params) => {
    const response = await fetch(`/api/users/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: params.name }),
    });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  },
});
```

**Idiomatic usage:**

```typescript
const updatedUser = await updateUser({ id: '123', name: 'New Name' });
```

**Reactive usage:**

```tsx
const { invoke, isPending, isError, error, data, reset, native } =
  updateUser.useHook();

const handleSubmit = async () => {
  await invoke({ id: '123', name: 'New Name' });
};
```

`IdiomaticMutationFactory` and `ReactiveMutationFactory` are also available.

## InfiniteQuery Factories

### ChimericInfiniteQueryFactory

```typescript
import { ChimericInfiniteQueryFactory } from '@chimeric/react-query';
import { infiniteQueryOptions } from '@tanstack/react-query';

const getArchivedTodos = ChimericInfiniteQueryFactory<void, Todo[], number>({
  queryClient,
  getInfiniteQueryOptions: () =>
    infiniteQueryOptions({
      queryKey: ['archived-todos'],
      queryFn: ({ pageParam }) =>
        fetch(`/api/archived-todos?page=${pageParam}`).then((r) => r.json()),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => allPages.length,
    }),
});
```

**Idiomatic usage:**

```typescript
const { pages, pageParams } = await getArchivedTodos();
```

**Reactive usage:**

```tsx
const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
  getArchivedTodos.useHook();

// Suspense variant
const { data } = getArchivedTodos.useSuspenseHook();
```

## Reducers

Reducers combine multiple chimeric services into a single derived value.

### ChimericSyncReducer

Combines multiple `ChimericSync` services synchronously. Provided by `@chimeric/react`.

```typescript
import { ChimericSyncReducer } from '@chimeric/react';

const getDashboardData = ChimericSyncReducer<void>().build({
  serviceList: [{ service: getCurrentUser }, { service: getNotificationCount }],
  reducer: ([user, count]) => ({ user, unread: count }),
});
```

### ChimericAsyncReducer

Combines queries, eager async, and sync services into a `ChimericEagerAsync`.

```typescript
import { ChimericAsyncReducer } from '@chimeric/react-query';

const getDashboard = ChimericAsyncReducer<{ userId: string }>().build({
  serviceList: [
    { service: getUser, getParams: (p) => ({ id: p.userId }) },
    { service: getUserPosts, getParams: (p) => ({ userId: p.userId }) },
  ],
  reducer: ([user, posts]) => ({ user, posts, totalPosts: posts.length }),
});
```

## Options Pattern

All factories accept a two-level options structure as a second argument:

```typescript
// Idiomatic
await query(params, {
  options: { forceRefetch: true }, // chimeric options
  nativeOptions: { staleTime: 0 }, // TanStack Query options
});

// Reactive
query.useHook(params, {
  options: { enabled: true }, // chimeric options
  nativeOptions: { refetchInterval: 5000 }, // TanStack Query options
});
```

## Server Components

This package uses the `react-server` export condition. When your bundler resolves imports for a server component, it automatically uses a server-safe build where hooks throw descriptive errors if accidentally called. No separate import path is needed — the same `import { ... } from '@chimeric/react-query'` works in both server and client contexts.

## Development

```bash
npx nx build @chimeric/react-query
npx nx test @chimeric/react-query
```
