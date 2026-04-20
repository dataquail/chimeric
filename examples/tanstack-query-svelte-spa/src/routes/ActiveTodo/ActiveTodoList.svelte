<script lang="ts">
  import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
  import ActiveTodoCard from './ActiveTodoCard.svelte';

  const query = activeTodoService.getAll.useHook();
</script>

{#if query.isPending}
  <div class="loader-container">
    <div class="loader"></div>
  </div>
{:else if query.isError}
  <p>Error loading todos</p>
{:else if query.data}
  <div class="scroll-area">
    {#each query.data as todo (todo.id)}
      <ActiveTodoCard {todo} />
    {/each}
    {#if query.data.length === 0}
      <p style="color: var(--text-dimmed); text-align: center; padding: 2rem;">
        No active todos. Add one above!
      </p>
    {/if}
  </div>
{/if}
