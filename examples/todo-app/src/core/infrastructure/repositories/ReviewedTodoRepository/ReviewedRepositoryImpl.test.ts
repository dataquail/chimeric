import { describe, it, expect } from 'vitest';
import { ChimericSyncTestHarness, chimericMethods } from '@chimeric/testing';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import { act } from 'react';
import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';

describe('ReviewedTodoRepositoryImpl', () => {
  const getReviewedTodoRepository = () => {
    return appContainer.get<InjectionType<'IReviewedTodoRepository'>>(
      InjectionSymbol('IReviewedTodoRepository'),
    );
  };

  it.each(chimericMethods)('getOneById.%s', async (method) => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const getOneByIdHarness = ChimericSyncTestHarness({
      chimericSync: reviewedTodoRepository.getOneById,
      method,
      params: { id: '1' },
      wrapper: getTestWrapper(),
    });
    expect(getOneByIdHarness.result.current).toBeUndefined();

    act(() => {
      reviewedTodoRepository.save(createReviewedTodo('1'));
    });

    await getOneByIdHarness.waitFor(
      () => expect(getOneByIdHarness.result.current).toBeDefined(),
      { reinvokeIdiomaticFn: true },
    );

    expect(getOneByIdHarness.result.current).toBeDefined();
    expect(getOneByIdHarness.result.current?.id).toEqual('1');
  });

  it.each(chimericMethods)('saveMany.%s', async (method) => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const getOneById1Harness = ChimericSyncTestHarness({
      chimericSync: reviewedTodoRepository.getOneById,
      method,
      params: { id: '1' },
      wrapper: getTestWrapper(),
    });

    const getOneById2Harness = ChimericSyncTestHarness({
      chimericSync: reviewedTodoRepository.getOneById,
      method,
      params: { id: '2' },
      wrapper: getTestWrapper(),
    });

    expect(getOneById1Harness.result.current).toBeUndefined();
    expect(getOneById2Harness.result.current).toBeUndefined();

    act(() => {
      reviewedTodoRepository.saveMany([
        createReviewedTodo('1'),
        createReviewedTodo('2'),
      ]);
    });

    await getOneById1Harness.waitFor(
      () => expect(getOneById1Harness.result.current).toBeDefined(),
      { reinvokeIdiomaticFn: true },
    );
    await getOneById2Harness.waitFor(
      () => expect(getOneById2Harness.result.current).toBeDefined(),
      { reinvokeIdiomaticFn: true },
    );

    expect(getOneById1Harness.result.current).toBeDefined();
    expect(getOneById1Harness.result.current?.id).toEqual('1');

    expect(getOneById2Harness.result.current).toBeDefined();
  });

  it.each(chimericMethods)('delete.%s', async (method) => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const getOneByIdHarness = ChimericSyncTestHarness({
      chimericSync: reviewedTodoRepository.getOneById,
      method,
      params: { id: '1' },
      wrapper: getTestWrapper(),
    });

    expect(getOneByIdHarness.result.current).toBeUndefined();

    act(() => {
      reviewedTodoRepository.save(createReviewedTodo('1'));
    });

    await getOneByIdHarness.waitFor(
      () => expect(getOneByIdHarness.result.current).toBeDefined(),
      { reinvokeIdiomaticFn: true },
    );

    expect(getOneByIdHarness.result.current).toBeDefined();
    expect(getOneByIdHarness.result.current?.id).toEqual('1');

    act(() => {
      reviewedTodoRepository.delete({ id: '1' });
    });

    await getOneByIdHarness.waitFor(
      () => expect(getOneByIdHarness.result.current).toBeUndefined(),
      { reinvokeIdiomaticFn: true },
    );

    expect(getOneByIdHarness.result.current).toBeUndefined();
  });
});
