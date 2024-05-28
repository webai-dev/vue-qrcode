import LcPaginator from "../components/base/LcPaginator.vue"
import Button from "../components/base/LcButton.vue"
import "../auto-imports.d.ts"

export default {
  title: "Paginator",
  component: LcPaginator,
  argTypes: {
    total: {
      control: {
        type: "select",
      },
      options: [10, 50, 100, 1000],
    },
    page: {
      control: {
        type: "select",
      },
      options: [1, 2, 3, 4, 5],
    },
    pageSize: {
      control: {
        type: "select",
      },
      options: [10, 20, 50, 100],
    },
    totalPages: {
      control: {
        type: "select",
      },
      options: [1, 2, 3, 4, 5],
    },
    onPageChange: {
      action: "pageChange",
      table: {
        summary: null,
      },
    },
  },
}

const Template = (args) => ({
  components: { LcPaginator, Button },
  setup: () => ({ args }),

  template: `<div style="width: 600px"><LcPaginator v-bind="args" /></div>`,
})

export const Paginator = Template.bind({})
Paginator.args = {
  total: 50,
  page: 1,
  pageSize: 10,
}
