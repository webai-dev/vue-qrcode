import LcButton from "../components/base/LcButton.vue"
import IconLocation from "../assets/icons/icon-location.svg?component"
import IconUser from "../assets/icons/icon-user.svg?component"
import IconPlus from "~/assets/icons/icon-plus-xl.svg?component"

const iconList = { IconLocation, IconUser, IconPlus, none: undefined }

export default {
  title: "LcButton",
  component: LcButton,
  argTypes: {
    variant: {
      options: [
        "primary",
        "secondary",
        "secondary-gray",
        "tertiary",
        "tertiary-gray",
        "link",
        "link-gray",
      ],
    },
    size: {
      options: ["sm", "md", "lg", "xl", "2xl"],
    },
    destructive: {
      options: { true: true, false: false },
    },
    disabled: {
      options: { true: true, false: false },
    },
    icon: {
      control: {
        type: "select",
        labels: {
          IconLocation: "Location",
          IconUser: "User",
          IconPlus: "Plus",
          none: "None",
        },
      },
      options: Object.keys(iconList),
      mapping: iconList,
    },
    trailingIcon: {
      options: { true: true, false: false },
    },
    round: {
      options: { true: true, false: false },
    },
    iconOnly: {
      options: { true: true, false: false },
    },
    default: {
      control: {
        type: "text",
      },
    },
    onClick: {
      action: "clicked",
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
  components: { LcButton, IconLocation, IconUser, IconPlus },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template:
    '<LcButton @onClick="onClick" v-bind="args">{{args.default}}</LcButton> ',
})

export const PrimaryVariant = Template.bind({})
PrimaryVariant.args = {
  variant: "primary",
  size: "md",
  default: "Button CTA",
}

export const SecondaryVariant = Template.bind({})
SecondaryVariant.args = {
  variant: "secondary",
  size: "md",
  default: "Button CTA",
}

export const SecondaryGrayVariant = Template.bind({})
SecondaryGrayVariant.args = {
  variant: "secondary-gray",
  size: "md",
  default: "Button CTA",
}

export const TertiaryVariant = Template.bind({})
TertiaryVariant.args = {
  variant: "tertiary",
  size: "md",
  default: "Button CTA",
}

export const TertiaryGrayVariant = Template.bind({})
TertiaryGrayVariant.args = {
  variant: "tertiary-gray",
  size: "md",
  default: "Button CTA",
}

export const LinkVariant = Template.bind({})
LinkVariant.args = {
  variant: "link",
  size: "md",
  default: "Button CTA",
}

export const LinkGrayVariant = Template.bind({})
LinkGrayVariant.args = {
  variant: "link-gray",
  size: "md",
  default: "Button CTA",
}
