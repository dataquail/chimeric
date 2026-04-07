import { SetupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getConfig } from 'src/utils/getConfig';

export const mockSaveActiveTodoForLater = (
  server: SetupServer,
  saveActiveTodoForLaterResponse: { id: string },
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
