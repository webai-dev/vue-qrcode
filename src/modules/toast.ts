import Toast from "vue-toastification"
import type { PluginOptions } from "vue-toastification"
import type { UserModule } from "~/types/types"

export const install: UserModule = ({ app }) => {
  const options: PluginOptions = {
    hideProgressBar: true,
  }

  app.use(Toast, options)
}
