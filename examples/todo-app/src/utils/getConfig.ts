export const getConfig = () => {
  type Environment = 'development';
  const environment: Environment = 'development';

  const configMap = {
    development: {
      API_HOST: 'dataquail.github.io/todo-app/api',
      API_URL: 'https://dataquail.github.io/todo-app/api',
    },
  };

  return configMap[environment];
};
