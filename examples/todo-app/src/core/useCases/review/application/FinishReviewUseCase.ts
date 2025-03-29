import { inject, injectable } from 'inversify';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';

@injectable()
export class FinishReviewUseCase {
  constructor(
    @inject(InjectionSymbol('IReviewRepository'))
    private readonly reviewRepository: InjectionType<'IReviewRepository'>,
    @inject(InjectionSymbol('IReviewedTodoRepository'))
    private readonly reviewedTodoRepository: InjectionType<'IReviewedTodoRepository'>,
  ) {}

  public execute() {
    const review = this.reviewRepository.get();

    if (!review) {
      throw new Error('No review found');
    }

    const reviewedTodoList = review.todoIdList.map((todoId) =>
      createReviewedTodo(todoId),
    );

    this.reviewedTodoRepository.saveMany(reviewedTodoList);
    this.reviewRepository.delete();
  }
}
