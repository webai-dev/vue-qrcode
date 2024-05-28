import mixpanel from "mixpanel-browser"
import type { Mixpanel } from "mixpanel-browser"

let mixpanel_instance: Mixpanel

const initMixpanel = () => {
  mixpanel_instance = mixpanel.init(
    <string>import.meta.env.VITE_MIXPANEL_TOKEN,
    {
      debug: import.meta.env.DEV,
    },
    "labelcloud_frontend",
  )
}

export default initMixpanel

export const track = (
  eventName: string,
  props: { [propName: string]: any },
) => {
  mixpanel_instance?.track(eventName, props)
}

export const register = (userId: string) => {
  mixpanel_instance?.register({ userId })
}

export const identify = (userId: string) => {
  mixpanel_instance?.identify(userId)
}

export const alias = (userId: string) => {
  mixpanel_instance?.alias(userId)
}

export const people = {
  set_once: (props: { [propName: string]: any }) => {
    mixpanel_instance?.people.set_once(props)
  },
}
