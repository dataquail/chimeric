import { vi } from 'vitest';
import {
  createIdiomaticInfiniteQuery,
  createReactiveInfiniteQuery,
  fuseChimericInfiniteQuery,
} from '@chimeric/core';
import { infiniteQueryOptions } from '@tanstack/react-query';
import { TanstackInfiniteQueryReactiveReturnType } from '@chimeric/react-query/src/lib/InfiniteQuery/reactive/types';

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

export const makeTanStackInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ['todos'],
    queryFn: async ({ pageParam = '' }) => {
      const mockPage = {
        data: [
          {
            id: `${pageParam}1`,
            text: `Task from ${pageParam || 'start'}`,
            completed: false,
          },
          {
            id: `${pageParam}2`,
            text: `Task from ${pageParam || 'start'} 2`,
            completed: true,
          },
        ],
        nextCursor: `${pageParam}next`,
      };
      return mockPage;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
  });

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
      native: null as unknown as TanstackInfiniteQueryReactiveReturnType<
        never,
        Error,
        never
      >,
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
      native: null as unknown as TanstackInfiniteQueryReactiveReturnType<
        {
          data: { id: string; text: string; completed: boolean }[];
          nextCursor: string;
        },
        Error,
        string
      >,
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
