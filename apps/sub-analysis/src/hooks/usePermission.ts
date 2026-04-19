import { useUserStore } from '@/store/userStore'

export function usePermission() {
  const permissions = useUserStore((s) => s.permissions)

  const has = (code: string) => permissions.includes(code)
  const hasAny = (codes: string[]) => codes.some((c) => permissions.includes(c))
  const hasAll = (codes: string[]) => codes.every((c) => permissions.includes(c))

  return { has, hasAny, hasAll }
}
