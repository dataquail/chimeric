import { inject, injectable } from 'inversify';
import { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { Review } from 'src/core/domain/review/entities/Review';
import { SavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { ChimericAsyncReadFactory } from '@chimeric/core';
import { makeMetaAggregator } from '@chimeric/utilities';
import { TodoUnderReview } from 'src/core/domain/review/viewModels/out/TodoUnderReview';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type GetTodosUnderReviewUseCaseChimaric = ChimericAsyncReadFactory<
  () => Promise<TodoUnderReview[]>,
  Error
>;

@injectable()
export class GetTodosUnderReviewUseCase
  implements GetTodosUnderReviewUseCaseChimaric
{
  public readonly useAsync: GetTodosUnderReviewUseCaseChimaric['useAsync'];
  public readonly call: GetTodosUnderReviewUseCaseChimaric['call'];
  public readonly errorHelpers: GetTodosUnderReviewUseCaseChimaric['errorHelpers'];

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
    this.useAsync = this.useAsyncImpl;
    this.call = this.callImpl;
    this.errorHelpers = {};
  }

  private useAsyncImpl() {
    const activeTodoListMeta = this.activeTodoService.getAll.useQuery();
    const savedForLaterTodoListMeta =
      this.savedForLaterTodoService.getAll.useQuery();
    const review = this.reviewRepository.get.use();

    return makeMetaAggregator(
      [activeTodoListMeta, savedForLaterTodoListMeta],
      (metaList, context) => {
        const [activeTodoList, savedForLaterTodoList] = metaList;

        if (!activeTodoList || !savedForLaterTodoList || !context.review) {
          return [];
        }

        return this.execute(
          activeTodoList,
          savedForLaterTodoList,
          context.review,
        );
      },
      { review },
    );
  }

  private async callImpl() {
    const activeTodoList = await this.activeTodoService.getAll.call();
    const savedForLaterTodoList =
      await this.savedForLaterTodoService.getAll.call();
    const review = this.reviewRepository.get.call();

    if (!review) {
      return [];
    }

    return this.execute(activeTodoList, savedForLaterTodoList, review);
  }

  private execute(
    activeTodoList: ActiveTodo[],
    savedForLaterTodoList: SavedForLaterTodo[],
    review: Review,
  ) {
    return review.todoIdList.reduce((acc, todoUnderReviewId) => {
      const previouslyReviewedTodo =
        this.reviewedTodoRepository.getOneById.call({
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
