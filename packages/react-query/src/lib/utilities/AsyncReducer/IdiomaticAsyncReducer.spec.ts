import { createIdiomaticEagerAsync, createIdiomaticSync } from '@chimeric/core';
import { IdiomaticAsyncReducer } from './IdiomaticAsyncReducer';
import { TestTodoStore } from '../__tests__/TestTodoStore';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../../Query/idiomatic/IdiomaticQueryFactory';

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
    return IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (params: { name: string }) =>
        queryOptions({
          queryKey: ['test'],
          queryFn: () => {
            return Promise.resolve(params.name);
          },
        }),
    });
  };

  const createNoParamsQuery = () => {
    const queryClient = new QueryClient();
    return IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: () => {
            return Promise.resolve('Bob' as const);
          },
        }),
    });
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
});
