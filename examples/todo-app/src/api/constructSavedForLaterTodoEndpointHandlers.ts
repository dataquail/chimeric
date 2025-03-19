import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { ActiveTodoRepository } from './repositories/ActiveTodoRepository';
import { SavedForLaterTodoRepository } from './repositories/SavedForLaterTodoRepository';
import { SaveForLaterBody } from 'src/core/domain/savedForLaterTodo/dtos/in/SaveForLaterBody';
import { ActivateBody } from 'src/core/domain/savedForLaterTodo/dtos/in/ActivateBody';

export const constructSavedForLaterTodoEndpointHandlers = (
  savedForLaterTodoRepository: SavedForLaterTodoRepository,
  activeTodoRepository: ActiveTodoRepository,
) => {
  return [
    http.get(`${getConfig().API_URL}/saved-for-later-todo`, async () => {
      return HttpResponse.json(savedForLaterTodoRepository.getAll());
    }),

    http.post(
      `${getConfig().API_URL}/saved-for-later-todo/save-for-later`,
      async ({ request }) => {
        const savedForLaterBody =
          (await request.json()) as unknown as SaveForLaterBody;

        const activeTodoToSaveForLater = activeTodoRepository.getOneById(
          savedForLaterBody.activeTodoId,
        );

        if (!activeTodoToSaveForLater) {
          return new HttpResponse(null, { status: 404 });
        }

        if (activeTodoToSaveForLater.completed_at) {
          return new HttpResponse(null, { status: 422 });
        }

        const savedForLaterTodoId = savedForLaterTodoRepository.create(
          activeTodoToSaveForLater.title,
          activeTodoToSaveForLater.created_at,
        );

        activeTodoRepository.delete(activeTodoToSaveForLater.id);

        return HttpResponse.json({ id: savedForLaterTodoId });
      },
    ),

    http.post(
      `${getConfig().API_URL}/saved-for-later-todo/activate`,
      async ({ request }) => {
        const activateBody = (await request.json()) as unknown as ActivateBody;

        const savedForLaterTodoToActivate =
          savedForLaterTodoRepository.getOneById(
            activateBody.savedForLaterTodoId,
          );

        if (!savedForLaterTodoToActivate) {
          return new HttpResponse(null, { status: 404 });
        }

        const activeTodoId = activeTodoRepository.create({
          title: savedForLaterTodoToActivate.title,
          created_at: savedForLaterTodoToActivate.created_at,
        });

        savedForLaterTodoRepository.delete(savedForLaterTodoToActivate.id);

        return HttpResponse.json({ id: activeTodoId });
      },
    ),

    http.get(
      `${getConfig().API_URL}/saved-for-later-todo/:id`,
      async ({ params }) => {
        const id = params.id as unknown as string;
        const savedForLaterTodo = savedForLaterTodoRepository.getOneById(id);
        if (!savedForLaterTodo) {
          return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(savedForLaterTodo);
      },
    ),

    http.delete(
      `${getConfig().API_URL}/saved-for-later-todo/:id`,
      async ({ params }) => {
        const id = params.id as unknown as string;
        savedForLaterTodoRepository.delete(id);
        return HttpResponse.json({ message: 'success' });
      },
    ),
  ];
};
