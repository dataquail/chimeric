import { computed, type ComputedRef } from 'vue';
import { Review } from 'src/core/domain/review/entities/Review';
import { reviewRecord, saveReview, deleteReview, ReviewRecord } from './reviewStore';

const toDomain = (record: ReviewRecord): Review => ({
  createdAt: new Date(record.createdAt),
  todoIdList: record.todoIdList,
});

type ReviewGetChimeric = {
  (): Review | undefined;
  useHook: () => ComputedRef<Review | undefined>;
};

const reviewGet: ReviewGetChimeric = Object.assign(
  (): Review | undefined =>
    reviewRecord.value ? toDomain(reviewRecord.value) : undefined,
  {
    useHook: (): ComputedRef<Review | undefined> =>
      computed(() =>
        reviewRecord.value ? toDomain(reviewRecord.value) : undefined,
      ),
  },
);

export const reviewRepository = {
  save: (review: Review): void => {
    saveReview(review);
  },
  delete: (): void => {
    deleteReview();
  },
  get: reviewGet,
};
