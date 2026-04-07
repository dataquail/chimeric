import { Router } from 'express';
import { ActiveTodoRepository, SavedForLaterTodoRepository } from '../repositories';
import { SaveForLaterBody, ActivateBody } from '../types';

export const createSavedForLaterTodoRoutes = (
  savedForLaterTodoRepository: SavedForLaterTodoRepository,
  activeTodoRepository: ActiveTodoRepository
): Router => {
  const router = Router();

  // GET /api/saved-for-later-todo - Get all saved for later todos
  router.get('/', (req, res) => {
    res.json(savedForLaterTodoRepository.getAll());
  });

  // GET /api/saved-for-later-todo/:id - Get a single saved for later todo
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const savedForLaterTodo = savedForLaterTodoRepository.getOneById(id);
    if (!savedForLaterTodo) {
      return res.status(404).json({ message: 'Saved for later todo not found' });
    }
    res.json(savedForLaterTodo);
  });

  // POST /api/saved-for-later-todo/save-for-later - Save an active todo for later
  router.post('/save-for-later', (req, res) => {
    const saveForLaterBody = req.body as SaveForLaterBody;

    const activeTodoToSaveForLater = activeTodoRepository.getOneById(
      saveForLaterBody.activeTodoId
    );

    if (!activeTodoToSaveForLater) {
      return res.status(404).json({ message: 'Active todo not found' });
    }

    if (activeTodoToSaveForLater.completed_at) {
      return res.status(422).json({ message: 'Cannot save completed todo for later' });
    }

    const savedForLaterTodoId = savedForLaterTodoRepository.create(
      activeTodoToSaveForLater.title,
      activeTodoToSaveForLater.created_at
    );

    activeTodoRepository.delete(activeTodoToSaveForLater.id);

    res.json({ id: savedForLaterTodoId });
  });

  // POST /api/saved-for-later-todo/activate - Activate a saved for later todo
  router.post('/activate', (req, res) => {
    const activateBody = req.body as ActivateBody;

    const savedForLaterTodoToActivate = savedForLaterTodoRepository.getOneById(
      activateBody.savedForLaterTodoId
    );

    if (!savedForLaterTodoToActivate) {
      return res.status(404).json({ message: 'Saved for later todo not found' });
    }

    const activeTodoId = activeTodoRepository.create({
      title: savedForLaterTodoToActivate.title,
      created_at: savedForLaterTodoToActivate.created_at,
    });

    savedForLaterTodoRepository.delete(savedForLaterTodoToActivate.id);

    res.json({ id: activeTodoId });
  });

  // DELETE /api/saved-for-later-todo/:id - Delete a saved for later todo
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    savedForLaterTodoRepository.delete(id);
    res.json({ message: 'success' });
  });

  return router;
};
