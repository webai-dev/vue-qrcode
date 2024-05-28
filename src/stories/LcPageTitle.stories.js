import LcPageTitle from "../components/base/LcPageTitle.vue"

export default {
  title: "LcPageTitle",
  component: LcPageTitle,
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcPageTitle },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcPageTitle v-bind="args" /> ',
})

export const Default = Template.bind({})
Default.args = {
  title: "Page title",
  subtitle: "Subtitle",
}
