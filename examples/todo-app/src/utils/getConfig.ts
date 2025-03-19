export const getConfig = () => {
  type Environment = 'development' | 'staging';
  const environment: Environment = 'development';

  const configMap = {
    development: {
      API_HOST: 'dataquail.github.io/todo-app/api',
      API_URL: 'https://dataquail.github.io/todo-app/api',
    },
    staging: {
      API_HOST: 'test.dataquail.com/api',
      API_URL: 'https://test.dataquail.com/api',
    },
  };

  return configMap[environment];
};
