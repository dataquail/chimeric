import { ChimericReadFactory } from 'src/utils/domain/ChimericRead';
import { Review } from '../entities/Review';

export type IReviewRepository = {
  save: (review: Review) => void;
  delete: () => void;
  get: ChimericReadFactory<() => Review | undefined>;
};
