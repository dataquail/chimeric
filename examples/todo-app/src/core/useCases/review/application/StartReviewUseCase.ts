import { createReview } from 'src/core/domain/review/entities/Review';
import { DefineChimericAsync, ChimericAsyncFactory } from '@chimeric/react';
import { IReviewRepository } from 'src/core/domain/review/ports/IReviewRepository';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

export type StartReviewUseCase = {
  execute: DefineChimericAsync<() => Promise<void>>;
};

export const createStartReviewUseCase = (
  reviewRepository: IReviewRepository,
  activeTodoService: IActiveTodoService,
  savedForLaterTodoService: ISavedForLaterTodoService,
): StartReviewUseCase => {
  const _execute = async () => {
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
  };

  return {
    execute: ChimericAsyncFactory(_execute),
  };
};
