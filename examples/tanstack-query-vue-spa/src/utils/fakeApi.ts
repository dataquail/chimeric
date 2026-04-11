/**
 * A simple in-memory fake API to simulate network requests.
 * In a real application, these would be actual HTTP calls.
 */

import type { Todo } from 'src/core/domain/todo/entities/Todo';

let todos: Todo[] = [
  { id: '1', title: 'Learn @chimeric/vue-query', completed: false },
  { id: '2', title: 'Build a Vue app with chimeric pattern', completed: false },
  { id: '3', title: 'Write tests for the Vue package', completed: true },
];

let nextId = 4;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fakeApi = {
  async getTodos(): Promise<Todo[]> {
    await delay(300);
    return [...todos];
  },

  async createTodo(title: string): Promise<Todo> {
    await delay(200);
    const newTodo: Todo = {
      id: String(nextId++),
      title,
      completed: false,
    };
    todos = [...todos, newTodo];
    return newTodo;
  },

  async deleteTodo(id: string): Promise<void> {
    await delay(200);
    todos = todos.filter((t) => t.id !== id);
  },

  async toggleTodo(id: string): Promise<Todo> {
    await delay(200);
    todos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    const updated = todos.find((t) => t.id === id);
    if (!updated) throw new Error(`Todo ${id} not found`);
    return updated;
  },
};
