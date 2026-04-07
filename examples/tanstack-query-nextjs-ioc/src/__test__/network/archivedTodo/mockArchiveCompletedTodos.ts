import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';

export const mockArchiveCompletedTodos = (
  server: SetupServer,
  response: { ids: string[] },
) => {
  server.use(
    http.post(`${getConfig().API_URL}/archived-todo/archive`, () => {
      return HttpResponse.json(response);
    }),
  );
};
