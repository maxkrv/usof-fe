import { Flex, Text } from '@mantine/core';
import { FC } from 'react';

import { CommentResponse } from '@/shared/types/interfaces';

import { CommentsCard } from './comments-card';

interface CommentsListProps {
  data: CommentResponse[];
  postId: number;
}

export const CommentsList: FC<CommentsListProps> = ({ data, postId }) => {
  if (!data.length) {
    return <Text ta="center">No comments found.</Text>;
  }

  return (
    <Flex direction="column" gap={5}>
      {data?.map((comment) => <CommentsCard postId={postId} key={comment.id} comment={comment} />)}
    </Flex>
  );
};
