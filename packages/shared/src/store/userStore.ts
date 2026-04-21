import { create } from 'zustand'

/**
 * 与主应用 `UserInfo` 契约对齐（主应用源：`essApi.ts` 中的 `UserInfo`）。
 * 子应用通过 wujie props 接收，字段需保持一致，避免后续访问时出现 undefined。
 */
export interface UserInfo {
  id: string
  username: string
  realName: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

interface UserState {
  token: string | null
  userInfo: UserInfo | null
  permissions: string[]
  setToken: (token: string | null) => void
  setUserInfo: (info: UserInfo | null) => void
  setPermissions: (perms: string[]) => void
  syncFromProps: (props: Record<string, unknown> | null | undefined) => void
}

function pickFromProps(props: Record<string, unknown> | null | undefined): Partial<UserState> {
  if (!props) return {}
  return {
    token: (props.token as string) ?? null,
    userInfo: (props.userInfo as UserInfo) ?? null,
    permissions: (props.permissions as string[]) ?? [],
  }
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userInfo: null,
  permissions: [],
  ...pickFromProps(window.$wujie?.props),
  setToken: (token) => set({ token }),
  setUserInfo: (info) => set({ userInfo: info }),
  setPermissions: (perms) => set({ permissions: perms }),
  syncFromProps: (props) => set(pickFromProps(props)),
}))
