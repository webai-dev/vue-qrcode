import LcModal from "../components/base/LcModal.vue"

import IconLocation from "../assets/icons/icon-location.svg?component"
import IconUser from "../assets/icons/icon-user.svg?component"

const iconList = { IconLocation, IconUser }

export default {
  title: "LcModal",
  component: LcModal,
  argTypes: {
    show: {
      control: {
        type: "boolean",
      },
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
    title: {
      control: {
        type: "text",
      },
    },
    description: {
      control: {
        type: "text",
      },
    },
    scannerModal: {
      control: {
        type: "boolean",
      },
    },
    closeButton: {
      control: {
        type: "boolean",
      },
    },
    destructive: {
      control: {
        type: "boolean",
      },
    },
    success: {
      control: {
        type: "boolean",
      },
    },
    onClose: {
      action: "onClose",
    },
    default: {
      control: {
        type: "text",
      },
    },
  },
}

const Template = (args) => ({
  components: { LcModal },
  setup: () => ({ args }),
  template: `<LcModal v-bind="args">{{args.default}}</LcModal>`,
})

export const Modal = Template.bind({})
Modal.args = {
  show: true,
  title: "Modal title",
  icon: IconUser,
  destructive: true,
  description:
    "Description: Icon name is also one of the arguments used for modal, but it is not possible to import it on storybook the way we use it in development",
}
