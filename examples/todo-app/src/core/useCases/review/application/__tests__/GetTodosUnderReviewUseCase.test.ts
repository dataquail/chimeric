import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { act } from '@testing-library/react';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { mockGetAllActiveTodos } from 'src/__test__/network/activeTodo/mockGetAllActiveTodos';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import {
  getChimericPromiseTestHarness,
  inferPromiseMethod,
} from 'src/utils/domain/__tests__/getChimericPromiseTestHarness';
import { mockGetAllSavedForLaterTodos } from 'src/__test__/network/savedForLaterTodo/mockGetAllSavedForLaterTodos';
import {
  getChimericAsyncReadTestHarness,
  ChimericAsyncReadMethods,
} from 'src/utils/domain/__tests__/getChimericAsyncReadTestHarness';

describe('GetTodosUnderReviewUseCase', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const getGetTodosUnderReviewUseCase = () => {
    return appContainer.get<InjectionType<'GetTodosUnderReviewUseCase'>>(
      InjectionSymbol('GetTodosUnderReviewUseCase'),
    );
  };

  const getStartReviewUseCase = () => {
    return appContainer.get<InjectionType<'StartReviewUseCase'>>(
      InjectionSymbol('StartReviewUseCase'),
    );
  };

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

  it.each(ChimericAsyncReadMethods)(
    'getTodosUnderReview.%s',
    async (chimericMethod) => {
      withOneUncompletedAndOneCompletedActiveTodoInList();
      withOneSavedForLaterTodoInList();
      const startReviewHarness = getChimericPromiseTestHarness(
        getTestWrapper(),
      )(getStartReviewUseCase(), inferPromiseMethod(chimericMethod));
      const getTodosUnderReviewHarness = getChimericAsyncReadTestHarness(
        getTestWrapper(),
      )(getGetTodosUnderReviewUseCase(), chimericMethod);

      act(() => {
        startReviewHarness.result?.current.call();
      });

      await startReviewHarness.waitForSuccess();
      await getTodosUnderReviewHarness.waitForSuccess();

      const todos = getTodosUnderReviewHarness.result.current.data;
      expect(todos).toHaveLength(2);
      expect(todos?.[0]).toEqual({
        id: '1',
        title: 'Active Todo 1',
        createdAt: new Date(nowTimeStamp),
        completedAt: undefined,
        isPrioritized: false,
        lastReviewedAt: undefined,
      });
      expect(todos?.[1]).toEqual({
        id: '3',
        title: 'Saved For Later Todo 3',
        createdAt: new Date(nowTimeStamp),
        completedAt: undefined,
        isPrioritized: null,
        lastReviewedAt: undefined,
      });
    },
  );
});
