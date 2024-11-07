import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch } from '@/shared/hooks/redux';
import { UserService } from '@/shared/services/user.service';
import { setUser } from '@/shared/store/features/user-slice';
import { EditUserDto, EditUserSchema, User } from '@/shared/types/interfaces';

import classes from './edit-user-form.module.css';

interface EditUserFormProps {
  user: User;
}

export const EditUserForm: FC<EditUserFormProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch
  } = useForm<EditUserDto>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      email: user.email,
      fullName: user.fullName,
      username: user.username
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: () => {
      dispatch(setUser({ ...user, ...watch() }));
      notifications.show({
        message: 'Profile updated successfully',
        color: 'green'
      });
    }
  });

  const onSubmit = (data: EditUserDto) => {
    mutate(data);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <TextInput {...register('username')} label="Username" />

      <TextInput {...register('fullName')} label="Full name" />

      <TextInput {...register('email')} label="Email" disabled />

      <Button disabled={!isValid} loading={isPending} type="submit">
        Save
      </Button>
    </form>
  );
};
