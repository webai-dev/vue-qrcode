import LcInput from "../components/base/LcInput.vue"
import IconLocation from "../assets/icons/icon-location.svg?component"
import IconUser from "../assets/icons/icon-user.svg?component"

const iconList = { IconLocation, IconUser }

export default {
  title: "LcInput/LcInput",
  component: LcInput,
  argTypes: {
    placeholder: {
      control: {
        type: "text",
      },
    },
    modelValue: {
      control: {
        type: "text",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    prefix: {
      control: {
        type: "text",
      },
    },
    type: {
      control: {
        type: "select",
      },
      options: ["text", "password", "email", "number", "tel", "url"],
    },
    icon: {
      control: {
        type: "select",
        labels: {
          IconLocation: "Location",
          IconUser: "User",
        },
      },
      options: Object.keys(iconList),
      mapping: iconList,
    },
    addonBefore: {
      control: {
        type: "boolean",
      },
    },
    addonAfter: {
      control: {
        type: "boolean",
      },
    },
    useValueInsteadOfModel: {
      control: {
        type: "boolean",
      },
    },
    value: {
      control: {
        type: "text",
      },
    },
    autofocus: {
      control: {
        type: "boolean",
      },
    },
    selectAllOnFocus: {
      control: {
        type: "boolean",
      },
    },
    readonly: {
      control: {
        type: "boolean",
      },
    },
    "onUpdate:modelValue": {
      action: "Update",
      table: {
        type: {
          summary: null,
        },
      },
    },
    onValidation: {
      action: "validation",
      table: {
        type: {
          summary: null,
        },
      },
    },
    onBlur: {
      action: "blur",
      table: {
        type: {
          summary: null,
        },
      },
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcInput },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args }
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<LcInput v-bind="args" />',
})

export const TestVariant = Template.bind({})
TestVariant.args = {
  placeholder: "Placeholder",
  disabled: false,
}

export const Secondary = Template.bind({})
Secondary.args = {
  placeholder: "Placeholder",
}
