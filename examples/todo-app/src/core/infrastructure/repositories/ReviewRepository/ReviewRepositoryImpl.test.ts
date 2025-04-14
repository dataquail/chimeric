import { describe, it, expect } from 'vitest';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import { ChimericSyncTestHarness, chimericMethods } from '@chimeric/testing';
import { act } from 'react';
import { createReview } from 'src/core/domain/review/entities/Review';

describe('ReviewRepositoryImpl', () => {
  const getReviewRepository = () => {
    return appContainer.get<InjectionType<'IReviewRepository'>>(
      InjectionSymbol('IReviewRepository'),
    );
  };

  it.each(chimericMethods)('get.%s', async (method) => {
    const reviewRepository = getReviewRepository();
    const getHarness = ChimericSyncTestHarness({
      chimericSync: reviewRepository.get,
      method,
      wrapper: getTestWrapper(),
    });
    expect(getHarness.result.current).toBeUndefined();
  });

  it.each(chimericMethods)('save.%s', async (method) => {
    const reviewRepository = getReviewRepository();
    const getHarness = ChimericSyncTestHarness({
      chimericSync: reviewRepository.get,
      method,
      wrapper: getTestWrapper(),
    });

    act(() => {
      reviewRepository.save(createReview(['1', '2', '3']));
    });

    await getHarness.waitFor(
      () => expect(getHarness.result.current).toBeDefined(),
      {
        reinvokeIdiomaticFn: true,
      },
    );
    expect(getHarness.result.current).toBeDefined();
    expect(getHarness.result.current?.todoIdList).toEqual(['1', '2', '3']);
  });

  it('delete', async () => {
    const reviewRepository = getReviewRepository();
    const getHarness = ChimericSyncTestHarness({
      chimericSync: reviewRepository.get,
      method: 'idiomatic',
      wrapper: getTestWrapper(),
    });

    act(() => {
      reviewRepository.save(createReview(['1', '2', '3']));
    });

    await getHarness.waitFor(
      () => expect(getHarness.result.current).toBeDefined(),
      {
        reinvokeIdiomaticFn: true,
      },
    );

    expect(getHarness.result.current).toBeDefined();
    expect(getHarness.result.current?.todoIdList).toEqual(['1', '2', '3']);

    act(() => {
      reviewRepository.delete();
    });

    await getHarness.waitFor(
      () => expect(getHarness.result.current).toBeUndefined(),
      {
        reinvokeIdiomaticFn: true,
      },
    );

    expect(getHarness.result.current).toBeUndefined();
  });
});
