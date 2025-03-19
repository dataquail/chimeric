import { http, HttpResponse } from 'msw';
import { getConfig } from '../utils/getConfig';
// import { ActiveTodoRepository } from './repositories/ActiveTodoRepository';
// import { CreateTodoBody } from 'src/core/domain/activeTodo/dtos/in/CreateTodoBody';

type ActiveTodoRepository = any;
type CreateTodoBody = any;

export const constructActiveTodoEndpointHandlers = (
  activeTodoRepository: ActiveTodoRepository,
) => {
  return [
    http.get(`${getConfig().API_URL}/active-todo`, async () => {
      return HttpResponse.json(activeTodoRepository.getAll());
    }),

    http.post(`${getConfig().API_URL}/active-todo`, async ({ request }) => {
      const createTodoBody =
        (await request.json()) as unknown as CreateTodoBody;
      const todoId = activeTodoRepository.create(createTodoBody);
      return HttpResponse.json({ id: todoId });
    }),

    http.delete(
      `${getConfig().API_URL}/active-todo/:id`,
      async ({ params }) => {
        const id = params.id as unknown as string;
        activeTodoRepository.delete(id);
        return HttpResponse.json({ message: 'success' });
      },
    ),

    http.post(
      `${getConfig().API_URL}/active-todo/:id/complete`,
      async ({ params }) => {
        const id = params.id as unknown as string;
        activeTodoRepository.complete(id);
        return HttpResponse.json({ message: 'success' });
      },
    ),

    http.post(
      `${getConfig().API_URL}/active-todo/:id/uncomplete`,
      async ({ params }) => {
        const id = params.id as unknown as string;
        activeTodoRepository.uncomplete(id);
        return HttpResponse.json({ message: 'success' });
      },
    ),

    http.get(`${getConfig().API_URL}/todo/:id`, async ({ params }) => {
      const id = params.id as unknown as string;
      const todo = activeTodoRepository.getOneById(id);
      if (!todo) {
        return new HttpResponse(null, { status: 404 });
      }
      return HttpResponse.json(todo);
    }),
  ];
};
