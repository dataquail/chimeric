import { IReviewRepository } from 'src/core/domain/review/ports/IReviewRepository';
import { IReviewedTodoRepository } from 'src/core/domain/review/ports/IReviewedTodoRepository';
import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';

export type FinishReviewUseCase = {
  execute: () => void;
};

export const createFinishReviewUseCase = (
  reviewRepository: IReviewRepository,
  reviewedTodoRepository: IReviewedTodoRepository,
): FinishReviewUseCase => ({
  execute: () => {
    const review = reviewRepository.get();

    if (!review) {
      throw new Error('No review found');
    }

    const reviewedTodoList = review.todoIdList.map((todoId) =>
      createReviewedTodo(todoId),
    );

    reviewedTodoRepository.saveMany(reviewedTodoList);
    reviewRepository.delete();
  },
});
