<script lang="ts">
  import type { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
  import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
  import { formatDate } from 'src/utils/formatDate';

  let { todo }: { todo: ActiveTodo } = $props();

  const completeOne = activeTodoService.completeOne.useHook();
  const uncompleteOne = activeTodoService.uncompleteOne.useHook();
  const deleteOne = activeTodoService.deleteOne.useHook();

  const isLoading = $derived(
    deleteOne.isPending || completeOne.isPending || uncompleteOne.isPending,
  );

  function handleToggle() {
    if (deleteOne.isPending) return;
    if (todo.completedAt) {
      uncompleteOne.invoke({ id: todo.id });
    } else {
      completeOne.invoke({ id: todo.id });
    }
  }
</script>

<div class="todo-card">
  <div
    class="checkbox-card {todo.completedAt ? 'checked' : ''} {deleteOne.isPending ? 'disabled' : ''}"
    role="checkbox"
    aria-checked={!!todo.completedAt}
    tabindex="0"
    onclick={handleToggle}
    onkeydown={(e) => e.key === 'Enter' && handleToggle()}
  >
    {#if isLoading}
      <div class="loader loader-sm" style="margin: 0.25rem;"></div>
    {:else}
      <div class="checkbox-indicator {todo.completedAt ? 'checked' : ''}"></div>
    {/if}
    <div class="todo-info">
      <h4>{todo.title}</h4>
      <span class="text-sm">Created: {formatDate(todo.createdAt)}</span>
      {#if todo.completedAt}
        <span class="text-sm">Completed: {formatDate(todo.completedAt)}</span>
      {/if}
    </div>
  </div>
  <button
    type="button"
    class="icon-btn danger"
    onclick={() => deleteOne.invoke({ id: todo.id })}
    disabled={deleteOne.isPending}
    aria-label="Delete todo"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Z"/>
    </svg>
  </button>
</div>
