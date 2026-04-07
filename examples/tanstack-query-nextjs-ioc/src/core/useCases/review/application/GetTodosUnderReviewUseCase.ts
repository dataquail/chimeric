import { DefineReactiveEagerAsync } from '@chimeric/react';
import { TodoUnderReview } from '@/core/domain/review/viewModels/out/TodoUnderReview';
import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';
import { ReactiveAsyncReducer } from '@chimeric/react-query';

export type GetTodosUnderReviewUseCase = DefineReactiveEagerAsync<
  () => Promise<TodoUnderReview[]>,
  Error
>;

export const createGetTodosUnderReviewUseCase = (
  reviewRepository: IReviewRepository,
  activeTodoService: IActiveTodoService,
): GetTodosUnderReviewUseCase =>
  ReactiveAsyncReducer().build({
    serviceList: [
      { service: activeTodoService.getAll },
      { service: reviewRepository.get },
    ],
    reducer: ([activeTodoList, review]) => {
      if (!review) {
        return [];
      }

      return review.todoIdList.reduce((acc, todoUnderReviewId) => {
        const activeTodo = activeTodoList.find(
          (todo) => todo.id === todoUnderReviewId,
        );

        if (!activeTodo) {
          return acc;
        }

        return [
          ...acc,
          {
            id: activeTodo.id,
            title: activeTodo.title,
            createdAt: activeTodo.createdAt,
            completedAt: activeTodo.completedAt,
          },
        ];
      }, [] as TodoUnderReview[]);
    },
  });
