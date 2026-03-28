import { describe, it, expect } from 'vitest';
import { InjectionSymbol, type InjectionType } from '@/core/global/types';
import { appContainer } from '@/core/global/appContainer';
import { createReview } from '@/core/domain/review/entities/Review';

describe('ReviewRepositoryImpl', () => {
  const getReviewRepository = () => {
    return appContainer.get<InjectionType<'IReviewRepository'>>(
      InjectionSymbol('IReviewRepository'),
    );
  };

  it('get', () => {
    const reviewRepository = getReviewRepository();
    const review = reviewRepository.get();
    expect(review).toBeUndefined();
  });

  it('save', () => {
    const reviewRepository = getReviewRepository();
    reviewRepository.save(createReview(['1', '2', '3']));
    const review = reviewRepository.get();
    expect(review).toBeDefined();
    expect(review?.todoIdList).toEqual(['1', '2', '3']);
  });

  it('delete', () => {
    const reviewRepository = getReviewRepository();
    reviewRepository.save(createReview(['1', '2', '3']));
    const review = reviewRepository.get();
    expect(review).toBeDefined();
    expect(review?.todoIdList).toEqual(['1', '2', '3']);

    reviewRepository.delete();
    const deletedReview = reviewRepository.get();
    expect(deletedReview).toBeUndefined();
  });
});
