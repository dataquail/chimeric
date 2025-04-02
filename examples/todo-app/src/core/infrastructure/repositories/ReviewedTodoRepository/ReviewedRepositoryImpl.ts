import { inject, injectable } from 'inversify';
import { useAppSelector } from 'src/lib/store';
import { IReviewedTodoRepository } from 'src/core/domain/review/ports/IReviewedTodoRepository';
import {
  deleteReviewedTodo,
  ReviewedTodoRecord,
  saveManyReviewedTodos,
  saveReviewedTodo,
} from './reviewedTodoStore';
import { ReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { fuseChimericRead } from '@chimeric/core';

@injectable()
export class ReviewedTodoRepositoryImpl implements IReviewedTodoRepository {
  public readonly save: IReviewedTodoRepository['save'];
  public readonly delete: IReviewedTodoRepository['delete'];
  public readonly saveMany: IReviewedTodoRepository['saveMany'];
  public readonly getOneById: IReviewedTodoRepository['getOneById'];

  constructor(
    @inject(InjectionSymbol('IAppStoreProvider'))
    private readonly appStoreProvider: InjectionType<'IAppStoreProvider'>,
  ) {
    this.save = this.saveImpl;
    this.delete = this.deleteImpl;
    this.saveMany = this.saveManyImpl;
    this.getOneById = this.getOneByIdImpl;
  }

  private saveImpl(reviewedTodo: ReviewedTodo) {
    this.appStoreProvider.get().dispatch(saveReviewedTodo(reviewedTodo));
  }

  private deleteImpl(args: { id: string }) {
    this.appStoreProvider.get().dispatch(deleteReviewedTodo(args));
  }

  private saveManyImpl(reviewedTodos: ReviewedTodo[]) {
    this.appStoreProvider.get().dispatch(saveManyReviewedTodos(reviewedTodos));
  }

  private readonly getOneByIdImpl: IReviewedTodoRepository['getOneById'] =
    fuseChimericRead({
      idiomatic: (args) => {
        const record = this.appStoreProvider.get().getState().todo.reviewedTodo[
          args.id
        ];
        return record ? ReviewedTodoRepositoryImpl.toDomain(record) : undefined;
      },
      reactive: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const record = useAppSelector(
          (state) => state.todo.reviewedTodo[args.id],
        );
        return record ? ReviewedTodoRepositoryImpl.toDomain(record) : undefined;
      },
    });

  private static toDomain(record: ReviewedTodoRecord): ReviewedTodo {
    return {
      id: record.id,
      lastReviewedAt: new Date(record.lastReviewedAt),
    };
  }
}
