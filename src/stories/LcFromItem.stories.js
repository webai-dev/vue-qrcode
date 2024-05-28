import LcFormItem from "../components/base/LcFormItem.vue"
import LcInput from "../components/base/LcInput.vue"

export default {
  title: "LcFormItem",
  component: LcFormItem,
  args: {},
  argTypes: {
    name: {
      type: "string",
      description: "Field name",
    },
    label: {
      type: "string",
      description: "Text before the input",
    },
    rules: {
      type: "any",
      description: "Validation rules",
    },
    className: {
      type: "string",
      description: "Field additional classes",
    },
    annotation: {
      type: "string",
      description: "Text under the input",
    },
    type: {
      type: "string",
      description: "Input type",
    },
    defaultValue: {
      type: "any",
      description: "Default input value",
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcFormItem, LcInput },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcFormItem v-bind="args"><LcInput /></LcFormItem>',
})

export const Default = Template.bind({})
Default.args = {
  name: "fieldName",
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  name: "fieldName",
  label: "Example Label",
}

export const WithAnnotation = Template.bind({})
WithAnnotation.args = {
  name: "fieldName",
  annotation: "annotation",
}
