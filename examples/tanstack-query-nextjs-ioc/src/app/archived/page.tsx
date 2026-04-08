import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getContainer } from '@/core/global/container';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { ArchivedTodoList } from './ArchivedTodoList';

export const dynamic = 'force-dynamic';

export default async function ArchivedPage() {
  const container = getContainer();
  await container.archivedTodoService.getAll.prefetch();

  return (
    <HydrationBoundary state={dehydrate(container.queryClientProvider.get())}>
      <AppShellWrapper>
        <div className="page-header">
          <h1>Archived Todo List</h1>
        </div>
        <div className="spacer-lg" />
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader" />
            </div>
          }
        >
          <ArchivedTodoList />
        </Suspense>
      </AppShellWrapper>
    </HydrationBoundary>
  );
}
