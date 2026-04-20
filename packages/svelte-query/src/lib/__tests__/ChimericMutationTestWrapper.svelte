<script lang="ts">
  import type { ChimericMutation } from '../Mutation/chimeric/types';

  let {
    chimericMutation,
    invokeParams = undefined,
  }: {
    chimericMutation: ChimericMutation<any, any, any>;
    invokeParams?: any;
  } = $props();

  const state = chimericMutation.useHook();
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
    if (invokeParams !== undefined) {
      state.invoke(invokeParams);
    } else {
      state.invoke();
    }
  }}>Invoke</button
>
