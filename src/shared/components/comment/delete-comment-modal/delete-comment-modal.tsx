import { Button, Flex, Modal, Text } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';

import { COMMENTS } from '@/shared/constants/query-keys';
import { CommentService } from '@/shared/services/comment.service';

interface DeleteCommentModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
  postId: number;
}

export const DeleteCommentModal: FC<DeleteCommentModalProps> = ({ open, onClose, id, postId }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CommentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS, String(postId)] });
      onClose();
    }
  });

  const handleDelete = () => {
    mutate(id);
  };

  return (
    <Modal centered opened={open} onClose={onClose}>
      <Text>Are you sure you want to delete this comment?</Text>

      <Flex gap={5} justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button color="red" onClick={handleDelete} loading={isPending}>
          Delete
        </Button>
      </Flex>
    </Modal>
  );
};
