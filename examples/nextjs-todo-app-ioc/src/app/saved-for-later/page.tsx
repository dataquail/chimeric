import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getContainer } from '@/core/global/container';
import { Title, Flex, Space, Loader } from '@mantine/core';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { SaveForLaterTodoList } from './SaveForLaterTodoList';

export default async function SavedForLaterPage() {
  const container = getContainer();
  await container.savedForLaterTodoService.getAll.prefetch();

  return (
    <HydrationBoundary state={dehydrate(container.queryClientProvider.get())}>
      <AppShellWrapper>
        <>
          <Flex justify="flex-start" align="center" direction="row" h="60px">
            <Title order={1}>Saved For Later Todo List</Title>
          </Flex>
          <Space h="lg" />
          <Suspense
            fallback={
              <Flex justify="center" align="center" w="100%" h="100%">
                <Loader />
              </Flex>
            }
          >
            <SaveForLaterTodoList />
          </Suspense>
        </>
      </AppShellWrapper>
    </HydrationBoundary>
  );
}
