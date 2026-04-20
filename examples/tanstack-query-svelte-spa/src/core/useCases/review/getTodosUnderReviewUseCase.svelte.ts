import { ReactiveAsyncReducer } from '@chimeric/svelte-query';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository/index.svelte';
import type { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';

export type TodoUnderReview = ActiveTodo;

export const getTodosUnderReviewUseCase = ReactiveAsyncReducer().build({
  serviceList: [
    { service: activeTodoService.getAll },
    { service: reviewRepository.get },
  ],
  reducer: ([activeTodoList, review]): TodoUnderReview[] => {
    if (!review) {
      return [];
    }

    return review.todoIdList.reduce((acc: TodoUnderReview[], todoId: string) => {
      const todo = activeTodoList?.find((t) => t.id === todoId);
      if (!todo) {
        return acc;
      }
      return [...acc, todo];
    }, []);
  },
});
