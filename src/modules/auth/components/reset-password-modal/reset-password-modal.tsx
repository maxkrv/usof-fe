import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { AuthService } from '@/shared/services/auth.service';
import { EmailDto, EmailSchema } from '@/shared/types/interfaces';

import classes from './reset-password-modal.module.css';

interface ResetPasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: FC<ResetPasswordModalProps> = ({ opened, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useForm<EmailDto>({
    resolver: zodResolver(EmailSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.sendResetPasswordLink,
    onSuccess: () => {
      onClose();
      notifications.show({
        message: 'Reset password link sent',
        color: 'green'
      });
    }
  });

  const onSubmit = (data: EmailDto) => {
    mutate(data);
  };

  return (
    <Modal centered onClose={onClose} opened={opened}>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Title mb={'xl'} order={3}>
          Reset password
        </Title>

        <TextInput
          {...register('email')}
          error={errors.email?.message}
          label="Email"
          withAsterisk
          size="md"
          w={'100%'}
        />

        <Button type="submit" fullWidth mt="md" size="md" loading={isPending} disabled={!isValid}>
          Send reset password link
        </Button>
      </form>
    </Modal>
  );
};
