import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockCreateOneActiveTodo = (
  server: SetupServer,
  createActiveTodoResponse: { id: string },
) => {
  server.use(
    http.post(`${getConfig().API_URL}/active-todo`, () => {
      return HttpResponse.json(createActiveTodoResponse);
    }),
  );
};
