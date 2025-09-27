import {
  createIdiomaticInfiniteQuery,
  createReactiveInfiniteQuery,
  fuseChimericInfiniteQuery,
} from '@chimeric/core';

interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  prevCursor?: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export const makeAsyncInfiniteQueryWithoutParams = () =>
  vi.fn(
    async (): Promise<{
      pages: PaginatedResponse<TodoItem>[];
      pageParams: string[];
    }> => {
      const mockPages = [
        {
          data: [
            { id: '1', text: 'Task 1', completed: false },
            { id: '2', text: 'Task 2', completed: true },
          ],
          nextCursor: 'cursor-2',
        },
        {
          data: [
            { id: '3', text: 'Task 3', completed: false },
            { id: '4', text: 'Task 4', completed: false },
          ],
          nextCursor: 'cursor-3',
        },
      ];

      return {
        pages: mockPages,
        pageParams: ['', 'cursor-2'],
      };
    },
  );

export const makeAsyncInfiniteQueryWithParams = () =>
  vi.fn(
    async (params: {
      filter: string;
    }): Promise<{
      pages: PaginatedResponse<TodoItem>[];
      pageParams: string[];
    }> => {
      const mockPages = [
        {
          data: [
            {
              id: '1',
              text: `Filtered ${params.filter} Task 1`,
              completed: false,
            },
            {
              id: '2',
              text: `Filtered ${params.filter} Task 2`,
              completed: true,
            },
          ],
          nextCursor: 'cursor-2',
        },
      ];

      return {
        pages: mockPages,
        pageParams: [''],
      };
    },
  );

export const makeAsyncInfiniteQueryWithPageParam = () =>
  vi.fn(
    async (params: {
      pageParam?: string;
    }): Promise<{
      pages: PaginatedResponse<TodoItem>[];
      pageParams: string[];
    }> => {
      const cursor = params.pageParam || '';
      const mockPages = [
        {
          data: [
            {
              id: `${cursor}1`,
              text: `Task from ${cursor || 'start'}`,
              completed: false,
            },
            {
              id: `${cursor}2`,
              text: `Task from ${cursor || 'start'} 2`,
              completed: true,
            },
          ],
          nextCursor: `${cursor}next`,
        },
      ];

      return {
        pages: mockPages,
        pageParams: [cursor],
      };
    },
  );

export const makeErrorInfiniteQuery = () =>
  vi.fn(
    async (): Promise<{
      pages: PaginatedResponse<TodoItem>[];
      pageParams: string[];
    }> => {
      throw new Error('Infinite query failed');
    },
  );

export const makeIdiomaticInfiniteQueryWithoutParams = () =>
  createIdiomaticInfiniteQuery(makeAsyncInfiniteQueryWithoutParams());

export const makeIdiomaticInfiniteQueryWithParams = () =>
  createIdiomaticInfiniteQuery(makeAsyncInfiniteQueryWithParams());

export const makeReactiveInfiniteQueryWithoutParams = () =>
  createReactiveInfiniteQuery(
    vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: {
        pages: [],
        pageParams: [''],
      },
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      hasNextPage: false,
      hasPreviousPage: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      refetch: vi.fn(),
      native: null,
    })),
  );

export const makeReactiveInfiniteQueryWithParams = () =>
  createReactiveInfiniteQuery(
    vi.fn((args: { filter: string }) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: {
        pages: [
          {
            data: [
              {
                id: '1',
                text: `Filtered ${args.filter} Task 1`,
                completed: false,
              },
              {
                id: '2',
                text: `Filtered ${args.filter} Task 2`,
                completed: true,
              },
            ],
            nextCursor: 'cursor-2',
          },
        ],
        pageParams: [''],
      },
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      hasNextPage: true,
      hasPreviousPage: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      refetch: vi.fn(),
      native: null,
    })),
  );
export const makeChimericInfiniteQueryWithoutParams = () =>
  fuseChimericInfiniteQuery({
    idiomatic: makeIdiomaticInfiniteQueryWithoutParams(),
    reactive: makeReactiveInfiniteQueryWithoutParams(),
  });

export const makeChimericInfiniteQueryWithParams = () =>
  fuseChimericInfiniteQuery({
    idiomatic: makeIdiomaticInfiniteQueryWithParams(),
    reactive: makeReactiveInfiniteQueryWithParams(),
  });
