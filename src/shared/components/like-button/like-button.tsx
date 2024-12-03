import { ActionIcon, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/shared/hooks/redux';
import { ReactionService } from '@/shared/services/reaction.service';
import { isUserActiveSelector, isUserAuthenticatedSelector } from '@/shared/store/features/user-slice';

import { InactiveUserPopover } from '../inactive-user-popover/inactive-user-popover';
import classes from './like-button.module.css';

interface LikeButtonProps {
  initialMyAction: 'LIKE' | 'DISLIKE' | null;
  postId?: number;
  commentId?: number;
  initialRating: number;
}

export const LikeButton: FC<LikeButtonProps> = ({ initialMyAction, postId, commentId, initialRating }) => {
  if (!postId && !commentId) {
    throw new Error('postId or commentId is required');
  }

  if (postId && commentId) {
    throw new Error('postId and commentId are mutually exclusive');
  }

  const navigate = useNavigate();

  const isUserActive = useAppSelector(isUserActiveSelector);
  const isUserAuthenticated = useAppSelector(isUserAuthenticatedSelector);

  const [myAction, setMyAction] = useState(initialMyAction);
  const [rating, setRating] = useState(initialRating);

  const { mutateAsync: createReaction } = useMutation({
    mutationFn: (type: 'LIKE' | 'DISLIKE') => {
      return postId
        ? ReactionService.createPostReaction(postId, {
            type
          })
        : ReactionService.createCommentReaction(commentId!, {
            type
          });
    }
  });

  const { mutateAsync: deleteReaction } = useMutation({
    mutationFn: (type: 'LIKE' | 'DISLIKE') => {
      return postId
        ? ReactionService.deletePostReaction(postId, {
            type
          })
        : ReactionService.deleteCommentReaction(commentId!, {
            type
          });
    }
  });

  const handleLike = () => {
    if (myAction === 'DISLIKE') {
      setMyAction('LIKE');
      setRating((prev) => prev + 2);

      createReaction('LIKE');

      return;
    }

    if (myAction === 'LIKE') {
      setMyAction(null);
      setRating((prev) => prev - 1);

      deleteReaction('LIKE');
    } else {
      setMyAction('LIKE');
      setRating((prev) => prev + 1);

      createReaction('LIKE');
    }
  };

  const handleDislike = () => {
    if (myAction === 'LIKE') {
      setMyAction('DISLIKE');
      setRating((prev) => prev - 2);

      createReaction('DISLIKE');

      return;
    }

    if (myAction === 'DISLIKE') {
      setMyAction(null);
      setRating((prev) => prev + 1);

      deleteReaction('DISLIKE');
    } else {
      setMyAction('DISLIKE');
      setRating((prev) => prev - 1);

      createReaction('DISLIKE');
    }
  };

  const disabled = !isUserActive || !isUserAuthenticated;

  const handleClick = (cb: () => void) => {
    if (!isUserAuthenticated) {
      navigate('/login');
      return;
    }

    cb();
  };

  return (
    <div className={classes.container}>
      <InactiveUserPopover>
        <ActionIcon variant="default" radius="lg" onClick={() => handleClick(handleLike)} disabled={disabled}>
          {myAction === 'LIKE' ? <BiSolidUpvote /> : <BiUpvote />}
        </ActionIcon>
      </InactiveUserPopover>

      <Text>{rating}</Text>

      <InactiveUserPopover>
        <ActionIcon variant="default" radius="lg" onClick={() => handleClick(handleDislike)} disabled={disabled}>
          {myAction === 'DISLIKE' ? <BiSolidDownvote /> : <BiDownvote />}
        </ActionIcon>
      </InactiveUserPopover>
    </div>
  );
};
