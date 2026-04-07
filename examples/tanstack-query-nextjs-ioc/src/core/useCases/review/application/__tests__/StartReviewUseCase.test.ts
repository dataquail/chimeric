import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { getContainer } from '@/core/global/container';
import { mockGetAllActiveTodos } from '@/__test__/network/activeTodo/mockGetAllActiveTodos';
import { mockGetAllSavedForLaterTodos } from '@/__test__/network/savedForLaterTodo/mockGetAllSavedForLaterTodos';

describe('StartReviewUseCase', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const getStartReviewUseCase = () => {
    return getContainer().startReviewUseCase;
  };

  const getReviewRepository = () => {
    return getContainer().reviewRepository;
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

  it('startReview', async () => {
    withOneUncompletedAndOneCompletedActiveTodoInList();
    withOneSavedForLaterTodoInList();

    await getStartReviewUseCase()();

    const review = getReviewRepository().get();
    // omits completed activeTodo 2
    expect(review?.todoIdList).toEqual(['1', '3']);
  });
});
