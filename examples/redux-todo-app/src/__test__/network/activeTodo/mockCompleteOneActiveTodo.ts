import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockCompleteOneActiveTodo = (
  server: SetupServer,
  completeActiveTodoResponse: { message: string },
) => {
  server.use(
    http.post(`${getConfig().API_URL}/active-todo/:id/complete`, () => {
      return HttpResponse.json(completeActiveTodoResponse);
    }),
  );
};
