import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';
import { ISaveActiveTodoForLater } from 'src/core/infrastructure/services/SavedForLaterTodoService/methods/saveForLater';

export const mockSaveActiveTodoForLater = (
  server: SetupServer,
  saveActiveTodoForLaterResponse: Awaited<ReturnType<ISaveActiveTodoForLater>>,
) => {
  server.use(
    http.post(
      `${getConfig().API_URL}/saved-for-later-todo/save-for-later`,
      () => {
        return HttpResponse.json(saveActiveTodoForLaterResponse);
      },
    ),
  );
};
