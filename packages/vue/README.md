# @chimeric/vue

Vue composable utilities for chimeric interfaces.

## Installation

```bash
npm install @chimeric/vue vue
```

## Usage

```typescript
import { ChimericAsyncFactory, ChimericEagerAsyncFactory } from '@chimeric/vue';

// Create a chimeric async function
const fetchUser = ChimericAsyncFactory(async (params: { id: string }) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
});

// Idiomatic usage (anywhere)
const user = await fetchUser({ id: '123' });

// Vue composable usage (in setup())
const { isPending, isSuccess, data, invoke } = fetchUser.useHook();
```
