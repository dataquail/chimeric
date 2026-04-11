import './styles.css';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import { queryClient } from './core/global/queryClient';

const app = createApp(App);

app.use(VueQueryPlugin, { queryClient });

app.mount('#app');
