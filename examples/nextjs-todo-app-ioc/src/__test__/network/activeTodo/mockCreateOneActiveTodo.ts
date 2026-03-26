import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';
import { ICreateActiveTodo } from '@/core/infrastructure/services/ActiveTodoService/methods/createOne';

export const mockCreateOneActiveTodo = (
  server: SetupServer,
  createActiveTodoResponse: Awaited<ReturnType<ICreateActiveTodo>>,
) => {
  server.use(
    http.post(`${getConfig().API_URL}/active-todo`, () => {
      return HttpResponse.json(createActiveTodoResponse);
    }),
  );
};
