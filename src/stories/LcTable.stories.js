import LcTable from "../components/base/LcTable.vue"
import "../auto-imports.d.ts"

export default {
  title: "LcTable",
  component: LcTable,
  argTypes: {
    selectable: {
      control: {
        type: "boolean",
      },
    },
  },
}

const Template = (args) => ({
  components: { LcTable },
  setup: () => ({ args }),

  template: `<LcTable
  :columns="args.columns"
  :data="args.data"
  :selectable="args.selectable"
  identifier="args.id"
></LcTable>`,
})

export const Table = Template.bind({})
Table.args = {
  columns: [
    { key: "id", title: "id" },
    { key: "name", title: "name" },
    { key: "action", title: "" },
  ],
  data: [
    { id: "1a2b3c", name: "Olivia Rhye" },
    { id: "2b3c4d", name: "Oliver Rhye" },
  ],
  identifier: "id",
  selectable: false,
}
