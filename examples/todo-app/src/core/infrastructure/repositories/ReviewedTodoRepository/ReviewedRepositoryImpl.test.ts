import { describe, it, expect } from 'vitest';
import {
  getChimericReadTestHarness,
  ChimericReadMethods,
} from '@chimeric/testing';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import { act } from '@testing-library/react';
import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';

describe('ReviewedTodoRepositoryImpl', () => {
  const getReviewedTodoRepository = () => {
    return appContainer.get<InjectionType<'IReviewedTodoRepository'>>(
      InjectionSymbol('IReviewedTodoRepository'),
    );
  };

  it.each(ChimericReadMethods)('getOneById.%s', async (chimericMethod) => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const getOneByIdHarness = getChimericReadTestHarness(getTestWrapper())(
      reviewedTodoRepository.getOneById,
      chimericMethod,
      { id: '1' },
    );
    expect(getOneByIdHarness.result.current).toBeUndefined();

    act(() => {
      reviewedTodoRepository.save(createReviewedTodo('1'));
    });

    await getOneByIdHarness.waitFor(
      () => getOneByIdHarness.result.current !== undefined,
    );

    expect(getOneByIdHarness.result.current).toBeDefined();
    expect(getOneByIdHarness.result.current?.id).toEqual('1');
  });

  it.each(ChimericReadMethods)('saveMany.%s', async (chimericMethod) => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const getOneById1Harness = getChimericReadTestHarness(getTestWrapper())(
      reviewedTodoRepository.getOneById,
      chimericMethod,
      { id: '1' },
    );

    const getOneById2Harness = getChimericReadTestHarness(getTestWrapper())(
      reviewedTodoRepository.getOneById,
      chimericMethod,
      { id: '2' },
    );

    expect(getOneById1Harness.result.current).toBeUndefined();
    expect(getOneById2Harness.result.current).toBeUndefined();

    act(() => {
      reviewedTodoRepository.saveMany([
        createReviewedTodo('1'),
        createReviewedTodo('2'),
      ]);
    });

    await getOneById1Harness.waitFor(
      () => getOneById1Harness.result.current !== undefined,
    );
    await getOneById2Harness.waitFor(
      () => getOneById2Harness.result.current !== undefined,
    );

    expect(getOneById1Harness.result.current).toBeDefined();
    expect(getOneById1Harness.result.current?.id).toEqual('1');

    expect(getOneById2Harness.result.current).toBeDefined();
  });

  it.each(ChimericReadMethods)('delete.%s', async (chimericMethod) => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const getOneByIdHarness = getChimericReadTestHarness(getTestWrapper())(
      reviewedTodoRepository.getOneById,
      chimericMethod,
      { id: '1' },
    );

    expect(getOneByIdHarness.result.current).toBeUndefined();

    act(() => {
      reviewedTodoRepository.save(createReviewedTodo('1'));
    });

    await getOneByIdHarness.waitFor(
      () => getOneByIdHarness.result.current !== undefined,
    );

    expect(getOneByIdHarness.result.current).toBeDefined();
    expect(getOneByIdHarness.result.current?.id).toEqual('1');

    act(() => {
      reviewedTodoRepository.delete({ id: '1' });
    });

    await getOneByIdHarness.waitFor(
      () => getOneByIdHarness.result.current === undefined,
    );

    expect(getOneByIdHarness.result.current).toBeUndefined();
  });
});
