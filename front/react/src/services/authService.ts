import type { LoginFormValues, RegisterFormValues, User } from '../types/auth'
import { get, post } from './request'

interface AuthApiResponse {
  user: User
  token: string
}

export async function loginApi(
  values: LoginFormValues,
): Promise<{ user: User; token: string }> {
  return post<AuthApiResponse>('/api/auth/login', {
    username: values.username,
    password: values.password,
  })
}

export async function registerApi(
  values: RegisterFormValues,
): Promise<{ user: User; token: string }> {
  return post<AuthApiResponse>('/api/auth/register', {
    username: values.username,
    email: values.email,
    password: values.password,
  })
}

/** 当前登录用户（需 Bearer token，由 request 拦截器自动附带） */
export async function getMeApi(): Promise<User> {
  return get<User>('/api/auth/me')
}