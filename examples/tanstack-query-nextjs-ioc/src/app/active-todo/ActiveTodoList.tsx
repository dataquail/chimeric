'use client';

import { ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { ActiveTodoCard } from './ActiveTodoCard';
import { getContainer } from '@/core/global/container';
import { usePriorityTodoStore } from '@/core/infrastructure/repositories/PriorityTodoRepository/priorityTodoStore';
import { useMemo } from 'react';

export const ActiveTodoList = () => {
  const { activeTodoService } = getContainer();
  const { data } = activeTodoService.getAll.useSuspenseHook();
  const { height } = useViewportSize();
  const priorityDict = usePriorityTodoStore((state) => state.dict);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aPrioritized = priorityDict[a.id]?.isPrioritized ?? false;
      const bPrioritized = priorityDict[b.id]?.isPrioritized ?? false;
      if (aPrioritized && !bPrioritized) return -1;
      if (!aPrioritized && bPrioritized) return 1;
      return 0;
    });
  }, [data, priorityDict]);

  return (
    <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
      {sortedData.map((todo) => (
        <ActiveTodoCard key={todo.id} todo={todo} />
      ))}
    </ScrollArea.Autosize>
  );
};
