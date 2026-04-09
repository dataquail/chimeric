# @chimeric/rtk-query

Redux Toolkit Query integration for the chimeric library — providing dual-interface patterns (idiomatic function calls + reactive hooks) on top of RTK Query endpoints.

## Installation

```bash
npm install @chimeric/rtk-query @reduxjs/toolkit react-redux
```

Requires `@reduxjs/toolkit` v2+ and `react-redux` v9+.

## Overview

`@chimeric/rtk-query` wraps existing RTK Query endpoints with chimeric factories. Each factory produces an object that can be called idiomatically (async/await, dispatching thunks against the store) or reactively (`.useHook()` inside a React component), using RTK Query's built-in caching and subscription model.

## Setup

Define your RTK Query API as usual, then wrap endpoints with chimeric factories:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query<User, { id: string }>({
      query: (params) => `users/${params.id}`,
    }),
    updateUser: builder.mutation<User, { id: string; name: string }>({
      query: (params) => ({
        url: `users/${params.id}`,
        method: 'PUT',
        body: { name: params.name },
      }),
    }),
  }),
});
```

## Query Factories

### ChimericQueryFactory

```typescript
import { ChimericQueryFactory } from '@chimeric/rtk-query';

const getUser = ChimericQueryFactory({
  store,
  endpoint: api.endpoints.getUser,
  endpointName: 'getUser',
  api,
});
```

**Idiomatic usage:**

```typescript
const user = await getUser({ id: '123' });

// Force a fresh fetch
const user = await getUser({ id: '123' }, { options: { forceRefetch: true } });

// Prefetch into cache
await getUser.prefetch({ id: '123' });
```

**Reactive usage (in a React component):**

```tsx
const { data, isPending, isError, error, refetch, native } = getUser.useHook(
  { id: userId },
  { options: { enabled: !!userId } },
);
```

`IdiomaticQueryFactory` and `ReactiveQueryFactory` are also available if you only need one path.

## Mutation Factories

### ChimericMutationFactory

```typescript
import { ChimericMutationFactory } from '@chimeric/rtk-query';

const updateUser = ChimericMutationFactory({
  store,
  endpoint: api.endpoints.updateUser,
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

For RTK Query endpoints that define `infiniteQueryOptions`:

```typescript
import { ChimericInfiniteQueryFactory } from '@chimeric/rtk-query';

const getArchivedTodos = ChimericInfiniteQueryFactory({
  store,
  endpoint: api.endpoints.getArchivedTodos,
  endpointName: 'getArchivedTodos',
  api,
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
```

## Reducers

Reducers combine multiple chimeric services into a single derived value. `ChimericSyncReducer` is provided by `@chimeric/react`. `ChimericAsyncReducer` is provided by this package:

```typescript
import { ChimericAsyncReducer } from '@chimeric/rtk-query';

const getDashboard = ChimericAsyncReducer<{ userId: string }>().build({
  serviceList: [
    { service: getUser, getParams: (p) => ({ id: p.userId }) },
    { service: getUserPosts, getParams: (p) => ({ userId: p.userId }) },
  ],
  reducer: ([user, posts]) => ({ user, posts }),
});
```

## Options Pattern

All factories accept a two-level options structure as a second argument:

```typescript
// Idiomatic
await query(params, {
  options: { forceRefetch: true },   // chimeric options
  nativeOptions: { ... },            // RTK Query native options
});

// Reactive
query.useHook(params, {
  options: { enabled: true },        // chimeric options
  nativeOptions: { skip: false },    // RTK Query native options
});
```

## Error Handling

RTK Query errors are wrapped in `RtkQueryError` for consistent error handling:

```typescript
import { RtkQueryError } from '@chimeric/rtk-query';

try {
  await getUser({ id: '123' });
} catch (error) {
  if (error instanceof RtkQueryError) {
    console.log(error.rtkError); // original RTK error shape
  }
}
```

## Development

```bash
npx nx build @chimeric/rtk-query
npx nx test @chimeric/rtk-query
```
