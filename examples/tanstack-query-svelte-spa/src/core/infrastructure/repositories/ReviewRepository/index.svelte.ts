import { ChimericSyncFactory } from '@chimeric/svelte';
import type { Review } from 'src/core/domain/review/entities/Review';

let review = $state<Review | undefined>(undefined);

export const reviewRepository = {
  get: ChimericSyncFactory((): Review | undefined => review),
  save(r: Review) {
    review = r;
  },
  delete() {
    review = undefined;
  },
};
