import { Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { ActiveTodoCard } from './ActiveTodoCard';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { useAppSelector } from 'src/lib/store';
import { useMemo } from 'react';

export const ActiveTodoList = () => {
  const { data, isPending } = activeTodoService.getAll.useHook();
  const { height } = useViewportSize();
  const priorityDict = useAppSelector(
    (state) => state.todo.priorityTodo.dict,
  );

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const aPrioritized = priorityDict[a.id]?.isPrioritized ?? false;
      const bPrioritized = priorityDict[b.id]?.isPrioritized ?? false;
      if (aPrioritized && !bPrioritized) return -1;
      if (!aPrioritized && bPrioritized) return 1;
      return 0;
    });
  }, [data, priorityDict]);

  if (isPending || !data) {
    return (
      <Flex justify="center" align="center" w="100%" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
      {sortedData.map((todo) => (
        <ActiveTodoCard key={todo.id} todo={todo} />
      ))}
    </ScrollArea.Autosize>
  );
};
