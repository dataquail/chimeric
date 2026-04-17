<script lang="ts">
  import type { ArchivedTodo } from 'src/core/domain/archivedTodo/entities/ArchivedTodo';
  import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
  import { formatDate } from 'src/utils/formatDate';

  let { todo }: { todo: ArchivedTodo } = $props();

  const unarchiveOne = archivedTodoService.unarchiveOne.useHook();
  const deleteOne = archivedTodoService.deleteOne.useHook();

  let menuOpen = $state(false);

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.menu-wrapper')) {
      menuOpen = false;
    }
  }

  $effect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  });
</script>

<div class="archived-card">
  <div class="archived-card-info">
    {#if deleteOne.isPending || unarchiveOne.isPending}
      <div class="loader loader-sm"></div>
    {/if}
    <h4>{todo.title}</h4>
    <span class="text-sm">Completed At: {formatDate(todo.completedAt)}</span>
    <span class="text-sm">Archived At: {formatDate(todo.archivedAt)}</span>
  </div>
  <div class="menu-wrapper">
    <button
      type="button"
      class="menu-trigger"
      onclick={() => (menuOpen = !menuOpen)}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="13" cy="8" r="1.5" />
      </svg>
    </button>
    {#if menuOpen}
      <div class="menu-dropdown">
        <div class="menu-label">Archived Todo Options</div>
        <button
          type="button"
          class="menu-item"
          onclick={() => {
            unarchiveOne.invoke({ id: todo.id });
            menuOpen = false;
          }}
        >
          Unarchive
        </button>
        <button
          type="button"
          class="menu-item danger"
          onclick={() => {
            deleteOne.invoke({ id: todo.id });
            menuOpen = false;
          }}
        >
          Delete
        </button>
      </div>
    {/if}
  </div>
</div>
