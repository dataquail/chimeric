import { Button, Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
import { ArchivedTodoCard } from './ArchivedTodoCard';
import { mapArchivedTodoDtoToArchivedTodo } from 'src/core/domain/archivedTodo/entities/ArchivedTodo';

export const ArchivedTodoList = () => {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    archivedTodoService.getAll.useHook();
  const { height } = useViewportSize();

  if (isPending) {
    return (
      <Flex justify="center" align="center" w="100%" h="100%">
        <Loader />
      </Flex>
    );
  }

  const archivedTodos =
    data?.pages.flatMap((page) =>
      page.list.map(mapArchivedTodoDtoToArchivedTodo),
    ) ?? [];

  return (
    <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
      {archivedTodos.map((archivedTodo) => (
        <ArchivedTodoCard
          key={archivedTodo.id}
          archivedTodo={archivedTodo}
        />
      ))}
      {hasNextPage && (
        <Flex justify="center" p="md">
          <Button
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
            variant="light"
          >
            {isFetchingNextPage ? <Loader size="sm" /> : 'Load More'}
          </Button>
        </Flex>
      )}
    </ScrollArea.Autosize>
  );
};
