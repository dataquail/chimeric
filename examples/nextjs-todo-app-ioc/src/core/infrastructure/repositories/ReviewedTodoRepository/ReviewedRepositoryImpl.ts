import { injectable } from 'inversify';
import { IReviewedTodoRepository } from '@/core/domain/review/ports/IReviewedTodoRepository';
import {
  ReviewedTodoRecord,
  ReviewedTodoStore,
  useReviewedTodoStore,
} from './reviewedTodoStore';
import { ReviewedTodo } from '@/core/domain/review/entities/ReviewedTodo';
import { CreateChimericSyncFactory } from '@chimeric/react';

const ChimericSyncFactory = CreateChimericSyncFactory<ReviewedTodoStore>({
  getState: () => useReviewedTodoStore.getState(),
  useSelector: useReviewedTodoStore,
});

const toDomain = (record: ReviewedTodoRecord): ReviewedTodo => {
  return {
    id: record.id,
    lastReviewedAt: new Date(record.lastReviewedAt),
  };
};

@injectable()
export class ReviewedTodoRepositoryImpl implements IReviewedTodoRepository {
  public readonly save: IReviewedTodoRepository['save'];
  public readonly delete: IReviewedTodoRepository['delete'];
  public readonly saveMany: IReviewedTodoRepository['saveMany'];
  public readonly getOneById: IReviewedTodoRepository['getOneById'];

  constructor() {
    this.save = this.saveImpl;
    this.delete = this.deleteImpl;
    this.saveMany = this.saveManyImpl;
    this.getOneById = this.getOneByIdImpl;
  }

  private saveImpl(reviewedTodo: ReviewedTodo) {
    useReviewedTodoStore.getState().saveReviewedTodo(reviewedTodo);
  }

  private deleteImpl(args: { id: string }) {
    useReviewedTodoStore.getState().deleteReviewedTodo(args);
  }

  private saveManyImpl(reviewedTodos: ReviewedTodo[]) {
    useReviewedTodoStore.getState().saveManyReviewedTodos(reviewedTodos);
  }

  private readonly getOneByIdImpl: IReviewedTodoRepository['getOneById'] =
    ChimericSyncFactory({
      selector: (args: { id: string }) => (state) => state.dict[args.id],
      reducer: (record) => (record ? toDomain(record) : undefined),
    });
}
