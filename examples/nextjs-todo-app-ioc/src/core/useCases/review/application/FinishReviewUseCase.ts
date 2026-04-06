import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IReviewedTodoRepository } from '@/core/domain/review/ports/IReviewedTodoRepository';
import { createReviewedTodo } from '@/core/domain/review/entities/ReviewedTodo';

export type FinishReviewUseCase = () => void;

export const createFinishReviewUseCase = (
  reviewRepository: IReviewRepository,
  reviewedTodoRepository: IReviewedTodoRepository,
): FinishReviewUseCase => () => {
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
