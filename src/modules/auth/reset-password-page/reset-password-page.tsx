import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Box, Button, Center, Container, Group, Paper, PasswordInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useAppDispatch } from '@/shared/hooks/redux';
import { AuthService } from '@/shared/services/auth.service';
import { activateConfetti } from '@/shared/store/features/confetti-slice';
import { clearUser } from '@/shared/store/features/user-slice';
import { passwordValidation } from '@/shared/types/interfaces';
import { removeTokens } from '@/shared/utils/utils';

import { PasswordRequirements } from '../components/password-validation';
import classes from './reset-password-page.module.css';

const ResetPasswordSchema = z
  .object({
    password: passwordValidation,
    repeatPassword: z.string().trim().min(1, { message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token } = useParams();

  const {
    handleSubmit,
    register,
    formState: { errors, dirtyFields, isValid },
    watch
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      notifications.show({
        message: 'Password reset successful',
        color: 'green'
      });
      notifications.show({
        message: 'You can now log in with your new password',
        color: 'green'
      });
      dispatch(activateConfetti());
      dispatch(clearUser());
      removeTokens();
      navigate('/login', {
        replace: true
      });
    }
  });

  const onSubmit = (data: ResetPasswordType) => {
    if (!token) return;

    mutate({ ...data, token });
  };

  return (
    <Container size={460} my={30}>
      <Title order={2} className={classes.title} ta="center">
        Forgot your password?
      </Title>

      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className={classes.form}
        withBorder
        shadow="md"
        p={20}
        radius="md"
        mt="xl">
        <PasswordInput
          {...register('password')}
          error={errors.password?.message}
          label="Password"
          withAsterisk
          mt="md"
          mb="xs"
          size="md"
        />
        <PasswordRequirements password={watch('password')} enableCheck={!!dirtyFields.password} />

        <PasswordInput
          {...register('repeatPassword')}
          error={errors.repeatPassword?.message}
          label="Confirm password"
          withAsterisk
          mt="md"
          size="md"
        />

        <Group justify="space-between" mt="lg" className={classes.controls}>
          <Anchor component={Link} to="/login" c="dimmed" size="sm" className={classes.control}>
            <Center inline>
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
          <Button loading={isPending} disabled={!isValid} type="submit" className={classes.control}>
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};
