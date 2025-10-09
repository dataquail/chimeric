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
});
