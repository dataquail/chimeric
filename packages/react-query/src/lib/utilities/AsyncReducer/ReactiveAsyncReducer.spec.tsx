import { createReactiveEagerAsync, createReactiveSync } from '@chimeric/core';
import { ReactiveAsyncReducer } from './ReactiveAsyncReducer';
import { renderHook, waitFor } from '@testing-library/react';
import { act, useSyncExternalStore } from 'react';
import { TestTodoStore } from '../__tests__/TestTodoStore';
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
} from '@tanstack/react-query';
import { ReactiveQueryFactory } from '../../Query/reactive/ReactiveQueryFactory';

describe('ReactiveAsyncReducer', () => {
  const createTodoHookAndStore = () => {
    const todoStore = new TestTodoStore();

    const getAllTodos = createReactiveSync(() => {
      return useSyncExternalStore(
        todoStore.subscribe.bind(todoStore),
        todoStore.getSnapshot.bind(todoStore),
      );
    });

    const getTodoById = createReactiveSync((id: number) => {
      return useSyncExternalStore(
        todoStore.subscribe.bind(todoStore),
        todoStore.getSnapshot.bind(todoStore),
      ).find((todo) => todo.id === id);
    });

    return { todoStore, getAllTodos, getTodoById };
  };

  const createParamsQuery = () => {
    return ReactiveQueryFactory({
      getQueryOptions: (params: { name: string }) =>
        queryOptions({
          queryKey: ['test1'],
          queryFn: () => {
            return Promise.resolve(params.name);
          },
        }),
    });
  };

  const createNoParamsQuery = () => {
    return ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test2'],
          queryFn: () => {
            return Promise.resolve('Bob' as const);
          },
        }),
    });
  };

  const createParamsEagerAsync = () => {
    return createReactiveEagerAsync((args: { age: number }) => {
      return {
        isIdle: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: args,
      };
    });
  };

  const createNoParamsEagerAsync = () => {
    return createReactiveEagerAsync(() => {
      return {
        isIdle: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: { age: 42 as const },
      };
    });
  };

  it('should be defined', () => {
    expect(ReactiveAsyncReducer).toBeDefined();
  });

  it('should aggregate multiple idiomactic sync interfaces with initial value reducer', async () => {
    const queryClient = new QueryClient();
    const { todoStore, getTodoById, getAllTodos } = createTodoHookAndStore();

    type Args = {
      index: number;
      name: string;
      age: number;
    };
    const TestReactiveAsyncReducer = ReactiveAsyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById,
          getParams: ({ index }: Args) => index,
        },
        {
          service: getAllTodos,
          // getParams: () => ({}),
        },
        {
          service: createParamsQuery(),
          getParams: ({ name }: Args) => ({ name }),
        },
        {
          service: createNoParamsQuery(),
          // getParams: () => ({}),
        },
        {
          service: createParamsEagerAsync(),
          getParams: ({ age }: Args) => ({ age }),
        },
        {
          service: createNoParamsEagerAsync(),
          // getParams: () => ({}),
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
      initialValueReducer: (
        [todo, todos, name, bob, ageResultWithParams, ageResultWithoutParams],
        params,
      ) => {
        // When data is not fully loaded, show available data only
        const parts = [];
        if (todo?.id !== undefined) parts.push(todo.id);
        if (todos !== undefined) parts.push(todos.length);
        if (name !== undefined) parts.push(name);
        if (bob !== undefined) parts.push(bob);
        if (ageResultWithParams !== undefined)
          parts.push(ageResultWithParams.age);
        if (ageResultWithoutParams !== undefined)
          parts.push(ageResultWithoutParams.age);
        parts.push(params.index); // Always add the index
        return parts.join(' + ');
      },
    });

    const { result } = renderHook(TestReactiveAsyncReducer.use, {
      initialProps: { index: 0, name: 'John', age: 20 },
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    expect(result.current.data).toEqual('0 + 20 + 42 + 0');

    act(() => {
      todoStore.addTodo();
    });

    expect(result.current.data).toEqual('0 + 1 + 20 + 42 + 0');

    await waitFor(() => {
      expect(result.current.isSuccess).toEqual(true);
    });

    expect(result.current.data).toEqual('0 + 0 + John + Bob + 20 + 42');
  });

  describe('Performance Characteristics', () => {
    it('demonstrates render behavior differences without initialReducer', async () => {
      const queryClient = new QueryClient();
      const { todoStore, getTodoById } = createTodoHookAndStore();

      let renders = 0;
      let reducerCalls = 0;

      type Args = {
        index: number;
        name: string;
        age: number;
      };
      const TestReactiveAsyncReducer = ReactiveAsyncReducer<Args>().build({
        serviceList: [
          {
            service: getTodoById,
            getParams: ({ index }: Args) => {
              renders++;
              return index;
            },
          },
          {
            service: createParamsEagerAsync(),
            getParams: ({ age }: Args) => ({ age }),
          },
          {
            service: createParamsQuery(),
            getParams: ({ name }: Args) => ({ name }),
          },
        ],
        reducer: ([todo, { age }, name], params) => {
          reducerCalls++;
          return `${todo?.id} + ${name} + ${age} + ${params.index}`;
        },
      });

      const initialProps = { index: 0, name: 'John', age: 20 };

      const { result, rerender } = renderHook(TestReactiveAsyncReducer.use, {
        initialProps,
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      // Initial render
      expect(renders).toBe(1);
      expect(reducerCalls).toBe(0);
      expect(result.current.data).toBeUndefined();

      act(() => {
        todoStore.addTodo();
        todoStore.addTodo();
      });

      expect(renders).toBe(1);
      expect(reducerCalls).toBe(0);
      expect(result.current.data).toBeUndefined();

      // Multiple rerenders
      for (let i = 0; i < 5; i++) {
        rerender(initialProps);
      }

      // With memoization, should only call reducer when data actually changes
      expect(renders).toBe(1);
      expect(reducerCalls).toBe(0); // Initial render + one change when query data arrives
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toEqual(true);
      });

      expect(reducerCalls).toBe(1);
      expect(result.current.data).toEqual('0 + John + 20 + 0');
    });
  });

  it('demonstrates render behavior differences with initialReducer', async () => {
    const queryClient = new QueryClient();
    const { todoStore, getTodoById } = createTodoHookAndStore();

    let renders = 0;
    let reducerCalls = 0;
    let initialReducerCalls = 0;

    type Args = {
      index: number;
      name: string;
      age: number;
    };
    const TestReactiveAsyncReducer = ReactiveAsyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById,
          getParams: ({ index }: Args) => {
            renders++;
            return index;
          },
        },
        {
          service: createParamsEagerAsync(),
          getParams: ({ age }: Args) => ({ age }),
        },
        {
          service: createParamsQuery(),
          getParams: ({ name }: Args) => ({ name }),
        },
      ],
      reducer: ([todo, { age }, name], params) => {
        reducerCalls++;
        return `${todo?.id} + ${name} + ${age} + ${params.index}`;
      },
      initialValueReducer: ([todo, age, name], params) => {
        // When data is not fully loaded, show available data only
        initialReducerCalls++;
        const parts = [];
        if (todo?.id !== undefined) parts.push(todo.id);
        if (age !== undefined) parts.push(age.age);
        if (name !== undefined) parts.push(name);
        parts.push(params.index); // Always add the index
        return parts.join(' + ');
      },
    });

    const initialProps = { index: 0, name: 'John', age: 20 };

    const { result, rerender } = renderHook(TestReactiveAsyncReducer.use, {
      initialProps,
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // Initial render
    expect(renders).toBe(1);
    expect(reducerCalls).toBe(0);
    expect(initialReducerCalls).toBe(1);
    expect(result.current.data).toBe('20 + 0');

    act(() => {
      todoStore.addTodo();
      todoStore.addTodo();
    });

    expect(renders).toBe(1);
    expect(reducerCalls).toBe(0);
    expect(initialReducerCalls).toBe(2);
    expect(result.current.data).toBe('0 + 20 + 0');

    // Multiple rerenders
    for (let i = 0; i < 5; i++) {
      rerender(initialProps);
    }

    // With memoization, should only call reducer when data actually changes
    expect(renders).toBe(1);
    expect(reducerCalls).toBe(0); // Initial render + one change when query data arrives
    expect(initialReducerCalls).toBe(2); // Initial render + one change when todo arrives
    expect(result.current.data).toBe('0 + 20 + 0');

    await waitFor(() => {
      expect(result.current.isSuccess).toEqual(true);
    });

    expect(reducerCalls).toBe(1);
    expect(initialReducerCalls).toBe(2); // No change
    expect(result.current.data).toEqual('0 + John + 20 + 0');
  });

  it('demonstrates render behavior differences with changing args', async () => {
    const queryClient = new QueryClient();
    const { todoStore, getTodoById, getAllTodos } = createTodoHookAndStore();

    let renders = 0;
    let reducerCalls = 0;
    let initialReducerCalls = 0;

    type Args = {
      index: number;
      name: string;
    };
    const TestReactiveAsyncReducer = ReactiveAsyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById,
          getParams: ({ index }: Args) => {
            renders++;
            return index;
          },
        },
        {
          service: getAllTodos,
        },
        {
          service: createParamsQuery(),
          getParams: ({ name }: Args) => ({ name }),
        },
      ],
      reducer: ([todo, allTodos, name], params) => {
        reducerCalls++;
        return `${todo?.id} + ${allTodos.length} + ${params.index} + ${name}`;
      },
      initialValueReducer: ([todo, allTodos, name], params) => {
        // When data is not fully loaded, show available data only
        initialReducerCalls++;
        const parts = [];
        if (todo?.id !== undefined) parts.push(todo.id);
        if (allTodos !== undefined) parts.push(allTodos.length);
        if (name !== undefined) parts.push(name);
        parts.push(params.index); // Always add the index
        return parts.join(' + ');
      },
    });

    const initialProps = { index: 0, name: 'John' };

    const { result, rerender } = renderHook(TestReactiveAsyncReducer.use, {
      initialProps,
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // Initial render
    expect(renders).toBe(1);
    expect(reducerCalls).toBe(0);
    expect(initialReducerCalls).toBe(1);
    expect(result.current.data).toBe('0 + 0');

    act(() => {
      todoStore.addTodo();
      todoStore.addTodo();
    });

    expect(renders).toBe(1);
    expect(reducerCalls).toBe(0);
    expect(initialReducerCalls).toBe(2);
    expect(result.current.data).toBe('0 + 2 + 0');

    // Multiple rerenders
    for (let i = 0; i < 5; i++) {
      rerender(initialProps);
    }

    // With memoization, should only call reducer when data actually changes
    expect(renders).toBe(1);
    expect(reducerCalls).toBe(0);
    expect(initialReducerCalls).toBe(2);
    expect(result.current.data).toBe('0 + 2 + 0');

    await waitFor(() => {
      expect(result.current.isSuccess).toEqual(true);
    });

    expect(renders).toBe(1);
    expect(reducerCalls).toBe(1);
    expect(initialReducerCalls).toBe(2);
    expect(result.current.data).toEqual('0 + 2 + 0 + John');

    act(() => {
      todoStore.addTodo();
    });

    expect(renders).toBe(1);
    expect(reducerCalls).toBe(2);
    expect(initialReducerCalls).toBe(2);
    expect(result.current.data).toEqual('0 + 3 + 0 + John');
  });
});
