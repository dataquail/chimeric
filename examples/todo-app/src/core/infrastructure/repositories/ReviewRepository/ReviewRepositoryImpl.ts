import { IReviewRepository } from 'src/core/domain/review/ports/IReviewRepository';
import { Review } from 'src/core/domain/review/entities/Review';
import { saveReview, deleteReview, ReviewRecord } from './reviewStore';
import { useAppSelector } from 'src/lib/store';
import { IAppStoreProvider } from 'src/core/global/appStoreProvider/IAppStoreProvider';
import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/react';

const toDomain = (record: ReviewRecord): Review => ({
  createdAt: new Date(record.createdAt),
  todoIdList: record.todoIdList,
});

export const createReviewRepository = (
  appStoreProvider: IAppStoreProvider,
): IReviewRepository => ({
  save: (review: Review) => {
    appStoreProvider.get().dispatch(saveReview(review));
  },
  delete: () => {
    appStoreProvider.get().dispatch(deleteReview());
  },
  get: fuseChimericSync({
    idiomatic: createIdiomaticSync(() => {
      const record = appStoreProvider.get().getState().todo.review.record;
      return record ? toDomain(record) : undefined;
    }),
    reactive: createReactiveSync(() => {
      const record = useAppSelector((state) => state.todo.review.record);
      return record ? toDomain(record) : undefined;
    }),
  }),
});
