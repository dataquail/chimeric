import { Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { container } from 'src/core/global/container';
import { SavedForLaterTodoCard } from './SavedForLaterTodoCard';

export const SaveForLaterTodoList = () => {
  const { savedForLaterTodoService } = container;
  const { data, isPending } = savedForLaterTodoService.getAll.useHook();
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
