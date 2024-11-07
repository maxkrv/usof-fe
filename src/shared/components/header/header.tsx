import { Alert, Button, Flex, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { FaRegUser } from 'react-icons/fa6';
import { IoIosLogOut } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { AuthService } from '@/shared/services/auth.service';
import { clearUser } from '@/shared/store/features/user-slice';
import { removeTokens } from '@/shared/utils/utils';

import Container from '../container/container';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { UserAvatar } from '../user-avatar/user-avatar';
import classes from './header.module.css';

const authRoutes = ['/login', '/register', '/activate', '/reset-password'];

export const Header = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);

  const { mutate } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      window.location.reload();
    },
    onError: () => {
      window.location.reload();
    }
  });

  if (
    authRoutes.includes(location.pathname) ||
    location.pathname.includes('activate') ||
    location.pathname.includes('reset-password')
  ) {
    return null;
  }

  const handleLogout = () => {
    mutate();
    removeTokens();
    dispatch(clearUser());
  };

  return (
    <>
      {user && !user?.isActive && (
        <Alert color="yellow" radius={0}>
          <Container>Please activate your account</Container>
        </Alert>
      )}

      <header className={classes.header}>
        <Container className={classes.mainSection}>
          <Flex gap="sm" align="center">
            <MobileMenu />
            <Text
              component={Link}
              to={'/'}
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: 'red', to: 'yellow', deg: 90 }}>
              USOF
            </Text>
          </Flex>

          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton style={{ borderRadius: '50%' }}>
                  <UserAvatar src={user.profilePicture} size="md" />
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <Text size="xs" truncate>
                    {user.fullName}
                  </Text>
                </Menu.Label>

                <Menu.Item component={Link} to={'/profile'} leftSection={<FaRegUser />}>
                  Profile
                </Menu.Item>

                <Menu.Item component={Link} to={'/settings'} leftSection={<IoSettingsOutline />}>
                  Settings
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item color="red" onClick={handleLogout} leftSection={<IoIosLogOut />}>
                  Logout
                  {/* <Button color="red" onClick={handleLogout} w={'100%'}>
                </Button> */}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

          {!user && (
            <Group gap="xs">
              <Button component={Link} to={'/login'} styles={{ root: { ':active': { transform: 'none' } } }}>
                Login
              </Button>

              <Button component={Link} to={'/register'} variant="light">
                Register
              </Button>
            </Group>
          )}
        </Container>
      </header>
    </>
  );
};
