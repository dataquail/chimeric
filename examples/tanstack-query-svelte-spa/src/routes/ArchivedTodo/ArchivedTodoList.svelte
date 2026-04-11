<script lang="ts">
  import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
  import ArchivedTodoCard from './ArchivedTodoCard.svelte';

  const query = archivedTodoService.getAll.useHook();
</script>

{#if query.isPending}
  <div class="loader-container">
    <div class="loader"></div>
  </div>
{:else if query.isError}
  <p>Error loading archived todos</p>
{:else if query.data}
  <div class="scroll-area">
    {#each query.data as todo (todo.id)}
      <ArchivedTodoCard {todo} />
    {/each}
    {#if query.data.length === 0}
      <p style="color: var(--text-dimmed); text-align: center; padding: 2rem;">
        No archived todos yet. Archive completed todos from the Active Todos page.
      </p>
    {/if}
  </div>
{/if}
