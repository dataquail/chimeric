import { QueryClient } from '@tanstack/react-query';
import { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { getQueryOptionsGetAll } from './getAll';

export const ClearAllMethodImpl = (queryClient: QueryClient) => () =>
  queryClient.setQueryData<ActiveTodo[]>(
    getQueryOptionsGetAll().queryKey,
    [],
  );
