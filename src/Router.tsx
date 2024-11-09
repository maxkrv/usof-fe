import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import ActivatePage from './modules/auth/activate-page/activate-page';
import { LoginPage } from './modules/auth/login-page';
import { RegisterPage } from './modules/auth/register-page';
import { ResetPasswordPage } from './modules/auth/reset-password-page/reset-password-page';
import { CategoryPostPage } from './modules/post/category/category-post-page';
import { CreatePostPage } from './modules/post/create-post-page/create-post-page';
import HomePage from './modules/post/home-page/home-page';
import { MyPostsPage } from './modules/post/my-posts-page/my-posts-page';
import { PostPage } from './modules/post/post-page/post-page';
import { ProfilePage } from './modules/profile/profile-page/profile-page';
import { UserPage } from './modules/user/user-page';
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
        path: 'category/:id',
        element: <CategoryPostPage />
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
      },
      {
        path: 'user/:id',
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        )
      },
      {
        path: 'my-posts',
        element: (
          <PrivateRoute>
            <MyPostsPage />
          </PrivateRoute>
        )
      },
      {
        path: 'post',
        children: [
          {
            path: ':id',
            element: (
              <PrivateRoute>
                <PostPage />
              </PrivateRoute>
            ),
            children: [
              {
                path: 'edit',
                element: (
                  <PrivateRoute>
                    <CreatePostPage />
                  </PrivateRoute>
                )
              }
            ]
          },
          {
            path: 'create',
            element: (
              <PrivateRoute>
                <CreatePostPage />
              </PrivateRoute>
            )
          }
        ]
      }
    ]
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
