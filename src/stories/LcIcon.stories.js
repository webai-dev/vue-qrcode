import LcIcon from "../components/base/LcIcon.vue"

export default {
  title: "LcIcon",
  component: LcIcon,
  args: {},
  argTypes: {
    size: {
      control: {
        type: "select",
      },
      options: ["small", "medium", "large"],
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcIcon },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcIcon v-bind="args">search</LcIcon> ',
})

export const DefaultVariant = Template.bind({})

export const SmallIcon = Template.bind({})
SmallIcon.args = {
  size: "small",
}

export const MediumIcon = Template.bind({})
MediumIcon.args = {
  size: "medium",
}

export const LargeIcon = Template.bind({})
LargeIcon.args = {
  size: "large",
}
