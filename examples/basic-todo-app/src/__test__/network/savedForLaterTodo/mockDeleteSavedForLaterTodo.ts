import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { IDeleteSavedForLaterTodo } from 'src/core/infrastructure/services/SavedForLaterTodoService/methods/deleteOne';

export const mockDeleteSavedForLaterTodo = (
  server: SetupServer,
  deleteSavedForLaterTodoResponse: Awaited<
    ReturnType<IDeleteSavedForLaterTodo>
  >,
) => {
  server.use(
    http.delete(`${getConfig().API_URL}/saved-for-later-todo/:id`, () => {
      return HttpResponse.json(deleteSavedForLaterTodoResponse);
    }),
  );
};
