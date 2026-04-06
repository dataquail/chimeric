import { DomainEventDeserializer } from '@/utils/domain/DomainEvent';
import { ActiveTodosFetchedEvent } from './ActiveTodosFetchedEvent';

export const deserializeActiveTodoEvents: DomainEventDeserializer = (data) => {
  if (data.name === 'ActiveTodosFetchedEvent') {
    return new ActiveTodosFetchedEvent(data.payload as { ids: string[] });
  }
  return undefined;
};
