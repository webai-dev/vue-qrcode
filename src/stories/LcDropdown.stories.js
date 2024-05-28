import LcDropdown from "../components/base/LcDropdown.vue"

const options = [
  "option 1",
  "option 2",
  "option 3",
  "option 4",
  "option 5",
  "option 6",
]

export default {
  title: "LcDropdown",
  component: LcDropdown,
  args: {
    options,
  },
  argTypes: {
    options: {
      type: "array",
      description: "Dropdown options",
    },
    placeholder: {
      type: "string",
      description: "Dropdown placeholder",
    },
    disabled: {
      type: "boolean",
      description: "Dropdown is disabled",
    },
    ModelValue: {
      type: "any",
      description: "Dropdown default value",
    },
    value: {
      type: "any",
      description: "Dropdown selected value",
    },
    addOn: {
      type: "before" | "after",
      description: "Dropdown addon position",
    },
    clearable: {
      type: "boolean",
      description: "Dropdown is clearable",
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcDropdown },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcDropdown v-bind="args"></LcDropdown>',
})

export const Default = Template.bind({})
Default.args = {}

export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
  placeholder: "Example placeholder",
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}

export const WithModelValue = Template.bind({})
WithModelValue.args = {
  modelValue: "option 1",
}

export const Clearable = Template.bind({})
Clearable.args = {
  clearable: true,
  modelValue: "option 1",
}
