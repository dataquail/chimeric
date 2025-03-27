import { Title, Flex, Space } from '@mantine/core';
import { AppShellWrapper } from 'src/components/AppShellWrapper';
import { ActiveTodoList } from './ActiveTodoList';
import { AddNewActiveTodoForm } from './AddNewActiveTodoForm';

export const ActiveTodo = () => {
  return (
    <AppShellWrapper>
      <>
        <Flex justify="space-between" align="center" direction="row" h="60px">
          <Title order={1}>Active Todo List</Title>
          <AddNewActiveTodoForm />
        </Flex>
        <Space h="lg" />
        <ActiveTodoList />
      </>
    </AppShellWrapper>
  );
};
