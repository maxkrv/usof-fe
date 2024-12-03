import { Button, Pagination } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import Container from '@/shared/components/container/container';
import { PostFilterForm } from '@/shared/components/post/post-filter-form/post-filter-form';
import { PostList } from '@/shared/components/post/post-list/post-list';
import { MY_POSTS } from '@/shared/constants/query-keys';
import { PostService } from '@/shared/services/post.service';
import { IPostFilterForm } from '@/shared/types/interfaces';
import { getTotalPages } from '@/shared/utils/utils';

import classes from './my-posts-page.module.css';

export const MyPostsPage = () => {
  const [filters, setFilters] = useState<IPostFilterForm>({
    order: {
      orderBy: 'createdAt',
      value: 'desc'
    },
    fromDate: null,
    toDate: null
  });

  const {
    data,
    isFetching,
    isLoading: isLoadingPosts
  } = useQuery({
    queryKey: [
      MY_POSTS,
      filters.order.orderBy,
      filters.order.value,
      filters.fromDate,
      filters.toDate,
      filters.page,
      filters.status,
      filters.categoryId
    ],
    queryFn: async () =>
      PostService.getMe({
        page: filters.page,
        orderBy: filters.order.orderBy,
        order: filters.order.value,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        status: filters.status,
        categoryId: filters.categoryId
      }),
    staleTime: 0
  });

  const loading = isLoadingPosts || isFetching;

  return (
    <Container className={classes.container}>
      <Button
        component={Link}
        to="/posts/create"
        variant="default"
        leftSection={<FaPlus />}
        style={{ alignSelf: 'center' }}>
        Create post
      </Button>

      <PostFilterForm filters={filters} setFilters={setFilters} isLoading={loading} title="My posts" hasActiveFilters />

      <PostList isLoading={loading} data={data!} />

      <Pagination
        total={getTotalPages(data?.pagination.total || 0, 10)}
        value={filters.page}
        onChange={(page) => {
          window.scrollTo(0, 0);
          setFilters((prev) => ({ ...prev, page }));
        }}
        style={{
          alignSelf: 'center'
        }}
      />
    </Container>
  );
};
