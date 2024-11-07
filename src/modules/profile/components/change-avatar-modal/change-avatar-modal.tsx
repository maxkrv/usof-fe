import { Button, Modal, rem, Text, Title } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';

import { useAppDispatch } from '@/shared/hooks/redux';
import { UserService } from '@/shared/services/user.service';
import { changeAvatar, clearAvatar, setPrevAvatar } from '@/shared/store/features/user-slice';

import classes from './change-avatar-modal.module.css';

interface ChangeAvatarModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ChangeAvatarModal: FC<ChangeAvatarModalProps> = ({ opened, onClose }) => {
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: UserService.updateAvatar,
    onSuccess: () => {
      onClose();
      dispatch(setPrevAvatar(URL.createObjectURL(files[0])));
    }
  });

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const onDrop = (files: FileWithPath[]) => {
    setFiles(files);
    const imageUrl = URL.createObjectURL(files[0]);
    dispatch(changeAvatar(imageUrl));
  };

  const handleClose = () => {
    setFiles([]);
    onClose();

    if (!isPending) {
      dispatch(clearAvatar());
    }
  };

  const onSubmit = () => {
    if (!files.length) return;

    const formData = new FormData();
    formData.append('avatar', files[0]);
    mutate(formData);
  };

  return (
    <Modal centered onClose={handleClose} opened={opened}>
      <div className={classes.form}>
        <Title order={5} ta="center">
          Change avatar
        </Title>

        <Dropzone
          multiple={false}
          onDrop={onDrop}
          maxSize={10 * 1024 * 1024}
          accept={['image/jpeg', 'image/png', 'image/webp', 'image/jpg']}
          className={classes.dropZone}
          h={rem(150)}
          disabled={isPending}>
          {!files.length && (
            <>
              <Dropzone.Idle>
                <Text ta="center">Select image</Text>
              </Dropzone.Idle>

              <Dropzone.Reject>
                <Text ta="center">Failed to load image</Text>
              </Dropzone.Reject>
            </>
          )}

          {!!files.length && <img className={classes.imagePreview} src={URL.createObjectURL(files[0])} alt="" />}
        </Dropzone>

        <Button onClick={onSubmit} disabled={files.length === 0 || isPending}>
          Save
        </Button>
      </div>
    </Modal>
  );
};
