<template>
  <div>
    <header>
      <h1>Chimeric Vue Query SPA</h1>
      <p class="subtitle">
        Demonstrating <code>@chimeric/vue-query</code> with the chimeric pattern
      </p>
    </header>

    <div class="info-box" style="margin-bottom: 1.5rem">
      <strong>Chimeric Pattern:</strong> Every service method supports both
      <code>service.method.useHook()</code> (reactive, for components) and
      <code>await service.method()</code> (idiomatic, for orchestration).
    </div>

    <AddTodoForm />
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import AddTodoForm from './components/AddTodoForm.vue';
import TodoList from './components/TodoList.vue';
</script>
