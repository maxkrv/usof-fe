import { ActionIcon, Avatar, Paper, Title } from '@mantine/core';
import { FaRegUser } from 'react-icons/fa6';
import { MdModeEdit } from 'react-icons/md';
import { Navigate } from 'react-router-dom';

import Container from '@/shared/components/container/container';
import { useAppSelector } from '@/shared/hooks/redux';

import classes from './profile-page.module.css';

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.user.user);

  if (!user?.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container>
      <section className={classes.userSection}>
        <Title order={3} mb="sm">
          My Profile
        </Title>
        <Paper className={classes.userContainerDesktop} radius="md" p={30}>
          <div className={classes.avatar}>
            {user.profilePicture ? (
              <Avatar src={user.profilePicture} size="xl" radius="md" />
            ) : (
              <Avatar size="xl" radius="md">
                <FaRegUser size={50} />
              </Avatar>
            )}

            <ActionIcon variant="default" radius="lg">
              <MdModeEdit />
            </ActionIcon>
          </div>
        </Paper>
      </section>
    </Container>
  );
};
