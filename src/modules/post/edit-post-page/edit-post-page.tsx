import { Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';

import Container from '@/shared/components/container/container';
import { POST_FOR_EDIT } from '@/shared/constants/query-keys';
import { PostService } from '@/shared/services/post.service';

import { UpdatePostForm } from '../components/update-post-form/update-post-form';

export const EditPostPage = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [POST_FOR_EDIT, id],
    queryFn: () => PostService.getForEdit(Number(id)),
    staleTime: 0,
    retry: false
  });

  if (isLoading || isFetching) {
    return null;
  }

  if (!data) {
    return <Navigate to="/" replace />;
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
