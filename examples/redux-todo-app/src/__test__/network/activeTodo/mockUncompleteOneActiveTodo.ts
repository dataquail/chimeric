import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockUncompleteOneActiveTodo = (
  server: SetupServer,
  uncompleteActiveTodoResponse: { message: string },
) => {
  server.use(
    http.post(`${getConfig().API_URL}/active-todo/:id/uncomplete`, () => {
      return HttpResponse.json(uncompleteActiveTodoResponse);
    }),
  );
};
