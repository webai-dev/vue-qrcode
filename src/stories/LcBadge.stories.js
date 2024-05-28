import LcBadge from "../components/base/LcBadge.vue"
import LcAvatar from "../components/base/LcAvatar.vue"
import IconDot from "~/assets/icons/icon-dot.svg?component"

const iconList = {
  dot: IconDot,
  none: undefined,
}

export default {
  title: "LcBadge",
  component: LcBadge,
  argTypes: {
    size: {
      control: {
        type: "radio",
      },
      options: ["sm", "md", "lg", "xl", "2xl"],
    },
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
    color: {
      control: {
        type: "select",
      },
      options: ["primary", "gray", "error", "warning", "success", "none"],
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcBadge },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcBadge v-bind="args" /> ',
})

export const PrimaryVariant = Template.bind({})
PrimaryVariant.args = {
  icon: "dot",
  text: "Badge text",
  avatar: false,
}

export const AvatarVariant = Template.bind({})
AvatarVariant.args = {
  icon: LcAvatar,
  avatar: true,
  text: "Badge with avatar",
}
