<template>
  <div class="card">
    <h2>Todos</h2>

    <div v-if="isPending" class="loader">Loading...</div>

    <div v-else-if="isError" class="error">
      Failed to load todos. Please try again.
    </div>

    <ul v-else-if="data && data.length > 0" class="todo-list">
      <li
        v-for="todo in data"
        :key="todo.id"
        class="todo-item"
      >
        <span class="todo-id">#{{ todo.id }}</span>
        <span :class="['todo-title', { completed: todo.completed }]">
          {{ todo.title }}
        </span>
        <span
          :class="['badge', todo.completed ? 'badge-green' : 'badge-gray']"
        >
          {{ todo.completed ? 'Done' : 'Pending' }}
        </span>
        <button
          class="btn-sm"
          :class="todo.completed ? 'btn-danger' : 'btn-primary'"
          :disabled="togglePending"
          @click="handleToggle(todo.id)"
        >
          {{ todo.completed ? 'Undo' : 'Complete' }}
        </button>
        <button
          class="btn-sm btn-danger"
          :disabled="deletePending"
          @click="handleDelete(todo.id)"
        >
          Delete
        </button>
      </li>
    </ul>

    <p v-else class="empty">No todos yet. Add one above!</p>
  </div>
</template>

<script setup lang="ts">
import { todoService } from 'src/core/infrastructure/services/TodoService';

const { data, isPending, isError } = todoService.getAll.useHook();

const { invoke: deleteInvoke, isPending: deletePending } =
  todoService.deleteOne.useHook();

const { invoke: toggleInvoke, isPending: togglePending } =
  todoService.toggleOne.useHook();

async function handleDelete(id: string) {
  await deleteInvoke({ id });
}

async function handleToggle(id: string) {
  await toggleInvoke({ id });
}
</script>
