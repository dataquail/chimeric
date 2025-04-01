import { inject, injectable } from 'inversify';
import { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { Review } from 'src/core/domain/review/entities/Review';
import { SavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import {
  // DefineChimericAsyncRead,
  // fuseChimericAsyncRead,
  DefineReactiveAsyncRead,
  createReactiveAsyncRead,
} from '@chimeric/core';
import { MetaAggregatorFactory } from '@chimeric/utilities';
import { TodoUnderReview } from 'src/core/domain/review/viewModels/out/TodoUnderReview';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

@injectable()
export class GetTodosUnderReviewUseCase {
  // public readonly execute: DefineChimericAsyncRead<
  //   () => Promise<TodoUnderReview[]>,
  //   Error
  // >;
  public readonly execute: DefineReactiveAsyncRead<
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
    // this.execute = fuseChimericAsyncRead({
    //   idiomatic: this.idiomaticImpl.bind(this),
    //   reactive: this.reactiveImpl.bind(this),
    // });

    this.execute = createReactiveAsyncRead(this.reactiveImpl.bind(this));
  }

  private reactiveImpl() {
    const activeTodoListMeta = this.activeTodoService.getAll.useQuery();
    const savedForLaterTodoListMeta =
      this.savedForLaterTodoService.getAll.useQuery();
    const review = this.reviewRepository.get.use();

    return MetaAggregatorFactory(
      [activeTodoListMeta, savedForLaterTodoListMeta],
      (metaList) => {
        const [activeTodoList, savedForLaterTodoList] = metaList;

        if (!activeTodoList || !savedForLaterTodoList || !review) {
          return [];
        }

        return this._execute(activeTodoList, savedForLaterTodoList, review);
      },
    );
  }

  // private async idiomaticImpl() {
  //   const activeTodoList = await this.activeTodoService.getAll();
  //   const savedForLaterTodoList = await this.savedForLaterTodoService.getAll();
  //   const review = this.reviewRepository.get();

  //   if (!review) {
  //     return [];
  //   }

  //   return this._execute(activeTodoList, savedForLaterTodoList, review);
  // }

  private _execute(
    activeTodoList: ActiveTodo[],
    savedForLaterTodoList: SavedForLaterTodo[],
    review: Review,
  ) {
    return review.todoIdList.reduce((acc, todoUnderReviewId) => {
      const previouslyReviewedTodo = this.reviewedTodoRepository.getOneById({
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
  }
}
