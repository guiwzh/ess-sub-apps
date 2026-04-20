declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean
    __WUJIE?: {
      id: string
      mount: () => void
      provide: {
        props: Record<string, unknown>
        bus: unknown
        location: unknown
      }
    }
    $wujie?: {
      props: Record<string, unknown>
      bus: unknown
      location: unknown
    }
    __WUJIE_MOUNT: () => void
    __WUJIE_UNMOUNT: () => void
  }
}

export {}
