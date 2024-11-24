import { Skeleton } from '@mantine/core';
import { Text } from '@mantine/core';
import { FC } from 'react';

import { PaginationResponse, PostResponse } from '@/shared/types/interfaces';

import { PostCard } from '../post-card/post-card';
import classes from './post-list.module.css';

interface PostListProps {
  data: PaginationResponse<PostResponse>;
  isLoading: boolean;
}

export const PostList: FC<PostListProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className={classes.container}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} height={250} />
        ))}
      </div>
    );
  }

  if (!isLoading && !data?.data?.length) {
    return <Text ta="center">No posts found.</Text>;
  }

  return (
    <div className={classes.container}>
      {data?.data?.map((post) => <PostCard key={post.id} post={post} isFeed={true} />)}
    </div>
  );
};
