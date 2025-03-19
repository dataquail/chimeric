import { StrictMode } from 'react';
import {
  // BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { setupApi } from './api/setupApi';
import { ErrorPage } from './components/ErrorPage';

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
        element: <App />,
        errorElement: <ErrorPage />,
      },
    ],
    // { basename: import.meta.env.BASE_URL },
  );

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
  );
});