import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { AppStore } from 'src/lib/store';
import { deprioritizeActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { saveActiveTodo } from '../activeTodoStore';

export const DeprioritizeMethodImpl = (
  appStore: AppStore,
): IActiveTodoService['deprioritize'] => {
  return (args: { id: string }) => {
    const activeTodo = appStore.getState().todo.activeTodos.dict[args.id];

    if (!activeTodo) {
      throw new Error('ActiveTodo not found');
    }

    const deprioritizedActiveTodo = deprioritizeActiveTodo(activeTodo);

    appStore.dispatch(saveActiveTodo(deprioritizedActiveTodo));
  };
};
