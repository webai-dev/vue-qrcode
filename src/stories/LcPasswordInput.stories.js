import LcPasswordInput from "../components/base/LcPasswordInput.vue"
import { rules } from "../modules/validationRules"

export default {
  title: "LcInput/LcPasswordInput",
  component: LcPasswordInput,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: { LcPasswordInput },
  setup: () => {
    rules()
    return { args }
  },
  template: '<LcPasswordInput v-bind="args"></LcPasswordInput>',
})

export const Default = Template.bind({})
Default.args = {}
