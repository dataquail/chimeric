# @chimeric/react

React-specific implementations and factory functions for the chimeric library - providing ready-to-use React hooks and components that implement the chimeric patterns with built-in state management, retry logic, and error handling.

## Installation

```bash
# Using npm
npm install @chimeric/react

# Using yarn
yarn add @chimeric/react

# Using pnpm
pnpm add @chimeric/react
```

**Note**: This package requires React 18 or 19 as a peer dependency and automatically includes `@chimeric/core`.

## Overview

`@chimeric/react` provides factory functions that create fully-implemented chimeric operations ready for use in React applications. Unlike `@chimeric/core` which provides types and creation utilities, this package includes the actual React hook implementations with:

- ✅ Built-in React state management using `useState`
- ✅ Automatic retry logic with exponential backoff
- ✅ Error handling and loading states
- ✅ TypeScript support with full type inference
- ✅ Both idiomatic and reactive patterns in one

## Core Exports

This package re-exports all types and utilities from `@chimeric/core` plus provides React-specific factory functions:

```typescript
// Re-exported from @chimeric/core
import {
  // Types for all operation patterns
  type ChimericAsync,
  type ReactiveAsync,
  type IdiomaticAsync,
  type ChimericEagerAsync,
  type ReactiveEagerAsync,
  type IdiomaticEagerAsync,
  type ChimericSync,
  type ReactiveSync,
  type IdiomaticSync,

  // Type guards
  isChimericAsync,
  isReactiveAsync,
  isIdiomaticAsync,

  // Core creation utilities
  fuseChimericAsync,
  createReactiveAsync,
  createIdiomaticAsync,
  // ... and more
} from '@chimeric/react';

// React-specific factory functions
import {
  ReactiveAsyncFactory,
  IdiomaticAsyncFactory,
  ChimericAsyncFactory,
  MetaAggregatorFactory,
} from '@chimeric/react';
```

## Factory Functions

### ReactiveAsyncFactory

Creates reactive async operations with React hooks and state management.

```tsx
import { ReactiveAsyncFactory } from '@chimeric/react';

// Create a reactive async operation
const fetchUser = ReactiveAsyncFactory(async (params: { id: string }) => {
  const response = await fetch(`/api/users/${params.id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
});

// Use in React component
const UserProfile = ({ userId }: { userId: string }) => {
  const { call, data, isPending, isError, error, isSuccess, isIdle } =
    fetchUser.useAsync({
      retry: 3, // Optional: retry up to 3 times with exponential backoff
    });

  const handleLoadUser = () => {
    call({ id: userId });
  };

  if (isIdle) {
    return <button onClick={handleLoadUser}>Load User</button>;
  }

  if (isPending) {
    return <div>Loading user...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (isSuccess && data) {
    return (
      <div>
        <h2>{data.name}</h2>
        <p>{data.email}</p>
        <button onClick={handleLoadUser}>Refresh</button>
      </div>
    );
  }

  return null;
};
```

### IdiomaticAsyncFactory

Creates traditional promise-based async operations with retry support.

```tsx
import { IdiomaticAsyncFactory } from '@chimeric/react';

// Create an idiomatic async operation
const createUser = IdiomaticAsyncFactory(
  async (params: { name: string; email: string }) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
);

// Use idiomatically with async/await
const handleCreateUser = async () => {
  try {
    const newUser = await createUser({
      name: 'John Doe',
      email: 'john@example.com',
      options: { retry: 2 }, // Optional retry configuration
    });
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Failed to create user:', error);
  }
};
```

### ChimericAsyncFactory

Creates chimeric operations that can be used both idiomatically and reactively.

```tsx
import { ChimericAsyncFactory, DefineChimericAsync } from '@chimeric/react';

// Define the type for better TypeScript support
type UserFetcher = DefineChimericAsync<
  (params: { id: string }) => Promise<User>
>;

// Create a chimeric async operation
const fetchUser: UserFetcher = ChimericAsyncFactory(
  async (params: { id: string }) => {
    const response = await fetch(`/api/users/${params.id}`);
    if (!response.ok) throw new Error('User not found');
    return response.json();
  },
);

// Use idiomatically
const loadUserData = async (userId: string) => {
  try {
    const user = await fetchUser({
      id: userId,
      options: { retry: 3 },
    });
    return user;
  } catch (error) {
    console.error('Failed to load user:', error);
    throw error;
  }
};

// Use reactively in component
const UserCard = ({ userId }: { userId: string }) => {
  const { call, data, isPending, isError, error } = fetchUser.useAsync();

  React.useEffect(() => {
    call({ id: userId });
  }, [userId]);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (data) return <div>Welcome, {data.name}!</div>;
  return null;
};
```

### MetaAggregatorFactory

Combines multiple reactive states into a single aggregated state - useful for coordinating multiple async operations.

```tsx
import { MetaAggregatorFactory } from '@chimeric/react';

const UserDashboard = ({ userId }: { userId: string }) => {
  const userQuery = fetchUser.useAsync();
  const postsQuery = fetchUserPosts.useAsync();
  const settingsQuery = fetchUserSettings.useAsync();

  // Aggregate multiple reactive states
  const aggregatedState = MetaAggregatorFactory(
    [userQuery, postsQuery, settingsQuery],
    ([userData, postsData, settingsData]) => ({
      user: userData,
      posts: postsData,
      settings: settingsData,
      totalPosts: postsData?.length || 0,
    }),
  );

  React.useEffect(() => {
    userQuery.invoke({ id: userId });
    postsQuery.invoke({ userId });
    settingsQuery.invoke({ userId });
  }, [userId]);

  if (aggregatedState.isPending) {
    return <div>Loading dashboard...</div>;
  }

  if (aggregatedState.isError) {
    return <div>Error loading dashboard: {aggregatedState.error?.message}</div>;
  }

  if (aggregatedState.isSuccess && aggregatedState.data) {
    const { user, posts, settings, totalPosts } = aggregatedState.data;
    return (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <p>You have {totalPosts} posts</p>
        <div>Theme: {settings.theme}</div>
        {/* Render posts, settings, etc. */}
      </div>
    );
  }

  return null;
};
```

## Built-in Features

### Retry Logic with Exponential Backoff

All factory functions include automatic retry capabilities:

```tsx
const resilientApiCall = ChimericAsyncFactory(async () => {
  // This might fail occasionally
  const response = await fetch('/api/unreliable-endpoint');
  if (!response.ok) throw new Error('API call failed');
  return response.json();
});

// Idiomatic usage with retry
const data = await resilientApiCall({
  options: { retry: 5 }, // Will retry up to 5 times with exponential backoff
});

// Reactive usage with retry
const MyComponent = () => {
  const { call, data, isPending } = resilientApiCall.useAsync({
    retry: 3, // Configure retry for the hook
  });

  // call() will automatically retry on failure
  return <button onClick={() => call()}>Fetch Data</button>;
};
```

### State Management

Reactive operations automatically manage loading states:

```tsx
const apiCall = ReactiveAsyncFactory(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
  return { message: 'Success!' };
});

