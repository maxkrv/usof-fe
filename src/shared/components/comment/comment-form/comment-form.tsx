import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Textarea } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { COMMENTS } from '@/shared/constants/query-keys';
import { useAppSelector } from '@/shared/hooks/redux';
import { CommentService } from '@/shared/services/comment.service';
import { isUserActiveSelector, isUserAuthenticatedSelector } from '@/shared/store/features/user-slice';

import { InactiveUserPopover } from '../../inactive-user-popover/inactive-user-popover';
import classes from './comment-form.module.css';

const CreateCommentSchema = z.object({
  content: z.string().trim().min(1, { message: 'Content is required' })
});
type CreateCommentSchemaType = z.infer<typeof CreateCommentSchema>;

interface CommentFormProps {
  postId: number;
}

export const CommentForm: FC<CommentFormProps> = ({ postId }) => {
  const queryClient = useQueryClient();

  const isUserActive = useAppSelector(isUserActiveSelector);
  const isUserAuthenticated = useAppSelector(isUserAuthenticatedSelector);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset
  } = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(CreateCommentSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CommentService.create,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: [COMMENTS, String(postId)] });
    }
  });

  const onSubmit = (data: CreateCommentSchemaType) => {
    if (!isValid) {
      return;
    }

    mutate({ ...data, postId });
  };

  const disabled = !isUserActive || !isUserAuthenticated;

  return (
    <Card className={classes.container} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        className={classes.textarea}
        {...register('content')}
        placeholder="Leave a comment"
        minRows={1}
        disabled={isPending || disabled}
        autosize
      />

      <InactiveUserPopover>
        <Button className={classes.button} loading={isPending} type="submit" disabled={disabled}>
          Send
        </Button>
      </InactiveUserPopover>
    </Card>
  );
};
