import { Title, Flex, Space } from '@mantine/core';
import { AppShellWrapper } from 'src/components/AppShellWrapper';
import { ArchivedTodoList } from './ArchivedTodoList';

export const ArchivedTodo = () => {
  return (
    <AppShellWrapper>
      <>
        <Flex justify="flex-start" align="center" direction="row" h="60px">
          <Title order={1}>Archived Todo List</Title>
        </Flex>
        <Space h="lg" />
        <ArchivedTodoList />
      </>
    </AppShellWrapper>
  );
};
