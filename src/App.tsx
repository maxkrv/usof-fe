import { LoadingOverlay } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Confetti } from './shared/components/confetti/confetti';
import { Header } from './shared/components/header/header';
import { USER_ME } from './shared/constants/query-keys';
import { useAppDispatch } from './shared/hooks/redux';
import { UserService } from './shared/services/user.service';
import { setLoading, setUser } from './shared/store/features/user-slice';

function App() {
  const dispatch = useAppDispatch();

  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey: [USER_ME],
    queryFn: UserService.me,
    retry: false
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      dispatch(setLoading(false));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      dispatch(setLoading(false));
    }
  }, [isError]);

  return (
    <>
      <Notifications />

      <LoadingOverlay visible={isLoading || isFetching} overlayProps={{ backgroundOpacity: 1 }} />

      <Header />

      <Confetti />

      <Outlet />
    </>
  );
}

export default App;
