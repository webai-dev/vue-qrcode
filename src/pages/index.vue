<script setup lang="ts">
import { storeToRefs } from "pinia"
import { Form } from "vee-validate"
import { rules } from "~/modules/validationRules"
import LcSidebar from "~/components/shared/LcSidebar.vue"
import LcHeader from "~/components/shared/LcHeader.vue"
import Check from "~/assets/icons/icon-check.svg?component"
import { localStore } from "~/modules/localStore"
import { useSessionStore } from "~/stores/session"
import { useUsersStore } from "~/stores/users"
import LcActionButtons from "~/components/base/LcActionButtons.vue"
import LcLoader from "~/components/base/LcLoader.vue"
import { useUtilityStore } from "~/stores/utility"

const router = useRouter()
const isMobile = ref(false)
const accepted = localStore.get("acceptedTerms")
const sessionStore = useSessionStore()
const userStore = useUsersStore()
const utilityStore = useUtilityStore()
const acceptedTermsOfUse = ref(false)

const { isUpdating } = storeToRefs(userStore)

const showTermsModal = computed(
  () =>
    !accepted &&
    sessionStore.getCurrentUser &&
    !sessionStore.getCurrentUser?.acceptedTermsDate,
)

const calculateWidth = () => {
  if (window.innerWidth >= 768) {
    isMobile.value = false
  } else {
    isMobile.value = true
  }
}

const updateUsersTerms = () => {
  userStore.edit({
    id: sessionStore.getCurrentUser?.id as string,
    acceptedTerms: acceptedTermsOfUse.value,
    callback: () => {
      sessionStore.loadCurrentUser()
      router.push("/welcome")
    },
  })
}

onMounted(() => {
  calculateWidth()
  window.addEventListener("resize", calculateWidth)
})

onUnmounted(() => {
  window.removeEventListener("resize", calculateWidth)
})
</script>

<script lang="ts">
export default {
  name: "AppIndex",
}
</script>

<template>
  <div :class="['layout', { wholePage: utilityStore.isWholePageLayout }]">
    <component :is="LcSidebar" v-if="!isMobile" />
    <component :is="LcHeader" v-else />
    <div class="main">
      <div class="content">
        <router-view />
      </div>
      <LcModal
        title="Accept terms of use"
        description="You haven't accepted our terms of use, yet."
        :icon="Check"
        :show="Boolean(showTermsModal)"
      >
        <Form>
          <template v-if="isUpdating === sessionStore.getCurrentUser?.id">
            <div class="loader-wrapper">
              <LcLoader size="md" />
            </div>
          </template>
          <template v-else>
            <LcFormItem v-slot="{ field, meta }" name="terms" type="checkbox">
              <LcCheckbox
                id="terms"
                v-model="acceptedTermsOfUse"
                name="terms"
                v-bind="field"
                :meta="meta"
              />
              <label class="terms-label">
                <LcButton
                  variant="link"
                  @click="router.push({ name: 'terms' })"
                  >{{ $t("I agree to the terms and conditions") }}</LcButton
                >
              </label>
            </LcFormItem>
          </template>
          <LcActionButtons>
            <LcButton class="btn-save" size="lg" @click="updateUsersTerms">{{
              $t("Save")
            }}</LcButton>
          </LcActionButtons>
        </Form>
      </LcModal>
    </div>
  </div>
</template>

<style lang="scss">
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  &.wholePage {
    display: flex;

    .main {
      padding: 0;

      .content {
        margin: 0;
        height: 100%;
      }
    }
  }

  @include mq("tablet") {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns-tablet), 1fr);
    column-gap: 1rem;
  }
  @include mq("desktop") {
    grid-template-columns: repeat(var(--grid-columns-desktop), 1fr);
    column-gap: 1rem;
  }
}

.main {
  box-sizing: border-box;
  grid-column: span 4;
  padding: 4rem 1rem 0;
  overflow: auto;
  height: 100%;

  @include mq("tablet") {
    grid-template-columns: repeat(var(--grid-columns-tablet), 1fr);
    column-gap: 1rem;
    grid-column: 3/8;
    padding: 0 1rem 0 0;
    height: 100vh;
  }
  @include mq("desktop") {
    grid-template-columns: repeat(var(--grid-columns-desktop), 1fr);
    grid-column: 4/13;
  }
}

.loader-wrapper {
  display: flex;
  justify-content: center;
}

.terms-label {
  .btn--link {
    padding-left: 0;
  }
}

.content {
  margin: var(--space-8) var(--space-4) var(--space-4);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
