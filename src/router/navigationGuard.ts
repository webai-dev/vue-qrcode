import type { NavigationGuard } from "vue-router"
import { useSessionStore } from "~/stores/session"

import "vue-router"
import type { IUserRole } from "~/types/stores/Session"
import { Role } from "~/constants/permissions"

declare module "vue-router" {
  interface RouteMeta {
    // must be declared by every route
    role?: IUserRole[]
  }
}

export const navigationGuard: NavigationGuard = async (to) => {
  const sessionStore = useSessionStore()

  if (to.matched.some((record) => record.name === "auth")) {
    return
  }

  if (!sessionStore.isCurrentUserFetched) {
    await sessionStore.loadCurrentUser(false)
    if (!sessionStore.getCurrentUser) {
      return { name: "auth.login" }
    }
  }

  if (!to.meta.role) {
    return
  }

  if (sessionStore.isAdmin) {
    if (to.meta.role?.includes(Role.SuperAdmin)) {
      return
    } else {
      return { name: "app.generator" }
    }
  }

  if (
    (sessionStore.getCurrentRole &&
      to.meta.role.includes(sessionStore.getCurrentRole)) ||
    sessionStore.getCurrentUserCustomers.length === 0
  ) {
    return
  }

  return { name: "app.generator" }
}
