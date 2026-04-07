import { createReview } from '@/core/domain/review/entities/Review';
import { DefineChimericAsync, ChimericAsyncFactory } from '@chimeric/react';
import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';

export type StartReviewUseCase = DefineChimericAsync<() => Promise<void>>;

export const createStartReviewUseCase = (
  reviewRepository: IReviewRepository,
  activeTodoService: IActiveTodoService,
): StartReviewUseCase => {
  return ChimericAsyncFactory(async () => {
    const activeTodoList = await activeTodoService.getAll();

    const todosToReviewIdList: string[] = activeTodoList
      .filter((activeTodo) => activeTodo.completedAt)
      .map((activeTodo) => activeTodo.id);

    const review = createReview(todosToReviewIdList);
    reviewRepository.save(review);
  });
};
