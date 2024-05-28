import { ref } from "vue"
import LcSuggestion from "../components/base/LcSuggestion.vue"
import LcInput from "../components/base/LcInput.vue"

export default {
  title: "LcSuggestion",
  component: LcSuggestion,
  argTypes: {
    text: {
      control: {
        type: "string",
      },
    },
  },
}

const Template = (args) => ({
  components: { LcSuggestion, LcInput },
  setup: () => {
    const textModel = ref(args.text || "")
    return { args, textModel }
  },
  template: `<LcSuggestion v-bind="args" :text="textModel">
    <LcInput v-model="textModel" />
  </LcSuggestion>`,
})

export const DefaultVariant = Template.bind({})
DefaultVariant.args = {
  suggestions: [
    { name: "Alpha", id: 1 },
    { name: "Beta", id: 2 },
    { name: "Gamma", id: 3 },
  ],
  isLoading: false,
}

export const LoadingVariant = Template.bind({})
LoadingVariant.args = {
  text: "alp",
  suggestions: [
    { name: "Alpha", id: 1 },
    { name: "Beta", id: 2 },
    { name: "Gamma", id: 3 },
  ],
  isLoading: true,
}
