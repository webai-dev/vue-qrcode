import { createApp } from "vue"

import { createRouter, createWebHistory } from "vue-router"
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"

import { version as packageVersion } from "../package.json"
import App from "./App.vue"
import { routes, navigationGuard } from "./router"
import initMixpanel from "~/modules/tracking"

import "./assets/styles/styles.scss"

const app = createApp(App)
export const router = createRouter({
  routes,
  history: createWebHistory(),
  linkActiveClass: "active-router-link",
  linkExactActiveClass: "active-exact-router-link",
})

Sentry.init({
  app,
  dsn: <string>import.meta.env.VITE_SENTRY_DSN,
  // enabled takes boolean value, can not be casted from string, nor !! (for some reason it returns opposite value)
  enabled: import.meta.env.SENTRY_ENABLE === "true",
  environment: <string>import.meta.env.VITE_NODE_ENV,
  release: `Frontend@${packageVersion}`,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["localhost", "dev.labelcloud.org"],
    }),
  ],
  tracesSampleRate: 1.0,
})

Object.values(import.meta.globEager("./modules/*.ts")).map((i) =>
  i.install?.({ app, router, routes }),
)

initMixpanel()

// provide stores for e2e tests
if (window.Cypress) {
  const testStoresNames: { [key: string]: { name: string; fnName: string } } = {
    "./stores/generator.ts": {
      name: "generatorStore",
      fnName: "useGeneratorStore",
    },
    "./stores/session.ts": {
      name: "sessionStore",
      fnName: "useSessionStore",
    },
  }
  const storeModules = import.meta.globEager("./stores/*.ts")
  Object.keys(storeModules).map((path) => {
    try {
      testStoresNames[path] &&
        (window.testStores = {
          ...(window.testStores ? window.testStores : {}),
          ...(storeModules[path][testStoresNames[path].fnName]
            ? {
                [testStoresNames[path].name]:
                  storeModules[path][testStoresNames[path].fnName](),
              }
            : {}),
        })
    } catch (e) {
      // fail silently - stores may be unavailable in some test mock scenarios
      // eslint-disable-next-line no-console
      console.log(e)
    }

    return testStoresNames[path]
  })
}

router.beforeEach(navigationGuard)
app.use(router)

app.mount("#app")
