<script lang="ts">
  import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
  import { startReviewUseCase } from 'src/core/useCases/review/startReviewUseCase';
  import { finishReviewUseCase } from 'src/core/useCases/review/finishReviewUseCase';
  import { reviewStore } from 'src/core/infrastructure/repositories/ReviewRepository/index.svelte';
  import { formatDate } from 'src/utils/formatDate';

  const activeTodosQuery = activeTodoService.getAll.useHook();
  const startReview = startReviewUseCase.useHook();
  const finishReview = finishReviewUseCase.useHook();
  const uncompleteOne = activeTodoService.uncompleteOne.useHook();

  const hasStartedReview = $derived(!!reviewStore.review);

  const todosUnderReview = $derived(
    reviewStore.review
      ? reviewStore.review.todoIdList.reduce(
          (acc: typeof activeTodosQuery.data, todoId: string) => {
            const todo = activeTodosQuery.data?.find((t) => t.id === todoId);
            if (todo) {
              acc = [...(acc ?? []), todo];
            }
            return acc;
          },
          [],
        )
      : [],
  );
</script>

<div>
  <div class="page-header">
    <h1>Review Completed Todos</h1>
    {#if hasStartedReview}
      <button
        type="button"
        class="btn"
        onclick={() => finishReview.invoke()}
        disabled={finishReview.isPending}
      >
        {#if finishReview.isPending}
          <span class="loader loader-sm"></span>
        {:else}
          Archive & Finish
        {/if}
      </button>
    {:else}
      <button
        type="button"
        class="btn"
        onclick={() => startReview.invoke()}
        disabled={startReview.isPending}
      >
        {#if startReview.isPending}
          <span class="loader loader-sm"></span>
        {:else}
          Start Review
        {/if}
      </button>
    {/if}
  </div>

  {#if !hasStartedReview}
    <p class="text-dimmed" style="padding: 1rem 0;">
      Start a review to see all completed todos. Uncheck any you want to keep
      active. The rest will be archived when you finish.
    </p>
  {/if}

  {#if startReview.isPending || activeTodosQuery.isPending}
    <div class="loader"></div>
  {:else}
    <div class="scroll-area">
      {#each todosUnderReview ?? [] as todo (todo.id)}
        {@const isExempted = !todo.completedAt}
        <div class="todo-card">
          <div
            class="checkbox-card {!isExempted ? 'checked' : ''} {uncompleteOne.isPending ? 'disabled' : ''}"
            role="checkbox"
            aria-checked={!isExempted}
            tabindex="0"
            onclick={() => {
              if (!isExempted && !uncompleteOne.isPending) {
                uncompleteOne.invoke({ id: todo.id });
              }
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' && !isExempted && !uncompleteOne.isPending) {
                uncompleteOne.invoke({ id: todo.id });
              }
            }}
          >
            {#if uncompleteOne.isPending}
              <div class="loader loader-sm" style="margin: 0.5rem;"></div>
            {:else}
              <div class="checkbox-indicator {!isExempted ? 'checked' : ''}"></div>
            {/if}
            <div class="todo-info">
              <h4 class={isExempted ? 'dimmed' : ''}>{todo.title}</h4>
              <span class="text-sm">Created At: {formatDate(todo.createdAt)}</span>
              {#if isExempted}
                <span class="text-sm text-dimmed text-italic">
                  Uncompleted — will not be archived
                </span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
