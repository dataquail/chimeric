import { AppStore } from '@/lib/store';
import { removeAllActiveTodos } from '@/core/infrastructure/services/ActiveTodoService/activeTodoStore';

export const ClearAllMethodImpl = (appStore: AppStore) => () =>
  appStore.dispatch(removeAllActiveTodos());
