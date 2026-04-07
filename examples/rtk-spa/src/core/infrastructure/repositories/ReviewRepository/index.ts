import { Review } from 'src/core/domain/review/entities/Review';
import { saveReview, deleteReview, ReviewRecord } from './reviewStore';
import { appStore } from 'src/core/global/appStore';
import { IReviewRepository } from 'src/core/domain/review/ports/IReviewRepository';
import { ChimericSyncFactory } from 'src/utils/domain/ChimericSyncFactory';

export const reviewRepository: IReviewRepository = {
  save: (review: Review) => {
    appStore.dispatch(saveReview(review));
  },
  delete: () => {
    appStore.dispatch(deleteReview());
  },
  get: ChimericSyncFactory({
    selector: () => (state) => state.todo.review.record,
    reducer: (record) => (record ? toDomain(record) : undefined),
  }),
};

const toDomain = (record: ReviewRecord): Review => {
  return {
    createdAt: new Date(record.createdAt),
    todoIdList: record.todoIdList,
  };
};
