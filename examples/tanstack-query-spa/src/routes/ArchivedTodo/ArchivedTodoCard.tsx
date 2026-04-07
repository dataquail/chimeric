import {
  Box,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { format } from 'date-fns';
import { IconDots, IconRestore, IconTrash } from '@tabler/icons-react';
import { ArchivedTodo } from 'src/core/domain/archivedTodo/entities/ArchivedTodo';
import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';

type Props = {
  archivedTodo: ArchivedTodo;
};

export const ArchivedTodoCard = ({ archivedTodo }: Props) => {
  const unarchiveOne = archivedTodoService.unarchiveOne.useHook();
  const deleteOne = archivedTodoService.deleteOne.useHook();

  return (
    <Box key={archivedTodo.id} p="xs" pr="lg">
      <Group wrap="nowrap" align="flex-start">
        <Stack p="xs" align="stretch" gap="xs" style={{ flex: 1 }}>
          {deleteOne.isPending || unarchiveOne.isPending ? (
            <Loader size="sm" />
          ) : null}
          <Title order={4}>{archivedTodo.title}</Title>
          <Text size="sm">{`Completed At: ${format(
            archivedTodo.completedAt,
            'M/d/yyyy h:m aaa',
          )}`}</Text>
          <Text size="sm">{`Archived At: ${format(
            archivedTodo.archivedAt,
            'M/d/yyyy h:m aaa',
          )}`}</Text>
        </Stack>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <IconDots />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Archived Todo Options</Menu.Label>
            <Menu.Item
              leftSection={
                <IconRestore style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => unarchiveOne.invoke({ id: archivedTodo.id })}
            >
              Unarchive
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => deleteOne.invoke({ id: archivedTodo.id })}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
};
