<script lang="ts">
  import type { ReactiveEagerAsync } from '@chimeric/core';

  let {
    reactiveEagerAsync,
    params = undefined,
    enabled = true,
  }: {
    reactiveEagerAsync: ReactiveEagerAsync<any, any, any>;
    params?: any;
    enabled?: boolean;
  } = $props();

  // Only pass options object when enabled is explicitly false, to avoid
  // accidentally treating { enabled: true } as params for optional-param functions
  const state = params !== undefined
    ? reactiveEagerAsync.useHook(params, { enabled })
    : enabled === false
      ? reactiveEagerAsync.useHook({ enabled })
      : reactiveEagerAsync.useHook();
</script>

<div data-testid="isIdle">{String(state.isIdle)}</div>
<div data-testid="isPending">{String(state.isPending)}</div>
<div data-testid="isSuccess">{String(state.isSuccess)}</div>
<div data-testid="isError">{String(state.isError)}</div>
<div data-testid="data">{state.data !== undefined ? String(state.data) : ''}</div>
<div data-testid="error">{state.error?.message ?? ''}</div>
