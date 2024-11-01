import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { USER_ME } from '@/shared/constants/query-keys';
import { AuthService } from '@/shared/services/auth.service';
import { RegisterDto, RegisterSchema } from '@/shared/types/interfaces';
import { addTokens } from '@/shared/utils/utils';

import { PasswordRequirements } from '../password-validation';
import classes from './register-form.module.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors, dirtyFields, isValid },
    watch
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      notifications.show({
        message: 'Registration successful'
      });
      notifications.show({
        message: 'Please check your email for verification link'
      });
      addTokens(data);
      queryClient.invalidateQueries({ queryKey: [USER_ME] });
      navigate('/');
    }
  });

  const onSubmit = (data: RegisterDto) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
        Registration
      </Title>

      <TextInput {...register('username')} error={errors.username?.message} label="Username" withAsterisk size="md" />
      <TextInput {...register('email')} error={errors.email?.message} label="Email" withAsterisk mt="md" size="md" />
      <TextInput
        {...register('fullName')}
        error={errors.fullName?.message}
        label="Full name"
        withAsterisk
        mt="md"
        size="md"
      />
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

      <Button type="submit" fullWidth mt="xl" size="md" loading={isPending} disabled={!isValid}>
        Register
      </Button>

      <Text ta="center" mt="md">
        Have an account?{' '}
        <Anchor component={Link} to={'/login'} fw={700}>
          Login
        </Anchor>
      </Text>
    </form>
  );
};

export default RegisterForm;
