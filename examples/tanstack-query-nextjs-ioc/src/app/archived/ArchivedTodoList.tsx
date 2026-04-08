'use client';

import { getContainer } from '@/core/global/container';
import { ArchivedTodoCard } from './ArchivedTodoCard';
import { mapArchivedTodoDtoToArchivedTodo } from '@/core/domain/archivedTodo/entities/ArchivedTodo';

export const ArchivedTodoList = () => {
  const { archivedTodoService } = getContainer();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    archivedTodoService.getAll.useSuspenseHook();

  const archivedTodos = data.pages.flatMap((page) =>
    page.list.map(mapArchivedTodoDtoToArchivedTodo),
  );

  return (
    <div className="scroll-area">
      {archivedTodos.map((archivedTodo) => (
        <ArchivedTodoCard
          key={archivedTodo.id}
          archivedTodo={archivedTodo}
        />
      ))}
      {hasNextPage && (
        <div className="flex-center">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <span className="loader loader-sm" />
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
