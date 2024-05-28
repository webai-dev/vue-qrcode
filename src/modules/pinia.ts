import { createPinia } from "pinia"
import type { UserModule } from "~/types/types"

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
}
