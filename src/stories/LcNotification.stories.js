import LcNotification from "../components/base/LcNotification.vue"

export default {
  title: "LcNotification",
  component: LcNotification,
  argTypes: {
    type: {
      control: {
        type: "select",
      },
      options: ["info", "error", "warning", "success"],
    },
    title: {
      control: {
        type: "text",
      },
    },
    default: {
      control: {
        type: "text",
      },
    },
    onClose: {
      action: "close",
      table: {
        type: {
          summary: null,
        },
      },
    },
  },
}

const Template = (args) => ({
  components: { LcNotification },
  setup: () => ({ args }),

  template: `<div style="width: 600px"><LcNotification v-bind="args"><template v-if="${
    "default" in args
  }">${args.default}</template></LcNotification></div>`,
})

export const Notification = Template.bind({})
Notification.args = {
  title: "Notification Title",
  type: "info",
  default: "Notification Body",
}
