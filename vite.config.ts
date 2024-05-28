import path from "path"
import { defineConfig, loadEnv } from "vite"
import Vue from "@vitejs/plugin-vue"
// @ts-ignore
import { commonPlugins } from "./vite-common.config"

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const viteEnv = loadEnv(mode, process.cwd())
  const proxyRemoteApi = !!viteEnv.VITE_PROXY_REMOTE_API
  // viteEnv.VITE_API_URL = "http://localhost:3001"
  const serverConfig = proxyRemoteApi
    ? {
        server: {
          proxy: {
            "^/api/*": {
              target: viteEnv.VITE_API_URL as string,
              changeOrigin: true,
              cookieDomainRewrite: "",
              secure: false,
              rewrite: (path: string) => path.replace(/^\/api/, ""),
            },
          },
        },
      }
    : {}

  return defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/assets/styles/variables/_index.scss";
          @import "@/assets/styles/helpers/_index.scss";
          `,
        },
      },
    },
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirname, "src")}/`,
        "~/": `${path.resolve(__dirname, "src")}/`,
      },
    },
    plugins: [Vue(), ...commonPlugins],
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "@vueuse/core",
        "@vueuse/head",
        "vue-i18n",
      ],
    },
    ...serverConfig,
  })
}
