# @chimeric/core

The core types and utilities for the chimeric library - a React TypeScript library that provides unified patterns for synchronous, asynchronous, query, and mutation interfaces for idiomatic and reactive paradigms.

## Installation

```bash
# Using npm
npm install @chimeric/core

# Using yarn
yarn add @chimeric/core

# Using pnpm
pnpm add @chimeric/core
```

## Core Concepts

The chimeric library provides three main paradigms for handling operations:

- **Idiomatic**: Traditional function-based approach
- **Reactive**: Hook-based approach with state management
- **Chimeric**: Fusion of both idiomatic and reactive patterns

Each paradigm supports different operation types: `Sync`, `Async`, `EagerAsync`, `Query`, and `Mutation`.

## Core Types

### Reactive<T, E>

The foundational reactive state type used across all reactive operations:

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

### 1. Sync Operations

Synchronous operations that execute immediately and return results.

#### Idiomatic Sync

```typescript
import { createIdiomaticSync, IdiomaticSync } from '@chimeric/core';

// Example usage
const findNewUsers = createIdiomaticSync(() => {
  return store.getState().users.filter((user) => user.isNew);
});

const result = findNewUsers(); // [{ isNew: true, name: 'Harry', id: 123 }]
```

#### Reactive Sync

```tsx
import { createReactiveSync, ReactiveSync } from '@chimeric/core';

// Example usage
const reactiveFindNewUsers = createReactiveSync(() => {
  return useSelector((state) => state.users.filter((user) => user.isNew));
});

// In a React component
const MyComponent = () => {
  const result = reactiveFindNewUsers.useSync();
  return (
    <div>
      {result.map((newUser) => {
        <div key={newUser.id}>{newUser.name}</div>;
      })}
    </div>
  );
};
```

#### Chimeric Sync

```tsx
import { fuseChimericSync, ChimericSync } from '@chimeric/core';

// Example usage
const chimericFindNewUsers = fuseChimericSync(
  createIdiomaticSync(
    () => store.getState().users.filter((user) => user.isNew);,
  ),
  createReactiveSync(() => useSelector((state) => state.users.filter((user) => user.isNew))),
);

// Use idiomatically
const result1 = chimericFindNewUsers();

// Use reactively in component
const MyComponent = () => {
  const result2 = chimericFindNewUsers.useSync();
  return (
    <div>
      {result2.map((newUser) => {
        <div key={newUser.id}>{newUser.name}</div>;
      })}
    </div>
  );
};
```

### 2. Async Operations

Asynchronous operations that return promises and provide loading states.

#### Reactive Async

```tsx
// In a React component
const UserProfile = ({ userId }: { userId: string }) => {
  const { call, data, isPending, isError, error } = fetchUser.useAsync();

  const handleFetch = () => call({ id: userId });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      {data ? (
        <div>{data.name}</div>
      ) : (
        <button onClick={handleFetch}>Load User Profile</button>
      )}
    </div>
  );
};
```

### 3. EagerAsync Operations

Asynchronous operations that execute immediately when called.

#### Reactive EagerAsync

```tsx
// In a React component - executes immediately
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isPending, isError, error } = eagerFetchUser.useEagerAsync({
    id: userId,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return <div>{data?.name}</div>;
};
```

### 4. Query Operations

Query operations. Needs to be implemented via a query library like Tanstack Query.

#### Chimeric Query

```tsx
// Idiomatically
const user = await userQuery();

// In a React component
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isPending, isError, error, refetch } = userQuery.useQuery({
    id: userId,
  });

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {data && <div>{data.name}</div>}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
};
```

### 5. Mutation Operations

Mutation operations. Needs to be implemented via a mutation library like Tanstack Query.

#### Chimeric Mutation

```tsx
// Idiomatically
const result = await updateUser();

// In a React component
const EditUser = ({ user }: { user: User }) => {
  const { call, isPending, isSuccess, isError, error, reset } =
    updateUser.useMutation();

  const handleSubmit = (formData: { name: string }) => {
    call({ id: user.id, name: formData.name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue={user.name} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {isSuccess && <div>Saved successfully!</div>}
      {isError && <div>Error: {error?.message}</div>}
      <button type="button" onClick={reset}>
        Reset
      </button>
    </form>
  );
};
```

## Type Guards

Each operation type includes type guard functions for runtime type checking:

```typescript
import {
  isReactiveSync,
  isReactiveAsync,
  isReactiveQuery,
  isReactiveMutation,
  isChimericSync,
} from '@chimeric/core';

// Example usage
if (isReactiveSync(someObject)) {
  // TypeScript now knows someObject is ReactiveSync
  const result = someObject.useSync(params);
}

if (isChimericSync(someObject)) {
  // Can be used both ways
  const result1 = someObject(params); // Idiomatic
  const result2 = someObject.useSync(params); // Reactive
}
```

## Development

### Building

```bash
nx build core
```

### Running Tests

```bash
nx test core
```
