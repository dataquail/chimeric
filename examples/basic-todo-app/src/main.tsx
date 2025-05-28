import 'src/core/global/registerEventHandlers';
import '@mantine/core/styles.css';
import './styles.css';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { setupApi } from './api/setupApi';
import { ErrorPage } from './components/ErrorPage';
import { Providers } from './providers';
import { ActiveTodo } from './routes/ActiveTodo';
import { SavedForLaterTodo } from './routes/SavedForLaterTodo';
import { Review } from './routes/Review';

async function prepare() {
  // Import using a dynamic import instead of a relative path
  const worker = await import('msw/browser').then(({ setupWorker }) =>
    setupWorker(),
  );
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

  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <StrictMode>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </StrictMode>,
    );
  }
});
