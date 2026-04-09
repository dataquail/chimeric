# @chimeric/core

Core types and utilities for the chimeric library — a TypeScript library that provides dual-interface patterns where every operation works both as a direct function call (idiomatic) and as a React hook (reactive).

## Installation

```bash
npm install @chimeric/core
```

## Core Concepts

Chimeric provides three paradigms for every operation:

- **Idiomatic**: Direct function calls for orchestration, scripts, tests, and server-side logic
- **Reactive**: Hook-based interface (`.useHook()`) for use inside React components
- **Chimeric**: Fusion of both — one object, two execution paths

Each paradigm supports six operation types: `Sync`, `Async`, `EagerAsync`, `Query`, `Mutation`, and `InfiniteQuery`.

## Reactive Base Type

```typescript
type Reactive<T, E extends Error> = {
  data: T;
  isIdle: boolean;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: E | null;
};
```

## Operation Types

### Sync

Synchronous operations that execute immediately and return a result.

```tsx
import { createIdiomaticSync, createReactiveSync, fuseChimericSync } from '@chimeric/core';

const getNewUsers = fuseChimericSync({
  idiomatic: createIdiomaticSync(() => {
    return store.getState().users.filter((user) => user.isNew);
  }),
  reactive: createReactiveSync(() => {
    return useSelector((state) => state.users.filter((user) => user.isNew));
  }),
});

// Idiomatic
const users = getNewUsers();

// Reactive (in a React component)
const users = getNewUsers.useHook();
```

### Async

Asynchronous operations with manual invocation and loading states.

```tsx
import { fuseChimericAsync } from '@chimeric/core';

// Idiomatic
const user = await fetchUser({ id: userId });

// Reactive (in a React component)
const { invoke, data, isPending, isError, error } = fetchUser.useHook();

const handleFetch = () => invoke({ id: userId });
```

### EagerAsync

Asynchronous operations that execute immediately when parameters change.

```tsx
// Reactive — executes immediately on mount and when params change
const { data, isPending, isError, error } = fetchUser.useHook({ id: userId });
```

### Query

Cached read operations. Requires an integration library (`@chimeric/react-query` or `@chimeric/rtk-query`).

```tsx
// Idiomatic
const user = await userQuery({ id: userId });

// Reactive (in a React component)
const { data, isPending, isError, error, refetch } = userQuery.useHook({ id: userId });
```

### Mutation

Write operations. Requires an integration library.

```tsx
// Idiomatic
const result = await updateUser({ id: userId, name: 'New Name' });

// Reactive (in a React component)
const { invoke, isPending, isError, error, reset } = updateUser.useHook();

const handleSubmit = () => invoke({ id: userId, name: 'New Name' });
```

### InfiniteQuery

Paginated read operations. Requires an integration library.

```tsx
// Idiomatic
const { pages, pageParams } = await archivedTodos();

// Reactive (in a React component)
const { data, hasNextPage, fetchNextPage, isPending } = archivedTodos.useHook();
```

## Fusion Functions

Combine idiomatic and reactive implementations into a chimeric object:

| Function | Operation Type |
|----------|---------------|
| `fuseChimericSync` | Synchronous |
| `fuseChimericAsync` | Asynchronous (manual invoke) |
| `fuseChimericEagerAsync` | Asynchronous (auto-execute) |
| `fuseChimericQuery` | Cached queries |
| `fuseChimericMutation` | Mutations |
| `fuseChimericInfiniteQuery` | Paginated queries |

All take a `{ idiomatic, reactive }` config object.

## Type Guards

Runtime type checking for each operation type:

```typescript
import { isChimericQuery, isReactiveSync, isIdiomaticAsync } from '@chimeric/core';

if (isChimericQuery(operation)) {
  const result = await operation({ id: '123' });       // idiomatic
  const { data } = operation.useHook({ id: '123' });   // reactive
}
```

## Development

```bash
npx nx build @chimeric/core
npx nx test @chimeric/core
```
