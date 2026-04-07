import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { IGetAllSavedForLaterTodos } from 'src/core/infrastructure/services/SavedForLaterTodoService/methods/getAll';

export const mockGetAllSavedForLaterTodos = (
  server: SetupServer,
  savedForLaterTodoListDto: Awaited<ReturnType<IGetAllSavedForLaterTodos>>,
) => {
  server.use(
    http.get(`${getConfig().API_URL}/saved-for-later-todo`, () => {
      return HttpResponse.json(savedForLaterTodoListDto);
    }),
  );
};
