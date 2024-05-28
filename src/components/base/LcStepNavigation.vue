<script lang="ts" setup>
import CircleCheckIcon from "~/assets/icons/icon-circle-check.svg?component"

interface Step {
  title: string
  url: string
}

interface LcStepNavigationComponentProps {
  steps: Step[]
  clickable?: boolean
}

const props = defineProps<LcStepNavigationComponentProps>()

const router = useRouter()
const route = useRoute()

const currentStep = ref<number>(0)

const currentStepValue = computed(() => currentStep.value)

const setStep = (index: number) => {
  currentStep.value = index
  router?.replace({
    query: { step: index },
  })
}

const next = () => {
  if (currentStep.value !== props.steps.length - 1) {
    setStep(currentStep.value + 1)
  }
}

const previous = () => {
  if (currentStep.value !== 0) {
    setStep(currentStep.value - 1)
  }
}

const updateQuery = () => {
  if (Number(route?.query?.step) < 0) {
    currentStep.value = 0
  } else if (Number(route?.query?.step) > props.steps.length - 1) {
    currentStep.value = props.steps.length - 1
  } else {
    currentStep.value = Number(route?.query?.step)
  }
}

watch(
  () => route?.query?.step,
  (newStep, oldStep) => {
    if (newStep !== oldStep) {
      updateQuery()
    }
  },
)

onBeforeMount(() => {
  if (!route?.query?.step || route?.query?.step === "") {
    router?.replace({
      query: { step: 0 },
    })
  } else {
    updateQuery()
  }
})
</script>

<template>
  <div class="lc-step-navigation-container">
    <ul class="lc-step-navigation-header">
      <li
        v-for="(step, index) in props.steps"
        :key="index"
        :class="[
          {
            active: currentStep === index,
            done: currentStep > index,
            last: index === props.steps.length - 1,
            first: index === 0,
          },
        ]"
        @click="props.clickable && setStep(index)"
      >
        <CircleCheckIcon />
        <div class="active-stroke" />
        {{ step.title }}
      </li>
    </ul>
    <div class="lc-step-navigation-content">
      <slot name="content" :events="{ next, previous }"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lc-step-navigation-container {
  width: 80%;
  overflow: hidden;

  .lc-step-navigation-header {
    list-style: none;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;
    height: var(--space-16);

    li {
      font-size: var(--text-sm-font-size);
      position: relative;
      font-weight: 400;
      color: var(--clr-gray-400);
      padding: 0 var(--space-2);
      flex: 1 0 auto;
      text-align: center;

      svg {
        position: absolute;
        top: 0;
        left: calc(50% - 11px);
        z-index: 2;
        display: none;
      }

      .active-stroke {
        height: 2px;
        width: 50%;
        position: absolute;
        left: 50%;
        top: 11px;
        background-color: var(--clr-gray-200);
        display: none;
        z-index: 0;
      }

      &.active {
        font-weight: var(--font-weight-semibold);
        color: var(--clr-gray-800);

        &:not(.last) .active-stroke {
          display: inline-block;
        }

        &:after {
          background-color: var(--clr-gray-500);
        }

        &:before {
          background: var(--clr-primary-500);
        }
      }

      &:before {
        content: " ";
        width: 18px;
        height: 18px;
        display: block;
        color: #ffffff;
        background: var(--clr-gray-200);
        border-radius: 50%;
        margin: -7px 0 10px calc(50% - 20px);
        border: 10px solid white;
        position: relative;
        z-index: 1;
      }

      &:after {
        content: "";
        width: 100%;
        height: 2px;
        background: var(--clr-gray-200);
        position: absolute;
        top: 11px;
        left: 0;
        z-index: -1;
      }

      &.first {
        &:after {
          width: 50%;
          left: 50%;
        }
      }

      &.last {
        &:after {
          width: 50%;
        }
      }

      &.done {
        color: var(--clr--gray-400);

        svg {
          display: inline-block;
          color: var(--clr-gray-500);
        }

        &:before {
          background-color: white;
        }

        &:after {
          background-color: var(--clr-gray-500);
        }
      }
    }
  }

  .lc-step-navigation-content {
    padding-top: var(--space-10);
    height: calc(100% - var(--space-10) - var(--space-16));
  }

  .lc-step-navigation-action {
    display: flex;
    justify-content: center;
  }
}
</style>
