import { createReview } from '@/core/domain/review/entities/Review';
import { DefineChimericAsync, ChimericAsyncFactory } from '@chimeric/react';
import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';
import { ISavedForLaterTodoService } from '@/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

export type StartReviewUseCase = DefineChimericAsync<() => Promise<void>>;

export const createStartReviewUseCase = (
  reviewRepository: IReviewRepository,
  activeTodoService: IActiveTodoService,
  savedForLaterTodoService: ISavedForLaterTodoService,
): StartReviewUseCase => {
  return ChimericAsyncFactory(async () => {
    const activeTodoList = await activeTodoService.getAll();
    const savedForLaterTodoList = await savedForLaterTodoService.getAll();

    const todosToReviewIdList: string[] = [
      ...activeTodoList
        .filter((activeTodo) => !activeTodo.completedAt)
        .map((activeTodo) => activeTodo.id),
      ...savedForLaterTodoList.map((savedForLaterTodo) => savedForLaterTodo.id),
    ];

    const review = createReview(todosToReviewIdList);
    reviewRepository.save(review);
  });
};
