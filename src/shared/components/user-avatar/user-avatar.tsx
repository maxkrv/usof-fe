import { ActionIcon, Avatar } from '@mantine/core';
import classNames from 'classnames';
import { FC } from 'react';
import { FaRegUser } from 'react-icons/fa6';
import { MdModeEdit } from 'react-icons/md';

import classes from './user-avatar.module.css';

interface UserAvatarProps {
  src?: string | null;
  showEditButton?: boolean;
  onEditClick?: () => void;
  size?: 'md' | 'xl';
}

export const UserAvatar: FC<UserAvatarProps> = ({ src, showEditButton, onEditClick, size = 'md' }) => {
  return (
    <div className={classNames(classes.avatar, classes[size])}>
      {src ? (
        <Avatar src={src} size={size} radius="md" />
      ) : (
        <Avatar size={size} radius="md">
          <FaRegUser size={size === 'xl' ? 50 : undefined} />
        </Avatar>
      )}

      {showEditButton && (
        <ActionIcon variant="default" radius="lg" onClick={onEditClick}>
          <MdModeEdit />
        </ActionIcon>
      )}
    </div>
  );
};
