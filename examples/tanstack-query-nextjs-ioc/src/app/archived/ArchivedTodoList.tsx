'use client';

import { Button, Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { getContainer } from '@/core/global/container';
import { ArchivedTodoCard } from './ArchivedTodoCard';
import { mapArchivedTodoDtoToArchivedTodo } from '@/core/domain/archivedTodo/entities/ArchivedTodo';

export const ArchivedTodoList = () => {
  const { archivedTodoService } = getContainer();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    archivedTodoService.getAll.useSuspenseHook();
  const { height } = useViewportSize();

  const archivedTodos = data.pages.flatMap((page) =>
    page.list.map(mapArchivedTodoDtoToArchivedTodo),
  );

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
