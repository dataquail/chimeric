import { AppStore } from 'src/lib/store';
import { removeAllActiveTodos } from 'src/core/infrastructure/services/ActiveTodoService/activeTodoStore';

export const ClearAllMethodImpl = (appStore: AppStore) => () =>
  appStore.dispatch(removeAllActiveTodos());
