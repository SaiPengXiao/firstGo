import type { LoginFormValues, RegisterFormValues, User } from '../types/auth'

/** 模拟登录，后续可替换为真实 API */
export async function loginApi(
  values: LoginFormValues,
): Promise<{ user: User; token: string }> {
  await delay(600)
  if (!values.username || !values.password) {
    throw new Error('请输入用户名和密码')
  }
  return {
    user: {
      id: crypto.randomUUID(),
      username: values.username,
      email: `${values.username}@example.com`,
    },
    token: `mock-token-${Date.now()}`,
  }
}

/** 模拟注册 */
export async function registerApi(
  values: RegisterFormValues,
): Promise<{ user: User; token: string }> {
  await delay(600)
  return {
    user: {
      id: crypto.randomUUID(),
      username: values.username,
      email: values.email,
    },
    token: `mock-token-${Date.now()}`,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}