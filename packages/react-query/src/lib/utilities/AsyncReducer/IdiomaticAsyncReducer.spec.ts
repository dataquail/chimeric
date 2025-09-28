import { createIdiomaticEagerAsync, createIdiomaticSync } from '@chimeric/core';
import { IdiomaticAsyncReducer } from './IdiomaticAsyncReducer';
import { TestTodoStore } from '../__tests__/TestTodoStore';
import { QueryClient, queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../../Query/idiomatic/IdiomaticQueryFactory';
import { IdiomaticInfiniteQueryFactory } from '../../InfiniteQuery/idiomatic/IdiomaticInfiniteQueryFactory';

describe('IdiomaticAsyncReducer', () => {
  const createTodoStoreAndGetters = () => {
    const todoStore = new TestTodoStore();

    return {
      todoStore,
      getAllTodos: createIdiomaticSync(() => {
        return todoStore.getSnapshot();
      }),
      getTodoById: createIdiomaticSync((id: number) => {
        return todoStore.getSnapshot().find((todo) => todo.id === id);
      }),
    };
  };

  const createParamsQuery = () => {
    const queryClient = new QueryClient();
    return IdiomaticQueryFactory(queryClient, (params: { name: string }) =>
      queryOptions({
        queryKey: ['test'],
        queryFn: () => {
          return Promise.resolve(params.name);
        },
      }),
    );
  };

  const createNoParamsQuery = () => {
    const queryClient = new QueryClient();
    return IdiomaticQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: () => {
          return Promise.resolve('Bob' as const);
        },
      }),
    );
  };

  const createParamsEagerAsync = () => {
    return createIdiomaticEagerAsync(async (args: { age: number }) => {
      return { age: args.age };
    });
  };

  const createNoParamsEagerAsync = () => {
    return createIdiomaticEagerAsync(async () => {
      return { age: 42 as const };
    });
  };

  const createParamsInfiniteQuery = () => {
    const queryClient = new QueryClient();
    return IdiomaticInfiniteQueryFactory(
      queryClient,
      (params: { filter: string }) =>
        infiniteQueryOptions({
          queryKey: ['infiniteTest', params.filter],
          queryFn: ({ pageParam = 0 }) => {
            return Promise.resolve({
              data: [
                {
                  id: `${params.filter}-${pageParam}-1`,
                  text: `Item 1 for ${params.filter}`,
                },
                {
                  id: `${params.filter}-${pageParam}-2`,
                  text: `Item 2 for ${params.filter}`,
                },
              ],
              nextCursor: pageParam + 1,
            });
          },
          initialPageParam: 0,
          getNextPageParam: () => 1,
          getPreviousPageParam: () => null,
        }),
    );
  };

  const createNoParamsInfiniteQuery = () => {
    const queryClient = new QueryClient();
    return IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['infiniteTestNoParams'],
          queryFn: ({ pageParam = 0 }) => {
            return Promise.resolve({
              data: [
                { id: `item-${pageParam}-1`, text: `Default Item 1` },
                { id: `item-${pageParam}-2`, text: `Default Item 2` },
              ],
              nextCursor: pageParam + 1,
            });
          },
          initialPageParam: 0,
          getNextPageParam: () => 1,
          getPreviousPageParam: () => null,
        }),
    );
  };

  it('should be defined', () => {
    expect(IdiomaticAsyncReducer).toBeDefined();
  });

  it('should aggregate multiple services', async () => {
    const { todoStore, getAllTodos, getTodoById } = createTodoStoreAndGetters();

    todoStore.addTodo();

    expect(getAllTodos()).toEqual(todoStore.getSnapshot());
    type Args = { index: number; name: string; age: number };
    const TestIdiomaticAsyncReducer = IdiomaticAsyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById,
          getParams: ({ index }: Args) => index,
        },
        {
          service: getAllTodos,
        },
        {
          service: createParamsQuery(),
          getParams: ({ name }: Args) => ({ name }),
          options: { forceRefetch: true },
        },
        {
          service: createNoParamsQuery(),
        },
        {
          service: createParamsEagerAsync(),
          getParams: ({ age }: Args) => ({ age }),
        },
        {
          service: createNoParamsEagerAsync(),
        },
      ],
      reducer: (
        [todo, todos, name, bob, ageResultWithParams, ageResultWithoutParams],
        params,
      ) => {
        return `${todo?.id} + ${todos[params.index].id} + ${name} + ${bob} + ${
          ageResultWithParams.age
        } + ${ageResultWithoutParams.age}`;
      },
    });

    expect(
      await TestIdiomaticAsyncReducer({
        index: 0,
        name: 'John',
        age: 20,
      }),
    ).toEqual('0 + 0 + John + Bob + 20 + 42');
  });

  it('should aggregate services including infinite queries', async () => {
    const { todoStore, getAllTodos, getTodoById } = createTodoStoreAndGetters();

    todoStore.addTodo();

    type Args = { index: number; filter: string; name: string };
    const TestIdiomaticAsyncReducerWithInfiniteQuery = IdiomaticAsyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById,
          getParams: ({ index }: Args) => index,
        },
        {
          service: getAllTodos,
        },
        {
          service: createParamsInfiniteQuery(),
          getParams: ({ filter }: Args) => ({ filter }),
        },
        {
          service: createNoParamsInfiniteQuery(),
        },
        {
          service: createParamsQuery(),
          getParams: ({ name }: Args) => ({ name }),
        },
      ],
      reducer: (
        [todo, todos, infiniteWithParams, infiniteWithoutParams, name],
        _params,
      ) => {
        const firstInfiniteItem = infiniteWithParams?.pages?.[0]?.data?.[0];
        const firstDefaultItem = infiniteWithoutParams?.pages?.[0]?.data?.[0];
        return `${todo?.id} + ${todos.length} + ${firstInfiniteItem?.id} + ${firstDefaultItem?.id} + ${name}`;
      },
    });

    expect(
      await TestIdiomaticAsyncReducerWithInfiniteQuery({
        index: 0,
        filter: 'test',
        name: 'Alice',
      }),
    ).toEqual('0 + 1 + test-0-1 + item-0-1 + Alice');
  });
});
