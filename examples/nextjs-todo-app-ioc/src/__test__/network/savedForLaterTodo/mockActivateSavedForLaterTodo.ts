import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';
import { IActivateSavedForLaterTodo } from '@/core/infrastructure/services/SavedForLaterTodoService/methods/activate';

export const mockActivateSavedForLaterTodo = (
  server: SetupServer,
  activateSavedForLaterTodoResponse: Awaited<
    ReturnType<IActivateSavedForLaterTodo>
  >,
) => {
  server.use(
    http.post(`${getConfig().API_URL}/saved-for-later-todo/activate`, () => {
      return HttpResponse.json(activateSavedForLaterTodoResponse);
    }),
  );
};
