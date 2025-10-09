import { createIdiomaticSync } from '@chimeric/core';
import { IdiomaticSyncReducer } from './IdiomaticSyncReducer';
import { TestTodoStore } from '../__tests__/TestTodoStore';

describe('IdiomaticSyncFactoryFromMany', () => {
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
      getTodoIdOrReturn1: createIdiomaticSync((id?: number) => {
        return todoStore.getSnapshot().find((todo) => todo.id === id)?.id ?? 1;
      }),
    };
  };

  it('should be defined', () => {
    expect(IdiomaticSyncReducer).toBeDefined();
  });

  it('should aggregate frome one idiomactic sync interface', () => {
    const { todoStore, getAllTodos } = createTodoStoreAndGetters();
    todoStore.addTodo();

    expect(getAllTodos()).toEqual(todoStore.getSnapshot());

    type Args = number;
    const TestIdiomaticSyncReducer = IdiomaticSyncReducer<Args>().build({
      serviceList: [{ service: getAllTodos }],
      reducer: ([todos], params) => {
        return todos[params].id;
      },
    });

    expect(TestIdiomaticSyncReducer(0)).toEqual(0);
  });

  it('should aggregate multiple idiomactic sync interfaces', () => {
    const { todoStore: todoStore1, getAllTodos: getAllTodos1 } =
      createTodoStoreAndGetters();
    const {
      todoStore: todoStore2,
      getTodoById: getTodoById2,
      getTodoIdOrReturn1,
    } = createTodoStoreAndGetters();

    expect(getAllTodos1()).toEqual(todoStore1.getSnapshot());
    expect(getTodoById2(0)).toEqual(todoStore2.getSnapshot()[0]);

    type Args = number;
    const TestIdiomaticSyncReducer = IdiomaticSyncReducer<Args>().build({
      serviceList: [
        {
          service: getAllTodos1,
        },
        {
          service: getTodoById2,
          getParams: (params: Args) => params,
        },
        {
          service: getTodoIdOrReturn1,
          getParams: (params: Args) => params,
        },
      ],
      reducer: ([todos, todo, number], params) => {
        return `${todos[params]?.id} + ${todo?.id} + ${number}`;
      },
    });

    expect(TestIdiomaticSyncReducer(0)).toEqual('undefined + undefined + 1');

    todoStore1.addTodo();
    todoStore2.addTodo();

    expect(TestIdiomaticSyncReducer(0)).toEqual('0 + 0 + 0');
  });

  it('should handle optional service params', () => {
    const {
      todoStore: todoStore1,
      getAllTodos: getAllTodos1,
      getTodoIdOrReturn1,
    } = createTodoStoreAndGetters();

    type Args = number | undefined;
    const TestIdiomaticSyncReducer = IdiomaticSyncReducer<Args>().build({
      serviceList: [
        { service: getAllTodos1 },
        {
          service: getTodoIdOrReturn1,
          getParams: (index: Args) => index || 1,
        },
      ],
      reducer: ([todos, todoId], params) => {
        return `${todos[params || 0]?.id} + ${todoId}`;
      },
    });

    expect(TestIdiomaticSyncReducer(0)).toEqual('undefined + 1');

    todoStore1.addTodo();

    expect(TestIdiomaticSyncReducer(0)).toEqual('0 + 1');
  });

  it('should throw ts error when mixing optional service params with required params', () => {
    const { getAllTodos, getTodoById, getTodoIdOrReturn1 } =
      createTodoStoreAndGetters();

    type Args = number | undefined;
    IdiomaticSyncReducer<Args>().build({
      serviceList: [
        // @ts-expect-error
        { service: getTodoById, getParams: (index: Args) => index },
        {
          service: getTodoIdOrReturn1,
          getParams: (index: Args) => index,
        },
      ],
      reducer: () => 'test',
    });

    IdiomaticSyncReducer<Args>().build({
      serviceList: [
        // @ts-expect-error
        { service: getTodoById },
        {
          service: getTodoIdOrReturn1,
          getParams: () => 1,
        },
      ],
      reducer: () => 'test',
    });

    IdiomaticSyncReducer<Args>().build({
      serviceList: [
        {
          service: getTodoById,
          getParams: (index: Args) => index || 0,
        },
        { service: getTodoIdOrReturn1 },
      ],
      reducer: () => 'test',
    });

    IdiomaticSyncReducer<Args>().build({
      serviceList: [
        {
          service: getAllTodos,
          // @ts-expect-error
          getParams: (index: Args) => index,
        },
      ],
      reducer: () => 'test',
    });
  });
});
