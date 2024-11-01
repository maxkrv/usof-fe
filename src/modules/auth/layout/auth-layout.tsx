import { Button, Paper, Text } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { Link, Navigate } from 'react-router-dom';

import { useAppSelector } from '@/shared/hooks/redux';

import classes from './auth-layout.module.css';

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAppSelector((state) => state.user);

  if (isLoading) {
    return null;
  }

  if (user?.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.banner}>
        <Text component="h1" size="xl" fw={900} variant="gradient" gradient={{ from: 'red', to: 'yellow', deg: 90 }}>
          USOF
        </Text>

        <Text size="xl">Best social app</Text>
      </div>

      <Paper className={classes.content} radius={0} p={30}>
        {children}
      </Paper>

      <Button
        component={Link}
        to={'/'}
        variant="outline"
        className={classes.backButton}
        leftSection={<IoChevronBack />}>
        Home
      </Button>
    </div>
  );
};

export default AuthLayout;
