import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getContainer } from '@/core/global/container';
import { Title, Flex, Space, Loader } from '@mantine/core';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { ActiveTodoList } from './ActiveTodoList';
import { AddNewActiveTodoForm } from './AddNewActiveTodoForm';
import { EventHydration } from '@/providers/EventHydration';

export default async function ActiveTodoPage() {
  const container = getContainer();
  await container.activeTodoService.getAll.prefetch();

  return (
    <HydrationBoundary state={dehydrate(container.queryClientProvider.get())}>
      <EventHydration
        events={container.applicationEventEmitter.getDeferredEvents()}
      />
      <AppShellWrapper>
        <>
          <Flex justify="space-between" align="center" direction="row" h="60px">
            <Title order={1}>Active Todo List</Title>
            <AddNewActiveTodoForm />
          </Flex>
          <Space h="lg" />
          <Suspense
            fallback={
              <Flex justify="center" align="center" w="100%" h="100%">
                <Loader />
              </Flex>
            }
          >
            <ActiveTodoList />
          </Suspense>
        </>
      </AppShellWrapper>
    </HydrationBoundary>
  );
}
