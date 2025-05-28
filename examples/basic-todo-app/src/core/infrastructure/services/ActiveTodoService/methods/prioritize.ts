import { saveActiveTodo } from '../activeTodoStore';
import { prioritizeActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { appStore } from 'src/core/global/appStore';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const PrioritizeMethodImpl: IActiveTodoService['prioritize'] = (args: {
  id: string;
}) => {
  const activeTodo = appStore.getState().todo.activeTodos.dict[args.id];

  if (!activeTodo) {
    throw new Error('ActiveTodo not found');
  }

  const prioritizedActiveTodo = prioritizeActiveTodo(activeTodo);

  appStore.dispatch(saveActiveTodo(prioritizedActiveTodo));
};
