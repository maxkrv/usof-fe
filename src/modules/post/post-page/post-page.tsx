import { Flex, Pagination, Skeleton, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CommentFilter } from '@/shared/components/comment/comment-filter/comment-filter';
import { CommentForm } from '@/shared/components/comment/comment-form/comment-form';
import { CommentsList } from '@/shared/components/comment/comments-list/comments-list';
import Container from '@/shared/components/container/container';
import { PostCard } from '@/shared/components/post/post-card/post-card';
import { COMMENTS, POST_BY_ID } from '@/shared/constants/query-keys';
import { CommentService } from '@/shared/services/comment.service';
import { PostService } from '@/shared/services/post.service';
import { ICommentFilterForm } from '@/shared/types/interfaces';
import { getTotalPages } from '@/shared/utils/utils';

export const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ICommentFilterForm>({
    order: {
      orderBy: 'createdAt',
      value: 'desc'
    }
  });

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [POST_BY_ID, id],
    queryFn: () => PostService.getById(Number(id)),
    staleTime: 0,
    retry: false
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: [COMMENTS, id, filters.order.orderBy, filters.order.value, filters.page],
    queryFn: () =>
      CommentService.getAll({
        postId: Number(id),
        orderBy: filters.order.orderBy,
        order: filters.order.value,
        page: filters.page
      }),
    staleTime: 0
  });

  const loading = isLoading || isFetching;

  useEffect(() => {
    if (isError) {
      navigate('/404');
    }
  }, [isError]);

  return (
    <Container>
      {loading || isError ? <Skeleton height={250} /> : <PostCard post={data!} isFeed={false} />}

      <Flex direction="column" mt="lg" gap={5} mb={20}>
        <Title order={5}>Comments</Title>

        <CommentForm postId={Number(id)} />

        <CommentFilter filters={filters} setFilters={setFilters} isLoading={loading || isLoadingComments} />

        {isLoadingComments ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={140} />)
        ) : (
          <CommentsList data={comments?.data || []} postId={Number(id)} />
        )}

        <Pagination
          total={getTotalPages(comments?.pagination.total || 0, 10)}
          value={filters.page}
          onChange={(value) => setFilters({ ...filters, page: value })}
          style={{ alignSelf: 'center' }}
        />
      </Flex>
    </Container>
  );
};
