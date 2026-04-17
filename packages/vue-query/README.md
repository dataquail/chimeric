# @chimeric/vue-query

Vue Query utilities for chimeric interfaces using TanStack Query.

## Installation

```bash
npm install @chimeric/vue-query @tanstack/vue-query vue
```

## Usage

```typescript
import { ChimericQueryFactory, ChimericMutationFactory } from '@chimeric/vue-query';
import { queryOptions, QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient();

// Create a chimeric query
const getUser = ChimericQueryFactory({
  queryClient,
  getQueryOptions: (params: { id: string }) =>
    queryOptions({
      queryKey: ['user', params.id],
      queryFn: () => fetchUser(params.id),
    }),
});

// Idiomatic usage (anywhere)
const user = await getUser({ id: '123' });

// Vue composable usage (in setup())
const { isPending, isSuccess, data } = getUser.useHook({ id: '123' });
// isPending.value, data.value - access via .value
```
