import { Flex, Pagination, Paper, Skeleton, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from '@/shared/components/container/container';
import { PostFilterForm } from '@/shared/components/post/post-filter-form/post-filter-form';
import { PostList } from '@/shared/components/post/post-list/post-list';
import { UserAvatar } from '@/shared/components/user-avatar/user-avatar';
import { USER_BY_ID, USERS_POSTS } from '@/shared/constants/query-keys';
import { PostService } from '@/shared/services/post.service';
import { UserService } from '@/shared/services/user.service';
import { IPostFilterForm } from '@/shared/types/interfaces';
import { getTotalPages } from '@/shared/utils/utils';

import classes from './user-page.module.css';
export const UserPage = () => {
  const { id } = useParams();

  const [filters, setFilters] = useState<IPostFilterForm>({
    order: {
      orderBy: 'createdAt',
      value: 'desc'
    },
    fromDate: null,
    toDate: null
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [USER_BY_ID, id],
    queryFn: () => {
      return UserService.getById(Number(id));
    },
    staleTime: 0
  });

  const {
    data,
    isFetching,
    isLoading: isLoadingPosts
  } = useQuery({
    queryKey: [
      USERS_POSTS,
      id,
      filters.order.orderBy,
      filters.order.value,
      filters.fromDate,
      filters.toDate,
      filters.page
    ],
    queryFn: async () =>
      PostService.getAll({
        userId: Number(id),
        page: filters.page,
        orderBy: filters.order.orderBy,
        order: filters.order.value,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined
      }),
    enabled: !!id && !isLoadingUser
  });

  const loading = isLoadingPosts || isFetching;

  return (
    <Container className={classes.container}>
      <section className={classes.userSection}>
        {isLoadingUser ? (
          <Skeleton height={30} w={150} mb="sm" mx={'auto'} />
        ) : (
          <Title order={3} mb="sm" ta="center">
            {user?.username}&apos;s Profile
          </Title>
        )}

        {isLoadingUser ? (
          <Skeleton className={classes.userContainerDesktopSkeleton} />
        ) : (
          <Paper className={classes.userContainerDesktop} radius="md" p={15}>
            <UserAvatar size="xl" src={user?.profilePicture} onEditClick={open} />

            <div className={classes.userInfo}>
              <Text>{user?.username}</Text>
              <Text>Rating: {user?.rating}</Text>
            </div>
          </Paper>
        )}
      </section>

      <Flex direction="column" gap="1rem">
        <PostFilterForm
          filters={filters}
          setFilters={setFilters}
          title={isLoadingUser ? <Skeleton height={28.8} w={100} /> : `${user?.username}'s Posts`}
          isLoading={loading}
        />

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
      </Flex>
    </Container>
  );
};
