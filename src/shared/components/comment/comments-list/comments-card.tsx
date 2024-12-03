import { ActionIcon, Group, Menu, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/shared/hooks/redux';
import { CommentResponse } from '@/shared/types/interfaces';

import { LikeButton } from '../../like-button/like-button';
import { UserAvatar } from '../../user-avatar/user-avatar';
import { DeleteCommentModal } from '../delete-comment-modal/delete-comment-modal';
import { EditCommentModal } from '../edit-comment-modal/edit-comment-modal';

interface CommentsCardProps {
  comment: CommentResponse;
  postId: number;
}

export const CommentsCard: FC<CommentsCardProps> = ({ comment, postId }) => {
  const userId = useAppSelector((state) => state.user.user?.id);

  const [isDeleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [isEditModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const [content, setContent] = useState(comment.content);
  const [isEdited, setIsEdited] = useState(comment.isEdited);

  return (
    <>
      <Paper p="xs" withBorder key={comment.id}>
        <Group>
          {comment.author ? (
            <>
              <Link to={`/user/${comment.author.id}`}>
                <UserAvatar src={comment.author.profilePicture} />
              </Link>
              <div>
                <Link to={`/user/${comment.author.id}`}>
                  <Text>{comment.author.username}</Text>
                </Link>
                <Text size="xs" c="dimmed">
                  {dayjs(comment.createdAt).fromNow()}
                </Text>
              </div>
            </>
          ) : (
            <>
              <UserAvatar />
              <div>
                <Text>[deleted]</Text>
                <Text size="xs" c="dimmed">
                  {dayjs(comment.createdAt).fromNow()}
                </Text>
              </div>
            </>
          )}

          {userId === comment.author?.id && (
            <Menu>
              <Menu.Target>
                <ActionIcon ml="auto" variant="default">
                  <HiOutlineDotsVertical />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item px={5} leftSection={<MdEdit />} onClick={openEditModal}>
                  Edit
                </Menu.Item>
                <Menu.Item px={5} leftSection={<FaRegTrashAlt />} color="red" onClick={openDeleteModal}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
        <Text pt="sm">
          {content}{' '}
          <Text c="dimmed" component="span">
            {' '}
            {isEdited && '(edited)'}
          </Text>
        </Text>

        <LikeButton initialMyAction={comment.myReaction} commentId={comment.id} initialRating={comment.rating} />
      </Paper>

      <DeleteCommentModal postId={postId} id={comment.id} open={isDeleteModalOpened} onClose={closeDeleteModal} />
      <EditCommentModal
        id={comment.id}
        open={isEditModalOpened}
        onClose={closeEditModal}
        setContent={setContent}
        setIsEdited={setIsEdited}
        content={content}
      />
    </>
  );
};
