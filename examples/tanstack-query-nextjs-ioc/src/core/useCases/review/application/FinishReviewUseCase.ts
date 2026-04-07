import { DefineChimericAsync, ChimericAsyncFactory } from '@chimeric/react';
import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IArchivedTodoService } from '@/core/domain/archivedTodo/ports/IArchivedTodoService';

export type FinishReviewUseCase = DefineChimericAsync<() => Promise<void>>;

export const createFinishReviewUseCase = (
  reviewRepository: IReviewRepository,
  archivedTodoService: IArchivedTodoService,
): FinishReviewUseCase => {
  return ChimericAsyncFactory(async () => {
    const review = reviewRepository.get();

    if (!review) {
      throw new Error('No review found');
    }

    await archivedTodoService.archiveCompleted({
      activeTodoIds: review.todoIdList,
    });

    reviewRepository.delete();
  });
};
