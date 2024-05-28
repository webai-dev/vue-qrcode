import LcDraggable from "../components/base/LcDraggable.vue"

export default {
  title: "LcDraggable",
  component: LcDraggable,
  args: {},
  argTypes: {
    list: {
      type: "array",
      description: "Draggable items",
    },
    onDragEnd: {
      type: "Function",
      description: "Function to run when drag ends",
    },
    drag: {
      type: "boolean",
      description: "Initial State of the draggable",
    },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { LcDraggable },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => ({ args }),
  // And then the `args` are bound to your component with `v-bind="args"`
  template: `<div>
      <LcDraggable v-bind="args">'
        <template #element="{ element, index }">
          <div style="background-color: royalblue; padding: 5px; margin: 5px; text-align: center; color: white"
          >
            Example {{ index }}
          </div>
        </template>
      </LcDraggable>
      <div id="draggable-message">Start Dragging to see updates here ...</div>
    </div>`,
})

export const Default = Template.bind({})
Default.args = {
  list: [1, 2, 3],
  onDragEnd: (elem) => {
    document.querySelector(
      "#draggable-message",
    ).innerHTML = `Element Dragged from ${elem.oldIndex} to ${elem.newIndex}`
  },
  drag: true,
}
