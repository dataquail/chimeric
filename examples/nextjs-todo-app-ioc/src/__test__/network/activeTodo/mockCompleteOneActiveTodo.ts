import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/utils/getConfig';
import { ICompleteActiveTodo } from '@/core/infrastructure/services/ActiveTodoService/methods/complete';

export const mockCompleteOneActiveTodo = (
  server: SetupServer,
  completeActiveTodoResponse: Awaited<ReturnType<ICompleteActiveTodo>>,
) => {
  server.use(
    http.post(`${getConfig().API_URL}/active-todo/:id/complete`, () => {
      return HttpResponse.json(completeActiveTodoResponse);
    }),
  );
};
