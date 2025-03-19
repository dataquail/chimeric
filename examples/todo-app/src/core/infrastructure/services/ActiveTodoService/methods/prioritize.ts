import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { AppStore } from 'src/lib/store';
import { saveActiveTodo } from '../activeTodoStore';
import { prioritizeActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';

export const PrioritizeMethodImpl = (
  appStore: AppStore,
): IActiveTodoService['prioritize'] => {
  return (args: { id: string }) => {
    const activeTodo = appStore.getState().todo.activeTodos.dict[args.id];

    if (!activeTodo) {
      throw new Error('ActiveTodo not found');
    }

    const prioritizedActiveTodo = prioritizeActiveTodo(activeTodo);

    appStore.dispatch(saveActiveTodo(prioritizedActiveTodo));
  };
};
