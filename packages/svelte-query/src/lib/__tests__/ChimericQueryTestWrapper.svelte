<script lang="ts">
  import type { ChimericQuery } from '../Query/chimeric/types';

  let {
    chimericQuery,
    params = undefined,
    enabled = true,
  }: {
    chimericQuery: ChimericQuery<any, any, any, any>;
    params?: any;
    enabled?: boolean;
  } = $props();

  const result =
    params !== undefined
      ? chimericQuery.useHook(params, { options: { enabled } })
      : chimericQuery.useHook({ options: { enabled } });
</script>

<div data-testid="isIdle">{String(result.isIdle)}</div>
<div data-testid="isPending">{String(result.isPending)}</div>
<div data-testid="isSuccess">{String(result.isSuccess)}</div>
<div data-testid="isError">{String(result.isError)}</div>
<div data-testid="data">{result.data !== undefined ? String(result.data) : ''}</div>
<div data-testid="error">{result.error?.message ?? ''}</div>
