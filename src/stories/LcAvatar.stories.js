import LcAvatar from "../components/base/LcAvatar.vue"

const logoList = { avatar: "src/assets/icons/test-avatar.png", none: undefined }
const iconList = { dot: "dot", company: "company", none: undefined }

export default {
  title: "LcAvatar",
  component: LcAvatar,
  args: {},
  argTypes: {
    size: {
      control: {
        type: "radio",
      },
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    active: {
      options: { true: true, false: false },
    },
    logo: {
      control: {
        type: "radio",
        labels: {
          avatar: "Avatar",
          none: "None",
        },
      },
      options: Object.keys(logoList),
      mapping: logoList,
    },
    icon: {
      control: {
        type: "radio",
        labels: {
          dot: "Dot",
          company: "Company",
          none: "None",
        },
      },
      options: Object.keys(iconList),
      mapping: iconList,
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcAvatar },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcAvatar v-bind="args"></LcAvatar> ',
})

export const Default = Template.bind({})
Default.args = {}

export const WithIcons = Template.bind({})
WithIcons.args = {
  size: "xl",
  active: true,
  icon: iconList.dot,
  logo: logoList.avatar,
}
