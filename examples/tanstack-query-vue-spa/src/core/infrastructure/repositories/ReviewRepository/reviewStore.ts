import { ref } from 'vue';
import { Review } from 'src/core/domain/review/entities/Review';

export type ReviewRecord = {
  createdAt: string;
  todoIdList: string[];
};

export const reviewRecord = ref<ReviewRecord | undefined>(undefined);

export const saveReview = (review: Review): void => {
  reviewRecord.value = {
    createdAt: review.createdAt.toISOString(),
    todoIdList: review.todoIdList,
  };
};

export const deleteReview = (): void => {
  reviewRecord.value = undefined;
};
