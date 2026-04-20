export const getConfig = () => ({
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
});
