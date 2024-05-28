import LcDialog from "../components/base/LcDialog.vue"

export default {
  title: "LcDialog",
  component: LcDialog,
  argTypes: {
    show: {
      control: {
        type: "boolean",
      },
    },
    icon: {
      control: false,
    },
    headline: {
      control: {
        type: "text",
      },
    },
    description: {
      control: {
        type: "text",
      },
    },
    destructive: {
      control: {
        type: "boolean",
      },
    },
    confirmLabel: {
      control: {
        type: "text",
      },
    },
    cancelLabel: {
      control: {
        type: "text",
      },
    },
    onConfirm: {
      action: "onConfirm",
    },
    onClose: {
      action: "onClose",
    },
    showLoader: {
      control: {
        type: "boolean",
      },
    },
    confirmButtonIcon: {
      control: false,
    },
    default: {
      control: {
        type: "text",
      },
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcDialog },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcDialog
      v-bind="args"
    >
      <template v-if="${"default" in args}">${args.default}</template>
    </LcDialog>`,
})

export const Default = Template.bind({})

Default.args = {
  show: true,
  icon: "mail",
  headline: "Delete the API Key?",
  default: `Deleting the API key can cause errors in the connected applications`,
  destructive: true,
  confirmLabel: "Delete Api Key",
}

export const NewApiKey = Template.bind({})

NewApiKey.args = {
  show: true,
  headline: "New API key got generated. Please save your key now!",
  icon: "circle-check",
  description:
    "For safety reasons the key is only shown once. Please store it somewhere save.",
  default: `
    <div>

    </div>
  `,
  confirmLabel: "Copy API key",
  cancelLabel: "Close",
}
