'use client';

import { useRef } from 'react';
import { getContainer } from '@/core/global/container';
import { SerializedDomainEvent } from '@/utils/domain/DomainEvent';

type Props = {
  events: SerializedDomainEvent[];
};

export const EventHydration = ({ events }: Props) => {
  const hasFlushed = useRef(false);

  if (!hasFlushed.current && events.length > 0) {
    getContainer().applicationEventEmitter.flushSerializedEvents(events);
    hasFlushed.current = true;
  }

  return null;
};
