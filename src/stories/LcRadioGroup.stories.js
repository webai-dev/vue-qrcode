import LcRadioButton from "../components/base/LcRadioButton.vue"
import LcRadioGroup from "../components/base/LcRadioGroup.vue"

export default {
  title: "LcRadioGroup",
  component: LcRadioGroup,
  args: {
    size: "sm",
    disabled: false,
    valid: true,
    label: "",
    description: "",
    vertical: true,
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

const InteractiveTemplate = (args) => ({
  components: { LcRadioGroup, LcRadioButton },
  setup: () => {
    const { valid, vertical, ...withoutValid } = args
    return {
      radios: ["one", "two"].map((id) => ({
        ...withoutValid,
        meta: { valid },
        id: `option-${id}`,
        name: "options-three",
        label: `${withoutValid.label} - ${id}`,
        value: id,
      })),
      vertical,
    }
  },
  data: () => ({
    selected: null,
  }),
  template: `
    <div>
      <LcRadioGroup :vertical="vertical">
        <LcRadioButton
          v-for="item in radios"
          :key="item.id"
          v-bind="item"
          v-model="selected"
        >
        {{ item.label }}
        </LcRadioButton>
      </LcRadioGroup>
      <br/>
      <p>Value: {{ selected ?? 'none' }}</p>
    </div>
  `,
})

export const InteractiveDefault = InteractiveTemplate.bind({})

InteractiveDefault.args = {
  size: "sm",
  id: "example-id",
  name: "option",
  label: "Remember me",
  description: "Save my login details for next time.",
}
