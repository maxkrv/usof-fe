import { Pagination } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Container from '@/shared/components/container/container';
import { PostFilterForm } from '@/shared/components/post/post-filter-form/post-filter-form';
import { PostList } from '@/shared/components/post/post-list/post-list';
import { POST_FAVORITES } from '@/shared/constants/query-keys';
import { PostService } from '@/shared/services/post.service';
import { IPostFilterForm } from '@/shared/types/interfaces';
import { getTotalPages } from '@/shared/utils/utils';

import classes from './favorites-page.module.css';

export const FavoritesPage = () => {
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
      POST_FAVORITES,
      filters.order.orderBy,
      filters.order.value,
      filters.fromDate,
      filters.toDate,
      filters.page
    ],
    queryFn: async () =>
      PostService.getFavorites({
        page: filters.page,
        orderBy: filters.order.orderBy,
        order: filters.order.value,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined
      })
  });

  const loading = isLoadingPosts || isFetching;

  return (
    <Container className={classes.container}>
      <PostFilterForm filters={filters} setFilters={setFilters} isLoading={loading} title="Favorites" />

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
