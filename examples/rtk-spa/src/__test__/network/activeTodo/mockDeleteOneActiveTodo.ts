import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockDeleteOneActiveTodo = (
  server: SetupServer,
  deleteActiveTodoResponse: { message: string },
) => {
  server.use(
    http.delete(`${getConfig().API_URL}/active-todo/:id`, () => {
      return HttpResponse.json(deleteActiveTodoResponse);
    }),
  );
};
