import { TodoUnderReview } from 'src/core/domain/review/viewModels/out/TodoUnderReview';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { savedForLaterTodoService } from 'src/core/infrastructure/services/SavedForLaterTodoService';
import { reviewedTodoRepository } from 'src/core/infrastructure/repositories/ReviewedTodoRepository';
import { ReactiveAsyncReducer } from '@chimeric/rtk-query';

export const getTodosUnderReviewUseCase = ReactiveAsyncReducer().build({
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
