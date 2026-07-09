export interface User {
  id: string
  username: string
  email: string
  roles: string[]
}

export interface LoginFormValues {
  username: string
  password: string
}

export interface RegisterFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}