import {
  IPriorityTodoRepository,
  PriorityTodo,
} from '@/core/domain/priorityTodo/ports/IPriorityTodoRepository';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { ActiveTodosFetchedEvent } from '@/core/domain/activeTodo/events/ActiveTodosFetchedEvent';

export const createHandleActiveTodosFetched = (
  priorityTodoRepository: IPriorityTodoRepository,
  applicationEventEmitter: IApplicationEventEmitter,
) => {
  const execute = (event: unknown) => {
    if (event instanceof ActiveTodosFetchedEvent) {
      const activeIds = event.payload.ids;
      // Build reconciled list: preserve existing priority for known IDs,
      // default new IDs to unprioritized
      const reconciled: PriorityTodo[] = activeIds.map((id) => {
        const existing = priorityTodoRepository.getOneById({ id });
        return existing ?? { id, isPrioritized: false };
      });

      // Save reconciled entries (adds new, preserves existing)
      priorityTodoRepository.saveMany(reconciled);

      // Note: stale entries (IDs no longer in the active list) remain in the store.
      // This is acceptable since they're inert — getOneById for a stale ID
      // won't be called from the UI since ActiveTodoCard only renders
      // for todos in the current active list.
    }
  };

  applicationEventEmitter.subscribe(execute);

  return { execute };
};
