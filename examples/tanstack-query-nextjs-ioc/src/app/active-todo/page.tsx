import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getContainer } from '@/core/global/container';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { ActiveTodoList } from './ActiveTodoList';
import { AddNewActiveTodoForm } from './AddNewActiveTodoForm';
import { EventHydration } from '@/providers/EventHydration';

export const dynamic = 'force-dynamic';

export default async function ActiveTodoPage() {
  const container = getContainer();
  await container.activeTodoService.getAll.prefetch();

  return (
    <HydrationBoundary state={dehydrate(container.queryClientProvider.get())}>
      <EventHydration
        events={container.applicationEventEmitter.getDeferredEvents()}
      />
      <AppShellWrapper>
        <div className="page-header">
          <h1>Active Todo List</h1>
          <AddNewActiveTodoForm />
        </div>
        <div className="spacer-lg" />
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader" />
            </div>
          }
        >
          <ActiveTodoList />
        </Suspense>
      </AppShellWrapper>
    </HydrationBoundary>
  );
}
