import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { reviewedTodoRepository } from 'src/core/infrastructure/repositories/ReviewedTodoRepository';

export const finishReviewUseCase = () => {
  const review = reviewRepository.get();

  if (!review) {
    throw new Error('No review found');
  }

  const reviewedTodoList = review.todoIdList.map((todoId) =>
    createReviewedTodo(todoId),
  );

  reviewedTodoRepository.saveMany(reviewedTodoList);
  reviewRepository.delete();
};
