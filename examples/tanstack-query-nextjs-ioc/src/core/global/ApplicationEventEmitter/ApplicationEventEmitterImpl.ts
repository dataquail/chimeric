import {
  DomainEvent,
  SerializedDomainEvent,
  DomainEventDeserializer,
} from '@/utils/domain/DomainEvent';
import { IApplicationEventEmitter, Listener } from './IApplicationEventEmitter';

export class ApplicationEventEmitterImpl implements IApplicationEventEmitter {
  private readonly events: Set<unknown>;
  private readonly listeners: Set<Listener>;
  private readonly deferredEvents: SerializedDomainEvent[];
  private readonly isServer: boolean;
  private readonly deserializers: DomainEventDeserializer[];

  constructor(deserializers: DomainEventDeserializer[] = []) {
    this.events = new Set();
    this.listeners = new Set();
    this.deferredEvents = [];
    this.isServer = typeof window === 'undefined';
    this.deserializers = deserializers;
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);

    this.events.forEach((event) => {
      listener(event);
      this.events.delete(event);
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: unknown) {
    if (this.isServer && event instanceof DomainEvent) {
      this.deferredEvents.push({
        name: event.name,
        payload: event.payload,
      });
    }

    this.events.add(event);

    if (this.listeners.size > 0) {
      this.listeners.forEach((listener) => {
        listener(event);
      });
      this.events.delete(event);
    }
  }

  public clearEvents() {
    this.events.clear();
  }

  public clearListeners() {
    this.listeners.clear();
  }

  public getEvents() {
    return Array.from(this.events);
  }

  public getDeferredEvents(): SerializedDomainEvent[] {
    return [...this.deferredEvents];
  }

  public flushSerializedEvents(events: SerializedDomainEvent[]) {
    for (const serialized of events) {
      let deserialized: DomainEvent<object> | undefined;
      for (const deserializer of this.deserializers) {
        deserialized = deserializer(serialized);
        if (deserialized) break;
      }
      if (deserialized) {
        this.emit(deserialized);
      }
    }
  }
}
