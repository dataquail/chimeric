import { DefineReactiveEagerAsync } from '@chimeric/react';
import { TodoUnderReview } from '@/core/domain/review/viewModels/out/TodoUnderReview';
import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IReviewedTodoRepository } from '@/core/domain/review/ports/IReviewedTodoRepository';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';
import { ISavedForLaterTodoService } from '@/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { ReactiveAsyncReducer } from '@chimeric/react-query';

export type GetTodosUnderReviewUseCase = DefineReactiveEagerAsync<
  () => Promise<TodoUnderReview[]>,
  Error
>;

export const createGetTodosUnderReviewUseCase = (
  reviewRepository: IReviewRepository,
  reviewedTodoRepository: IReviewedTodoRepository,
  activeTodoService: IActiveTodoService,
  savedForLaterTodoService: ISavedForLaterTodoService,
): GetTodosUnderReviewUseCase =>
  ReactiveAsyncReducer().build({
    serviceList: [
      { service: activeTodoService.getAll },
      { service: savedForLaterTodoService.getAll },
      { service: reviewRepository.get },
    ],
    reducer: ([activeTodoList, savedForLaterTodoList, review]) => {
      if (!review) {
        return [];
      }

      return review.todoIdList.reduce((acc, todoUnderReviewId) => {
        const previouslyReviewedTodo = reviewedTodoRepository.getOneById({
          id: todoUnderReviewId,
        });
        const activeTodo = activeTodoList.find(
          (todo) => todo.id === todoUnderReviewId,
        );
        const savedForLaterTodo = savedForLaterTodoList.find(
          (todo) => todo.id === todoUnderReviewId,
        );

        // If the todoUnderReview does not have a counterpart in the active or saved for later list,
        // then the client state has fallen out of sync with the server stateand we should ignore it.
        if (!activeTodo && !savedForLaterTodo) {
          return acc;
        }

        if (activeTodo) {
          return [
            ...acc,
            {
              id: activeTodo.id,
              title: activeTodo.title,
              createdAt: activeTodo.createdAt,
              completedAt: activeTodo.completedAt,
              lastReviewedAt: previouslyReviewedTodo?.lastReviewedAt,
            },
          ];
        } else if (savedForLaterTodo) {
          return [
            ...acc,
            {
              id: savedForLaterTodo.id,
              title: savedForLaterTodo.title,
              createdAt: savedForLaterTodo.createdAt,
              completedAt: undefined,
              lastReviewedAt: previouslyReviewedTodo?.lastReviewedAt,
            },
          ];
        }

        return acc;
      }, [] as TodoUnderReview[]);
    },
  });
