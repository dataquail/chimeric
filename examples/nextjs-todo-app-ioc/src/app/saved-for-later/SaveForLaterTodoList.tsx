'use client';

import { ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { getContainer } from '@/core/global/container';
import { SavedForLaterTodoCard } from './SavedForLaterTodoCard';

export const SaveForLaterTodoList = () => {
  const { savedForLaterTodoService } = getContainer();
  const { data } = savedForLaterTodoService.getAll.useSuspenseHook();
  const { height } = useViewportSize();

  return (
    <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
      {data.map((savedForLaterTodo) => (
        <SavedForLaterTodoCard
          key={savedForLaterTodo.id}
          savedForLaterTodo={savedForLaterTodo}
        />
      ))}
    </ScrollArea.Autosize>
  );
};
