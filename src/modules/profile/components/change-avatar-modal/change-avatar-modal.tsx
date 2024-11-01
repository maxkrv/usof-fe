import { Modal } from '@mantine/core';
import { FC } from 'react';

interface ChangeAvatarModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ChangeAvatarModal: FC<ChangeAvatarModalProps> = ({ opened, onClose }) => {
  return <Modal centered onClose={onClose} opened={opened}></Modal>;
};
