<script lang="ts">
  import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
  import { mapArchivedTodoDtoToArchivedTodo } from 'src/core/domain/archivedTodo/entities/ArchivedTodo';
  import ArchivedTodoCard from './ArchivedTodoCard.svelte';

  const query = archivedTodoService.getAll.useHook();

  const archivedTodos = $derived(
    query.data?.pages.flatMap((page) =>
      page.list.map(mapArchivedTodoDtoToArchivedTodo),
    ) ?? [],
  );
</script>

{#if query.isPending}
  <div class="loader-container">
    <div class="loader"></div>
  </div>
{:else if query.isError}
  <p>Error loading archived todos</p>
{:else}
  <div class="scroll-area">
    {#each archivedTodos as todo (todo.id)}
      <ArchivedTodoCard {todo} />
    {/each}
    {#if archivedTodos.length === 0}
      <p style="color: var(--text-dimmed); text-align: center; padding: 2rem;">
        No archived todos yet. Archive completed todos from the Active Todos page.
      </p>
    {/if}
    {#if query.hasNextPage}
      <div class="flex-center">
        <button
          type="button"
          class="btn btn-light"
          onclick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {#if query.isFetchingNextPage}
            <span class="loader loader-sm"></span>
          {:else}
            Load More
          {/if}
        </button>
      </div>
    {/if}
  </div>
{/if}
