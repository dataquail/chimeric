import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { SavedForLaterTodoDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';

export const mockGetOneSavedForLaterTodo = (
  server: SetupServer,
  savedForLaterTodoDto: SavedForLaterTodoDto,
) => {
  server.use(
    http.get(
      `${getConfig().API_URL}/saved-for-later-todo/${savedForLaterTodoDto.id}`,
      () => {
        return HttpResponse.json(savedForLaterTodoDto);
      },
    ),
  );
};
