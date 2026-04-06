import { SerializedDomainEvent } from '@/utils/domain/DomainEvent';

export type Listener = (event: unknown) => void;

export interface IApplicationEventEmitter {
  subscribe(listener: Listener): () => void;
  emit(event: unknown): void;
  clearEvents(): void;
  clearListeners(): void;
  getEvents(): unknown[];
  getDeferredEvents(): SerializedDomainEvent[];
  flushSerializedEvents(events: SerializedDomainEvent[]): void;
}
