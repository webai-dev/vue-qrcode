const path = require("path")
const Components = require("unplugin-vue-components/vite")
const AutoImport = require("unplugin-auto-import/vite")
const VueI18n = require("@intlify/vite-plugin-vue-i18n").default
const ViteFonts = require("vite-plugin-fonts").default
const SvgLoader = require("vite-svg-loader").default

/**
 * Put common plugins for Vite her (for Storybook and project itself)
 */
module.exports = {
  commonPlugins: [
    SvgLoader({
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
    Components({ dts: true }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: "src/auto-imports.d.ts",
    }),
    ViteFonts({
      google: {
        families: [
          "Inter",
          {
            name: "Inter",
            styles: "wght@400;500;600;700&display=swap",
          },
        ],
      },
    }),
    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, "src/locales/**")],
    }),
  ],
}