const MyComponent = () => {
  const {
    call,
    data, // undefined | T
    isIdle, // true initially
    isPending, // true during execution
    isSuccess, // true when completed successfully
    isError, // true when error occurred
    error, // Error | null
  } = apiCall.useAsync();

  return (
    <div>
      <button onClick={() => call()} disabled={isPending}>
        {isPending ? 'Loading...' : 'Call API'}
      </button>

      {isSuccess && <div>✅ {data?.message}</div>}
      {isError && <div>❌ {error?.message}</div>}
    </div>
  );
};
```

### TypeScript Integration

Full type safety with automatic inference:

```tsx
// Type is automatically inferred
const typedApiCall = ChimericAsyncFactory(
  async (params: { userId: string; includeProfile: boolean }) => {
    const user = await fetchUser(params.userId);
    const profile = params.includeProfile
      ? await fetchProfile(params.userId)
      : null;

    return {
      user,
      profile,
      timestamp: Date.now(),
    };
  },
);

// TypeScript knows the exact shape of the returned data and call parameters
const MyComponent = () => {
  const { call, data } = typedApiCall.useAsync();

  // data is properly typed as:
  // { user: User; profile: Profile | null; timestamp: number } | undefined

  // call is properly typed to require:
  // { userId: string; includeProfile: boolean }

  return (
    <div>
      <button
        onClick={() =>
          call({
            userId: '123', // TypeScript ensures userId is string
            includeProfile: true, // TypeScript ensures includeProfile is boolean
          })
        }
      >
        Load User
      </button>

      {data && (
        <>
          <h1>{data.user.name}</h1>
          {data.profile && <p>{data.profile.bio}</p>}
          <small>Loaded at: {new Date(data.timestamp).toLocaleString()}</small>
        </>
      )}
    </div>
  );
};
```

## Sync Operations

The package also re-exports sync operations from `@chimeric/core`. For sync operations, you typically use the core utilities directly since they don't require React-specific implementations:

```tsx
import {
  createReactiveSync,
  createIdiomaticSync,
  fuseChimericSync,
} from '@chimeric/react';

// Reactive sync - uses React hooks
const useCurrentUser = createReactiveSync(() => {
  return useSelector((state) => state.auth.currentUser);
});

// Idiomatic sync - pure function
const getCurrentUser = createIdiomaticSync(() => {
  return store.getState().auth.currentUser;
});

// Chimeric sync - both patterns
const currentUser = fuseChimericSync(getCurrentUser, useCurrentUser);
```

## Error Handling Best Practices

```tsx
const robustApiCall = ChimericAsyncFactory(async (params: { id: string }) => {
  try {
    const response = await fetch(`/api/data/${params.id}`);

    if (!response.ok) {
      // Throw specific errors for better error handling
      if (response.status === 404) {
        throw new Error(`Data not found for ID: ${params.id}`);
      }
      if (response.status >= 500) {
        throw new Error('Server error - please try again later');
      }
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Re-throw with context
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
});

const DataComponent = ({ dataId }: { dataId: string }) => {
  const { call, data, isPending, isError, error } = robustApiCall.useAsync({
    retry: 3, // Automatic retry for transient failures
  });

  const handleRetry = () => call({ id: dataId });

  if (isPending) return <div>Loading...</div>;

  if (isError) {
    return (
      <div>
        <p>❌ {error?.message}</p>
        <button onClick={handleRetry}>Try Again</button>
      </div>
    );
  }

  return <div>{data && JSON.stringify(data, null, 2)}</div>;
};
```

## Development

### Building

```bash
nx build react
```

### Running Tests

```bash
nx test react
```

The tests demonstrate usage patterns and can serve as additional examples for implementation.
