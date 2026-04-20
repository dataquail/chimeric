<script lang="ts">
  import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';

  let title = $state('');
  let isSubmitting = $state(false);
  const createOne = activeTodoService.createOne.useHook();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    isSubmitting = true;
    try {
      await createOne.invoke({ title: title.trim() });
      title = '';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form class="form-row" onsubmit={handleSubmit}>
  <input
    class="text-input"
    type="text"
    placeholder="Enter your todo"
    bind:value={title}
    disabled={isSubmitting}
  />
  <button class="btn" type="submit" disabled={isSubmitting || !title.trim()}>
    {#if isSubmitting}
      <span class="loader loader-sm"></span>
    {:else}
      Add
    {/if}
  </button>
</form>
