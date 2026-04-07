import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockDeleteSavedForLaterTodo = (
  server: SetupServer,
  deleteSavedForLaterTodoResponse: { message: string },
) => {
  server.use(
    http.delete(`${getConfig().API_URL}/saved-for-later-todo/:id`, () => {
      return HttpResponse.json(deleteSavedForLaterTodoResponse);
    }),
  );
};
