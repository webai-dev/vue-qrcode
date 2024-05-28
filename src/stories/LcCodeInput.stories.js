import LcCodeInput from "../components/base/LcCodeInput.vue"

export default {
  title: "LcInput/LcCodeInput",
  component: LcCodeInput,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: { LcCodeInput },
  setup() {
    return { args }
  },
  template: '<LcCodeInput v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {}

export const WithAlpha = Template.bind({})
WithAlpha.args = {
  pattern: "alpha",
}

export const WithDifferentCount = Template.bind({})
WithDifferentCount.args = {
  count: 9,
}
