import LcCardContent from "../components/base/LcCardContent.vue"

export default {
  title: "LcCard/LcCardContent",
  component: LcCardContent,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: { LcCardContent },
  setup: () => ({ args }),
  template: '<LcCardContent v-bind="args">Example</LcCardContent>',
})

export const Default = Template.bind({})
Default.args = {}
