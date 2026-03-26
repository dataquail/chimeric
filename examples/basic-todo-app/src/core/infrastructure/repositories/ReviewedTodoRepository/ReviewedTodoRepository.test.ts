import { describe, it, expect } from 'vitest';
import {
  ChimericSyncTestHarness,
  chimericMethods,
} from '@chimeric/testing-react';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import { act } from 'react';
import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { reviewedTodoRepository } from '.';

describe('reviewedTodoRepository', () => {
  describe('idiomatically', () => {
    it('getOneById', () => {
      const nonExistentReviewedTodo = reviewedTodoRepository.getOneById({
        id: 'some-id',
      });
      expect(nonExistentReviewedTodo).toBeUndefined();

      reviewedTodoRepository.save(createReviewedTodo('some-id'));

      const existentReviewedTodo = reviewedTodoRepository.getOneById({
        id: 'some-id',
      });
      expect(existentReviewedTodo).toBeDefined();
      expect(existentReviewedTodo?.id).toEqual('some-id');
    });

    it('saveMany', () => {
      const nonExistentReviewedTodo1 = reviewedTodoRepository.getOneById({
        id: 'id-1',
      });
      const nonExistentReviewedTodo2 = reviewedTodoRepository.getOneById({
        id: 'id-2',
      });
      expect(nonExistentReviewedTodo1).toBeUndefined();
      expect(nonExistentReviewedTodo2).toBeUndefined();

      reviewedTodoRepository.saveMany([
        createReviewedTodo('id-1'),
        createReviewedTodo('id-2'),
      ]);

      const existentReviewedTodo1 = reviewedTodoRepository.getOneById({
        id: 'id-1',
      });
      const existentReviewedTodo2 = reviewedTodoRepository.getOneById({
        id: 'id-2',
      });
      expect(existentReviewedTodo1).toBeDefined();
      expect(existentReviewedTodo1?.id).toEqual('id-1');
      expect(existentReviewedTodo2).toBeDefined();
      expect(existentReviewedTodo2?.id).toEqual('id-2');
    });

    it('delete', () => {
      reviewedTodoRepository.save(createReviewedTodo('to-be-deleted-id'));

      const existentReviewedTodo = reviewedTodoRepository.getOneById({
        id: 'to-be-deleted-id',
      });
      expect(existentReviewedTodo).toBeDefined();
      expect(existentReviewedTodo?.id).toEqual('to-be-deleted-id');

      reviewedTodoRepository.delete({ id: 'to-be-deleted-id' });

      const deletedReviewedTodo = reviewedTodoRepository.getOneById({
        id: 'to-be-deleted-id',
      });
      expect(deletedReviewedTodo).toBeUndefined();
    });
  });

  it.each(chimericMethods)('getOneById.%s', async (method) => {
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
