import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../hooks/redux';

export const ActiveUserRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAppSelector((state) => state.user);

  if (isLoading) {
    return null;
  }

  if (!user?.isActive && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return children;
};
