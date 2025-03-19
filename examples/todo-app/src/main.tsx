import 'reflect-metadata';
import '@mantine/core/styles.css';
import 'src/core/global/inversify.config';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { ErrorPage } from './ErrorPage';
import { setupApi } from './api/setupApi';
import { Todo } from './routes/Todo';
import { SavedForLaterTodo } from './routes/SavedForLaterTodo';
import { Review } from './routes/Review';

async function prepare() {
  // @ts-expect-error - async import needed to mock api
  await import('/mockServiceWorker.js?url&worker');
  const { setupWorker } = await import('msw/browser');
  const worker = setupWorker();
  setupApi(worker);
}

prepare().then(() => {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Todo />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/saved-for-later',
        element: <SavedForLaterTodo />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/review',
        element: <Review />,
        errorElement: <ErrorPage />,
      },
    ],
    { basename: import.meta.env.BASE_URL },
  );

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </React.StrictMode>,
  );
});
