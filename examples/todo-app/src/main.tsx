import 'reflect-metadata';
import '@mantine/core/styles.css';
import 'src/core/global/inversify.config';
import './styles.css';
import { StrictMode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { setupApi } from './api/setupApi';
import { ErrorPage } from './components/ErrorPage';
import { Providers } from './providers';
import { ActiveTodo } from './routes/ActiveTodo';
import { SavedForLaterTodo } from './routes/SavedForLaterTodo';
import { Review } from './routes/Review';

async function prepare() {
  // @ts-expect-error - async import needed to mock api
  await import('/mockServiceWorker.js?url&worker');
  const { setupWorker } = await import('msw/browser');
  const worker = setupWorker();
  await setupApi(worker);
}

prepare().then(() => {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <ActiveTodo />,
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
    <StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </StrictMode>,
  );
});