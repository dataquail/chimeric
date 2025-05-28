import { Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { ActiveTodoCard } from './ActiveTodoCard';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';

export const ActiveTodoList = () => {
  const { data, isPending } = activeTodoService.getAll.useQuery();
  const { height } = useViewportSize();

  if (isPending || !data) {
    return (
      <Flex justify="center" align="center" w="100%" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
      {data.map((todo) => (
        <ActiveTodoCard key={todo.id} todo={todo} />
      ))}
    </ScrollArea.Autosize>
  );
};
