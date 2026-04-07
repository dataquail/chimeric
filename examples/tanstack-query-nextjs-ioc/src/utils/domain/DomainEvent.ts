export abstract class DomainEvent<TPayload extends object> {
  constructor(
    public readonly name: string,
    public readonly payload: TPayload,
  ) {}
}

export type SerializedDomainEvent = {
  name: string;
  payload: object;
};

export type DomainEventDeserializer = (
  data: SerializedDomainEvent,
) => DomainEvent<object> | undefined;
