declare global {
  interface NavigatorUAData {
    platform: string
  }

  interface Navigator {
    userAgentData?: NavigatorUAData
  }
}

export type NavigatorUserAgentDataShim = never
