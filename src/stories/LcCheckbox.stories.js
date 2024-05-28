import LcCheckbox from "../components/base/LcCheckbox.vue"

export default {
  title: "LcCheckbox",
  component: LcCheckbox,
  argTypes: {
    id: {
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
    label: {
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
    name: {
      control: {
        type: "text",
      },
    },
    size: {
      control: {
        type: "select",
      },
      options: ["sm", "md"],
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcCheckbox },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),
  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcCheckbox v-bind="args">{{ args.label }}</LcCheckbox>`,
})

export const DefaultVariant = Template.bind({})

DefaultVariant.args = {
  size: "sm",
  id: "example-id",
  label: "Remember me",
}

export const WithDescription = Template.bind({})

WithDescription.args = {
  size: "md",
  id: "example-id",
  label: "Remember me",
  description: "Save my login details for next time.",
}
