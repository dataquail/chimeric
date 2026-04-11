<template>
  <div class="card">
    <h2>Add Todo</h2>
    <form class="form-row" @submit.prevent="handleSubmit">
      <input
        v-model="title"
        type="text"
        placeholder="Enter todo title..."
        :disabled="isPending"
      />
      <button
        type="submit"
        class="btn-primary"
        :disabled="isPending || !title.trim()"
      >
        {{ isPending ? 'Adding...' : 'Add' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { todoService } from 'src/core/infrastructure/services/TodoService';

const title = ref('');

const { invoke, isPending } = todoService.createOne.useHook();

async function handleSubmit() {
  if (!title.value.trim()) return;
  await invoke({ title: title.value.trim() });
  title.value = '';
}
</script>
