import { Router } from 'express';
import { ActiveTodoRepository } from '../repositories';
import { CreateTodoBody } from '../types';

export const createActiveTodoRoutes = (
  activeTodoRepository: ActiveTodoRepository,
): Router => {
  const router = Router();

  // GET /api/active-todo - Get all active todos
  router.get('/', (req, res) => {
    res.json(activeTodoRepository.getAll());
  });

  // POST /api/active-todo - Create a new todo
  router.post('/', (req, res) => {
    const createTodoBody = req.body as CreateTodoBody;
    const todoId = activeTodoRepository.create(createTodoBody);
    res.json({ id: todoId });
  });

  // DELETE /api/active-todo/:id - Delete a todo
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    activeTodoRepository.delete(id);
    res.json({ message: 'success' });
  });

  // POST /api/active-todo/:id/complete - Mark todo as complete
  router.post('/:id/complete', (req, res) => {
    const { id } = req.params;
    try {
      activeTodoRepository.complete(id);
      res.json({ message: 'success' });
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Todo not found' });
    }
  });

  // POST /api/active-todo/:id/uncomplete - Mark todo as incomplete
  router.post('/:id/uncomplete', (req, res) => {
    const { id } = req.params;
    try {
      activeTodoRepository.uncomplete(id);
      res.json({ message: 'success' });
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Todo not found' });
    }
  });

  return router;
};

// GET /api/todo/:id - Get a single todo by ID (separate route)
export const createTodoRoutes = (
  activeTodoRepository: ActiveTodoRepository,
): Router => {
  const router = Router();

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const todo = activeTodoRepository.getOneById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  });

  return router;
};
