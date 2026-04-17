import { ChimericAsyncFactory } from '@chimeric/svelte';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { reviewStore } from 'src/core/infrastructure/repositories/ReviewRepository/index.svelte';
import { createReview } from 'src/core/domain/review/entities/Review';

export const startReviewUseCase = ChimericAsyncFactory(async () => {
  const activeTodoList = await activeTodoService.getAll();

  const todosToReviewIdList: string[] = activeTodoList
    .filter((activeTodo) => activeTodo.completedAt)
    .map((activeTodo) => activeTodo.id);

  const review = createReview(todosToReviewIdList);
  reviewStore.save(review);
});
