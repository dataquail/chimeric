import type { Review } from 'src/core/domain/review/entities/Review';

let review = $state<Review | undefined>(undefined);

export const reviewStore = {
  get review() {
    return review;
  },
  save(r: Review) {
    review = r;
  },
  delete() {
    review = undefined;
  },
};
