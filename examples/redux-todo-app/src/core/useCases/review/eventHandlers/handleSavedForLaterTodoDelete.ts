import { SavedForLaterTodoDeletedEvent } from 'src/core/domain/savedForLaterTodo/events/SavedForLaterTodoDeletedEvent';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { reviewedTodoRepository } from 'src/core/infrastructure/repositories/ReviewedTodoRepository';

export const handleSavedForLaterTodoDelete = (event: unknown) => {
  if (event instanceof SavedForLaterTodoDeletedEvent) {
    const review = reviewRepository.get();

    if (review) {
      reviewRepository.save({
        createdAt: review.createdAt,
        todoIdList: review.todoIdList.filter(
          (todoId) => todoId !== event.payload.id,
        ),
      });
    }

    reviewedTodoRepository.delete({ id: event.payload.id });
  }
};
