import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockActivateSavedForLaterTodo = (
  server: SetupServer,
  activateSavedForLaterTodoResponse: { id: string },
) => {
  server.use(
    http.post(`${getConfig().API_URL}/saved-for-later-todo/activate`, () => {
      return HttpResponse.json(activateSavedForLaterTodoResponse);
    }),
  );
};
