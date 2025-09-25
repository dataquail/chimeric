import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/core';
import { TestTodoStore } from '../__tests__/TestTodoStore';
import { ChimericSyncReducer } from './ChimericSyncReducer';
import { act, useSyncExternalStore } from 'react';
import { renderHook } from '@testing-library/react';

describe('ChimericSyncReducer', () => {
  const createTodoStoreAndServices = () => {
    const todoStore = new TestTodoStore();

    const idiomaticGetAllTodos = createIdiomaticSync(() => {
      return todoStore.getSnapshot();
    });

    const reactiveGetAllTodos = createReactiveSync(() => {
      return useSyncExternalStore(
        todoStore.subscribe.bind(todoStore),
        todoStore.getSnapshot.bind(todoStore),
      );
    });

    const idiomaticGetTodoById = createIdiomaticSync((id: number) => {
      return todoStore.getSnapshot().find((todo) => todo.id === id);
    });

    const reactiveGetTodoById = createReactiveSync((id: number) => {
      return useSyncExternalStore(
        todoStore.subscribe.bind(todoStore),
        todoStore.getSnapshot.bind(todoStore),
      ).find((todo) => todo.id === id);
    });

    return {
      todoStore,
      getAllTodos: fuseChimericSync({
        idiomatic: idiomaticGetAllTodos,
        reactive: reactiveGetAllTodos,
      }),
      getTodoById: fuseChimericSync({
        idiomatic: idiomaticGetTodoById,
        reactive: reactiveGetTodoById,
      }),
    };
  };

  it('should be defined', () => {
    expect(ChimericSyncReducer).toBeDefined();
  });

  describe('idiomatic', () => {
    it('should aggregate from one idiomatic sync interface', () => {
      const { todoStore, getAllTodos } = createTodoStoreAndServices();

      expect(getAllTodos().length).toBe(0);
      expect(getAllTodos()).toEqual(todoStore.getSnapshot());

      todoStore.addTodo();

      expect(getAllTodos().length).toBe(1);
      expect(getAllTodos()).toEqual(todoStore.getSnapshot());

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [{ service: getAllTodos }],
        reducer: ([todos], params) => {
          return todos[params].id;
        },
      });

      expect(TestChimericSyncReducer(0)).toEqual(0);
    });

    it('should aggregate multiple idiomatic sync interfaces', () => {
      const { todoStore: todoStore1, getAllTodos: getAllTodos1 } =
        createTodoStoreAndServices();
      const { todoStore: todoStore2, getTodoById: getTodoById2 } =
        createTodoStoreAndServices();

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [
          { service: getAllTodos1 },
          {
            service: getTodoById2,
            getParams: (index: Args) => index,
          },
        ],
        reducer: ([todos, todo], params) => {
          return `${todos[params]?.id} + ${todo?.id}`;
        },
      });

      expect(TestChimericSyncReducer(0)).toEqual('undefined + undefined');

      todoStore1.addTodo();
      todoStore2.addTodo();

      expect(TestChimericSyncReducer(0)).toEqual('0 + 0');
    });
  });

  describe('reactive', () => {
    it('should aggregate from one reactive sync interface', () => {
      const { todoStore, getAllTodos } = createTodoStoreAndServices();

      const { result } = renderHook(getAllTodos.use);

      expect(result.current.length).toBe(0);

      act(() => {
        todoStore.addTodo();
      });

      expect(result.current.length).toBe(1);

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [{ service: getAllTodos }],
        reducer: ([todos], params) => {
          return todos[params].id;
        },
      });

      const { result: result2 } = renderHook(TestChimericSyncReducer.use, {
        initialProps: 0,
      });

      expect(result2.current).toEqual(0);
    });

    it('should aggregate multiple reactive sync interfaces', () => {
      const { todoStore: todoStore1, getAllTodos: getAllTodos1 } =
        createTodoStoreAndServices();
      const { todoStore: todoStore2, getTodoById: getTodoById2 } =
        createTodoStoreAndServices();

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [
          { service: getAllTodos1 },
          {
            service: getTodoById2,
            getParams: (index: Args) => index,
          },
        ],
        reducer: ([todos, todo], params) => {
          return `${todos[params]?.id} + ${todo?.id}`;
        },
      });

      expect(TestChimericSyncReducer(0)).toEqual('undefined + undefined');

      act(() => {
        todoStore1.addTodo();
        todoStore2.addTodo();
      });

      expect(TestChimericSyncReducer(0)).toEqual('0 + 0');
    });
  });
});
