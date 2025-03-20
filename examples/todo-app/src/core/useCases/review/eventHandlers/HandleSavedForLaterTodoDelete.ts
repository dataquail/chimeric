import { inject, injectable } from 'inversify';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { SavedForLaterTodoDeletedEvent } from 'src/core/domain/savedForLaterTodo/events/SavedForLaterTodoDeletedEvent';

@injectable()
export class HandleSavedForLaterTodoDelete {
  constructor(
    @inject(InjectionSymbol('IReviewRepository'))
    private readonly reviewRepository: InjectionType<'IReviewRepository'>,
    @inject(InjectionSymbol('IReviewedTodoRepository'))
    private readonly reviewedTodoRepository: InjectionType<'IReviewedTodoRepository'>,
    @inject(InjectionSymbol('IApplicationEventEmitter'))
    private readonly applicationEventEmitter: InjectionType<'IApplicationEventEmitter'>,
  ) {
    this.applicationEventEmitter.subscribe(this.execute.bind(this));
  }

  public execute(event: unknown) {
    if (event instanceof SavedForLaterTodoDeletedEvent) {
      const review = this.reviewRepository.get.call();

      if (review) {
        this.reviewRepository.save({
          createdAt: review.createdAt,
          todoIdList: review.todoIdList.filter(
            (todoId) => todoId !== event.payload.id,
          ),
        });
      }

      this.reviewedTodoRepository.delete({ id: event.payload.id });
    }
  }
}
