import { inject, injectable } from 'inversify';
import { IReviewRepository } from 'src/core/domain/review/ports/IReviewRepository';
import { Review } from 'src/core/domain/review/entities/Review';
import { saveReview, deleteReview, ReviewRecord } from './reviewStore';
import { useAppSelector } from 'src/lib/store';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { fuseChimericSync } from '@chimeric/core';
@injectable()
export class ReviewRepositoryImpl implements IReviewRepository {
  public readonly save: IReviewRepository['save'];
  public readonly delete: IReviewRepository['delete'];
  public readonly get: IReviewRepository['get'];

  constructor(
    @inject(InjectionSymbol('IAppStoreProvider'))
    private readonly appStoreProvider: InjectionType<'IAppStoreProvider'>,
  ) {
    this.save = this.saveImpl;
    this.delete = this.deleteImpl;
    this.get = this.getImpl;
  }

  private saveImpl(review: Review) {
    this.appStoreProvider.get().dispatch(saveReview(review));
  }

  private deleteImpl() {
    this.appStoreProvider.get().dispatch(deleteReview());
  }

  private readonly getImpl: IReviewRepository['get'] = fuseChimericSync({
    idiomatic: () => {
      const record = this.appStoreProvider.get().getState().todo.review.record;
      return record ? ReviewRepositoryImpl.toDomain(record) : undefined;
    },
    reactive: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const record = useAppSelector((state) => state.todo.review.record);
      return record ? ReviewRepositoryImpl.toDomain(record) : undefined;
    },
  });

  private static toDomain(record: ReviewRecord): Review {
    return {
      createdAt: new Date(record.createdAt),
      todoIdList: record.todoIdList,
    };
  }
}
