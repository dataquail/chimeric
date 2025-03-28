import { inject, injectable } from 'inversify';
import { createReview } from 'src/core/domain/review/entities/Review';
import { ChimericPromiseFactory } from '@chimeric/core';
import { makeChimericPromise } from '@chimeric/utilities';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type StartReviewUseCaseChimeric = ChimericPromiseFactory<
  () => Promise<void>,
  Error
>;

@injectable()
export class StartReviewUseCase implements StartReviewUseCaseChimeric {
  public readonly usePromise: StartReviewUseCaseChimeric['usePromise'];
  public readonly call: StartReviewUseCaseChimeric['call'];
  public readonly errorHelpers: StartReviewUseCaseChimeric['errorHelpers'];

  constructor(
    @inject(InjectionSymbol('IReviewRepository'))
    private readonly reviewRepository: InjectionType<'IReviewRepository'>,
    @inject(InjectionSymbol('IActiveTodoService'))
    private readonly activeTodoService: InjectionType<'IActiveTodoService'>,
    @inject(InjectionSymbol('ISavedForLaterTodoService'))
    private readonly savedForLaterTodoService: InjectionType<'ISavedForLaterTodoService'>,
  ) {
    const chimericPromise = makeChimericPromise({
      promiseFn: this.execute.bind(this),
      errorHelpers: {},
    });
    this.usePromise = chimericPromise.usePromise;
    this.call = chimericPromise.call;
    this.errorHelpers = chimericPromise.errorHelpers;
  }

  private async execute() {
    const activeTodoList = await this.activeTodoService.getAll.call();
    const savedForLaterTodoList =
      await this.savedForLaterTodoService.getAll.call();

    const todosToReviewIdList: string[] = [
      ...activeTodoList
        .filter((activeTodo) => !activeTodo.completedAt)
        .map((activeTodo) => activeTodo.id),
      ...savedForLaterTodoList.map((savedForLaterTodo) => savedForLaterTodo.id),
    ];

    const review = createReview(todosToReviewIdList);
    this.reviewRepository.save(review);
  }
}
