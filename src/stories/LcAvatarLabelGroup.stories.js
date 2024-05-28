import LcAvatarLabelGroup from "../components/base/LcAvatarLabelGroup.vue"

const sizeList = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
}
const logoList = { avatar: "src/assets/icons/test-avatar.png", none: undefined }
const iconList = { dot: "dot", company: "company", none: undefined }

export default {
  title: "LcAvatarLabelGroup",
  component: LcAvatarLabelGroup,
  args: {},
  argTypes: {
    size: {
      control: {
        type: "radio",
      },
      options: Object.keys(sizeList),
      mapping: sizeList,
    },
    active: {
      control: {
        type: "boolean",
      },
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
    name: "",
    email: "",
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcAvatarLabelGroup },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcAvatarLabelGroup v-bind="args"></LcAvatarLabelGroup> ',
})

export const Default = Template.bind({})
Default.args = {
  name: "Test Test",
  email: "test@test.net",
}

export const WithIcons = Template.bind({})
WithIcons.args = {
  size: sizeList.md,
  active: true,
  logo: logoList.avatar,
  icon: "dot",
  name: "Test Test",
  email: "test@test.net",
}
