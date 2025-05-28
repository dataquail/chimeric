import { deprioritizeActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { saveActiveTodo } from '../activeTodoStore';
import { appStore } from 'src/core/global/appStore';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const DeprioritizeMethodImpl: IActiveTodoService['deprioritize'] =
  (args: { id: string }) => {
    const activeTodo = appStore.getState().todo.activeTodos.dict[args.id];

    if (!activeTodo) {
      throw new Error('ActiveTodo not found');
    }

    const deprioritizedActiveTodo = deprioritizeActiveTodo(activeTodo);

    appStore.dispatch(saveActiveTodo(deprioritizedActiveTodo));
  };
