import ky, { HTTPError } from 'ky';

import { config } from '@/config/config';

import { AuthResponse } from '../types/interfaces';
import { addTokens, getAccessToken, getRefreshToken } from '../utils/utils';

export const apiClient = ky.create({
  prefixUrl: config.apiUrl,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (request.url.includes('auth/refresh') || request.url.includes('auth/logout')) return request;

        const accessToken = getAccessToken();

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return request;
      }
    ],
    beforeError: [
      async (error) => {
        const err = await error.response.json();
        return err as HTTPError;
      }
    ],
    beforeRetry: [
      async ({ request }) => {
        const refreshToken = getRefreshToken();
        console.log('🚀 ~ file: api.ts:34 ~ refreshToken:', refreshToken);

        if (!refreshToken) return;

        const res = await apiClient
          .post('auth/refresh', {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })
          .json<AuthResponse>();

        if (!res) {
          // handle error
        }

        addTokens(res);
        request.headers.set('Authorization', `Bearer ${res.accessToken}`);
      }
    ]
  },
  retry: {
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    statusCodes: [401],
    limit: 1
  }
});
