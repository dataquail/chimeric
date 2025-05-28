import { describe, it, expect } from 'vitest';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import {
  ChimericSyncTestHarness,
  chimericMethods,
} from '@chimeric/testing-react';
import { act } from 'react';
import { createReview } from 'src/core/domain/review/entities/Review';
import { reviewRepository } from '.';

describe('reviewRepository', () => {
  it.each(chimericMethods)('get.%s', async (method) => {
    const getHarness = ChimericSyncTestHarness({
      chimericSync: reviewRepository.get,
      method,
      wrapper: getTestWrapper(),
    });
    expect(getHarness.result.current).toBeUndefined();
  });

  it.each(chimericMethods)('save.%s', async (method) => {
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
