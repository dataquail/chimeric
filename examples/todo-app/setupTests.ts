import '@testing-library/jest-dom';
import 'src/core/global/inversify.config';
import { appContainer } from 'src/core/global/appContainer';
import { vi } from 'vitest';
import { InjectionSymbol } from 'src/core/global/types';
import { IQueryClientProvider } from 'src/core/global/queryClientProvider/IQueryClientProvider';
import { IAppStoreProvider } from 'src/core/global/appStoreProvider/IAppStoreProvider';
import { revertAll } from 'src/lib/features/revertAll';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollTo = vi.fn().mockReturnValue({ x: 0, y: 0 });

beforeEach(() => {
  appContainer.snapshot();
  const queryClientProvider = appContainer.get<IQueryClientProvider>(
    InjectionSymbol('IQueryClientProvider'),
  );
  queryClientProvider.get().clear();
  const appStoreProvider = appContainer.get<IAppStoreProvider>(
    InjectionSymbol('IAppStoreProvider'),
  );
  appStoreProvider.get().dispatch(revertAll());
});

afterEach(async () => {
  appContainer.restore();
});
