# @chimeric/react-query

TanStack Query integration for the chimeric library - providing seamless integration between chimeric patterns and TanStack Query's powerful caching, synchronization, and server state management capabilities.

## Installation

```bash
# Using npm
npm install @chimeric/react-query

# Using yarn
yarn add @chimeric/react-query

# Using pnpm
pnpm add @chimeric/react-query
```

**Note**: This package requires `@tanstack/react-query` v5 or higher as a peer dependency.

## Overview

`@chimeric/react-query` bridges the gap between chimeric patterns and TanStack Query, providing:

- ✅ **Query Operations**: Full TanStack Query integration with caching, background updates, and stale-while-revalidate
- ✅ **Mutation Operations**: Optimistic updates, rollback, and mutation state management
- ✅ **Managed Store Queries**: Queries that sync with external state management (Redux, Zustand, etc.)
- ✅ **All Chimeric Patterns**: Idiomatic, Reactive, and Chimeric implementations
- ✅ **TypeScript Integration**: Full type safety with TanStack Query types
- ✅ **Native TanStack Features**: Access to all native TanStack Query options and return values

## Core Exports

```typescript
import {
  // Query Factory Functions
  ReactiveQueryFactory,
  IdiomaticQueryFactory,
  ChimericQueryFactory,

  // Mutation Factory Functions
  ReactiveMutationFactory,
  IdiomaticMutationFactory,
  ChimericMutationFactory,

  // Managed Store Query Factories
  ReactiveQueryWithManagedStoreFactory,
  IdiomaticQueryWithManagedStoreFactory,
  ChimericQueryWithManagedStoreFactory,

  // Types
  type ReactiveQuery,
  type IdiomaticQuery,
  type ChimericQuery,
  type ReactiveMutation,
  type IdiomaticMutation,
  type ChimericMutation,

  // TanStack Query re-exports
  type QueryKey,

  // Type guards and utilities
  isReactiveQuery,
  isIdiomaticQuery,
  isChimericQuery,
  isReactiveMutation,
  isIdiomaticMutation,
  isChimericMutation,
} from '@chimeric/react-query';
```

## Query Operations

### ReactiveQueryFactory

Creates reactive queries with TanStack Query hooks and full caching capabilities.

```tsx
import { ReactiveQueryFactory } from '@chimeric/react-query';
import { queryOptions } from '@tanstack/react-query';

// Create a reactive query
const fetchUser = ReactiveQueryFactory((params: { id: string }) =>
  queryOptions({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }),
);

// Use in React component
const UserProfile = ({ userId }: { userId: string }) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    native, // Full TanStack Query result
  } = fetchUser.useQuery({
    id: userId,
    options: { enabled: !!userId }, // Chimeric options
    nativeOptions: { retry: 3 }, // Native TanStack Query options
  });

  if (isPending) return <div>Loading user...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
      <button onClick={() => refetch()}>Refresh</button>

      {/* Access native TanStack Query features */}
      <small>
        Last updated:{' '}
        {native.dataUpdatedAt
          ? new Date(native.dataUpdatedAt).toLocaleString()
          : 'Never'}
      </small>
    </div>
  );
};
```

### IdiomaticQueryFactory

Creates promise-based queries that integrate with TanStack Query's cache.

```tsx
import { IdiomaticQueryFactory } from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Create an idiomatic query
const fetchUserPosts = IdiomaticQueryFactory(
  queryClient,
  (params: { userId: string; limit?: number }) =>
    queryOptions({
      queryKey: ['user-posts', params.userId, params.limit],
      queryFn: async () => {
        const response = await fetch(
          `/api/users/${params.userId}/posts?limit=${params.limit || 10}`,
        );
        return response.json();
      },
    }),
);

// Use idiomatically
const loadUserPosts = async (userId: string) => {
  try {
    const posts = await fetchUserPosts({
      userId,
      limit: 20,
      options: { forceRefetch: true }, // Chimeric options
      nativeOptions: { staleTime: 0 }, // Native TanStack Query options
    });

    console.log('Posts loaded:', posts);
    return posts;
  } catch (error) {
    console.error('Failed to load posts:', error);
    throw error;
  }
};

// The query result is automatically cached by TanStack Query
const handleLoadPosts = async () => {
  const posts = await loadUserPosts('user-123');
  // Subsequent calls may return cached data
};
```

