import { Title } from '@mantine/core';

import Container from '@/shared/components/container/container';

import { CreatePostForm } from '../components/create-post-form/create-post-form';

export const CreatePostPage = () => {
  return (
    <Container>
      <Title order={2} ta="center">
        Create Post
      </Title>

      <CreatePostForm />
    </Container>
  );
};
