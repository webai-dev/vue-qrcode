import LcStepNavigation from "../components/base/LcStepNavigation.vue"

const steps = [
  { title: "Step 1", url: "" },
  { title: "Step 2", url: "" },
  { title: "Step 3", url: "" },
]
export default {
  title: "LcStepNavigation",
  component: LcStepNavigation,
  args: {},
  argTypes: {
    steps: {
      type: "array",
      description: "The steps the component will show",
    },
    clickable: {
      type: "boolean",
      description: "The navigation is enabled",
    },
  },
}

const Template = (args) => ({
  components: { LcStepNavigation },
  setup: () => ({ args }),
  template: `<LcStepNavigation :steps="args.steps">
  <template #content>
    <div>Step Example Content</div>
  </template>
  </LcStepNavigation>`,
})

export const Default = Template.bind({})
Default.args = { steps }
