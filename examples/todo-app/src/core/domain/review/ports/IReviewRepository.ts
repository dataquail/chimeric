import { DefineChimericSync } from '@chimeric/core';
import { Review } from '../entities/Review';

export type IReviewRepository = {
  save: (review: Review) => void;
  delete: () => void;
  get: DefineChimericSync<() => Review | undefined>;
};
