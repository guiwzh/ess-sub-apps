import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    body: {
      code: 0,
      message: 'success',
      data: {
        accessToken: 'sub-operation-dev-token',
        refreshToken: 'sub-operation-dev-refresh',
      },
    },
  },
])
