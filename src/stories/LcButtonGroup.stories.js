import LcButton from "../components/base/LcButton.vue"
import LcButtonGroup from "../components/base/LcButtonGroup.vue"
import IconPlaceholder from "../assets/icons/icon-placeholder.svg?component"

export default {
  title: "LcButtonGroup",
  component: LcButtonGroup,
  size: "md",
  variant: "secondary-gray",
  argTypes: {
    variant: {
      control: {
        type: "select",
      },
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
      control: {
        type: "select",
      },
      options: ["sm", "md", "lg", "xl", "2xl"],
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcButtonGroup, LcButton },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcButtonGroup>
      <LcButton v-bind="args">Left</LcButton>
      <LcButton v-bind="args">Middle</LcButton>
      <LcButton v-bind="args">Trailing</LcButton>
    </LcButtonGroup>`,
})

export const PrimaryVariant = Template.bind({})

PrimaryVariant.args = {
  variant: "primary",
}

export const SecondaryVariant = Template.bind({})
SecondaryVariant.args = {
  variant: "secondary",
}

export const SecondaryGrayVariant = Template.bind({})
SecondaryGrayVariant.args = {
  variant: "secondary-gray",
}

export const TertiaryVariant = Template.bind({})
TertiaryVariant.args = {
  variant: "tertiary",
}

export const TertiaryGrayVariant = Template.bind({})
TertiaryGrayVariant.args = {
  variant: "tertiary-gray",
}

export const LinkVariant = Template.bind({})
LinkVariant.args = {
  variant: "link",
}

export const LinkGrayVariant = Template.bind({})
LinkGrayVariant.args = {
  variant: "link-gray",
}

const TemplateWithIcons = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcButtonGroup, LcButton, IconPlaceholder },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),

  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcButtonGroup>
      <LcButton v-bind="args"><IconPlaceholder class="button-icon"/>Left</LcButton>
      <LcButton v-bind="args"><IconPlaceholder class="button-icon"/>Middle</LcButton>
      <LcButton v-bind="args"><IconPlaceholder class="button-icon"/>Trailing</LcButton>
    </LcButtonGroup>`,
})

export const WithIcons = TemplateWithIcons.bind({})
WithIcons.args = {
  variant: "secondary-gray",
  size: "md",
}
