import LcRadioButton from "../components/base/LcRadioButton.vue"

const sizeList = {
  sm: "sm",
  md: "md",
}

export default {
  title: "LcRadioButton",
  component: LcRadioButton,
  argTypes: {
    id: {
      control: {
        type: "text",
      },
    },
    name: {
      control: {
        type: "text",
      },
    },
    value: {
      control: {
        type: "text",
      },
    },
    modelValue: {
      control: {
        type: "boolean",
      },
    },
    meta: {
      control: false,
    },
    default: {
      control: {
        type: "text",
      },
    },
    description: {
      control: {
        type: "text",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    indeterminate: {
      control: {
        type: "boolean",
      },
    },
    size: {
      control: {
        type: "radio",
        labels: {
          sm: "Small",
          md: "Medium",
        },
      },
      options: Object.keys(sizeList),
      mapping: sizeList,
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcRadioButton },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => {
    const { valid, modelValue, ...withoutValid } = args
    return {
      args: {
        ...withoutValid,
        meta: { valid },
        modelValue: modelValue ? args.value : null,
      },
    }
  },

  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcRadioButton v-bind="args">{{args.default}}</LcRadioButton>`,
})

export const DefaultVariant = Template.bind({})

DefaultVariant.args = {
  size: "sm",
  id: "example-id",
  value: "one",
  name: "options-one",
  default: "Remember me",
}

export const WithDescription = Template.bind({})

WithDescription.args = {
  size: "md",
  id: "example-id",
  value: "two",
  name: "options-two",
  default: "Remember me",
  description: "Save my login details for next time.",
}
