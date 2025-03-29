import { inject, injectable } from 'inversify';
import { createReview } from 'src/core/domain/review/entities/Review';
import { DefineChimericPromise } from '@chimeric/core';
import { ChimericPromiseFactory } from '@chimeric/utilities';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

@injectable()
export class StartReviewUseCase {
  public readonly execute: DefineChimericPromise<() => Promise<void>, Error>;

  constructor(
    @inject(InjectionSymbol('IReviewRepository'))
    private readonly reviewRepository: InjectionType<'IReviewRepository'>,
    @inject(InjectionSymbol('IActiveTodoService'))
    private readonly activeTodoService: InjectionType<'IActiveTodoService'>,
    @inject(InjectionSymbol('ISavedForLaterTodoService'))
    private readonly savedForLaterTodoService: InjectionType<'ISavedForLaterTodoService'>,
  ) {
    this.execute = ChimericPromiseFactory({
      promiseFn: this._execute.bind(this),
    });
  }

  private async _execute() {
    const activeTodoList = await this.activeTodoService.getAll();
    const savedForLaterTodoList = await this.savedForLaterTodoService.getAll();

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
