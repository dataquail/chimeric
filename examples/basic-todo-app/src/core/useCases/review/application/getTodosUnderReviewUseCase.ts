import { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { Review } from 'src/core/domain/review/entities/Review';
import { SavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import {
  createReactiveEagerAsync,
  MetaAggregatorFactory,
} from '@chimeric/react';
import { TodoUnderReview } from 'src/core/domain/review/viewModels/out/TodoUnderReview';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { savedForLaterTodoService } from 'src/core/infrastructure/services/SavedForLaterTodoService';
import { reviewedTodoRepository } from 'src/core/infrastructure/repositories/ReviewedTodoRepository';

const _reactiveImpl = () => {
  const activeTodoListMeta = activeTodoService.getAll.use();
  const savedForLaterTodoListMeta = savedForLaterTodoService.getAll.use();
  const review = reviewRepository.get.use();

  return MetaAggregatorFactory(
    [activeTodoListMeta, savedForLaterTodoListMeta],
    (metaList) => {
      const [activeTodoList, savedForLaterTodoList] = metaList;

      if (!activeTodoList || !savedForLaterTodoList || !review) {
        return [];
      }

      return _execute(activeTodoList, savedForLaterTodoList, review);
    },
  );
};

const _execute = (
  activeTodoList: ActiveTodo[],
  savedForLaterTodoList: SavedForLaterTodo[],
  review: Review,
) => {
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
          isPrioritized: activeTodo.isPrioritized,
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
          isPrioritized: null,
          lastReviewedAt: previouslyReviewedTodo?.lastReviewedAt,
        },
      ];
    }

    return acc;
  }, [] as TodoUnderReview[]);
};

export const getTodosUnderReviewUseCase =
  createReactiveEagerAsync(_reactiveImpl);
