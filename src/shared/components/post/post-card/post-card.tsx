import { ActionIcon, Badge, Card, Flex, Menu, Text, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoShareSocial } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

import { CATEGORY_POSTS, MY_POSTS, POST_BY_ID, POST_FEED, USERS_POSTS } from '@/shared/constants/query-keys';
import { useAppSelector } from '@/shared/hooks/redux';
import { useShare } from '@/shared/hooks/useShare';
import { PostService } from '@/shared/services/post.service';
import { isUserActiveSelector, isUserAuthenticatedSelector } from '@/shared/store/features/user-slice';
import { PostResponse } from '@/shared/types/interfaces';

import { CommentsBox } from '../../comments-box/comments-box';
import { InactiveUserPopover } from '../../inactive-user-popover/inactive-user-popover';
import { LikeButton } from '../../like-button/like-button';
import { UserAvatar } from '../../user-avatar/user-avatar';
import { PostContent } from '../post-content/post-content';
import classes from './post-card.module.css';
dayjs.extend(relativeTime);

export interface PostCardProps {
  post: PostResponse;
  isFeed?: boolean;
}

export const PostCard: FC<PostCardProps> = ({ post, isFeed }) => {
  const userId = useAppSelector((state) => state.user.user?.id);
  const isUserActive = useAppSelector(isUserActiveSelector);
  const isUserAuthenticated = useAppSelector(isUserAuthenticatedSelector);
  const navigate = useNavigate();
  const share = useShare();
  const queryClient = useQueryClient();

  const [favorite, setFavorite] = useState(post.favorite);

  const { mutate: mutateSetFavorite } = useMutation({
    mutationFn: () => PostService.setFavorite(post.id)
  });
  const { mutate: mutateDelete } = useMutation({
    mutationFn: () => PostService.delete(post.id),
    onSuccess: () => {
      notifications.show({
        message: 'Post deleted',
        color: 'green'
      });
      queryClient.invalidateQueries({ queryKey: [POST_FEED] });
      queryClient.invalidateQueries({ queryKey: [USERS_POSTS, String(userId)] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_POSTS] });
      queryClient.invalidateQueries({ queryKey: [MY_POSTS] });
      queryClient.invalidateQueries({ queryKey: [POST_BY_ID, String(post.id)] });
    }
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

  const handleDelete = () => {
    mutateDelete();
  };

  const handleClick = (cb: () => void) => {
    if (!isUserAuthenticated) {
      navigate('/login');
      return;
    }

    cb();
  };

  const handleShare = () => {
    share({
      title: post.title,
      url: window.location.origin + `/post/${post.id}`,
      text: post.content
    });
  };

  const disabled = !isUserActive && isUserAuthenticated;

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

          <Menu>
            <Menu.Target>
              <ActionIcon ml="auto" variant="default">
                <HiOutlineDotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item px={5} leftSection={<IoShareSocial />} onClick={handleShare}>
                Share
              </Menu.Item>
              {userId === post.author.id && (
                <Menu.Item component={Link} to={`/post/edit/${post.id}`} px={5} leftSection={<MdEdit />}>
                  Edit
                </Menu.Item>
              )}
              {isFeed && userId === post.author.id && (
                <Menu.Item px={5} leftSection={<FaRegTrashAlt />} color="red" onClick={handleDelete}>
                  Delete
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Flex mt="xs">
          {post.categories.map((category) => (
            <Badge
              component={Link}
              to={`/category/${category.id}`}
              key={category.id}
              variant="default"
              style={{ cursor: 'pointer' }}>
              {category.title}
            </Badge>
          ))}
        </Flex>
      </Card.Section>

      <Card.Section withBorder p={10}>
        <Text component={isFeed ? Link : undefined} to={`/post/${post.id}`} size="lg" fw={700} mb={10}>
          {post.title}
        </Text>

        <PostContent id={post.id} content={post.content} isFeed={isFeed} />
      </Card.Section>

      <Card.Section withBorder p={10}>
        <Flex align="center" gap={5}>
          <LikeButton initialMyAction={post.myAction} postId={post.id} initialRating={post.rating} />

          <CommentsBox postId={post.id} comments={post.comments} asLink={isFeed} />

          <InactiveUserPopover>
            <UnstyledButton
              disabled={disabled}
              className={classes.favoriteButton}
              onClick={() => handleClick(handleSetFavorite)}>
              {favorite ? <FaStar /> : <FaRegStar />}
            </UnstyledButton>
          </InactiveUserPopover>
        </Flex>

        {post.status === 'INACTIVE' && <Badge color="red">Inactive</Badge>}
      </Card.Section>
    </Card>
  );
};
