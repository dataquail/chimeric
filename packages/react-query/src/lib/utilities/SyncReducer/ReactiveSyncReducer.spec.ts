import { createReactiveSync } from '@chimeric/core';
import { ReactiveSyncReducer } from './ReactiveSyncReducer';
import { renderHook } from '@testing-library/react';
import { act, useSyncExternalStore } from 'react';
import { TestTodoStore } from '../__tests__/TestTodoStore';

describe('ReactiveSyncReducer', () => {
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

    const getTodoIdOrReturn1 = createReactiveSync((id?: number) => {
      return (
        useSyncExternalStore(
          todoStore.subscribe.bind(todoStore),
          todoStore.getSnapshot.bind(todoStore),
        ).find((todo) => todo.id === id)?.id ?? 1
      );
    });

    return { todoStore, getAllTodos, getTodoById, getTodoIdOrReturn1 };
  };

  it('should be defined', () => {
    expect(ReactiveSyncReducer).toBeDefined();
  });

  it('should aggregate from one reactive sync interface', () => {
    const { todoStore, getAllTodos } = createTodoHookAndStore();

    const { result } = renderHook(getAllTodos.use);

    expect(result.current.length).toBe(0);

    act(() => {
      todoStore.addTodo();
    });

    expect(result.current.length).toBe(1);

    type Args = number;
    const TestReactiveSyncReducer = ReactiveSyncReducer<Args>().build({
      serviceList: [
        {
          service: getAllTodos,
        },
      ],
      reducer: ([todos], params) => todos[params].id,
    });

    const { result: result2 } = renderHook(TestReactiveSyncReducer.use, {
      initialProps: 0,
    });

    expect(result2.current).toEqual(0);
  });

  it('should aggregate multiple idiomactic sync interfaces', () => {
    const {
      todoStore: todoStore1,
      getAllTodos: getAllTodos1,
      getTodoIdOrReturn1,
    } = createTodoHookAndStore();
    const { todoStore: todoStore2, getTodoById: getTodoById2 } =
      createTodoHookAndStore();

    type Args = number;
    const TestReactiveSyncReducer = ReactiveSyncReducer<Args>().build({
      serviceList: [
        { service: getAllTodos1 },
        {
          service: getTodoById2,
          getParams: (index: Args) => index,
        },
        {
          service: getTodoIdOrReturn1,
          getParams: (index: Args) => index,
        },
      ],
      reducer: ([todos, todo, todoId], params) => {
        return `${todos[params]?.id} + ${todo?.id} + ${todoId}`;
      },
    });

    const { result } = renderHook(TestReactiveSyncReducer.use, {
      initialProps: 0,
    });

    expect(result.current).toEqual('undefined + undefined + 1');

    act(() => {
      todoStore1.addTodo();
      todoStore2.addTodo();
    });

    expect(result.current).toEqual('0 + 0 + 0');
  });

  it('should handle optional service params', () => {
    const {
      todoStore: todoStore1,
      getAllTodos: getAllTodos1,
      getTodoIdOrReturn1,
    } = createTodoHookAndStore();

    type Args = number | undefined;
    const TestReactiveSyncReducer = ReactiveSyncReducer<Args>().build({
      serviceList: [
        { service: getAllTodos1 },
        {
          service: getTodoIdOrReturn1,
          getParams: (index: Args) => index,
        },
      ],
      reducer: ([todos, todoId], params) => {
        return `${todos[params || 0]?.id} + ${todoId}`;
      },
    });

    const { result } = renderHook(TestReactiveSyncReducer.use, {
      initialProps: 0,
    });

    expect(result.current).toEqual('undefined + 1');

    act(() => {
      todoStore1.addTodo();
    });

    expect(result.current).toEqual('0 + 0');
  });

  it('should throw ts error when mixing optional service params with required params', () => {
    const { getTodoById: getTodoById1, getTodoIdOrReturn1 } =
      createTodoHookAndStore();

    type Args = number | undefined;
    ReactiveSyncReducer<Args>().build({
      serviceList: [
        // @ts-expect-error - getParams cannot return undefined
        { service: getTodoById1, getParams: (index: Args) => index },
        {
          service: getTodoIdOrReturn1,
          getParams: (index: Args) => index,
        },
      ],
      reducer: () => 'test',
    });

    ReactiveSyncReducer<Args>().build({
      serviceList: [
        // @ts-expect-error - getTodoById expects getParams
        { service: getTodoById1 },
        {
          service: getTodoIdOrReturn1,
          getParams: () => 1,
        },
      ],
      reducer: () => 'test',
    });

    ReactiveSyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById1,
          getParams: (index: Args) => index || 0,
        },
        {
          service: getTodoIdOrReturn1,
        },
      ],
      reducer: () => 'test',
    });
  });

  describe('Performance Characteristics', () => {
    it('demonstrates render behavior differences', () => {
      const { todoStore: todoStore1, getAllTodos: getAllTodos1 } =
        createTodoHookAndStore();
      const { todoStore: todoStore2, getTodoById: getTodoById2 } =
        createTodoHookAndStore();

      let renders = 0;
      let reducerCalls = 0;

      // Track renders for each implementation
      type Args = number;
      const useOriginal = ReactiveSyncReducer<Args>().build({
        serviceList: [
          { service: getAllTodos1 },
          {
            service: getTodoById2,
            getParams: (index: Args) => {
              renders++;
              return index;
            },
          },
        ],
        reducer: ([todos, todo], params) => {
          reducerCalls++;
          return (todos[params - 1]?.text ?? 'null') + (todo?.text ?? 'null');
        },
      });

      // Render each implementation multiple times
      const { rerender: rerenderOrig, result } = renderHook(
        (index: number) => useOriginal.use(index),
        { initialProps: 0 },
      );
      // Initial render
      expect(renders).toBe(1);
      expect(reducerCalls).toBe(1);
      expect(result.current).toBe('nullnull');

      act(() => {
        todoStore1.addTodo();
        todoStore1.addTodo();
        todoStore2.addTodo();
        todoStore2.addTodo();
      });

      expect(reducerCalls).toBe(2);
      expect(result.current).toBe('nullTodo #1');

      // Multiple rerenders
      for (let i = 0; i < 5; i++) {
        rerenderOrig(1);
      }

      // Original recreates on every render
      expect(renders).toBe(2);
      expect(reducerCalls).toBe(3);
      expect(result.current).toBe('Todo #1Todo #2');
    });
  });
});
