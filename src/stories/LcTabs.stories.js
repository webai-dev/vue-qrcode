import LcTabs from "../components/base/LcTabs.vue"
const tabs = [
  { text: "Example Tab 1", key: "1" },
  { text: "Example Tab 2", key: "2" },
  { text: "Example Tab 3", key: "3" },
]
export default {
  title: "LcTabs",
  component: LcTabs,
  args: {},
  argTypes: {
    tabs: {
      type: "array",
      description: "Tabs list",
    },
    activeTab: {
      type: "string",
      description: "Key of selected tabs",
    },
  },
}

const Template = (args) => ({
  components: { LcTabs },
  setup: () => ({ args }),
  template: '<LcTabs v-bind="args"></LcTabs>',
})

export const Default = Template.bind({})
Default.args = {
  tabs,
}

export const WithActiveTab = Template.bind({})
WithActiveTab.args = {
  tabs,
  activeTab: "2",
}
