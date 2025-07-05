import {
  Box,
  Checkbox,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { format } from 'date-fns';
import {
  IconDots,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';
import { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { savedForLaterTodoService } from 'src/core/infrastructure/services/SavedForLaterTodoService';

type OwnProps = {
  todo: ActiveTodo;
};

export const ActiveTodoCard = ({ todo }: OwnProps) => {
  const saveForLater = savedForLaterTodoService.saveForLater.useMutation();
  const completeOne = activeTodoService.completeOne.useMutation();
  const uncompleteOne = activeTodoService.uncompleteOne.useMutation();
  const deleteOne = activeTodoService.deleteOne.useMutation();
  const prioritize = activeTodoService.prioritize;
  const deprioritize = activeTodoService.deprioritize;

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
              <Text size="sm">{`Created At: ${format(todo.createdAt, 'M/d/yyyy h:m aaa')}`}</Text>
              <Text size="sm">{`Completed At: ${todo.completedAt ? format(todo.completedAt, 'M/d/yyyy h:m aaa') : 'N/A'}`}</Text>
            </Stack>
            {todo.isPrioritized && (
              <Box style={{ flexGrow: 1 }} p="xs">
                <IconStarFilled
                  style={{
                    width: rem(20),
                    height: rem(20),
                    position: 'absolute',
                    right: rem(70),
                  }}
                />
              </Box>
            )}
          </Group>
        </Checkbox.Card>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <IconDots />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Todo Options</Menu.Label>
            <Menu.Item
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => deleteOne.invoke({ id: todo.id })}
            >
              Delete
            </Menu.Item>
            {todo.isPrioritized ? (
              <Menu.Item
                leftSection={
                  <IconStar style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => deprioritize({ id: todo.id })}
              >
                Deprioritize
              </Menu.Item>
            ) : (
              <Menu.Item
                leftSection={
                  <IconStarFilled style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => prioritize({ id: todo.id })}
              >
                Prioritize
              </Menu.Item>
            )}
            <Menu.Item
              leftSection={
                <IconPlus style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() =>
                saveForLater.invoke({
                  activeTodoId: todo.id,
                })
              }
            >
              Save For Later
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
};
