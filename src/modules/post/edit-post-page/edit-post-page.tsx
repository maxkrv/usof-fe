import { Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import Container from '@/shared/components/container/container';
import { POST_BY_ID } from '@/shared/constants/query-keys';
import { PostService } from '@/shared/services/post.service';

import { UpdatePostForm } from '../components/update-post-form/update-post-form';

export const EditPostPage = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [POST_BY_ID, id],
    queryFn: () => PostService.getById(Number(id)),
    staleTime: 0
  });

  if (isLoading || isFetching) {
    return null;
  }

  if (!data) {
    return null;
  }

  return (
    <Container>
      <Title order={2} ta="center">
        Edit Post
      </Title>

      <UpdatePostForm initialData={data} />
    </Container>
  );
};
