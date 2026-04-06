'use client';

import { ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { ActiveTodoCard } from './ActiveTodoCard';
import { getContainer } from '@/core/global/container';

export const ActiveTodoList = () => {
  const { activeTodoService } = getContainer();
  const { data } = activeTodoService.getAll.useSuspenseHook();
  const { height } = useViewportSize();

  return (
    <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
      {data.map((todo) => (
        <ActiveTodoCard key={todo.id} todo={todo} />
      ))}
    </ScrollArea.Autosize>
  );
};
