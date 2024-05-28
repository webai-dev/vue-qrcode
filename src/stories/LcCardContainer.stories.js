import LcCardContainer from "../components/base/LcCardContainer.vue"

export default {
  title: "LcCard/LcCardContainer",
  component: LcCardContainer,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: { LcCardContainer },
  setup: () => ({ args }),
  template: '<LcCardContainer v-bind="args">Example</LcCardContainer>',
})

export const Default = Template.bind({})
Default.args = {}
