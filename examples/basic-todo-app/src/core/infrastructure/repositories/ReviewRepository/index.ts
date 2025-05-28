import { Review } from 'src/core/domain/review/entities/Review';
import { saveReview, deleteReview, ReviewRecord } from './reviewStore';
import { useAppSelector } from 'src/lib/store';
import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/react';
import { appStore } from 'src/core/global/appStore';
import { IReviewRepository } from 'src/core/domain/review/ports/IReviewRepository';

export const reviewRepository: IReviewRepository = {
  save: (review: Review) => {
    appStore.dispatch(saveReview(review));
  },
  delete: () => {
    appStore.dispatch(deleteReview());
  },
  get: fuseChimericSync({
    idiomatic: createIdiomaticSync(() => {
      const record = appStore.getState().todo.review.record;
      return record ? toDomain(record) : undefined;
    }),
    reactive: createReactiveSync(() => {
      const record = useAppSelector((state) => state.todo.review.record);
      return record ? toDomain(record) : undefined;
    }),
  }),
};

const toDomain = (record: ReviewRecord): Review => {
  return {
    createdAt: new Date(record.createdAt),
    todoIdList: record.todoIdList,
  };
};
