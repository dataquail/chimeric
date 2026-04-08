import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getContainer } from '@/core/global/container';
import { Title, Flex, Space, Loader } from '@mantine/core';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { ArchivedTodoList } from './ArchivedTodoList';

export const dynamic = 'force-dynamic';

export default async function ArchivedPage() {
  const container = getContainer();
  await container.archivedTodoService.getAll.prefetch();

  return (
    <HydrationBoundary state={dehydrate(container.queryClientProvider.get())}>
      <AppShellWrapper>
        <>
          <Flex justify="flex-start" align="center" direction="row" h="60px">
            <Title order={1}>Archived Todo List</Title>
          </Flex>
          <Space h="lg" />
          <Suspense
            fallback={
              <Flex justify="center" align="center" w="100%" h="100%">
                <Loader />
              </Flex>
            }
          >
            <ArchivedTodoList />
          </Suspense>
        </>
      </AppShellWrapper>
    </HydrationBoundary>
  );
}
