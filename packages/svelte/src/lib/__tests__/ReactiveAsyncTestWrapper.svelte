<script lang="ts">
  import type { ReactiveAsync } from '@chimeric/core';

  let {
    reactiveAsync,
    params = undefined,
  }: {
    reactiveAsync: ReactiveAsync<any, any, any>;
    params?: any;
  } = $props();

  const state = reactiveAsync.useHook();
</script>

<div data-testid="isIdle">{String(state.isIdle)}</div>
<div data-testid="isPending">{String(state.isPending)}</div>
<div data-testid="isSuccess">{String(state.isSuccess)}</div>
<div data-testid="isError">{String(state.isError)}</div>
<div data-testid="data">{state.data !== undefined ? String(state.data) : ''}</div>
<div data-testid="error">{state.error?.message ?? ''}</div>
<button
  data-testid="invoke"
  onclick={() => {
    if (params !== undefined) {
      state.invoke(params);
    } else {
      state.invoke();
    }
  }}>Invoke</button
>
