import { Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { SavedForLaterTodoCard } from './SavedForLaterTodoCard';
import { savedForLaterTodoService } from 'src/core/infrastructure/services/SavedForLaterTodoService';

export const SaveForLaterTodoList = () => {
  const { data, isPending } = savedForLaterTodoService.getAll.useQuery();
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
      {data.map((savedForLaterTodo) => (
        <SavedForLaterTodoCard
          key={savedForLaterTodo.id}
          savedForLaterTodo={savedForLaterTodo}
        />
      ))}
    </ScrollArea.Autosize>
  );
};
