<script lang="ts">
  import ArchivedTodoList from './ArchivedTodoList.svelte';
  import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
  import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';

  const activeTodosQuery = activeTodoService.getAll.useHook();
  const archiveCompleted = archivedTodoService.archiveCompleted.useHook();

  async function handleArchiveCompleted() {
    const completedIds =
      activeTodosQuery.data
        ?.filter((t) => t.completedAt !== undefined)
        .map((t) => t.id) ?? [];

    if (completedIds.length === 0) return;

    await archiveCompleted.invoke({ activeTodoIds: completedIds });
  }

  const hasCompleted = $derived(
    (activeTodosQuery.data?.filter((t) => t.completedAt !== undefined).length ??
      0) > 0,
  );
</script>

<div class="page-header">
  <h1>Archived Todos</h1>
  <button
    class="btn"
    onclick={handleArchiveCompleted}
    disabled={archiveCompleted.isPending || !hasCompleted}
  >
    {#if archiveCompleted.isPending}
      <span class="loader loader-sm"></span>
    {:else}
      Archive Completed
    {/if}
  </button>
</div>
<ArchivedTodoList />
