import { ChimericQueryFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { ActiveTodo, mapTodoDtoToActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { TodoListDto } from 'src/core/domain/activeTodo/dtos/out/TodoListDto';

export const GET_ALL_QUERY_KEY = ['GET_ACTIVE_TODO_LIST'] as const;

export const getQueryOptionsGetAll = () => ({
  queryKey: [...GET_ALL_QUERY_KEY] as const,
  queryFn: async (): Promise<ActiveTodo[]> => {
    const todoListDto = await wrappedFetch<TodoListDto>(
      `${getConfig().API_URL}/active-todo`,
    );
    return todoListDto.list.map(mapTodoDtoToActiveTodo);
  },
});

export const GetAllMethodImpl = ChimericQueryFactory<void, ActiveTodo[]>({
  queryClient,
  getQueryOptions: getQueryOptionsGetAll,
});
