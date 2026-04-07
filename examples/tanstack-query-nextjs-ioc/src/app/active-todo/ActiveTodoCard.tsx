'use client';

import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { format } from 'date-fns';
import { IconStar, IconStarFilled, IconTrash } from '@tabler/icons-react';
import { ActiveTodo } from '@/core/domain/activeTodo/entities/ActiveTodo';
import { getContainer } from '@/core/global/container';

type Props = {
  todo: ActiveTodo;
};

export const ActiveTodoCard = ({ todo }: Props) => {
  const {
    activeTodoService,
    priorityTodoRepository,
    prioritizeTodoUseCase,
    deprioritizeTodoUseCase,
  } = getContainer();

  const priorityTodo = priorityTodoRepository.getOneById.useHook({
    id: todo.id,
  });
  const isPrioritized = priorityTodo?.isPrioritized ?? false;

  const completeOne = activeTodoService.completeOne.useHook();
  const uncompleteOne = activeTodoService.uncompleteOne.useHook();
  const deleteOne = activeTodoService.deleteOne.useHook();

  return (
    <Box key={todo.id} p="xs" pr="lg">
      <Group wrap="nowrap" align="flex-start">
        <Checkbox.Card
          radius="md"
          checked={Boolean(todo.completedAt)}
          disabled={deleteOne.isPending}
          onClick={() => {
            const isCompleted = Boolean(todo.completedAt);
            if (isCompleted) {
              uncompleteOne.invoke({ id: todo.id });
            } else {
              completeOne.invoke({ id: todo.id });
            }
          }}
        >
          <Group wrap="nowrap" align="flex-start">
            {deleteOne.isPending ||
            completeOne.isPending ||
            uncompleteOne.isPending ? (
              <Loader p="xs" />
            ) : (
              <Checkbox.Indicator mt="sm" ml="sm" />
            )}
            <Stack p="xs" align="stretch" gap="xs">
              <Title order={4}>{todo.title}</Title>
              <Text size="sm">{`Created At: ${format(
                todo.createdAt,
                'M/d/yyyy h:m aaa',
              )}`}</Text>
              <Text size="sm">{`Completed At: ${
                todo.completedAt
                  ? format(todo.completedAt, 'M/d/yyyy h:m aaa')
                  : 'N/A'
              }`}</Text>
            </Stack>
          </Group>
        </Checkbox.Card>
        <ActionIcon
          variant={isPrioritized ? 'filled' : 'subtle'}
          color="yellow"
          size="lg"
          onClick={() =>
            isPrioritized
              ? deprioritizeTodoUseCase({ id: todo.id })
              : prioritizeTodoUseCase({ id: todo.id })
          }
        >
          {isPrioritized ? (
            <IconStarFilled style={{ width: rem(20), height: rem(20) }} />
          ) : (
            <IconStar style={{ width: rem(20), height: rem(20) }} />
          )}
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          size="lg"
          onClick={() => deleteOne.invoke({ id: todo.id })}
          disabled={deleteOne.isPending}
        >
          <IconTrash style={{ width: rem(20), height: rem(20) }} />
        </ActionIcon>
      </Group>
    </Box>
  );
};
