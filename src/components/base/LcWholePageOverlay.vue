<script setup lang="ts">
import type { Component } from "vue"
import LcButton from "~/components/base/LcButton.vue"
import LcInput from "~/components/base/LcInput.vue"
import ArrowLeftIcon from "~/assets/icons/icon-arrow-left.svg?component"
import XIcon from "~/assets/icons/icon-x.svg?component"
import { useUtilityStore } from "~/stores/utility"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"

const router = useRouter()

const props = defineProps<{
  icon: Component
  pageTitle: string
  closeRoutePath: string
  subtitle?: string
  hidePrevBtn?: boolean
  projectName?: string
  success?: boolean
  error?: boolean
  onClose?: () => void
}>()

const emits = defineEmits<{
  (event: "updateProjectName", value?: string): void
}>()

const utilityStore = useUtilityStore()
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

// refs
const name = ref(props.projectName || "No project name")
const projectNameEditMode = ref(false)

// watchers
watch(
  () => props.projectName,
  (newName) => !!newName && (name.value = newName as string),
)

// methods
const toggleProjectNameEditMode = () => {
  projectNameEditMode.value = !projectNameEditMode.value
  if (!projectNameEditMode.value) {
    if (name.value === "" && props.projectName) {
      name.value = props.projectName
    } else if (name.value !== props.projectName) {
      generatorStore.updateProject({
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: generatorStore.getProjectId,
        payload: { name: name.value },
      })
      emits("updateProjectName", name.value)
    }
  }
}

const handleClose = () => {
  props.onClose && props.onClose()
  router.push(props.closeRoutePath)
}

// hooks
onBeforeMount(() => {
  utilityStore.activateWholePageLayout()
})
onBeforeUnmount(() => {
  utilityStore.deactivateWholePageLayout()
})
</script>
<template>
  <div
    :class="[
      'lc-whole-page-overlay',
      { error: props.error, success: props.success },
    ]"
  >
    <div class="lc-whole-page-overlay__header">
      <LcButton
        v-if="!hidePrevBtn"
        variant="link"
        :icon="ArrowLeftIcon"
        @click="router.go(-1)"
      >
        back
      </LcButton>
      <span
        v-if="!projectNameEditMode"
        class="lc-whole-page-overlay__header-project-name"
        data-cy="edit-title"
        @click="toggleProjectNameEditMode"
      >
        {{ name || props.projectName }}
      </span>
      <LcFormItem v-else v-slot="{ field, meta }" name="name">
        <LcInput
          v-model="name"
          v-bind="field"
          :meta="meta"
          autofocus
          :select-all-on-focus="!props.projectName"
          @blur="toggleProjectNameEditMode"
        />
      </LcFormItem>
      <LcButton
        variant="link"
        :icon="XIcon"
        data-cy="close"
        @click="handleClose"
      />
    </div>
    <div class="lc-whole-page-overlay__content">
      <div class="lc-whole-page-overlay__content-head">
        <component
          :is="icon"
          v-if="icon"
          class="lc-whole-page-overlay__content-head-icon"
        />
        <div class="lc-whole-page-overlay__content-head-title lc-page-subtitle">
          {{ pageTitle }}
        </div>
        <div
          v-if="subtitle"
          class="lc-whole-page-overlay__content-head-subtitle"
        >
          {{ subtitle }}
        </div>
      </div>
      <div class="lc-whole-page-overlay__content-body">
        <div class="lc-whole-page-overlay__content-body-container">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.lc-whole-page-overlay {
  height: 100%;
  padding-top: 3.5rem;
  box-sizing: border-box;
  overflow: hidden;

  &__header {
    padding: var(--space-2);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: white;
    z-index: 5;
    height: 3.5rem;

    &-project-name {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      font-size: var(--text-sm-font-size);
    }

    input {
      font-weight: var(--font-weight-semibold);
      text-align: center;
    }
  }

  &.error {
    .lc-whole-page-overlay__content-head-icon {
      color: var(--clr-error-600);
    }
  }

  &.success {
    .lc-whole-page-overlay__content-head-icon {
      color: var(--clr-success-500);
    }
  }

  &__content {
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;

    &-head {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-12) var(--space-4) 0;
      box-sizing: border-box;
      height: 10rem;
      -webkit-box-shadow: 0 0 21px 21px #ffffff;
      box-shadow: 0 0 21px 21px #ffffff;
      position: relative;
      z-index: 5;

      &-icon {
        transform: scale(1.5);
        color: var(--clr-primary-500);
        margin-bottom: var(--space-8);
        min-height: 26px;
      }

      &-title.lc-page-subtitle {
        margin-bottom: var(--space-2);
        text-align: center;
      }

      &-subtitle {
        color: var(--clr-gray-500);
      }
    }

    &-body {
      padding: var(--space-4);
      padding-top: var(--space-8);
      box-sizing: border-box;
      overflow: auto;
      height: calc(100% - 10rem);
      display: flex;
      flex-direction: column;
      align-items: center;

      &-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 630px;
        max-width: 100%;

        @media screen and (max-width: 440px) {
          width: 100%;
        }
      }
    }
  }
}
</style>
