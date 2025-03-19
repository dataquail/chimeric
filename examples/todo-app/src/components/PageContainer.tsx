import { Box } from '@mantine/core';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      h="100vh"
      style={{
        position: 'absolute',
        left: '0px',
        right: '0px',
        top: '0px',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
};
