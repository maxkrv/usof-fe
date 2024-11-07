import { Button, Paper, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navigate } from 'react-router-dom';

import { ResetPasswordModal } from '@/modules/auth/components/reset-password-modal/reset-password-modal';
import Container from '@/shared/components/container/container';
import { UserAvatar } from '@/shared/components/user-avatar/user-avatar';
import { useAppSelector } from '@/shared/hooks/redux';

import { ChangeAvatarModal } from '../components/change-avatar-modal/change-avatar-modal';
import { EditUserForm } from '../components/edit-user-form/edit-user-form';
import classes from './profile-page.module.css';

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.user.user);

  const [opened, { open, close }] = useDisclosure(false);
  const [resetPasswordOpened, { open: openResetPassword, close: closeResetPassword }] = useDisclosure(false);

  if (!user?.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Container className={classes.container}>
        <section className={classes.userSection}>
          <Title order={3} mb="sm" ta="center">
            My Profile
          </Title>
          <Paper className={classes.userContainerDesktop} radius="md" p={15}>
            <UserAvatar size="xl" src={user.profilePicture} showEditButton onEditClick={open} />

            <div className={classes.userInfo}>
              <Text>{user.username}</Text>
              <Text>{user.fullName}</Text>
              <Text>Rating: {user.rating}</Text>
            </div>
          </Paper>
        </section>

        <section>
          <Title order={3} mb="sm">
            Edit profile
          </Title>

          <EditUserForm user={user} />
        </section>

        <section>
          <Title order={3} mb="sm">
            Password
          </Title>

          <Button variant="default" onClick={openResetPassword}>
            Change password
          </Button>
        </section>
      </Container>

      <ChangeAvatarModal opened={opened} onClose={close} />
      <ResetPasswordModal opened={resetPasswordOpened} onClose={closeResetPassword} />
    </>
  );
};
