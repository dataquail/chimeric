import { DomainEvent } from '@/utils/domain/DomainEvent';

export class SavedForLaterTodoDeletedEvent extends DomainEvent<{ id: string }> {
  constructor(payload: { id: string }) {
    super('SavedForLaterTodoDeletedEvent', payload);
  }
}
