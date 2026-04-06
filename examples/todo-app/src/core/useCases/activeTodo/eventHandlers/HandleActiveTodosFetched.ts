import {
  IPriorityTodoRepository,
  PriorityTodo,
} from 'src/core/domain/priorityTodo/ports/IPriorityTodoRepository';
import { IApplicationEventEmitter } from 'src/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { ActiveTodosFetchedEvent } from 'src/core/domain/activeTodo/events/ActiveTodosFetchedEvent';

export const createHandleActiveTodosFetched = (
  priorityTodoRepository: IPriorityTodoRepository,
  applicationEventEmitter: IApplicationEventEmitter,
) => {
  const execute = (event: unknown) => {
    if (event instanceof ActiveTodosFetchedEvent) {
      const activeIds = event.payload.ids;
      const reconciled: PriorityTodo[] = activeIds.map((id) => {
        const existing = priorityTodoRepository.getOneById({ id });
        return existing ?? { id, isPrioritized: false };
      });

      priorityTodoRepository.saveMany(reconciled);
    }
  };

  applicationEventEmitter.subscribe(execute);

  return { execute };
};
