import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';
import { IDeleteSavedForLaterTodo } from '@/core/infrastructure/services/SavedForLaterTodoService/methods/deleteOne';

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
