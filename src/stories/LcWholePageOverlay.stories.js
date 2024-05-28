import vueRouter from "storybook-vue3-router"
import LcWholePageOverlay from "../components/base/LcWholePageOverlay.vue"
import QrIcon from "~/assets/icons/icon-qr.svg?component"

const iconList = {
  qrCode: QrIcon,
  none: undefined,
}

export default {
  title: "LcWholePageOverlay",
  component: LcWholePageOverlay,
  decorators: [vueRouter()],
  args: {
    icon: QrIcon,
    pageTitle: "Page title",
    subTitle: "Subtitle",
    closeRoutePath: "/",
    // eslint-disable-next-line no-alert
    onClose: () => alert("Action before close handler"),
  },
  argTypes: {
    icon: {
      control: {
        type: "select",
        labels: {
          dot: "Dot",
          none: "None",
        },
      },
      options: Object.keys(iconList),
      mapping: iconList,
    },
    closeRoutePath: {
      control: false,
    },
  },
}

// create a mock container component that will contain the link to open overlay, so that we have router history

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcWholePageOverlay },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcWholePageOverlay v-bind="args" /> ',
})

export const Default = Template.bind({})

Default.decorators = [vueRouter()]

export const Success = Template.bind({})
Success.args = {
  success: true,
}

export const Error = Template.bind({})
Error.args = {
  error: true,
}

export const NoPrevButton = Template.bind({})
NoPrevButton.args = {
  hidePrevBtn: true,
}
