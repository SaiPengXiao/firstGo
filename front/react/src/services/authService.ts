import type { LoginFormValues, RegisterFormValues, User } from '../types/auth'
import { apiPost } from './http'

interface AuthApiResponse {
  user: User
  token: string
}

export async function loginApi(
  values: LoginFormValues,
): Promise<{ user: User; token: string }> {
  return apiPost<AuthApiResponse>('/api/auth/login', {
    username: values.username,
    password: values.password,
  })
}

export async function registerApi(
  values: RegisterFormValues,
): Promise<{ user: User; token: string }> {
  return apiPost<AuthApiResponse>('/api/auth/register', {
    username: values.username,
    email: values.email,
    password: values.password,
  })
}