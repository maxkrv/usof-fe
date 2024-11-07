import { z } from 'zod';

export const passwordValidation = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()]/, 'Password must contain at least one special character');

export const LoginSchema = z.object({
  login: z.string().trim().min(1, { message: 'Login is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' })
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    username: z.string().trim().min(1, { message: 'Username is required' }),
    email: z.string().email().trim().min(1, { message: 'Email is required' }),
    fullName: z.string().trim().min(1, { message: 'Full name is required' }),
    password: passwordValidation,
    repeatPassword: z.string().trim().min(1, { message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const EmailSchema = z.object({
  email: z.string().email().trim().min(1, { message: 'Email is required' })
});
export type EmailDto = z.infer<typeof EmailSchema>;

export interface ResetPasswordDto {
  password: string;
  repeatPassword: string;
  token: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profilePicture: null | string;
  createdAt: Date;
  rating: number;
  isActive: boolean;
  fullName: string;
}

export const EditUserSchema = z.object({
  username: z.string().trim().min(1, { message: 'Username is required' }).optional(),
  fullName: z.string().trim().min(1, { message: 'Full name is required' }).optional(),
  email: z.string().email().trim().min(1, { message: 'Email is required' }).optional()
});
export type EditUserDto = z.infer<typeof EditUserSchema>;

export interface Category {
  id: number;
  title: string;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface GetPostsDto extends PaginationDto {
  order?: 'asc' | 'desc';
  orderBy?: 'createdAt' | 'rating' | 'comments';
  categoryId?: number;
  userId?: number;
  fromDate?: Date;
  toDate?: Date;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    total: number;
  };
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  myAction: 'LIKE' | 'DISLIKE' | null;
  rating: number;
  comments: number;
  status?: 'ACTIVE' | 'INACTIVE';
  favorite: boolean;
  categories: Category[];
  author: {
    id: number;
    profilePicture: string | null;
    username: string;
  };
  createdAt: Date;
}

export interface ReactionDto {
  type: 'LIKE' | 'DISLIKE';
}

export interface IPostFilterForm {
  order: {
    value: 'asc' | 'desc';
    orderBy: 'createdAt' | 'rating' | 'comments';
  };
  fromDate?: Date | null;
  toDate?: Date | null;
  status?: 'ACTIVE' | 'INACTIVE';
}