### ChimericQueryFactory

Creates queries that work both idiomatically and reactively with shared TanStack Query cache.

```tsx
import {
  ChimericQueryFactory,
  DefineChimericQuery,
} from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Define the type for separate interfaces (IOC)
type UserDataQuery = DefineChimericQuery<
  (params: { id: string; includeProfile: boolean }) => Promise<UserWithProfile>
>;

// Create a chimeric query
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
      staleTime: 2 * 60 * 1000, // 2 minutes
    }),
);

// Use idiomatically
const loadUserData = async (userId: string) => {
  const userData = await fetchUserData({
    id: userId,
    includeProfile: true,
    nativeOptions: { retry: 2 },
  });

  return userData;
};

// Use reactively in component
const UserDashboard = ({ userId }: { userId: string }) => {
  const { data, isPending, isError, error, native } = fetchUserData.useQuery({
    id: userId,
    includeProfile: true,
    options: { enabled: !!userId },
  });

  // Both idiomatic and reactive calls share the same cache!
  const handleRefreshData = async () => {
    await loadUserData(userId); // This will update the reactive query too
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>{data?.user.name}</h1>
      {data?.profile && <p>Bio: {data.profile.bio}</p>}

      <button onClick={handleRefreshData}>Refresh Data</button>

      {/* Show cache status */}
      <div>
        Cache Status: {native.isStale ? 'Stale' : 'Fresh'}
        {native.isFetching && ' (Updating...)'}
      </div>
    </div>
  );
};
```

## Mutation Operations

### ReactiveMutationFactory

Creates reactive mutations with TanStack Query's mutation capabilities.

```tsx
import { ReactiveMutationFactory } from '@chimeric/react-query';

// Create a reactive mutation
const updateUser = ReactiveMutationFactory({
  mutationFn: async (params: { id: string; name: string; email: string }) => {
    const response = await fetch(`/api/users/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: params.name, email: params.email }),
    });

    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },
  // Native TanStack Query mutation options
  onSuccess: (data, variables) => {
    console.log('User updated successfully:', data);
  },
  onError: (error, variables) => {
    console.error('Failed to update user:', error);
  },
});

// Use in React component
const EditUserForm = ({ user }: { user: User }) => {
  const [formData, setFormData] = React.useState({
    name: user.name,
    email: user.email,
  });

  const {
    call,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    reset,
    native, // Full TanStack Query mutation result
  } = updateUser.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await call({
        id: user.id,
        name: formData.name,
        email: formData.email,
        nativeOptions: {
          onSuccess: () => {
            // Additional success handling
            setFormData({ name: '', email: '' });
          },
        },
      });
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Name"
        disabled={isPending}
      />

      <input
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
        disabled={isPending}
      />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update User'}
      </button>

      {isSuccess && <div>✅ User updated successfully!</div>}
      {isError && <div>❌ Error: {error?.message}</div>}

      <button type="button" onClick={reset}>
        Reset Status
      </button>

      {/* Access native TanStack Query mutation features */}
      <div>
        Mutation Status: {native.status}
        {native.submittedAt && (
          <small>
            {' '}
            (Last attempt: {new Date(native.submittedAt).toLocaleString()})
          </small>
        )}
      </div>
    </form>
  );
};
```

### ChimericMutationFactory

Creates mutations that work both idiomatically and reactively.

```tsx
import { ChimericMutationFactory } from '@chimeric/react-query';

