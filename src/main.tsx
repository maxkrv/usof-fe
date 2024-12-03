import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import './styles/style.css';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HTTPError } from 'ky';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Router } from './Router.tsx';
import { store } from './shared/store/store.ts';
import { handleErrorMessage } from './shared/utils/utils.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
    mutations: {
      onError(error) {
        handleErrorMessage(error as HTTPError);
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="auto"
      theme={{
        components: {
          Button: {
            styles: {
              root: { ':active': { transform: 'none' } }
            }
          }
        }
      }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router />

          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
