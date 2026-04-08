import {
  IPriorityTodoRepository,
  PriorityTodo,
} from 'src/core/domain/priorityTodo/ports/IPriorityTodoRepository';
import {
  PriorityTodoRecord,
  savePriorityTodo,
  saveManyPriorityTodos,
  deletePriorityTodo,
} from './priorityTodoStore';
import { ChimericSyncFactory } from 'src/utils/domain/ChimericSyncFactory';
import { appStore } from 'src/core/global/appStore';

const toDomain = (record: PriorityTodoRecord): PriorityTodo => ({
  id: record.id,
  isPrioritized: record.isPrioritized,
});

export const createPriorityTodoRepository = (): IPriorityTodoRepository => ({
  getOneById: ChimericSyncFactory({
    selector: (args: { id: string }) => (state) =>
      state.todo.priorityTodo.dict[args.id],
    reducer: (record) => (record ? toDomain(record) : undefined),
  }),
  save: (priorityTodo: PriorityTodo) => {
    appStore.dispatch(savePriorityTodo(priorityTodo));
  },
  saveMany: (priorityTodos: PriorityTodo[]) => {
    appStore.dispatch(saveManyPriorityTodos(priorityTodos));
  },
  delete: (args: { id: string }) => {
    appStore.dispatch(deletePriorityTodo(args));
  },
});
