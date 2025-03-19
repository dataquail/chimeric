import { Title, Flex, Space } from '@mantine/core';
import { TodoList } from 'src/routes/Todo/TodoList';
import { AddNewTodoForm } from 'src/routes/Todo/AddNewTodoForm';
import { AppShellWrapper } from 'src/components/AppShellWrapper';

export const Todo = () => {
  return (
    <AppShellWrapper>
      <>
        <Flex justify="space-between" align="center" direction="row" h="60px">
          <Title order={1}>Active Todo List</Title>
          <AddNewTodoForm />
        </Flex>
        <Space h="lg" />
        <TodoList />
      </>
    </AppShellWrapper>
  );
};
