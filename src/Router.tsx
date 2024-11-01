import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import ActivatePage from './modules/auth/activate-page/activate-page';
import { LoginPage } from './modules/auth/login-page';
import { RegisterPage } from './modules/auth/register-page';
import { ResetPasswordPage } from './modules/auth/reset-password-page/reset-password-page';
import HomePage from './modules/home-page/home-page';
import { ProfilePage } from './modules/profile/profile-page/profile-page';
import PrivateRoute from './shared/hoc/private-route';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordPage />
      },
      {
        path: 'activate/:token',
        element: (
          <PrivateRoute>
            <ActivatePage />
          </PrivateRoute>
        )
      },
      {
        path: 'protected',
        element: (
          <PrivateRoute>
            <div>protected</div>
          </PrivateRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        )
      }
    ]
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
