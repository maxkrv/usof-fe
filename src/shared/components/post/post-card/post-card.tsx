import { Card, Flex, Text, UnstyledButton } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/shared/hooks/redux';
import { PostService } from '@/shared/services/post.service';
import { isUserActiveSelector, isUserAuthenticatedSelector } from '@/shared/store/features/user-slice';
import { PostResponse } from '@/shared/types/interfaces';

import { CommentsBox } from '../../comments-box/comments-box';
import { InactiveUserPopover } from '../../inactive-user-popover/inactive-user-popover';
import { LikeButton } from '../../like-button/like-button';
import { UserAvatar } from '../../user-avatar/user-avatar';
import classes from './post-card.module.css';
dayjs.extend(relativeTime);

export interface PostCardProps {
  post: PostResponse;
}

export const PostCard: FC<PostCardProps> = ({ post }) => {
  const isUserActive = useAppSelector(isUserActiveSelector);
  const isUserAuthenticated = useAppSelector(isUserAuthenticatedSelector);
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(post.favorite);

  const { mutate: mutateSetFavorite } = useMutation({
    mutationFn: () => PostService.setFavorite(post.id)
  });
  const { mutate: mutateDeleteFavorite } = useMutation({
    mutationFn: () => PostService.deleteFavorite(post.id)
  });

  const handleSetFavorite = () => {
    if (favorite) {
      setFavorite(false);
      mutateDeleteFavorite();
    } else {
      setFavorite(true);
      mutateSetFavorite();
    }
  };

  const disabled = !isUserActive && isUserAuthenticated;

  const handleClick = (cb: () => void) => {
    if (!isUserAuthenticated) {
      navigate('/login');
      return;
    }

    cb();
  };

  return (
    <Card withBorder p={15}>
      <Card.Section withBorder p={10}>
        <Flex align="center" gap="xs">
          <Link to={`/user/${post.author.id}`}>
            <UserAvatar src={post.author.profilePicture} />
          </Link>
          <Link to={`/user/${post.author.id}`}>
            <Text>{post.author.username}</Text>
          </Link>

          <Text size="xs">{dayjs(post.createdAt).fromNow()}</Text>
        </Flex>
      </Card.Section>

      <Card.Section withBorder p={10}>
        <Text size="lg" fw={700} mb={10}>
          {post.title}
        </Text>

        <Text>{post.content}</Text>
      </Card.Section>

      <Card.Section withBorder p={10}>
        <Flex align="center" gap={5}>
          <LikeButton initialMyAction={post.myAction} postId={post.id} initialRating={post.rating} />

          <CommentsBox postId={post.id} comments={post.comments} />

          <InactiveUserPopover>
            <UnstyledButton
              disabled={disabled}
              className={classes.favoriteButton}
              onClick={() => handleClick(handleSetFavorite)}>
              {favorite ? <FaStar /> : <FaRegStar />}
            </UnstyledButton>
          </InactiveUserPopover>
        </Flex>
      </Card.Section>
    </Card>
  );
};
