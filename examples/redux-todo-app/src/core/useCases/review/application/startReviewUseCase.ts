import { createReview } from 'src/core/domain/review/entities/Review';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { savedForLaterTodoService } from 'src/core/infrastructure/services/SavedForLaterTodoService';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { ChimericAsyncFactory } from '@chimeric/react';

export const startReviewUseCase = ChimericAsyncFactory(async () => {
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
