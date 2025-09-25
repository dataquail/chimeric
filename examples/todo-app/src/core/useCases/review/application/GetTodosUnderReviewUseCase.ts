import { inject, injectable } from 'inversify';
import { DefineReactiveEagerAsync } from '@chimeric/react';
import { TodoUnderReview } from 'src/core/domain/review/viewModels/out/TodoUnderReview';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { ReactiveAsyncReducer } from '@chimeric/react-query';

@injectable()
export class GetTodosUnderReviewUseCase {
  public readonly execute: DefineReactiveEagerAsync<
    () => Promise<TodoUnderReview[]>,
    Error
  >;

  constructor(
    @inject(InjectionSymbol('IReviewRepository'))
    private readonly reviewRepository: InjectionType<'IReviewRepository'>,
    @inject(InjectionSymbol('IReviewedTodoRepository'))
    private readonly reviewedTodoRepository: InjectionType<'IReviewedTodoRepository'>,
    @inject(InjectionSymbol('IActiveTodoService'))
    private readonly activeTodoService: InjectionType<'IActiveTodoService'>,
    @inject(InjectionSymbol('ISavedForLaterTodoService'))
    private readonly savedForLaterTodoService: InjectionType<'ISavedForLaterTodoService'>,
  ) {
    this.execute = ReactiveAsyncReducer().build({
      serviceList: [
        { service: this.activeTodoService.getAll },
        { service: this.savedForLaterTodoService.getAll },
        { service: this.reviewRepository.get },
      ],
      reducer: ([activeTodoList, savedForLaterTodoList, review]) => {
        if (!review) {
          return [];
        }

        return review.todoIdList.reduce((acc, todoUnderReviewId) => {
          const previouslyReviewedTodo = this.reviewedTodoRepository.getOneById(
            {
              id: todoUnderReviewId,
            },
          );
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
      },
    });
  }
}
