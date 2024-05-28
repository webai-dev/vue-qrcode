import { ref } from "vue"
import LcProgressBar from "../components/base/LcProgressBar.vue"

export default {
  title: "LcProgressBar",
  component: LcProgressBar,
  args: {},
  argTypes: {
    progress: {
      control: {
        type: "number",
      },
    },
  },
}

const Template = () => ({
  components: { LcProgressBar },
  setup: () => {
    const count = ref(0)
    const progress = setInterval(() => {
      if (count.value < 100) {
        count.value++
      } else {
        clearInterval(progress)
      }
    }, 12)
    return { count }
  },
  template: `<LcProgressBar :progress="count" />`,
})

export const DefaultVariant = Template.bind({})
