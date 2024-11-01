import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { USER_ME } from '@/shared/constants/query-keys';
import { AuthService } from '@/shared/services/auth.service';
import { LoginDto, LoginSchema } from '@/shared/types/interfaces';
import { addTokens } from '@/shared/utils/utils';

import { ResetPasswordModal } from '../reset-password-modal/reset-password-modal';
import classes from './login-form.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      addTokens(data);
      queryClient.invalidateQueries({
        queryKey: [USER_ME]
      });
      navigate('/');
    }
  });

  const onSubmit = (data: LoginDto) => {
    mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Login
        </Title>

        <TextInput
          {...register('login')}
          error={errors.login?.message}
          label="Email or Username"
          withAsterisk
          size="md"
        />
        <PasswordInput
          {...register('password')}
          error={errors.password?.message}
          label="Password"
          withAsterisk
          mt="md"
          size="md"
        />

        <Text ta="center" mt="md">
          Forgot password?{' '}
          <Anchor href="#" onClick={open} fw={700}>
            Reset it
          </Anchor>
        </Text>

        <Button type="submit" fullWidth mt="md" size="md" loading={isPending} disabled={!isValid}>
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor component={Link} to="/register" fw={700}>
            Register
          </Anchor>
        </Text>
      </form>

      <ResetPasswordModal opened={opened} onClose={close} />
    </>
  );
};

export default LoginForm;
