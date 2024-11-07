import { Text } from '@mantine/core';
import { ElementType, FC } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import classes from './comments-box.module.css';

interface CommentsBoxProps {
  asLink?: boolean;
  postId: number;
  comments: number;
}

export const CommentsBox: FC<CommentsBoxProps> = ({ asLink = true, postId, comments }) => {
  const Component: ElementType = asLink ? Link : 'div';

  return (
    <Component className={classes.container} {...(asLink ? { to: `/post/${postId}` } : {})}>
      <FaRegComment />

      <Text>{comments}</Text>
    </Component>
  );
};
