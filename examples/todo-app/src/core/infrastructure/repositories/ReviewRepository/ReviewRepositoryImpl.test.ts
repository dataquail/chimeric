import { describe, it, expect } from 'vitest';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import {
  getChimericReadTestHarness,
  ChimericReadMethods,
} from '@chimeric/testing';
import { act } from '@testing-library/react';
import { createReview } from 'src/core/domain/review/entities/Review';

describe('ReviewRepositoryImpl', () => {
  const getReviewRepository = () => {
    return appContainer.get<InjectionType<'IReviewRepository'>>(
      InjectionSymbol('IReviewRepository'),
    );
  };

  it.each(ChimericReadMethods)('get.%s', async (chimericMethod) => {
    const reviewRepository = getReviewRepository();
    const getHarness = getChimericReadTestHarness(getTestWrapper())(
      reviewRepository.get,
      chimericMethod,
    );
    expect(getHarness.result.current).toBeUndefined();
  });

  it.each(ChimericReadMethods)('save.%s', async (chimericMethod) => {
    const reviewRepository = getReviewRepository();
    const getHarness = getChimericReadTestHarness(getTestWrapper())(
      reviewRepository.get,
      chimericMethod,
    );

    act(() => {
      reviewRepository.save(createReview(['1', '2', '3']));
    });

    await getHarness.waitFor(() => getHarness.result.current !== undefined);
    expect(getHarness.result.current).toBeDefined();
    expect(getHarness.result.current?.todoIdList).toEqual(['1', '2', '3']);
  });

  it('delete', async () => {
    const reviewRepository = getReviewRepository();
    const getHarness = getChimericReadTestHarness(getTestWrapper())(
      reviewRepository.get,
      'call',
    );

    act(() => {
      reviewRepository.save(createReview(['1', '2', '3']));
    });

    await getHarness.waitFor(() => getHarness.result.current !== undefined);

    expect(getHarness.result.current).toBeDefined();
    expect(getHarness.result.current?.todoIdList).toEqual(['1', '2', '3']);

    act(() => {
      reviewRepository.delete();
    });

    await getHarness.waitFor(() => getHarness.result.current === undefined);

    expect(getHarness.result.current).toBeUndefined();
  });
});
