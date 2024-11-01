import { apiClient } from '../api/api';
import { User } from '../types/interfaces';

export class UserService {
  static async me(): Promise<User> {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    return apiClient
      .get<User>('user/me', {
        retry: 1
      })
      .json();
  }
}
