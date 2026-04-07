import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { getContainer } from '@/core/global/container';
import { mockGetAllActiveTodos } from '@/__test__/network/activeTodo/mockGetAllActiveTodos';
import { mockArchiveCompletedTodos } from '@/__test__/network/archivedTodo/mockArchiveCompletedTodos';
import { mockGetAllArchivedTodos } from '@/__test__/network/archivedTodo/mockGetAllArchivedTodos';

describe('FinishReviewUseCase', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const withTwoCompletedActiveTodos = () => {
    mockGetAllActiveTodos(server, {
      total_count: 2,
      list: [
        {
          id: '1',
          title: 'Completed Todo 1',
          created_at: nowTimeStamp,
          completed_at: nowTimeStamp,
        },
        {
          id: '2',
          title: 'Completed Todo 2',
          created_at: nowTimeStamp,
          completed_at: nowTimeStamp,
        },
      ],
    });
  };

  it('finishReview archives completed todos and clears the review', async () => {
    withTwoCompletedActiveTodos();
    mockArchiveCompletedTodos(server, { ids: ['archived-1', 'archived-2'] });
    mockGetAllArchivedTodos(server, { list: [], next_cursor: null });

    const container = getContainer();

    // Start a review
    await container.startReviewUseCase();

    const review = container.reviewRepository.get();
    expect(review?.todoIdList).toEqual(['1', '2']);

    // Finish the review — archives the completed todos
    await container.finishReviewUseCase();

    // Review should be cleared
    expect(container.reviewRepository.get()).toBeUndefined();
  });
});
