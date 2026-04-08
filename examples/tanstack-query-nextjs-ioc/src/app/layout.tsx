import '@/styles.css';

import { Providers } from '@/providers';

export const metadata = {
  title: 'Todo App with IoC',
  description: 'Next.js Todo App with Inversify IoC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
