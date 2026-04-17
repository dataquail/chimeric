import './styles.css';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { queryClient } from './core/global/queryClient';
import ActiveTodoPage from './routes/ActiveTodo/index.vue';
import ArchivedTodoPage from './routes/ArchivedTodo/index.vue';
import ReviewPage from './routes/Review/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ActiveTodoPage },
    { path: '/archived', component: ArchivedTodoPage },
    { path: '/review', component: ReviewPage },
  ],
});

const app = createApp(App);
app.use(VueQueryPlugin, { queryClient });
app.use(router);
app.mount('#app');
