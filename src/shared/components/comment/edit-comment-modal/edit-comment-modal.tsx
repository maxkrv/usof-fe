import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Modal, Textarea, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { CommentService } from '@/shared/services/comment.service';

interface EditCommentModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  setIsEdited: Dispatch<SetStateAction<boolean>>;
  id: number;
}

const CommentSchema = z.object({
  content: z.string().trim().min(1, { message: 'Content is required' })
});
type CommentSchemaType = z.infer<typeof CommentSchema>;

export const EditCommentModal: FC<EditCommentModalProps> = ({
  open,
  onClose,
  id,
  content,
  setContent,
  setIsEdited
}) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues
  } = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content
    }
  });

  const { mutate, isPending } = useMutation<unknown, Error, CommentSchemaType>({
    mutationFn: (dto) => CommentService.update(id, dto),
    onSuccess: () => {
      setContent(getValues('content'));
      setIsEdited(true);
      onClose();
    }
  });

  const onSubmit = (data: CommentSchemaType) => {
    if (!isValid) {
      return;
    }

    mutate(data);
  };

  return (
    <Modal centered opened={open} onClose={onClose}>
      <Title order={5} ta="center" mb="md">
        Edit comment
      </Title>

      <Flex component="form" onSubmit={handleSubmit(onSubmit)} direction="column" gap="xs">
        <Textarea {...register('content')} minRows={1} disabled={isPending} autosize />

        <Button loading={isPending} type="submit" style={{ alignSelf: 'flex-end' }}>
          Update
        </Button>
      </Flex>
    </Modal>
  );
};
