import LcTableCard from "../components/base/LcTableCard.vue"
import LcTable from "../components/base/LcTable.vue"
import LcPaginator from "../components/base/LcPaginator.vue"
import Button from "../components/base/LcButton.vue"
import "../auto-imports.d.ts"

export default {
  title: "LcTableCard",
  component: LcTableCard,
  argTypes: {
    paginated: {
      control: {
        type: "boolean",
      },
    },
  },
}
const columns = [
  { key: "id", title: "id" },
  { key: "name", title: "name" },
  { key: "action", title: "" },
]
const data = [
  { id: "1a2b3c", name: "Olivia Rhye" },
  { id: "2b3c4d", name: "Oliver Rhye" },
]

const Template = (args) => ({
  components: { LcTableCard, LcPaginator, LcTable, Button },
  setup: () => ({ args, columns, data }),

  template: `<LcTableCard
  :title="args.title"
  :subtitle="args.subtitle"
  :paginated="args.paginated"
>
  <template #header>
    <LcButton size="md">Example</LcButton>
  </template>
  <template #table>
    <LcTable
      :columns="columns"
      :data="data"
      selectable
      identifier="id"
    />
  </template>
  <template #pagination>
    <LcPaginator :page="1" :total="1" />
  </template>
</LcTableCard>`,
})

export const TableCard = Template.bind({})
TableCard.args = {
  title: "Example title",
  subtitle: "Example subtitle",
  paginated: true,
}
