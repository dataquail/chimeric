import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { act } from 'react';
import {
  chimericMethods,
  ChimericAsyncTestHarness,
  ChimericSyncTestHarness,
} from '@chimeric/testing-react';
import { mockGetAllActiveTodos } from 'src/__test__/network/activeTodo/mockGetAllActiveTodos';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import { mockGetAllSavedForLaterTodos } from 'src/__test__/network/savedForLaterTodo/mockGetAllSavedForLaterTodos';
import { startReviewUseCase } from '../startReviewUseCase';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';

describe('startReviewUseCase', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const withOneUncompletedAndOneCompletedActiveTodoInList = () => {
    mockGetAllActiveTodos(server, {
      total_count: 1,
      list: [
        {
          id: '1',
          title: 'Active Todo 1',
          created_at: nowTimeStamp,
          completed_at: null,
        },
        {
          id: '2',
          title: 'Active Todo 2',
          created_at: nowTimeStamp,
          completed_at: nowTimeStamp,
        },
      ],
    });
  };

  const withOneSavedForLaterTodoInList = () => {
    mockGetAllSavedForLaterTodos(server, {
      total_count: 1,
      list: [
        {
          id: '3',
          title: 'Saved For Later Todo 3',
          created_at: nowTimeStamp,
        },
      ],
    });
  };

  it.each(chimericMethods)('startReview.%s', async (chimericMethod) => {
    withOneUncompletedAndOneCompletedActiveTodoInList();
    withOneSavedForLaterTodoInList();
    const testWrapper = getTestWrapper();
    const startReviewHarness = ChimericAsyncTestHarness({
      chimericAsync: startReviewUseCase,
      method: chimericMethod,
      wrapper: testWrapper,
    });
    const getReviewHarness = ChimericSyncTestHarness({
      chimericSync: reviewRepository.get,
      method: chimericMethod,
      wrapper: testWrapper,
    });

    expect(startReviewHarness.result?.current.isPending).toBe(false);
    expect(startReviewHarness.result?.current.isSuccess).toBe(false);

    act(() => {
      startReviewHarness.result?.current.invoke();
    });

    await startReviewHarness.waitFor(() =>
      expect(startReviewHarness.result.current.isPending).toBe(true),
    );

    await getReviewHarness.waitFor(
      () => expect(getReviewHarness.result.current).not.toBeUndefined(),
      { reinvokeIdiomaticFn: true },
    );
    // omits completed activeTodo 2
    expect(getReviewHarness.result.current?.todoIdList).toEqual(['1', '3']);
  });
});
