# @chimeric/react

React-specific factory functions for the chimeric library — providing ready-to-use implementations with built-in state management, retry logic, and error handling.

## Installation

```bash
npm install @chimeric/react
```

Requires React 18+ as a peer dependency. Automatically includes `@chimeric/core`.

## Overview

`@chimeric/react` provides factory functions that create fully-implemented chimeric operations for React. Unlike `@chimeric/core` which provides low-level types and fusion utilities, this package includes actual React hook implementations with:

- Built-in state management (`useState`)
- Automatic retry with exponential backoff
- Loading/error/success state tracking
- Server component support via separate server entry point

## Factory Functions

### ChimericAsyncFactory

Creates an async operation usable both idiomatically and reactively.

```tsx
import { ChimericAsyncFactory } from '@chimeric/react';

const fetchUser = ChimericAsyncFactory(async (params: { id: string }) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
});

// Idiomatic
const user = await fetchUser({ id: '123' }, { options: { retry: 3 } });

// Reactive (in a React component)
const { invoke, data, isPending, isError, error } = fetchUser.useHook();

const handleFetch = () => invoke({ id: userId });
```

### ChimericEagerAsyncFactory

Creates an async operation that auto-executes when params change.

```tsx
import { ChimericEagerAsyncFactory } from '@chimeric/react';

const fetchUser = ChimericEagerAsyncFactory({
  eagerAsyncFn: async (params: { id: string }) => {
    const response = await fetch(`/api/users/${params.id}`);
    return response.json();
  },
});

// Idiomatic
const user = await fetchUser({ id: '123' });

// Reactive — auto-executes on mount and when params change
const { data, isPending, isError, error } = fetchUser.useHook(
  { id: userId },
  { options: { enabled: !!userId } },
);
```

### CreateChimericSyncFactory

Creates a factory bound to a state management library (Redux, Zustand, etc.) via an adapter.

```tsx
import { CreateChimericSyncFactory } from '@chimeric/react';

const ChimericSyncFactory = CreateChimericSyncFactory({
  getState: () => store.getState(),
  useSelector: useAppSelector,
});

const getTodoById = ChimericSyncFactory({
  selector: (params: { id: string }) => (state) => state.todos.find((t) => t.id === params.id),
});

// Idiomatic
const todo = getTodoById({ id: '123' });

// Reactive
const todo = getTodoById.useHook({ id: '123' });
```

### MetaAggregatorFactory

Aggregates multiple reactive states into a single state object.

```tsx
import { MetaAggregatorFactory } from '@chimeric/react';

const aggregated = MetaAggregatorFactory(
  [userResult, postsResult, settingsResult],
  ([userData, postsData, settingsData]) => ({
    user: userData,
    posts: postsData,
    settings: settingsData,
  }),
);

// aggregated.isPending — true if ANY are pending
// aggregated.isSuccess — true if ALL are successful
// aggregated.data — combined result from reducer
```

### ChimericSyncReducer

Combines multiple `ChimericSync` services into a single derived `ChimericSync`.

```tsx
import { ChimericSyncReducer } from '@chimeric/react';

const getDashboardData = ChimericSyncReducer<void>().build({
  serviceList: [{ service: getCurrentUser }, { service: getNotificationCount }],
  reducer: ([user, count]) => ({ user, unread: count }),
});

// Idiomatic
const data = getDashboardData();

// Reactive
const data = getDashboardData.useHook();
```

`IdiomaticSyncReducer` and `ReactiveSyncReducer` are also available for single-path usage.

## Server Components

This package uses the `react-server` export condition. When your bundler resolves imports for a server component, it automatically uses a server-safe build where hooks throw descriptive errors if accidentally called. No separate import path is needed — the same `import { ... } from '@chimeric/react'` works in both server and client contexts.

## Development

```bash
npx nx build @chimeric/react
npx nx test @chimeric/react
```
