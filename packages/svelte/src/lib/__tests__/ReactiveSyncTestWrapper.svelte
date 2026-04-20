<script lang="ts">
  import type { ReactiveSyncBox } from '../Sync/types';

  // Local, permissive shape for the hook under test. Using `ReactiveSync<any, ...>`
  // collapses the useHook signature to zero args (because `[any] extends [void]`),
  // which makes passing `params` a type error. This avoids that.
  type AnyReactiveSync = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useHook: (params?: any) => ReactiveSyncBox<unknown>;
  };

  let {
    reactiveSync,
    params = undefined,
  }: {
    reactiveSync: AnyReactiveSync;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any;
  } = $props();

  // svelte-ignore state_referenced_locally
  const state =
    params !== undefined ? reactiveSync.useHook(params) : reactiveSync.useHook();
</script>

<div data-testid="current">{state.current === undefined ? '' : String(state.current)}</div>
