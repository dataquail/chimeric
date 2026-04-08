'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconArchive, IconPencil } from './icons';

type Props = {
  children: React.ReactNode;
};

export const AppShellWrapper = ({ children }: Props) => {
  const [mobileOpened, setMobileOpened] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="avatar">
          <IconPencil size="1.25rem" />
        </div>
        <button
          type="button"
          className={`burger-btn ${mobileOpened ? 'open' : ''}`}
          onClick={() => setMobileOpened((o) => !o)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <nav className={`app-nav ${mobileOpened ? 'open' : ''}`}>
        <Link
          href="/active-todo"
          className={`nav-link ${isActive('/active-todo') ? 'active' : ''}`}
          onClick={() => setMobileOpened(false)}
        >
          <IconHome /> Active Todos
        </Link>
        <Link
          href="/archived"
          className={`nav-link ${isActive('/archived') ? 'active' : ''}`}
          onClick={() => setMobileOpened(false)}
        >
          <IconArchive /> Archived Todos
        </Link>
        <Link
          href="/review"
          className={`nav-link ${isActive('/review') ? 'active' : ''}`}
          onClick={() => setMobileOpened(false)}
        >
          <IconPencil /> Review Todos
        </Link>
      </nav>

      <main className="app-main">{children}</main>
    </div>
  );
};
