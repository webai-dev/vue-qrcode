import { ref } from "vue"
import {
  LcVerticalStepperContainer,
  LcVerticalStepperStep,
} from "../components/base/LcVerticalStepper"
import LcButton from "../components/base/LcButton.vue"
import CircleCheckIcon from "~/assets/icons/icon-circle-check.svg?component"

export default {
  title: "LcVerticalStepperContainer",
  component: LcVerticalStepperContainer,
  subcomponents: { LcVerticalStepperStep },
  args: {
    step1: { active: true },
    step2: { active: true, icon: CircleCheckIcon },
    step3: { active: true, textIcon: "Eg." },
    step4: { active: false },
    subStep1: { active: true, sub: true },
    subStep2: { active: false, sub: true, textIcon: "#1" },
  },
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: {
    LcVerticalStepperContainer,
    LcVerticalStepperStep,
    LcButton,
  },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup: () => {
    const testTexts = ref([])
    const refArgs = ref(args)
    const addText = () =>
      testTexts.value.push(
        "Niecosi moc bonie sapi. Nata ameyole ri yerogel acic sanulal risenep.",
      )
    const toggleActive = () =>
      (refArgs.value.step4.active = !refArgs.value.step4.active)
    return { args: refArgs, addText, toggleActive, testTexts }
  },

  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <LcVerticalStepperContainer>
        <LcVerticalStepperStep v-bind="args.step1">
            <template #title>Static <b>content</b></template>
            <template #default>
                <p>
                    Dit irid ceso ofedo asa din mecehi sal to: Socap amin
                    ronis sofekip nuv cay rit: Ciraruh yefar olo riha oba
                    nesiepak wobuhec teherin. Rame olonobo oninarad se lari;
                    nehi cikos gic tuwir ne faneyit elinov te? Cib reliros
                     bafa dosie.
                </p>
            </template>
        </LcVerticalStepperStep>
        <LcVerticalStepperStep v-bind="args.step2">
            <template #title>Dynamic content</template>
            <template #default>
            
                <LcButton @click="addText">Add content</LcButton>
                <p v-for="(text, i) in testTexts" :key="i">{{ text }}</p>
            </template>
        </LcVerticalStepperStep>
        <LcVerticalStepperStep v-bind="args.step3">
            <template #title>Sub-steps content</template>
            <template #default>
                <LcVerticalStepperStep v-bind="args.subStep1">
                    No notar cepe getanot asinak tetie ma geded, ho edigoso aturi gap ciecaru!
                    Musi rute senase vece otegas si noriro egugetid: Qubepi lo reme ometapeb
                    lisot luliren yalece obarapic. Agamosob nac oraseh aloror tem tienie firane
                    nitudir esiloge iebu, kobe begidor tepoda hine neye tanan calurey uharil.
                    Se hopegu dirara gori coro wesiem. Ce ricen ilune pi, gagace iweciros sifedet
                    magoter casa sotet. Teh baciva wewivag falifet potom vul. Sola epatila pecena
                    sako qepi per, letale carika tar ne to takod atirile emosiva inet. Gikunic ney
                    cabeka vedebec sah lo yasec toseno lacoz upicodom. Adonumit setab nelo.
                </LcVerticalStepperStep>
                <LcVerticalStepperStep v-bind="args.subStep2" />
            </template>
        </LcVerticalStepperStep>
        <LcVerticalStepperStep active v-bind="args.step4">
        <template #title>Toggle active state</template>
            <template #default>
                <LcButton @click="toggleActive">Toggle active state</LcButton>
            </template>
        </LcVerticalStepperStep>
    </LcVerticalStepperContainer>`,
})

export const Default = Template.bind({})
Default.args = {}
