/**
 * Todo API Server
 */

import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { ActiveTodoRepository, SavedForLaterTodoRepository } from './repositories';
import {
  createActiveTodoRoutes,
  createTodoRoutes,
  createSavedForLaterTodoRoutes,
} from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Initialize repositories (in-memory storage)
const activeTodoRepository = new ActiveTodoRepository();
const savedForLaterTodoRepository = new SavedForLaterTodoRepository();

// Routes
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to todo-api!' });
});

app.use('/api/active-todo', createActiveTodoRoutes(activeTodoRepository));
app.use('/api/todo', createTodoRoutes(activeTodoRepository));
app.use(
  '/api/saved-for-later-todo',
  createSavedForLaterTodoRoutes(savedForLaterTodoRepository, activeTodoRepository)
);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Todo API listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