// Create a chimeric mutation
const deleteUser = ChimericMutationFactory({
  mutationFn: async (params: { id: string }) => {
    const response = await fetch(`/api/users/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return { success: true, deletedId: params.id };
  },
  onSuccess: (data) => {
    console.log('User deleted:', data.deletedId);
  },
});

// Use idiomatically
const handleDeleteUser = async (userId: string) => {
  try {
    const result = await deleteUser({
      id: userId,
      nativeOptions: {
        onSuccess: () => {
          // Navigate away or update UI
          window.location.href = '/users';
        },
      },
    });

    return result;
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
};

// Use reactively in component
const DeleteUserButton = ({ userId }: { userId: string }) => {
  const { call, isPending, isError, error } = deleteUser.useMutation();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      await call({ id: userId });
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        {isPending ? 'Deleting...' : 'Delete User'}
      </button>

      {isError && <div>Error: {error?.message}</div>}
    </div>
  );
};
```

## Managed Store Queries

For applications using external state management (Redux, Zustand, etc.), managed store queries sync TanStack Query's cache invalidation with your store updates.

### ReactiveQueryWithManagedStoreFactory

```tsx
import { ReactiveQueryWithManagedStoreFactory } from '@chimeric/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { queryOptions } from '@tanstack/react-query';

// Create a managed store query
const fetchAndStoreUsers = ReactiveQueryWithManagedStoreFactory({
  // TanStack Query handles cache invalidation and background fetching
  getQueryOptions: () =>
    queryOptions({
      queryKey: ['users'],
      queryFn: async () => {
        const response = await fetch('/api/users');
        const users = await response.json();

        // Update your store directly
        dispatch(setUsers(users));

        // Return value doesn't matter - data comes from store
        return null;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),

  // Data comes from your store
  useFromStore: () => useSelector((state: RootState) => state.users.list),
});

// Use in component
const UsersList = () => {
  const {
    data: users, // This comes from your Redux store
    isPending,
    isError,
    error,
    refetch,
    native,
  } = fetchAndStoreUsers.useQuery();

  // TanStack Query manages when to fetch, but data comes from your store
  // This is intended for use-cases that need flexiblity (realtime data, frontend-only state)

  if (isPending) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h2>Users ({users?.length || 0})</h2>

      <button onClick={() => refetch()}>Refresh Users</button>

      {users?.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}

      {/* TanStack Query still provides cache status */}
      <div>
        Cache Status: {native.isStale ? 'Stale' : 'Fresh'}
        {native.isFetching && ' (Fetching...)'}
      </div>
    </div>
  );
};
```

### TypeScript Integration

Full type safety with automatic inference:

```tsx
import {
  DefineChimericQuery,
  DefineChimericMutation,
} from '@chimeric/react-query';

// Define types for better TypeScript support
type UserQuery = DefineChimericQuery<
  (params: { id: string; includeProfile: boolean }) => Promise<UserWithProfile>
>;

type UpdateUserMutation = DefineChimericMutation<
  (params: { id: string; updates: Partial<User> }) => Promise<User>
>;

// TypeScript will enforce correct parameter types
const userQuery: UserQuery = ChimericQueryFactory(/* ... */);
const updateUserMutation: UpdateUserMutation =
  ChimericMutationFactory(/* ... */);

// Usage is fully typed
const MyComponent = () => {
  // TypeScript knows the exact parameter shape
  const { data } = userQuery.useQuery({
    id: '123', // ✅ string required
    includeProfile: true, // ✅ boolean required
    // includeProfile: "yes", // ❌ TypeScript error
  });

  const { call } = updateUserMutation.useMutation();

  const handleUpdate = () => {
    call({
      id: '123', // ✅ string required
      updates: { name: 'New Name' }, // ✅ Partial<User> required
      // updates: { invalidField: true }, // ❌ TypeScript error
    });
  };

  // data is properly typed as UserWithProfile | undefined
  return <div>{data?.user.name}</div>;
};
```

## Development

### Building

```bash
nx build react-query
```

### Running Tests

```bash
nx test react-query
```

The tests demonstrate integration patterns with TanStack Query and can serve as additional examples for implementation.
