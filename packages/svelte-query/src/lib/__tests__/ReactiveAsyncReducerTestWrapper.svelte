<script lang="ts">
  import type { ReactiveEagerAsync } from '@chimeric/core';

  let {
    reactiveEagerAsync,
    params = undefined,
  }: {
    reactiveEagerAsync: ReactiveEagerAsync<any, any, any>;
    params?: any;
  } = $props();

  const state =
    params !== undefined
      ? reactiveEagerAsync.useHook(params)
      : reactiveEagerAsync.useHook();
</script>

<div data-testid="isIdle">{String(state.isIdle)}</div>
<div data-testid="isPending">{String(state.isPending)}</div>
<div data-testid="isSuccess">{String(state.isSuccess)}</div>
<div data-testid="isError">{String(state.isError)}</div>
<div data-testid="data"
  >{state.data !== undefined ? JSON.stringify(state.data) : ''}</div
>
<div data-testid="error">{state.error?.message ?? ''}</div>
