import { IReviewRepository } from '@/core/domain/review/ports/IReviewRepository';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { ActiveTodoDeletedEvent } from '@/core/domain/activeTodo/events/ActiveTodoDeletedEvent';

export const createHandleActiveTodoDelete = (
  reviewRepository: IReviewRepository,
  applicationEventEmitter: IApplicationEventEmitter,
) => {
  const execute = (event: unknown) => {
    if (event instanceof ActiveTodoDeletedEvent) {
      const review = reviewRepository.get();

      if (review) {
        reviewRepository.save({
          createdAt: review.createdAt,
          todoIdList: review.todoIdList.filter(
            (todoId) => todoId !== event.payload.id,
          ),
        });
      }
    }
  };

  applicationEventEmitter.subscribe(execute);

  return { execute };
};
