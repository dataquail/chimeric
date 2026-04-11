<script lang="ts">
  import type { ArchivedTodo } from 'src/core/domain/archivedTodo/entities/ArchivedTodo';
  import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
  import { formatDate } from 'src/utils/formatDate';

  let { todo }: { todo: ArchivedTodo } = $props();

  const unarchiveOne = archivedTodoService.unarchiveOne.useHook();
  const deleteOne = archivedTodoService.deleteOne.useHook();
</script>

<div class="archived-card">
  <div class="archived-card-inner">
    <h4>{todo.title}</h4>
    <span class="text-sm">Completed: {formatDate(todo.completedAt)}</span>
    <span class="text-sm">Archived: {formatDate(todo.archivedAt)}</span>
  </div>
  <button
    type="button"
    class="btn btn-light"
    onclick={() => unarchiveOne.invoke({ id: todo.id })}
    disabled={unarchiveOne.isPending}
    style="font-size: 0.8rem; padding: 0.4rem 0.75rem; align-self: center;"
  >
    {#if unarchiveOne.isPending}
      <span class="loader loader-sm"></span>
    {:else}
      Unarchive
    {/if}
  </button>
  <button
    type="button"
    class="icon-btn danger"
    onclick={() => deleteOne.invoke({ id: todo.id })}
    disabled={deleteOne.isPending}
    aria-label="Delete archived todo"
    style="align-self: center;"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Z"/>
    </svg>
  </button>
</div>
