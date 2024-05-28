import LcCardHeader from "../components/base/LcCardHeader.vue"

export default {
  title: "LcCard/LcCardHeader",
  component: LcCardHeader,
  args: {},
  argTypes: {
    title: {
      tyep: "string",
      description: "Card title",
    },
    subtitle: {
      tyep: "string",
      description: "Card subtitle",
    },
  },
}

const Template = (args) => ({
  components: { LcCardHeader },
  setup: () => ({ args }),
  template: '<LcCardHeader v-bind="args">Example</LcCardHeader>',
})

export const Default = Template.bind({})
Default.args = {}

export const WithTitle = Template.bind({})
WithTitle.args = {
  title: "Example Title",
}

export const WithTitleAndSubtitle = Template.bind({})
WithTitleAndSubtitle.args = {
  title: "Example Title",
  subtitle: "Example Subtitle",
}
