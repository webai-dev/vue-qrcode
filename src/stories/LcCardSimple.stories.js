import LcCard from "../components/base/LcCard.vue"

export default {
  title: "LcCard/LcCardSimple",
  component: LcCard,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: { LcCard },
  setup: () => ({ args }),
  template: '<LcCard v-bind="args">Example</LcCard>',
})

export const Default = Template.bind({})
Default.args = {}
