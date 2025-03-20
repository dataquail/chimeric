import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { IGetSavedForLaterTodo } from 'src/core/infrastructure/services/SavedForLaterTodoService/methods/getOneById';

export const mockGetOneSavedForLaterTodo = (
  server: SetupServer,
  savedForLaterTodoDto: Awaited<ReturnType<IGetSavedForLaterTodo>>,
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
