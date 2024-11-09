import { Pagination } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { CategoryList } from '@/shared/components/category-list/category-list';
import Container from '@/shared/components/container/container';
import { PostFilterForm } from '@/shared/components/post/post-filter-form/post-filter-form';
import { PostList } from '@/shared/components/post/post-list/post-list';
import { POST_FEED } from '@/shared/constants/query-keys';
import { useCategories } from '@/shared/hooks/categories';
import { PostService } from '@/shared/services/post.service';
import { IPostFilterForm } from '@/shared/types/interfaces';
import { getTotalPages } from '@/shared/utils/utils';

import classes from './home-page.module.css';

const HomePage = () => {
  const { categories, isLoading } = useCategories();
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
    queryKey: [POST_FEED, filters.order.orderBy, filters.order.value, filters.fromDate, filters.toDate, filters.page],
    queryFn: async () =>
      PostService.getAll({
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
      <CategoryList categories={isLoading ? [] : categories} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <PostFilterForm filters={filters} setFilters={setFilters} isLoading={loading} />

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
      </main>
    </Container>
  );
};

export default HomePage;
