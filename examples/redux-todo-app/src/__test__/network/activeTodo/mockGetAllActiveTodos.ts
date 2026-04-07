import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { TodoListDto } from 'src/core/domain/activeTodo/dtos/out/TodoListDto';

export const mockGetAllActiveTodos = (
  server: SetupServer,
  activeTodoListDto: TodoListDto,
) => {
  server.use(
    http.get(`${getConfig().API_URL}/active-todo`, () => {
      return HttpResponse.json(activeTodoListDto);
    }),
  );
};
