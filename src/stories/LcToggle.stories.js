import LcToggle from "../components/base/LcToggle.vue"

export default {
  title: "LcToggle",
  component: LcToggle,
  args: {
    size: "sm",
    disabled: false,
    valid: true,
    modelValue: false,
    label: "",
    description: "",
  },
  argTypes: {
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
  components: { LcToggle },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => {
    const { valid, ...withoutValid } = args
    return { args: { ...withoutValid, meta: { valid } } }
  },

  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcToggle v-bind="args">{{ args.label }}</LcToggle>`,
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
