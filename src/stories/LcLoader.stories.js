import LcLoader from "../components/base/LcLoader.vue"

export default {
  title: "LcLoader",
  component: LcLoader,
  argTypes: {
    size: {
      control: {
        type: "radio",
      },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcLoader },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcLoader v-bind="args" /> ',
})

export const Default = Template.bind({})
Default.args = {
  white: false,
}

export const White = Template.bind({})
White.args = {
  white: true,
}
White.parameters = {
  backgrounds: { default: "dark" },
}
