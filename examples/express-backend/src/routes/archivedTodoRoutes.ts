import { Router } from 'express';
import { ActiveTodoRepository, ArchivedTodoRepository } from '../repositories';
import { ArchiveBody } from '../types';

export const createArchivedTodoRoutes = (
  archivedTodoRepository: ArchivedTodoRepository,
  activeTodoRepository: ActiveTodoRepository
): Router => {
  const router = Router();

  // GET /api/archived-todo - Get paginated archived todos
  router.get('/', (req, res) => {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    res.json(archivedTodoRepository.getPage(page, limit));
  });

  // GET /api/archived-todo/:id - Get a single archived todo
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const archivedTodo = archivedTodoRepository.getOneById(id);
    if (!archivedTodo) {
      return res.status(404).json({ message: 'Archived todo not found' });
    }
    return res.json(archivedTodo);
  });

  // POST /api/archived-todo/archive - Batch archive completed active todos
  router.post('/archive', (req, res) => {
    const { activeTodoIds } = req.body as ArchiveBody;
    const archivedIds: string[] = [];

    for (const activeTodoId of activeTodoIds) {
      const activeTodo = activeTodoRepository.getOneById(activeTodoId);
      if (!activeTodo || !activeTodo.completed_at) {
        continue;
      }

      const archivedId = archivedTodoRepository.create(
        activeTodo.title,
        activeTodo.completed_at
      );
      activeTodoRepository.delete(activeTodoId);
      archivedIds.push(archivedId);
    }

    res.json({ ids: archivedIds });
  });

  // POST /api/archived-todo/:id/unarchive - Unarchive back to active (incomplete)
  router.post('/:id/unarchive', (req, res) => {
    const { id } = req.params;
    const archivedTodo = archivedTodoRepository.getOneById(id);

    if (!archivedTodo) {
      return res.status(404).json({ message: 'Archived todo not found' });
    }

    const activeTodoId = activeTodoRepository.create({
      title: archivedTodo.title,
    });

    archivedTodoRepository.delete(id);

    return res.json({ id: activeTodoId });
  });

  // DELETE /api/archived-todo/:id - Delete an archived todo
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    archivedTodoRepository.delete(id);
    res.json({ message: 'success' });
  });

  return router;
};
