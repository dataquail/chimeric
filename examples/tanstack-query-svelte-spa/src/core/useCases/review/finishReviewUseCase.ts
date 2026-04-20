import { ChimericAsyncFactory } from '@chimeric/svelte';
import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository/index.svelte';

export const finishReviewUseCase = ChimericAsyncFactory(async () => {
  const review = reviewRepository.get();

  if (!review) {
    throw new Error('No review found');
  }

  await archivedTodoService.archiveCompleted({
    activeTodoIds: review.todoIdList,
  });

  reviewRepository.delete();
});
