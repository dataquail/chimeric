import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';
import { IDeleteActiveTodo } from '@/core/infrastructure/services/ActiveTodoService/methods/deleteOne';

export const mockDeleteOneActiveTodo = (
  server: SetupServer,
  deleteActiveTodoResponse: Awaited<ReturnType<IDeleteActiveTodo>>,
) => {
  server.use(
    http.delete(`${getConfig().API_URL}/active-todo/:id`, () => {
      return HttpResponse.json(deleteActiveTodoResponse);
    }),
  );
};
