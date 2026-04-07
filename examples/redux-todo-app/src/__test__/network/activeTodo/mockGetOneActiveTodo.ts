import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';

export const mockGetOneActiveTodo = (
  server: SetupServer,
  activeTodoDto: TodoDto,
) => {
  server.use(
    http.get(`${getConfig().API_URL}/active-todo/${activeTodoDto.id}`, () => {
      return HttpResponse.json(activeTodoDto);
    }),
  );
};
