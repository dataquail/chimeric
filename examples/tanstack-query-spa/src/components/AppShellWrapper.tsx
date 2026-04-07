import { AppShell, Avatar, Box, Burger, NavLink, Flex } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconArchive, IconHome2, IconPencilBolt } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export const AppShellWrapper = ({ children }: Props) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const { width } = useViewportSize();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex
          direction="row"
          align="center"
          gap="md"
          justify="space-between"
          pl="sm"
          pr="sm"
        >
          <Flex align="center" h="60px">
            <Avatar color="blue" radius="xl">
              <IconPencilBolt size="1.5rem" />
            </Avatar>
          </Flex>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <>
          <NavLink
            to="/"
            label="Active Todos"
            active={window.location.pathname === '/tanstack-query-spa/'}
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
            component={Link}
          />
          <NavLink
            to="/archived"
            label="Archived Todos"
            active={
              window.location.pathname === '/tanstack-query-spa/archived'
            }
            leftSection={<IconArchive size="1rem" stroke={1.5} />}
            component={Link}
          />
          <NavLink
            to="/review"
            label="Review Todos"
            active={window.location.pathname === '/tanstack-query-spa/review'}
            leftSection={<IconPencilBolt size="1rem" stroke={1.5} />}
            component={Link}
          />
        </>
      </AppShell.Navbar>

      <AppShell.Main>
        <>
          <Box visibleFrom="sm" w={`calc(${width}px - 350px)`}>
            {children}
          </Box>
          <Box
            hiddenFrom="sm"
            w={mobileOpened ? `300px` : `calc(${width}px - 50px)`}
          >
            {children}
          </Box>
        </>
      </AppShell.Main>
    </AppShell>
  );
};
