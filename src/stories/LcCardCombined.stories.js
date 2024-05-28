import LcButton from "../components/base/LcButton.vue"
import LcCard from "../components/base/LcCard.vue"
import LcCardActions from "../components/base/LcCardActions.vue"
import LcCardContainer from "../components/base/LcCardContainer.vue"
import LcCardContent from "../components/base/LcCardContent.vue"
import LcCardHeader from "../components/base/LcCardHeader.vue"

export default {
  title: "LcCard/LcCardCombined",
  component: LcCard,
  args: {},
  argTypes: {},
}

const Template = (args) => ({
  components: {
    LcButton,
    LcCard,
    LcCardActions,
    LcCardContainer,
    LcCardContent,
    LcCardHeader,
  },
  setup: () => ({ args }),
  template: `<LcCardContainer>
  <LcCard v-bind="args">
    <LcCardHeader title="Example title" subtitle="Example Subtitle" />
    <LcCardContent>Example Content</LcCardContent>
    <LcCardActions><LcButton>Example Action</LcButton></LcCardActions>
  </LcCard>
  </LcCardContainer>`,
})

export const Default = Template.bind({})
Default.args = {}
