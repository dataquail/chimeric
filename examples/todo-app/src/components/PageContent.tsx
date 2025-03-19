'use client';

import { Box } from '@mantine/core';

export const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <Box h="100%">{children}</Box>;
};
