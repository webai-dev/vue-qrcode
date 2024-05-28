import { ref } from "vue"
import LcContextMenu from "../components/base/LcContextMenu.vue"

export default {
  title: "LcContextMenu",
  component: LcContextMenu,
  argTypes: {
    showMenu: {
      control: {
        type: "boolean",
        default: true,
      },
    },
    onToggle: {
      action: "toggled",
    },
    onClose: {
      action: "close",
    },
  },
}

const Template = (args) => ({
  components: { LcContextMenu },
  setup: () => {
    const show = ref(false)
    const onToggle = () => (show.value = !show.value)
    const onClose = () => (show.value = false)
    return { args, show, onToggle, onClose }
  },
  template:
    "<LcContextMenu :show-menu='show' @toggle='onToggle' @close='onClose'><li>Option 1</li><li>Option 2</li></LcContextMenu>",
})

export const DefaultVariant = Template.bind({})
