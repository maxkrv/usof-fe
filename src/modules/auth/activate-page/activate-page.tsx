import { Loader, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { RxCross1 } from 'react-icons/rx';
import { Navigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '@/shared/hooks/redux';
import { AuthService } from '@/shared/services/auth.service';
import { activateConfetti } from '@/shared/store/features/confetti-slice';

import classes from './activate-page.module.css';

const ActivatePage = () => {
  const dispatch = useAppDispatch();

  const { token } = useParams();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const { mutate, isError, isSuccess } = useMutation({
    mutationFn: AuthService.activate,
    onSuccess: () => {
      dispatch(activateConfetti());
    }
  });

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, []);

  return (
    <div className={classes.container}>
      {!isSuccess && !isError && (
        <>
          <Title size="h2" className={classes.title}>
            Activating your account
          </Title>

          <Loader type="bars" />
        </>
      )}

      {isSuccess && (
        <>
          <Title size="h2" className={classes.title}>
            Account activated
          </Title>

          <FaCheck size={40} color="green" />

          <Navigate to="/" replace />
        </>
      )}

      {isError && (
        <>
          <Title size="h2" className={classes.title}>
            Failed to activate account
          </Title>

          <RxCross1 size={40} color="red" />
        </>
      )}
    </div>
  );
};

export default ActivatePage;
