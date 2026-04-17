import { create } from 'zustand'

interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar: string
  roles: string[]
}

interface UserState {
  token: string | null
  userInfo: UserInfo | null
  permissions: string[]
  setToken: (token: string | null) => void
  setUserInfo: (info: UserInfo | null) => void
  setPermissions: (perms: string[]) => void
  syncFromProps: (props: Record<string, unknown>) => void
}

function getInitFromWujie(): Partial<UserState> {
  const props = window.$wujie?.props
  if (!props) return {}
  return {
    token: (props.token as string) || null,
    userInfo: (props.userInfo as UserInfo) || null,
    permissions: (props.permissions as string[]) || [],
  }
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userInfo: null,
  permissions: [],
  ...getInitFromWujie(),
  setToken: (token) => set({ token }),
  setUserInfo: (info) => set({ userInfo: info }),
  setPermissions: (perms) => set({ permissions: perms }),
  syncFromProps: (props) =>
    set({
      token: (props.token as string) || null,
      userInfo: (props.userInfo as UserInfo) || null,
      permissions: (props.permissions as string[]) || [],
    }),
}))
