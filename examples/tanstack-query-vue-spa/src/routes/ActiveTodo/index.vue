<template>
  <div>
    <div class="page-header">
      <h1>Active Todo List</h1>
    </div>

    <!-- Add Todo Form -->
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div>
          <input
            type="text"
            class="text-input"
            :class="{ error: errorMsg }"
            placeholder="Enter your todo"
            v-model="title"
            @input="errorMsg = ''"
          />
          <div v-if="errorMsg" class="input-error">{{ errorMsg }}</div>
        </div>
        <button class="btn" type="submit" :disabled="createOne.isPending.value">
          <span v-if="createOne.isPending.value" class="loader loader-sm" />
          <span v-else>Add</span>
        </button>
      </div>
    </form>

    <!-- Todo List -->
    <div v-if="getAll.isPending.value" class="loader-container">
      <div class="loader" />
    </div>
    <div v-else class="scroll-area">
      <div
        v-for="todo in getAll.data.value ?? []"
        :key="todo.id"
        class="todo-card"
      >
        <div
          class="checkbox-card"
          :class="{
            checked: !!todo.completedAt,
            disabled: deleteOne.isPending.value,
          }"
          role="checkbox"
          :aria-checked="!!todo.completedAt"
          @click="handleToggle(todo.id, !!todo.completedAt)"
        >
          <div v-if="isLoading" class="loader loader-sm" style="margin: 0.5rem" />
          <div
            v-else
            class="checkbox-indicator"
            :class="{ checked: !!todo.completedAt }"
          />
          <div class="todo-info">
            <h4>{{ todo.title }}</h4>
            <span class="text-sm">Created At: {{ formatDate(todo.createdAt) }}</span>
            <span class="text-sm">
              Completed At: {{ todo.completedAt ? formatDate(todo.completedAt) : 'N/A' }}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="icon-btn danger"
          @click="deleteOne.invoke({ id: todo.id })"
          :disabled="deleteOne.isPending.value"
        >
          &#10005;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { formatDate } from 'src/utils/formatDate';

const title = ref('');
const errorMsg = ref('');

const getAll = activeTodoService.getAll.useHook();
const createOne = activeTodoService.createOne.useHook();
const completeOne = activeTodoService.completeOne.useHook();
const uncompleteOne = activeTodoService.uncompleteOne.useHook();
const deleteOne = activeTodoService.deleteOne.useHook();

const isLoading = false;

const handleSubmit = async () => {
  if (title.value.length < 1) {
    errorMsg.value = 'Must be at least 1 character long';
    return;
  }
  errorMsg.value = '';
  await createOne.invoke({ title: title.value });
  title.value = '';
};

const handleToggle = (id: string, isCompleted: boolean) => {
  if (deleteOne.isPending.value) return;
  if (isCompleted) {
    void uncompleteOne.invoke({ id });
  } else {
    void completeOne.invoke({ id });
  }
};
</script>
