import { notifications } from '@mantine/notifications';
import { HTTPError } from 'ky';

import { AuthResponse } from '../types/interfaces';

export const handleErrorMessage = (error: HTTPError) => {
  const messagesToIgnore: string[] = [];

  if (messagesToIgnore.includes(error.message)) return;

  notifications.show({
    title: 'Error',
    message: error.message,
    color: 'red'
  });
};

export const addTokens = (data: AuthResponse) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
