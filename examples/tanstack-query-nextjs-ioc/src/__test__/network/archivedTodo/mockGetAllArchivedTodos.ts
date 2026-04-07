import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';
import { ArchivedTodoPageDto } from '@/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';

export const mockGetAllArchivedTodos = (
  server: SetupServer,
  archivedTodoPageDto: ArchivedTodoPageDto,
) => {
  server.use(
    http.get(`${getConfig().API_URL}/archived-todo`, () => {
      return HttpResponse.json(archivedTodoPageDto);
    }),
  );
};
