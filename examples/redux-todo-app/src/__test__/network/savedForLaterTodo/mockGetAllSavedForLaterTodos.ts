import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { SavedForLaterTodoListDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoListDto';

export const mockGetAllSavedForLaterTodos = (
  server: SetupServer,
  savedForLaterTodoListDto: SavedForLaterTodoListDto,
) => {
  server.use(
    http.get(`${getConfig().API_URL}/saved-for-later-todo`, () => {
      return HttpResponse.json(savedForLaterTodoListDto);
    }),
  );
};
