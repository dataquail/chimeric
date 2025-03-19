import { AppShell, Avatar, Box, Burger, NavLink, Flex } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconHome2, IconPencilBolt, IconRestore } from '@tabler/icons-react';
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
            active={window.location.pathname === '/todo-app/'}
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
            component={Link}
          />
          <NavLink
            to="/saved-for-later"
            label="Saved For Later Todos"
            active={
              window.location.pathname ===
              '/todo-app/saved-for-later'
            }
            leftSection={<IconRestore size="1rem" stroke={1.5} />}
            component={Link}
          />
          <NavLink
            to="/review"
            label="Review Todos"
            active={
              window.location.pathname === '/todo-app/review'
            }
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
