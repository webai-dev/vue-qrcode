import LcCardActions from "../components/base/LcCardActions.vue"

export default {
  title: "LcCard/LcCardActions",
  component: LcCardActions,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: { LcCardActions },
  setup: () => ({ args }),
  template:
    '<LcCardActions v-bind="args"><button>Action</button></LcCardActions>',
})

export const Default = Template.bind({})
Default.args = {}
